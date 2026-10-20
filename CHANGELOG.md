# Registro de Decisões e Alterações (Changelog)

## Projeto: FogoZero – Sistema Inteligente de Registro e Monitoramento de Queimadas
**Autora:** Isadora Cristina Ferreira Queiroz  
**Turma:** 3°B de Informática  
**Metodologia:** Desenvolvimento responsável com apoio de IA (Google Antigravity), com rigorosa revisão humana de código, segurança e regras de negócio.

---

### Versão 1.2.0 (20/10/2026) — Suporte a Banco de Dados Relacional, Autenticação e Spec Final
* **Decisão Arquitetural:**
  * O agente inicialmente sugeriu apenas armazenamento local (`localStorage`) para rodar em hospedagens estáticas.
  * **Revisão Humana:** Identificada a exigência da atividade de um banco de dados relacional com script SQL, consultas parametrizadas e fluxo de login funcional.
  * **Implementação:** Criação do script [`database/schema.sql`](file:///C:/Users/Aluno/.gemini/antigravity/scratch/fogozero/database/schema.sql) com 3 tabelas (`municipios`, `usuarios`, `relatos_queimadas`) e dados de teste (seed).
* **Backend Node.js & Express:**
  * Criação do servidor [`server.js`](file:///C:/Users/Aluno/.gemini/antigravity/scratch/fogozero/server.js) utilizando o módulo nativo `node:sqlite` do Node 22, permitindo que o professor clone e rode o sistema sem precisar instalar ou configurar servidores MySQL/PostgreSQL externos.
  * Implementação de rotas REST: `GET /api/relatos`, `POST /api/relatos`, `GET /api/estatisticas` e `POST /api/auth/login`.
* **Correção Técnica Realizada:**
  * No Express 5, a rota coringa `app.get('*')` causava erro de `PathError` no `path-to-regexp`. A rota foi corrigida para o middleware padrão `app.use((req, res) => res.sendFile(...))`, garantindo estabilidade no carregamento do SPA.
* **Segurança e Variáveis de Ambiente:**
  * Criação do arquivo [`.env.example`](file:///C:/Users/Aluno/.gemini/antigravity/scratch/fogozero/.env.example) e configuração do [`.gitignore`](file:///C:/Users/Aluno/.gemini/antigravity/scratch/fogozero/.gitignore) para assegurar que nenhuma credencial ou banco binário seja comitado no GitHub.
  * Hash de senhas com SHA-256 no banco de dados e consultas com *Prepared Statements* em todas as rotas da API.
* **Documentação:**
  * Redação completa do documento [`spec.md`](file:///C:/Users/Aluno/.gemini/antigravity/scratch/fogozero/spec.md), cobrindo todos os requisitos das seções 3.1 a 3.5 da atividade.

---

### Versão 1.1.0 (20/10/2026) — Recursos de Busca, Filtros, Exportação e Menu Mobile
* **Revisão de Usabilidade:**
  * O agente propôs inicialmente uma exibição fixa dos últimos 6 relatos sem opção de pesquisa.
  * **Revisão Humana:** Percebeu-se que a comunidade e os fiscais precisavam localizar relatos por bairro ou município em tempo real, além de baixar planilhas para a Defesa Civil.
* **Implementações Adicionadas:**
  * Campo de busca em tempo real e filtro por status do relato (*Em Análise*, *Verificado*, *Encaminhado*, *Resolvido*).
  * Funções de exportação em **CSV** (com caractere BOM UTF-8 para compatibilidade perfeita no Microsoft Excel) e **JSON**.
  * Menu hambúrguer responsivo para navegação acessível em celulares.

---

### Versão 1.0.0 (06/10/2026) — Fundação do Projeto FogoZero
* **Estrutura Inicial:**
  * Criação do [`index.html`](file:///C:/Users/Aluno/.gemini/antigravity/scratch/fogozero/index.html) baseado no formulário do Simulado Centelha 3 Rondônia preenchido por Isadora Cristina.
  * Integração da biblioteca **Leaflet.js** para renderização do mapa georreferenciado de Rondônia, com marcadores pulsantes por nível de gravidade da fumaça.
  * Gráficos com **Chart.js** exibindo os dados científicos do INPE (redução de 79,2% em Porto Velho e comparativo de focos).
  * Publicação do vídeo pitch obrigatório de 3 minutos ([https://youtu.be/vBwcouGCj0k](https://youtu.be/vBwcouGCj0k)).
  * Criação do [`formulario.html`](file:///C:/Users/Aluno/.gemini/antigravity/scratch/fogozero/formulario.html) com todas as 17 respostas organizadas e formatadas para avaliação e impressão.
* **Revisão de Segurança Física:**
  * Foi adicionado aviso ostensivo em vermelho de segurança à vida, alertando a população a **nunca se aproximar do fogo para tirar fotos ou preencher o formulário**, priorizando a vida e saúde dos cidadãos.

---

### Checklist de Segurança Conferido (Anexo B da Apostila):
- [x] **Nenhuma credencial exposta:** `.env` excluído pelo `.gitignore`; `.env.example` com dados genéricos.
- [x] **Consultas parametrizadas:** `db.prepare(sql).all(...params)` utilizado em todas as leituras e inserções.
- [x] **Senhas protegidas:** Armazenadas com hash criptográfico, sem senhas em texto puro.
- [x] **Privacidade de dados:** Sem exposição de dados pessoais sensíveis de usuários em telas públicas (LGPD).
- [x] **Tratamento de erros:** Sem vazamento de stack traces internos do banco para o usuário final.
