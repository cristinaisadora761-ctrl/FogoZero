/**
 * FogoZero - Servidor Backend Node.js & API REST
 * Projeto Simulado Programa Centelha 3 Rondônia
 * Proponente: Isadora Cristina Ferreira Queiroz (3°B de Informática)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'database', 'fogozero.db');

// Middlewares essenciais
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Garantir que a pasta database existe
const dbDir = path.dirname(DB_FILE);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Inicialização do Banco de Dados SQLite
let db;
try {
  const isNovoBanco = !fs.existsSync(DB_FILE);
  db = new DatabaseSync(DB_FILE);

  if (isNovoBanco) {
    console.log('[Banco de Dados] Novo arquivo detectado. Aplicando database/schema.sql...');
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sqlContent = fs.readFileSync(schemaPath, 'utf8');
      db.exec(sqlContent);
      console.log('[Banco de Dados] Tabelas e sementes iniciais criadas com sucesso!');
    }
  } else {
    // Garante que as tabelas existem mesmo se o arquivo já existir vazio
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sqlContent = fs.readFileSync(schemaPath, 'utf8');
      db.exec(sqlContent);
    }
  }
} catch (err) {
  console.error('[Banco de Dados] Erro ao inicializar SQLite:', err.message);
}

// ====================================================================
// ROTAS DA API REST (Consultas parametrizadas contra SQL Injection)
// ====================================================================

// Rota de Diagnóstico / Saúde
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    sistema: 'FogoZero',
    ambiente: process.env.NODE_ENV || 'development',
    banco: 'SQLite 3 (nativo)',
    data: new Date().toISOString()
  });
});

// Listagem de Relatos com Filtros
app.get('/api/relatos', (req, res) => {
  try {
    const { status, municipio, busca } = req.query;
    let sql = 'SELECT * FROM relatos_queimadas WHERE 1=1';
    const params = [];

    if (status && status !== 'todos') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (municipio && municipio !== 'todos') {
      sql += ' AND municipio_nome LIKE ?';
      params.push(`%${municipio}%`);
    }

    if (busca && busca.trim()) {
      sql += ' AND (protocolo LIKE ? OR bairro LIKE ? OR tipo_queimada LIKE ? OR descricao LIKE ?)';
      const termo = `%${busca.trim()}%`;
      params.push(termo, termo, termo, termo);
    }

    sql += ' ORDER BY id DESC';

    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);

    // Mapeamento compatível com o formato da interface
    const formatados = rows.map(r => ({
      id: `FZ-RO-${r.id}`,
      protocolo: r.protocolo,
      municipio: r.municipio_nome,
      bairro: r.bairro,
      lat: r.latitude,
      lng: r.longitude,
      tipo: r.tipo_queimada,
      intensidade: r.intensidade_fumaca,
      proximidade: r.proximidade_residencias,
      dataHora: r.data_hora,
      descricao: r.descricao,
      status: r.status,
      statusBadge: obterBadgeStatus(r.status),
      foto: r.foto_url || null
    }));

    res.json(formatados);
  } catch (err) {
    console.error('Erro ao buscar relatos:', err);
    res.status(500).json({ erro: 'Falha ao consultar banco de dados.' });
  }
});

// Cadastro de Novo Relato (Consulta Parametrizada)
app.post('/api/relatos', (req, res) => {
  try {
    const {
      municipio,
      bairro,
      lat,
      lng,
      tipo,
      intensidade,
      proximidade,
      dataHora,
      descricao,
      foto
    } = req.body;

    if (!municipio || !tipo || !intensidade || !descricao) {
      return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos.' });
    }

    const protocolo = `FZ-RO-${Math.floor(1000 + Math.random() * 9000)}`;
    const latitude = parseFloat(lat) || -8.7619;
    const longitude = parseFloat(lng) || -63.9039;
    const dataHoraFinal = dataHora || new Date().toLocaleString('pt-BR');
    const statusInicial = 'Em Análise';

    const stmt = db.prepare(`
      INSERT INTO relatos_queimadas (
        protocolo, municipio_nome, bairro, latitude, longitude,
        tipo_queimada, intensidade_fumaca, proximidade_residencias,
        data_hora, descricao, status, foto_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      protocolo,
      municipio,
      bairro || 'Localidade informada',
      latitude,
      longitude,
      tipo,
      intensidade,
      proximidade || 'Entre 100m e 500m',
      dataHoraFinal,
      descricao,
      statusInicial,
      foto || null
    );

    const novoRelato = {
      protocolo,
      municipio,
      bairro: bairro || 'Localidade informada',
      lat: latitude,
      lng: longitude,
      tipo,
      intensidade,
      proximidade: proximidade || 'Entre 100m e 500m',
      dataHora: dataHoraFinal,
      descricao,
      status: statusInicial,
      statusBadge: obterBadgeStatus(statusInicial),
      foto: foto || null
    };

    res.status(201).json({
      sucesso: true,
      protocolo,
      relato: novoRelato
    });
  } catch (err) {
    console.error('Erro ao salvar relato:', err);
    res.status(500).json({ erro: 'Falha ao salvar relato no banco de dados.' });
  }
});

// Estatísticas Agrupadas para Gráficos
app.get('/api/estatisticas', (req, res) => {
  try {
    const totalStmt = db.prepare('SELECT COUNT(*) as total FROM relatos_queimadas');
    const total = totalStmt.get().total;

    const criticosStmt = db.prepare("SELECT COUNT(*) as count FROM relatos_queimadas WHERE intensidade_fumaca IN ('Crítica', 'Densa')");
    const criticos = criticosStmt.get().count;

    const porTipoStmt = db.prepare('SELECT tipo_queimada, COUNT(*) as count FROM relatos_queimadas GROUP BY tipo_queimada');
    const porTipo = porTipoStmt.all();

    res.json({
      total,
      criticos,
      porTipo
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao gerar estatísticas.' });
  }
});

// Autenticação de Usuários (Hash SHA-256)
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha.' });
    }

    const senhaHash = crypto.createHash('sha256').update(senha).digest('hex');

    const stmt = db.prepare('SELECT id, nome, email, perfil FROM usuarios WHERE email = ? AND senha_hash = ? AND ativo = 1');
    const usuario = stmt.get(email, senhaHash);

    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas. Verifique seu e-mail e senha de teste.' });
    }

    res.json({
      sucesso: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      },
      token: `token-sessao-${usuario.id}-${Date.now()}`
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro durante autenticação.' });
  }
});

// Função auxiliar para badges
function obterBadgeStatus(status) {
  switch (status) {
    case 'Encaminhado aos Bombeiros':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'Verificado pela Comunidade':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'Resolvido':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    default:
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
}

// Servir arquivos estáticos (Frontend)
app.use(express.static(__dirname));

// Rota de fallback para o frontend SPA (Compatível com Express 5)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Inicialização do Servidor
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🔥 FogoZero Server em execução na porta ${PORT}`);
    console.log(`🌐 Acesso Local: http://localhost:${PORT}`);
    console.log(`💾 Banco de Dados: ${DB_FILE}`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
