-- ====================================================================
-- FogoZero: Sistema Inteligente de Registro e Monitoramento de Queimadas
-- Script de Criação do Banco de Dados e Dados Iniciais (Seed)
-- Compatível com: SQLite, MySQL, MariaDB, PostgreSQL
-- ====================================================================

-- 1. Tabela de Municípios Monitorados
CREATE TABLE IF NOT EXISTS municipios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome VARCHAR(100) NOT NULL UNIQUE,
  estado VARCHAR(2) NOT NULL DEFAULT 'RO',
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Usuários do Sistema
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  perfil VARCHAR(30) NOT NULL DEFAULT 'cidadao', -- 'admin', 'agente', 'cidadao'
  ativo INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Relatos de Queimadas e Focos de Fogo
CREATE TABLE IF NOT EXISTS relatos_queimadas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  protocolo VARCHAR(20) NOT NULL UNIQUE,
  municipio_id INTEGER,
  municipio_nome VARCHAR(100) NOT NULL,
  bairro VARCHAR(120) NOT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  tipo_queimada VARCHAR(80) NOT NULL,
  intensidade_fumaca VARCHAR(30) NOT NULL, -- 'Crítica', 'Densa', 'Moderada', 'Leve'
  proximidade_residencias VARCHAR(50) NOT NULL,
  data_hora VARCHAR(30) NOT NULL,
  descricao TEXT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Em Análise', -- 'Em Análise', 'Verificado pela Comunidade', 'Encaminhado aos Bombeiros', 'Resolvido'
  foto_url TEXT,
  usuario_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (municipio_id) REFERENCES municipios(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ====================================================================
-- DADOS INICIAIS (SEED)
-- ====================================================================

-- Inserção de Municípios Principais de Rondônia
INSERT OR IGNORE INTO municipios (id, nome, estado, latitude, longitude) VALUES
  (1, 'Porto Velho', 'RO', -8.761944, -63.903889),
  (2, 'Ariquemes', 'RO', -9.913333, -63.040833),
  (3, 'Ji-Paraná', 'RO', -10.882778, -61.944167),
  (4, 'Cacoal', 'RO', -11.438611, -61.447222),
  (5, 'Vilhena', 'RO', -12.740556, -60.145833),
  (6, 'Jaru', 'RO', -10.438889, -62.466389),
  (7, 'Rolim de Moura', 'RO', -11.727778, -61.777778),
  (8, 'Guajará-Mirim', 'RO', -10.782778, -65.329722);

-- Inserção de Usuários de Teste (Senhas armazenadas com hash SHA-256)
-- Senha de teste para todos os usuários padrão abaixo: 'admin123' ou 'teste123'
-- Hash SHA-256 de 'admin123': 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
-- Hash SHA-256 de 'teste123': b849156f2e2a875a6435c2fb183b5f39e3dbdc5766aa9046c3efc12b87d8964c
INSERT OR IGNORE INTO usuarios (id, nome, email, senha_hash, perfil) VALUES
  (1, 'Professor Avaliador', 'professor@fogozero.org', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin'),
  (2, 'Agente Defesa Civil RO', 'agente@defesacivil.ro.gov.br', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'agente'),
  (3, 'Isadora Cristina (Estudante)', 'isadora@estudante.ro.gov.br', 'b849156f2e2a875a6435c2fb183b5f39e3dbdc5766aa9046c3efc12b87d8964c', 'cidadao');

-- Inserção de Relatos Iniciais Baseados no Cenário Real de Rondônia
INSERT OR IGNORE INTO relatos_queimadas 
  (id, protocolo, municipio_id, municipio_nome, bairro, latitude, longitude, tipo_queimada, intensidade_fumaca, proximidade_residencias, data_hora, descricao, status)
VALUES
  (1, 'FZ-RO-7812', 1, 'Porto Velho', 'Bairro Nacional', -8.729000, -63.905500, 'Terreno baldio urbano', 'Crítica', 'Menos de 100m', '2026-10-06 14:15', 'Fogo alto em vegetação seca de terreno baldio próximo a residências. Fumaça muito densa entrando nas casas com forte odor.', 'Encaminhado aos Bombeiros'),
  (2, 'FZ-RO-6431', 1, 'Porto Velho', 'Zona Leste (Jardim Santana)', -8.756000, -63.852000, 'Queima de lixo doméstico', 'Moderada', 'Entre 100m e 500m', '2026-10-06 11:30', 'Morador colocando fogo em folhas secas e lixo no fundo do quintal. Vento levando fumaça para a rua e escola próxima.', 'Verificado pela Comunidade'),
  (3, 'FZ-RO-5990', 1, 'Porto Velho', 'Estrada do Belmont', -8.705000, -63.882000, 'Margem de rodovia / acesso', 'Densa', 'Mais de 500m', '2026-10-05 16:45', 'Foco extenso na vegetação da margem da estrada reduzindo a visibilidade dos motoristas.', 'Em Análise'),
  (4, 'FZ-RO-4210', 2, 'Ariquemes', 'Setor 09', -9.913300, -63.040800, 'Pastagem / Área rural próxima', 'Moderada', 'Entre 100m e 500m', '2026-10-05 09:20', 'Fumaça visível em área de pasto seco. Fogo contido por aceiro mas fumaça perceptível na vizinhança.', 'Verificado pela Comunidade'),
  (5, 'FZ-RO-3874', 3, 'Ji-Paraná', 'Dois de Abril', -10.882700, -61.944200, 'Terreno baldio urbano', 'Leve', 'Menos de 100m', '2026-10-04 18:10', 'Pequeno foco de fogo já quase extinto, fumaça residual leve.', 'Resolvido'),
  (6, 'FZ-RO-2109', 4, 'Cacoal', 'Belo Horizonte', -11.438600, -61.447200, 'Área de mata / preservação', 'Densa', 'Mais de 500m', '2026-10-04 15:00', 'Fumaça densa avistada em fragmento florestal próximo ao anel viário.', 'Encaminhado aos Bombeiros');
