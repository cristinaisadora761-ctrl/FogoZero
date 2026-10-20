# Especificação Técnica do Sistema (Spec Final)

## Projeto: FogoZero – Sistema Inteligente de Registro e Monitoramento de Queimadas
**Proponente:** Isadora Cristina Ferreira Queiroz  
**Turma:** 3°B de Informática  
**Edital:** Simulado Programa Centelha 3 Rondônia – Fase 1 (Ideias Inovadoras)  
**Repositório Oficial:** [https://github.com/cristinaisadora761-ctrl/FogoZero](https://github.com/cristinaisadora761-ctrl/FogoZero)  
**Sistema Publicado no Ar:** [https://cristinaisadora761-ctrl.github.io/FogoZero/](https://cristinaisadora761-ctrl.github.io/FogoZero/)  
**Vídeo Pitch (3 minutos):** [https://youtu.be/vBwcouGCj0k](https://youtu.be/vBwcouGCj0k)  
**Professor Colaborador Convidado:** `rafaelpitwak`

---

## 1. Objetivo do Sistema
O **FogoZero** é uma aplicação web colaborativa desenvolvida para conectar moradores, estudantes, agricultores e órgãos de proteção ambiental ao monitoramento ágil de queimadas em Rondônia.

Enquanto sistemas como o Programa Queimadas do **INPE** monitoram grandes focos de calor via satélite de referência, o **FogoZero** atua como camada complementar de hiperproximidade:
- Coleta relatos locais de fumaça, terrenos baldios em chamas e queima irregular de lixo diretamente pelo celular ou computador.
- Georreferencia ocorrências via GPS e mapa interativo.
- Organiza dados estruturados em banco de dados para auxiliar ações de mitigação da Defesa Civil e conscientização pública.
- Fornece guia preventivo de saúde respiratória contra os efeitos tóxicos da fumaça na Amazônia rondoniense.

---

## 2. Usuários e Perfis de Acesso

| Perfil | Descrição | Permissões no Sistema |
| :--- | :--- | :--- |
| **Cidadão / Visitante** | Moradores urbanos e rurais, estudantes e professores. | Registrar relatos de queimadas, consultar o mapa público, visualizar estatísticas, baixar dados e acessar o guia de saúde. |
| **Agente Ambiental / Defesa Civil** | Fiscais da SEDAM, Defesa Civil e Corpo de Bombeiros Militar. | Acesso autenticado, visualização de protocolos, priorização de focos críticos e exportação de relatórios. |
| **Administrador** | Gestor técnico da plataforma e avaliadores acadêmicos. | Acesso completo a todos os dados do banco, moderação de relatos e auditoria do sistema. |

---

## 3. Casos de Uso e Fluxos Principais

* **UC01 - Registrar Foco de Queimada:** O usuário informa município, bairro, coordenadas (via GPS ou clique no mapa), tipo de foco, intensidade de fumaça, proximidade de residências, foto opcional e descrição. O sistema valida os campos, gera um protocolo único (ex.: `#FZ-RO-7812`) e persiste no banco de dados.
* **UC02 - Visualizar e Filtrar Focos no Mapa:** O mapa Leaflet exibe marcadores coloridos com base na gravidade (crítica, densa, moderada, leve) com filtros dinâmicos por intensidade e por município.
* **UC03 - Consultar Estatísticas Oficiais:** Comparativo histórico com dados oficiais do INPE (Junho 2024 vs. Junho 2025) e a redução de 79,2% em Porto Velho (Prefeitura Municipal / INPE).
* **UC04 - Buscar e Exportar Dados:** O feed de relatos permite busca em tempo real e exportação dos dados em formato **CSV** e **JSON**.
* **UC05 - Autenticação de Usuários:** Login seguro para agentes e administradores com verificação de hash SHA-256 no banco de dados.
* **UC06 - Acessar Guia de Saúde e Contatos de Emergência:** Orientações sobre uso de máscaras PFF2, umidificação de ambientes e links de discagem direta para Bombeiros (193), Defesa Civil (199) e SEDAM (0800 647 1150).

---

## 4. Requisitos do Sistema

### 4.1 Requisitos Funcionais (RF)
* **RF01:** O sistema deve permitir o cadastro de relatos sem exigência prévia de login para incentivar a participação popular.
* **RF02:** O sistema deve capturar coordenadas geográficas via API de Geolocalização do navegador ou por clique no mapa.
* **RF03:** O sistema deve gerar um número de protocolo único e legível para cada relato registrado.
* **RF04:** O sistema deve apresentar mapa interativo com marcadores georreferenciados e efeito visual de severidade da fumaça.
* **RF05:** O sistema deve exibir gráficos interativos com dados históricos e distribuição por tipo de queima.
* **RF06:** O sistema deve disponibilizar busca textual e filtros de status no feed comunitário.
* **RF07:** O sistema deve exportar os dados em formatos abertos (CSV e JSON).
* **RF08:** O sistema deve disponibilizar formulário de login com autenticação por hash de senha no banco.
* **RF09:** O sistema deve disponibilizar a visualização completa e formatada do Simulado Centelha 3 para impressão/PDF (`formulario.html`).
* **RF10:** O sistema deve exibir alertas ostensivos de segurança instruindo o cidadão a **nunca se aproximar das chamas**.

### 4.2 Requisitos Não-Funcionais (RNF)
* **RNF01 - Segurança:** Consultas ao banco de dados devem utilizar exclusivamente consultas parametrizadas (*Prepared Statements*) para prevenção contra *SQL Injection*. Senhas de usuários devem ser armazenadas com hash criptográfico.
* **RNF02 - Privacidade (LGPD):** Nenhum dado pessoal sensível (como CPF ou endereço residencial exato do usuário) é exposto publicamente no feed de relatos.
* **RNF03 - Disponibilidade e Resiliência:** A aplicação frontend funciona online sem necessidade de instalação via GitHub Pages com sincronização e fallback automático para *LocalStorage*, além de funcionar integrada à API REST quando rodada localmente com Node.js e banco SQLite.
* **RNF04 - Responsividade:** Layout totalmente adaptável a telas de smartphones, tablets e computadores desktop.
* **RNF05 - Usabilidade:** Interface intuitiva com tempo de resposta inferior a 200ms para buscas e filtros locais.

---

## 5. Modelo de Dados e Dicionário de Tabelas

O banco de dados foi projetado em SQL padrão, com script versionado no repositório em [`database/schema.sql`](file:///C:/Users/Aluno/.gemini/antigravity/scratch/fogozero/database/schema.sql).

### Dicionário de Tabelas

| Tabela | Campos principais | Chave primária | Relacionamentos |
| :--- | :--- | :--- | :--- |
| **`municipios`** | `id`, `nome`, `estado`, `latitude`, `longitude`, `created_at` | `id` | — |
| **`usuarios`** | `id`, `nome`, `email`, `senha_hash`, `perfil`, `ativo`, `created_at` | `id` | — |
| **`relatos_queimadas`** | `id`, `protocolo`, `municipio_id`, `municipio_nome`, `bairro`, `latitude`, `longitude`, `tipo_queimada`, `intensidade_fumaca`, `proximidade_residencias`, `data_hora`, `descricao`, `status`, `foto_url`, `usuario_id`, `created_at` | `id` | `municipio_id → municipios.id`<br>`usuario_id → usuarios.id` |

### Dados Iniciais (Seed)
O script `database/schema.sql` já insere automaticamente:
1. Os 8 principais municípios de Rondônia com coordenadas geográficas.
2. Três usuários de teste para diferentes perfis (`admin`, `agente`, `cidadao`) com senhas em hash SHA-256.
3. Seis ocorrências iniciais baseadas no histórico real de Rondônia para permitir testes imediatos do mapa e gráficos.

---

## 6. Decisão de Stack Tecnológica

* **Frontend:** HTML5 semântico, CSS3 com Tailwind CSS (CDN), Leaflet.js (mapas), Chart.js (gráficos), JavaScript Vanilla (ES6+ modular).
* **Backend:** Node.js (v20+) com Express e CORS.
* **Banco de Dados:** SQLite 3 nativo via módulo oficial `node:sqlite` (zero dependências de compilação externa) e script universal `database/schema.sql`.
* **Hospedagem / Publicação Gratuita:**
  * **No ar (Online sem instalação):** GitHub Pages ([https://cristinaisadora761-ctrl.github.io/FogoZero/](https://cristinaisadora761-ctrl.github.io/FogoZero/)).
  * **Execução Local:** Servidor Node.js Express na porta 3000 com SQLite persistido em arquivo.

---

## 7. Instalação e Execução

Esta seção contém todas as instruções necessárias para clonar, configurar e rodar o sistema localmente em qualquer computador.

### 7.1 Ambiente
* **Linguagem:** Node.js versão 20.x ou superior (testado no **Node.js v22.22.0** e **npm v10.9.4**).
* **Servidor Local:** Servidor Express embutido em Node.js (`server.js`).
* **Dependências:** `express`, `cors`, `dotenv` (instaladas com `npm install`).
* **Sistema Operacional Testado:** Windows 11 / Windows 10 (100% compatível com Linux e macOS).

### 7.2 Banco de Dados
* **SGBD:** SQLite (versão 3).
* **Nome do arquivo de banco:** `fogozero.db` (criado dentro da pasta `database/`).
* **Script SQL:** [`database/schema.sql`](file:///C:/Users/Aluno/.gemini/antigravity/scratch/fogozero/database/schema.sql).
* **Como executar o script:**
  * **Automático:** Ao iniciar o servidor pela primeira vez com `npm start`, o `server.js` detecta a ausência do banco e aplica o `database/schema.sql` automaticamente.
  * **Manual / Alternativo:** O professor também pode rodar o comando:
    ```bash
    npm run db:seed
    ```
    Ou abrir o arquivo `database/schema.sql` em qualquer cliente SQL (como SQLite Viewer, DBeaver ou phpMyAdmin).

### 7.3 Variáveis de Ambiente
O repositório possui o arquivo de template [`.env.example`](file:///C:/Users/Aluno/.gemini/antigravity/scratch/fogozero/.env.example). As variáveis utilizadas são:

| Variável | Descrição | Exemplo de Valor Local |
| :--- | :--- | :--- |
| `PORT` | Porta TCP onde o servidor HTTP escutará | `3000` |
| `NODE_ENV` | Modo de execução do ambiente | `development` |
| `DB_TYPE` | Tipo de banco de dados utilizado | `sqlite` |
| `DB_FILE` | Caminho do arquivo de banco de dados SQLite | `database/fogozero.db` |
| `SESSION_SECRET` | Chave secreta interna para proteção de sessões | `chave_secreta_local_dev` |

### 7.4 Passo a Passo de Instalação Local

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/cristinaisadora761-ctrl/FogoZero.git
   cd FogoZero
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Configurar as variáveis de ambiente:**
   * No Windows PowerShell:
     ```powershell
     Copy-Item .env.example .env
     ```
   * No Linux / macOS / Git Bash:
     ```bash
     cp .env.example .env
     ```

4. **Inicializar o banco de dados (Opcional, pois é automático):**
   ```bash
   npm run db:seed
   ```

5. **Iniciar o servidor:**
   ```bash
   npm start
   ```

6. **Abrir no navegador:**
   * Aplicação principal: [http://localhost:3000](http://localhost:3000)
   * Formulário impresso Centelha 3: [http://localhost:3000/formulario.html](http://localhost:3000/formulario.html)

---

### 7.5 Como Testar

#### Usuários de Teste (Criados pelo `database/schema.sql`):
| Perfil | E-mail de Teste | Senha de Teste | Objetivo do Teste |
| :--- | :--- | :--- | :--- |
| **Professor / Admin** | `professor@fogozero.org` | `admin123` | Validar fluxo de administração e moderação. |
| **Agente Defesa Civil** | `agente@defesacivil.ro.gov.br` | `admin123` | Validar fluxo de equipe técnica de campo. |
| **Cidadão Comum** | `isadora@estudante.ro.gov.br` | `teste123` | Validar acesso de estudante/comunidade. |

#### Roteiro do Fluxo Principal para Validação:
1. Abra [http://localhost:3000](http://localhost:3000) (ou o link no ar [https://cristinaisadora761-ctrl.github.io/FogoZero/](https://cristinaisadora761-ctrl.github.io/FogoZero/)).
2. Clique no botão **"🔐 Entrar"** na barra superior e digite:
   * E-mail: `professor@fogozero.org`
   * Senha: `admin123`
   * O sistema exibirá notificação de sucesso e identificará o usuário logado com distintivo verde.
3. Role até a seção **"Registrar Ocorrência de Queimada"**:
   * Selecione o município (ex.: Porto Velho), bairro e tipo de foco.
   * Clique em **"Usar Minha Localização Atual (GPS)"** ou clique diretamente em qualquer ponto do mapa para capturar coordenadas.
   * Preencha a descrição e envie o formulário.
4. Verifique a exibição do **Modal com o Protocolo Gerado** (ex.: `#FZ-RO-XXXX`).
5. Role até o **Mapa Interativo de Rondônia**:
   * O novo foco aparecerá com marcador pulsante animado.
   * Altere os filtros de intensidade da fumaça e de municípios para testar a renderização dinâmica.
6. Na seção **"Últimos Relatos Registrados"**:
   * Digite termos na barra de busca (ex.: "Bairro Nacional" ou "lixo") para testar a filtragem em tempo real.
   * Clique em **"📥 Exportar CSV"** ou **"💾 JSON"** para validar o download da base de dados.
7. Na seção **"Vídeo Pitch"**, confirme a reprodução do vídeo do YouTube (3 minutos).
8. Clique no botão **"📄 Formulário Completo (.doc)"** no topo da página para conferir todas as 17 respostas acadêmicas do Simulado Centelha 3.

#### Problemas Conhecidos ou Limitações Atuais:
* A captura de sinal GPS depende da permissão do usuário no navegador; caso recusada, o sistema aplica automaticamente as coordenadas centrais de Porto Velho/RO.
* O envio de fotos armazena miniaturas codificadas em base64 localmente; para produção em larga escala, recomenda-se integrar com um serviço de storage em nuvem (ex.: AWS S3 ou Cloudinary).
