# FogoZero – Sistema Inteligente de Registro e Monitoramento de Queimadas

**Projeto Acadêmico – Simulado Programa Centelha 3 Rondônia (Fase 1 - Ideias Inovadoras)**  
**Proponente:** Isadora Cristina Ferreira Queiroz  
**Turma:** 3°B de Informática  
**Edital:** Simulado com base no Edital nº 03/2026 - Centelha 3 Rondônia (FAPERO / FINEP / CERTI)  
**Vídeo Pitch:** [https://youtu.be/vBwcouGCj0k](https://youtu.be/vBwcouGCj0k) (Duração máxima: 3 minutos)  
**Repositório GitHub:** [https://github.com/cristinaisadora761-ctrl/FogoZero](https://github.com/cristinaisadora761-ctrl/FogoZero)  
**Acesso Online (GitHub Pages):** [https://cristinaisadora761-ctrl.github.io/FogoZero/](https://cristinaisadora761-ctrl.github.io/FogoZero/)

---

## 📌 Sobre o Projeto

O **FogoZero** é uma plataforma digital colaborativa desenvolvida para conectar a população ao monitoramento de queimadas e focos de calor em Rondônia.

Enquanto sistemas consolidados de satélite (como o Programa Queimadas do **INPE**) monitoram grandes áreas e focos térmicos com satélites de referência, o **FogoZero** atua como uma camada complementar comunitária em nível de rua e bairro:
- Permite que qualquer cidadão registre pelo celular relatos de fumaça, queimadas de lixo urbano, terrenos baldios e margens de estradas.
- Captura coordenadas via **GPS integrado** ou clique no mapa.
- Avalia severidade da fumaça e proximidade de casas e escolas.
- Apresenta os focos em um **mapa interativo em tempo real** e em um painel estatístico com dados históricos oficiais.
- Permite **pesquisar e filtrar ocorrências** em tempo real por bairro, cidade e status.
- Disponibiliza **exportação de dados em CSV e JSON** para relatórios e apoio à Defesa Civil e secretarias de meio ambiente.
- Menu responsivo adaptado para dispositivos móveis e celulares.
- Disponibiliza orientações de **saúde e prevenção respiratória** e canais diretos de emergência (193 Bombeiros, 199 Defesa Civil, SEDAM RO).

---

## 🚀 Estrutura dos Arquivos do Repositório

1. **`spec.md`**:  
   **Especificação Técnica Completa e Final do Sistema**, contendo objetivos, perfis de usuários, casos de uso, requisitos funcionais e não-funcionais, modelo de dados em tabela, critérios de aceite, decisão de stack e a seção completa de **Instalação e Execução** (ambiente, banco de dados, variáveis de ambiente, passo a passo numerado e como testar com usuários de teste).

2. **`CHANGELOG.md`**:  
   Registro detalhado de decisões, correções técnicas (ex.: ajuste de rotas do Express 5) e comprovação de **revisão humana** do código proposto pela IA, além da checagem do Checklist de Segurança (Anexo B).

3. **`database/schema.sql`**:  
   Script SQL padronizado para criação das tabelas (`municipios`, `usuarios`, `relatos_queimadas`) e inserção de dados iniciais (*seeds*) para testes imediatos.

4. **`server.js`**:  
   Servidor backend Node.js com Express e SQLite 3 nativo (`node:sqlite`), contendo API REST com consultas parametrizadas (*Prepared Statements*) e autenticação segura com hash SHA-256.

5. **`package.json`**:  
   Gerenciador de dependências (`express`, `cors`, `dotenv`) e scripts de inicialização (`npm start`, `npm run dev`, `npm run db:seed`).

6. **`.env.example`** & **`.gitignore`**:  
   Modelo de variáveis de ambiente e exclusão de credenciais sensíveis e arquivos binários do versionamento Git.

7. **`index.html`**:  
   Aplicação web principal responsiva (SPA), integrada à API REST e ao banco de dados, com mapa Leaflet, gráficos Chart.js, formulário com GPS e modal de autenticação.

8. **`formulario.html`**:  
   Dossiê completo das 17 respostas oficiais do Simulado Centelha 3 Rondônia, formatado para impressão ou exportação em PDF/Word (.doc).

9. **`styles.css`** & **`app.js`**:  
   Estilos visuais temáticos e lógica frontend cliente (com sincronização via API e fallback automático para LocalStorage).

---

## 💻 Como Instalar e Rodar Localmente (Guia Rápido)

Para rodar o sistema com backend Node.js e banco de dados SQLite:

```bash
# 1. Clonar o repositório
git clone https://github.com/cristinaisadora761-ctrl/FogoZero.git
cd FogoZero

# 2. Instalar dependências
npm install

# 3. Criar arquivo de configuração
cp .env.example .env   # No Windows PowerShell: Copy-Item .env.example .env

# 4. Iniciar o servidor (o banco é inicializado automaticamente)
npm start
```
Acesse no navegador: **`http://localhost:3000`**

### Usuários de Teste:
- **Professor / Admin:** `professor@fogozero.org` | Senha: `admin123`
- **Agente Defesa Civil:** `agente@defesacivil.ro.gov.br` | Senha: `admin123`
- **Cidadão Comum:** `isadora@estudante.ro.gov.br` | Senha: `teste123`

---

## 🌐 Acesso Online (Sem Instalação)

O sistema também está publicado e acessível publicamente via GitHub Pages:  
👉 **[https://cristinaisadora761-ctrl.github.io/FogoZero/](https://cristinaisadora761-ctrl.github.io/FogoZero/)**

---

## 📊 Principais Fontes e Dados Citados
- **INPE (Programa Queimadas)**: Junho/2025 (49 focos em RO) vs Junho/2024 (183 focos).
- **Prefeitura de Porto Velho**: Queda de 79,2% nos focos de queimada entre jan-mai de 2026 (22 focos) comparado a jan-mai de 2025 (106 focos).
- **Edital nº 03/2026 Centelha 3 Rondônia** (Fórmula da Nota: `(2 × S + M + E + I) ÷ 5`).
