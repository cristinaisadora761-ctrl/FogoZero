# FogoZero – Sistema Inteligente de Registro e Monitoramento de Queimadas

**Projeto Acadêmico – Simulado Programa Centelha 3 Rondônia (Fase 1 - Ideias Inovadoras)**  
**Proponente:** Isadora Cristina Ferreira Queiroz  
**Turma:** 3°B de Informática  
**Edital:** Simulado com base no Edital nº 03/2026 - Centelha 3 Rondônia (FAPERO / FINEP / CERTI)  
**Vídeo Pitch:** [https://youtu.be/vBwcouGCj0k](https://youtu.be/vBwcouGCj0k) (Duração máxima: 3 minutos)

---

## 📌 Sobre o Projeto

O **FogoZero** é uma plataforma digital colaborativa desenvolvida para conectar a população ao monitoramento de queimadas e focos de calor em Rondônia.

Enquanto sistemas consolidados de satélite (como o Programa Queimadas do **INPE**) monitoram grandes áreas e focos térmicos com satélites de referência, o **FogoZero** atua como uma camada complementar comunitária em nível de rua e bairro:
- Permite que qualquer cidadão registre pelo celular relatos de fumaça, queimadas de lixo urbano, terrenos baldios e margens de estradas.
- Captura coordenadas via **GPS integrado** ou clique no mapa.
- Avalia severidade da fumaça e proximidade de casas e escolas.
- Apresenta os focos em um **mapa interativo em tempo real** e em um painel estatístico com dados históricos oficiais.
- Disponibiliza orientações de **saúde e prevenção respiratória** e canais diretos de emergência (193 Bombeiros, 199 Defesa Civil, SEDAM RO).

---

## 🚀 Estrutura dos Arquivos

1. **`index.html`**:  
   Aplicação web principal responsiva, contendo:
   - Apresentação completa e Hero interativo com indicadores rápidos.
   - Formulário de Registro Cidadão com validação, geolocalização e preview de fotografia.
   - Mapa Interativo de Rondônia construído com **Leaflet.js** e marcadores com animação de pulso por gravidade.
   - Feed dinâmico de últimos relatos armazenados em `localStorage`.
   - Painel de Estatísticas com **Chart.js** (dados INPE: Junho 2024 vs 2025; redução de 79,2% em Porto Velho).
   - Seção do Vídeo Pitch incorporado do YouTube e tabela do roteiro de 3 minutos.
   - Dossiê detalhado dos 5 pilares do Programa Centelha 3.
   - Guia de Saúde e contatos de emergência (Bombeiros 193, Defesa Civil 199, SEDAM, PM Ambiental).

2. **`formulario.html`**:  
   Visualização formatada e limpa do **Formulário Individual do Estudante (Fase 1)** com todas as 17 respostas organizadas, fontes citadas, roteiro de pitch e critérios de avaliação com fórmula de nota. Otimizado para impressão direta em PDF ou cópia de texto para entrega em `.doc`.

3. **`styles.css`**:  
   Estilos customizados, tema escuro verde-floresta com destaques em fogo/âmbar, efeitos de vidro (glassmorphism), animações de pulso nos marcadores do mapa e formatações de impressão.

4. **`app.js`**:  
   Lógica JavaScript da aplicação: controle do mapa Leaflet, filtros por intensidade e cidade, geolocalização HTML5, geração de protocolo único, persistência em `localStorage`, gráficos Chart.js e alertas interativos.

---

## 💻 Como Abrir e Utilizar

Você pode abrir o site de duas maneiras muito simples:

### Opção 1: Abrir diretamente no navegador (Chrome, Edge, Firefox)
Basta clicar duas vezes no arquivo `index.html` ou arrastá-lo para a janela do seu navegador!

### Opção 2: Servidor local com Python
Se desejar executar com um servidor HTTP local:
```powershell
cd C:\Users\Aluno\.gemini\antigravity\scratch\fogozero
python -m http.server 3000
```
Em seguida, acesse no navegador: `http://localhost:3000`

---

## 📊 Principais Fontes e Dados Citados
- **INPE (Programa Queimadas)**: Junho/2025 (49 focos em RO) vs Junho/2024 (183 focos).
- **Prefeitura de Porto Velho**: Queda de 79,2% nos focos de queimada entre jan-mai de 2026 (22 focos) comparado a jan-mai de 2025 (106 focos).
- **Edital nº 03/2026 Centelha 3 Rondônia** (Fórmula da Nota: `(2 × S + M + E + I) ÷ 5`).
