/**
 * FogoZero - Sistema Inteligente de Registro e Monitoramento de Queimadas
 * Projeto de Isadora Cristina Ferreira Queiroz (3°B de Informática)
 * Simulado Centelha 3 Rondônia
 */

// Dados iniciais simulados baseados no cenário real de Rondônia
const INITIAL_REPORTS = [
  {
    id: "FZ-RO-2026-01",
    protocolo: "FZ-RO-7812",
    municipio: "Porto Velho",
    bairro: "Bairro Nacional",
    lat: -8.7290,
    lng: -63.9055,
    tipo: "Terreno baldio urbano",
    intensidade: "Crítica",
    proximidade: "Menos de 100m",
    dataHora: "2026-10-06 14:15",
    descricao: "Fogo alto em vegetação seca de terreno baldio próximo a residências. Fumaça muito densa entrando nas casas com forte odor.",
    status: "Encaminhado aos Bombeiros",
    statusBadge: "bg-red-500/20 text-red-400 border-red-500/30",
    foto: null
  },
  {
    id: "FZ-RO-2026-02",
    protocolo: "FZ-RO-6431",
    municipio: "Porto Velho",
    bairro: "Zona Leste (Jardim Santana)",
    lat: -8.7560,
    lng: -63.8520,
    tipo: "Queima de lixo doméstico",
    intensidade: "Moderada",
    proximidade: "Entre 100m e 500m",
    dataHora: "2026-10-06 11:30",
    descricao: "Morador colocando fogo em folhas secas e lixo no fundo do quintal. Vento levando fumaça para a rua e escola próxima.",
    status: "Verificado pela Comunidade",
    statusBadge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    foto: null
  },
  {
    id: "FZ-RO-2026-03",
    protocolo: "FZ-RO-5990",
    municipio: "Porto Velho",
    bairro: "Estrada do Belmont",
    lat: -8.7050,
    lng: -63.8820,
    tipo: "Margem de rodovia / acesso",
    intensidade: "Densa",
    proximidade: "Mais de 500m",
    dataHora: "2026-10-05 16:45",
    descricao: "Foco extenso na vegetação da margem da estrada reduzindo a visibilidade dos motoristas.",
    status: "Em Análise",
    statusBadge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    foto: null
  },
  {
    id: "FZ-RO-2026-04",
    protocolo: "FZ-RO-4210",
    municipio: "Ariquemes",
    bairro: "Setor 09",
    lat: -9.9133,
    lng: -63.0408,
    tipo: "Pastagem / Área rural próxima",
    intensidade: "Moderada",
    proximidade: "Entre 100m e 500m",
    dataHora: "2026-10-05 09:20",
    descricao: "Fumaça visível em área de pasto seco. Fogo contido por aceiro mas fumaça perceptível na vizinhança.",
    status: "Verificado pela Comunidade",
    statusBadge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    foto: null
  },
  {
    id: "FZ-RO-2026-05",
    protocolo: "FZ-RO-3874",
    municipio: "Ji-Paraná",
    bairro: "Dois de Abril",
    lat: -10.8827,
    lng: -61.9442,
    tipo: "Terreno baldio urbano",
    intensidade: "Leve",
    proximidade: "Menos de 100m",
    dataHora: "2026-10-04 18:10",
    descricao: "Pequeno foco de fogo já quase extinto, fumaça residual leve.",
    status: "Resolvido",
    statusBadge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    foto: null
  },
  {
    id: "FZ-RO-2026-06",
    protocolo: "FZ-RO-2109",
    municipio: "Cacoal",
    bairro: "Belo Horizonte",
    lat: -11.4386,
    lng: -61.4472,
    tipo: "Área de mata / preservação",
    intensidade: "Densa",
    proximidade: "Mais de 500m",
    dataHora: "2026-10-04 15:00",
    descricao: "Fumaça densa avistada em fragmento florestal próximo ao anel viário.",
    status: "Encaminhado aos Bombeiros",
    statusBadge: "bg-red-500/20 text-red-400 border-red-500/30",
    foto: null
  }
];

// Estado global da aplicação
let mapInstance = null;
let mapMarkers = [];
let currentReports = [];
let chartComparativo = null;
let chartCategorias = null;

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  carregarRelatos();
  inicializarMapa();
  renderizarRelatosNoMapa();
  renderizarFeedRelatos();
  atualizarContadores();
  inicializarGraficos();
  configurarEventosFormulario();
  preencherDataHoraPadrao();
});

// Carrega dados da API Backend (SQLite) com fallback automático para LocalStorage (GitHub Pages)
async function carregarRelatos() {
  try {
    const res = await fetch("/api/relatos");
    if (res.ok) {
      const dados = await res.json();
      if (Array.isArray(dados) && dados.length > 0) {
        currentReports = dados;
        salvarRelatos();
        renderizarRelatosNoMapa();
        renderizarFeedRelatos();
        atualizarContadores();
        atualizarGraficoCategorias();
        return;
      }
    }
  } catch (err) {
    // Modo estático (ex.: GitHub Pages) ou sem servidor rodando: utiliza LocalStorage
    console.info("FogoZero em modo estático/offline. Utilizando armazenamento local.");
  }

  // Fallback padrão para LocalStorage
  const salvas = localStorage.getItem("fogozero_relatos");
  if (salvas) {
    try {
      currentReports = JSON.parse(salvas);
    } catch (e) {
      currentReports = [...INITIAL_REPORTS];
    }
  } else {
    currentReports = [...INITIAL_REPORTS];
    localStorage.setItem("fogozero_relatos", JSON.stringify(currentReports));
  }
}

function salvarRelatos() {
  localStorage.setItem("fogozero_relatos", JSON.stringify(currentReports));
}

// Inicializa o Mapa Leaflet com foco em Rondônia
function inicializarMapa() {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  // Centro aproximado de Rondônia (Porto Velho e região)
  mapInstance = L.map("map", {
    scrollWheelZoom: true,
    zoomControl: true
  }).setView([-8.7619, -63.9039], 7);

  // CartoDB Dark Matter para destaque dos focos de fogo
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19
  }).addTo(mapInstance);

  // Clique no mapa para capturar coordenadas no formulário
  mapInstance.on("click", (e) => {
    const latInput = document.getElementById("coordLat");
    const lngInput = document.getElementById("coordLng");
    if (latInput && lngInput) {
      latInput.value = e.latlng.lat.toFixed(5);
      lngInput.value = e.latlng.lng.toFixed(5);
      showToast("Coordenadas selecionadas no mapa!", "info");
      
      // Feedback visual temporário
      const tempMarker = L.circleMarker([e.latlng.lat, e.latlng.lng], {
        radius: 8,
        color: "#ea580c",
        fillColor: "#f97316",
        fillOpacity: 0.8
      }).addTo(mapInstance);
      setTimeout(() => mapInstance.removeLayer(tempMarker), 4000);
    }
  });
}

// Renderiza marcadores no mapa
function renderizarRelatosNoMapa(filtroIntensidade = "todas", filtroMunicipio = "todos") {
  if (!mapInstance) return;

  // Limpa marcadores anteriores
  mapMarkers.forEach(m => mapInstance.removeLayer(m));
  mapMarkers = [];

  const filtrados = currentReports.filter(rep => {
    const atendeIntensidade = filtroIntensidade === "todas" || rep.intensidade.toLowerCase() === filtroIntensidade.toLowerCase();
    const atendeMunicipio = filtroMunicipio === "todos" || rep.municipio.toLowerCase().includes(filtroMunicipio.toLowerCase());
    return atendeIntensidade && atendeMunicipio;
  });

  filtrados.forEach(report => {
    // Escolhe classe de cor do marcador
    let markerClass = "marker-moderada";
    let iconChar = "🔥";
    if (report.intensidade === "Crítica") {
      markerClass = "marker-critico";
      iconChar = "⚠️";
    } else if (report.intensidade === "Densa") {
      markerClass = "marker-densa";
      iconChar = "🔥";
    } else if (report.intensidade === "Leve") {
      markerClass = "marker-leve";
      iconChar = "💨";
    }

    const customIcon = L.divIcon({
      className: `pulsing-marker ${markerClass}`,
      html: `<span>${iconChar}</span>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -14]
    });

    const marker = L.marker([report.lat, report.lng], { icon: customIcon });

    const popupContent = `
      <div class="text-xs">
        <div class="flex items-center justify-between gap-2 border-b border-gray-700/60 pb-1.5 mb-2">
          <span class="font-bold text-sm text-amber-400">${report.municipio}</span>
          <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-300">${report.protocolo}</span>
        </div>
        <p class="font-semibold text-gray-100 text-xs mb-1">📍 ${report.bairro || "Localização informada"}</p>
        <p class="text-gray-300 text-[11px] mb-1"><strong class="text-gray-400">Tipo:</strong> ${report.tipo}</p>
        <div class="grid grid-cols-2 gap-1 my-2 bg-black/40 p-1.5 rounded border border-gray-800 text-[11px]">
          <div><strong class="text-gray-400">Fumaça:</strong> <span class="font-semibold text-orange-400">${report.intensidade}</span></div>
          <div><strong class="text-gray-400">Distância:</strong> ${report.proximidade}</div>
        </div>
        <p class="text-gray-300 text-[11px] italic mb-2 line-clamp-3">"${report.descricao}"</p>
        <div class="flex items-center justify-between pt-1 border-t border-gray-800/80 text-[10px] text-gray-400">
          <span>🕒 ${report.dataHora}</span>
          <span class="px-1.5 py-0.5 rounded font-medium ${report.statusBadge}">${report.status}</span>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);
    marker.addTo(mapInstance);
    mapMarkers.push(marker);
  });
}

// Renderiza a lista de relatos na seção de comunidade
// Renderiza a lista de relatos na seção de comunidade
function renderizarFeedRelatos(lista = currentReports) {
  const container = document.getElementById("reports-feed-container");
  if (!container) return;

  if (!lista || lista.length === 0) {
    container.innerHTML = `<div class="col-span-full p-8 text-center text-gray-400 glass-panel rounded-xl border border-gray-800">Nenhum relato encontrado com os critérios selecionados.</div>`;
    return;
  }

  container.innerHTML = lista.slice(0, 9).map(rep => `
    <div class="glass-panel p-4 rounded-xl border border-gray-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="badge-tag ${rep.statusBadge}">
            ${rep.status}
          </span>
          <span class="text-xs font-mono text-gray-400">${rep.protocolo}</span>
        </div>
        <h4 class="font-bold text-gray-100 text-base flex items-center gap-1.5">
          <span class="text-orange-500">🔥</span> ${rep.tipo}
        </h4>
        <p class="text-xs text-emerald-400 font-medium mt-0.5">
          📍 ${rep.bairro ? `${rep.bairro}, ` : ''}${rep.municipio} - RO
        </p>
        <p class="text-xs text-gray-300 mt-2 line-clamp-2">
          "${rep.descricao}"
        </p>
      </div>

      <div class="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
        <span class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full ${rep.intensidade === 'Crítica' ? 'bg-red-500' : rep.intensidade === 'Densa' ? 'bg-orange-500' : 'bg-amber-400'}"></span>
          Fumaça ${rep.intensidade}
        </span>
        <button onclick="focarNoMapa(${rep.lat}, ${rep.lng})" class="text-emerald-400 hover:text-emerald-300 font-medium hover:underline text-xs flex items-center gap-1">
          Ver no Mapa ➔
        </button>
      </div>
    </div>
  `).join("");
}

// Filtra a lista de relatos em tempo real pela busca e status
window.filtrarFeedRelatos = function() {
  const termo = (document.getElementById("busca-feed-input")?.value || "").toLowerCase().trim();
  const statusFiltro = document.getElementById("filtro-feed-status")?.value || "todos";

  const filtrados = currentReports.filter(rep => {
    const textoCompleto = `${rep.protocolo} ${rep.municipio} ${rep.bairro} ${rep.tipo} ${rep.descricao}`.toLowerCase();
    const atendeTermo = !termo || textoCompleto.includes(termo);
    const atendeStatus = statusFiltro === "todos" || rep.status === statusFiltro;
    return atendeTermo && atendeStatus;
  });

  renderizarFeedRelatos(filtrados);
};

// Foca o mapa em um ponto específico e abre popup
window.focarNoMapa = function(lat, lng) {
  if (!mapInstance) return;
  mapInstance.flyTo([lat, lng], 13, { duration: 1.2 });
  
  // Rola até o mapa
  const mapSection = document.getElementById("mapa");
  if (mapSection) {
    mapSection.scrollIntoView({ behavior: "smooth" });
  }

  // Tenta abrir o popup correspondente
  setTimeout(() => {
    mapMarkers.forEach(marker => {
      const pos = marker.getLatLng();
      if (Math.abs(pos.lat - lat) < 0.0005 && Math.abs(pos.lng - lng) < 0.0005) {
        marker.openPopup();
      }
    });
  }, 1300);
};

// Atualiza contadores numéricos da tela
function atualizarContadores() {
  const totalRelatos = currentReports.length;
  const countElement = document.getElementById("counter-total-relatos");
  if (countElement) countElement.innerText = totalRelatos;

  const focosCriticos = currentReports.filter(r => r.intensidade === "Crítica" || r.intensidade === "Densa").length;
  const criticosElement = document.getElementById("counter-criticos");
  if (criticosElement) criticosElement.innerText = focosCriticos;
}

// Configura eventos do formulário de registro
function configurarEventosFormulario() {
  const form = document.getElementById("report-form");
  if (!form) return;

  // Botão de obter GPS
  const btnGps = document.getElementById("btn-obter-gps");
  if (btnGps) {
    btnGps.addEventListener("click", () => {
      if (!navigator.geolocation) {
        showToast("Geolocalização não suportada no seu navegador.", "error");
        return;
      }
      btnGps.innerHTML = `<span>Buscando sinal GPS...</span>`;
      btnGps.disabled = true;

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          document.getElementById("coordLat").value = lat.toFixed(5);
          document.getElementById("coordLng").value = lng.toFixed(5);
          btnGps.innerHTML = `<span>Localização Obtida via GPS</span>`;
          btnGps.disabled = false;
          showToast("Localização GPS capturada com sucesso!", "success");

          if (mapInstance) {
            mapInstance.flyTo([lat, lng], 14);
          }
        },
        (err) => {
          btnGps.innerHTML = `<span>Usar Minha Localização Atual (GPS)</span>`;
          btnGps.disabled = false;
          // Fallback para Porto Velho se o usuário recusar permissão
          document.getElementById("coordLat").value = "-8.7619";
          document.getElementById("coordLng").value = "-63.9039";
          showToast("GPS indisponível. Coordenadas padrão de Porto Velho inseridas.", "warning");
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }

  // Preview de foto
  const inputFoto = document.getElementById("fotoInput");
  const previewContainer = document.getElementById("foto-preview-container");
  const previewImg = document.getElementById("foto-preview-img");

  if (inputFoto && previewContainer && previewImg) {
    inputFoto.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          previewImg.src = event.target.result;
          previewContainer.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Filtros do mapa
  const selectFiltroIntensidade = document.getElementById("filtro-mapa-intensidade");
  const selectFiltroMunicipio = document.getElementById("filtro-mapa-municipio");

  if (selectFiltroIntensidade && selectFiltroMunicipio) {
    const aplicarFiltros = () => {
      renderizarRelatosNoMapa(selectFiltroIntensidade.value, selectFiltroMunicipio.value);
    };
    selectFiltroIntensidade.addEventListener("change", aplicarFiltros);
    selectFiltroMunicipio.addEventListener("change", aplicarFiltros);
  }

  // Submissão do formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const municipio = document.getElementById("municipioSelect").value;
    const bairro = document.getElementById("bairroInput").value.trim();
    const tipo = document.getElementById("tipoQueimadaSelect").value;
    const intensidade = document.getElementById("intensidadeSelect").value;
    const proximidade = document.getElementById("proximidadeSelect").value;
    const descricao = document.getElementById("descricaoInput").value.trim();
    const dataHora = document.getElementById("dataHoraInput").value;
    let lat = parseFloat(document.getElementById("coordLat").value);
    let lng = parseFloat(document.getElementById("coordLng").value);

    // Validação de coordenadas
    if (isNaN(lat) || isNaN(lng)) {
      // Coordenadas padrão com ligeiro ruído aleatório em Porto Velho
      lat = -8.7619 + (Math.random() - 0.5) * 0.05;
      lng = -63.9039 + (Math.random() - 0.5) * 0.05;
    }

    const protocoloGerado = `FZ-RO-${Math.floor(1000 + Math.random() * 9000)}`;

    const novoRelato = {
      id: `FZ-RO-${Date.now()}`,
      protocolo: protocoloGerado,
      municipio: municipio,
      bairro: bairro || "Localidade informada",
      lat: lat,
      lng: lng,
      tipo: tipo,
      intensidade: intensidade,
      proximidade: proximidade,
      dataHora: dataHora || new Date().toLocaleString("pt-BR"),
      descricao: descricao,
      status: "Em Análise",
      statusBadge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      foto: previewImg ? previewImg.src : null
    };

    // Tenta persistir no Banco de Dados via API REST
    fetch("/api/relatos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoRelato)
    })
    .then(r => r.json())
    .then(data => {
      if (data && data.protocolo) {
        novoRelato.protocolo = data.protocolo;
      }
    })
    .catch(() => {
      // Falha silenciosa para fallback local
    });

    // Insere no início da lista local
    currentReports.unshift(novoRelato);
    salvarRelatos();

    // Atualiza interface
    renderizarRelatosNoMapa();
    renderizarFeedRelatos();
    atualizarContadores();
    atualizarGraficoCategorias();

    // Limpa formulário
    form.reset();
    if (previewContainer) previewContainer.classList.add("hidden");
    preencherDataHoraPadrao();

    // Modal de confirmação com protocolo
    abrirModalConfirmacao(novoRelato);

    showToast(`Relato registrado com sucesso! Protocolo: ${protocoloGerado}`, "success");

    // Centraliza mapa no novo relato
    if (mapInstance) {
      mapInstance.flyTo([lat, lng], 14, { duration: 1.5 });
    }
  });
}

function preencherDataHoraPadrao() {
  const dtInput = document.getElementById("dataHoraInput");
  if (dtInput) {
    const now = new Date();
    const ano = now.getFullYear();
    const mes = String(now.getMonth() + 1).padStart(2, "0");
    const dia = String(now.getDate()).padStart(2, "0");
    const horas = String(now.getHours()).padStart(2, "0");
    const minutos = String(now.getMinutes()).padStart(2, "0");
    dtInput.value = `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  }
}

// Modal de confirmação
function abrirModalConfirmacao(relato) {
  const modal = document.getElementById("modal-confirmacao");
  const modalProto = document.getElementById("modal-proto-codigo");
  const modalResumo = document.getElementById("modal-resumo-texto");
  if (!modal) return;

  if (modalProto) modalProto.innerText = relato.protocolo;
  if (modalResumo) {
    modalResumo.innerHTML = `
      <strong>${relato.tipo}</strong> em <strong>${relato.municipio}</strong> (${relato.bairro})<br>
      Fumaça: <span class="text-orange-400">${relato.intensidade}</span> • Proximidade: ${relato.proximidade}
    `;
  }
  modal.classList.remove("hidden");
}

window.fecharModalConfirmacao = function() {
  const modal = document.getElementById("modal-confirmacao");
  if (modal) modal.classList.add("hidden");
};

// Modal de Formulário Completo Centelha 3
window.abrirModalFormularioCentelha = function() {
  const modal = document.getElementById("modal-formulario-centelha");
  if (modal) modal.classList.remove("hidden");
};

window.fecharModalFormularioCentelha = function() {
  const modal = document.getElementById("modal-formulario-centelha");
  if (modal) modal.classList.add("hidden");
};

// Inicializa os Gráficos com Chart.js
function inicializarGraficos() {
  // Gráfico 1: Comparativo Oficial INPE (Junho 2024 vs Junho 2025 em RO e Jan-Mai 2025 vs 2026 em Porto Velho)
  const ctxComp = document.getElementById("chartComparativo");
  if (ctxComp && typeof Chart !== "undefined") {
    chartComparativo = new Chart(ctxComp, {
      type: "bar",
      data: {
        labels: [
          "Junho (Rondônia Geral)",
          "Jan-Maio (Porto Velho)"
        ],
        datasets: [
          {
            label: "Período Anterior (2024 / 2025)",
            data: [183, 106],
            backgroundColor: "rgba(239, 68, 68, 0.75)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: "Período Monitorado (2025 / 2026)",
            data: [49, 22],
            backgroundColor: "rgba(16, 185, 129, 0.75)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#cbd5e1", font: { size: 12 } }
          },
          tooltip: {
            callbacks: {
              afterBody: (context) => {
                if (context[0].dataIndex === 1) {
                  return "Redução oficial de 79,2% em Porto Velho (Dados INPE / Prefeitura)";
                }
                return "Redução de 183 para 49 focos no mês de junho (Dados INPE)";
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#94a3b8" },
            grid: { color: "rgba(148, 163, 184, 0.1)" }
          },
          x: {
            ticks: { color: "#94a3b8" },
            grid: { display: false }
          }
        }
      }
    });
  }

  // Gráfico 2: Distribuição por Tipo de Ocorrência Comunitária
  const ctxCat = document.getElementById("chartCategorias");
  if (ctxCat && typeof Chart !== "undefined") {
    const tipos = contarTiposRelatos();
    chartCategorias = new Chart(ctxCat, {
      type: "doughnut",
      data: {
        labels: Object.keys(tipos),
        datasets: [{
          data: Object.values(tipos),
          backgroundColor: [
            "#f97316", // Terreno baldio
            "#eab308", // Lixo doméstico
            "#ef4444", // Margem de rodovia
            "#10b981", // Pastagem
            "#06b6d4"  // Área de mata
          ],
          borderColor: "#0f1c18",
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#cbd5e1", font: { size: 11 }, boxWidth: 12 }
          }
        },
        cutout: "68%"
      }
    });
  }
}

function contarTiposRelatos() {
  const counts = {
    "Terreno baldio": 0,
    "Queima de lixo": 0,
    "Margem rodovia": 0,
    "Pastagem rural": 0,
    "Área florestal": 0
  };

  currentReports.forEach(r => {
    if (r.tipo.includes("Terreno")) counts["Terreno baldio"]++;
    else if (r.tipo.includes("lixo")) counts["Queima de lixo"]++;
    else if (r.tipo.includes("rodovia")) counts["Margem rodovia"]++;
    else if (r.tipo.includes("Pastagem")) counts["Pastagem rural"]++;
    else counts["Área florestal"]++;
  });

  return counts;
}

function atualizarGraficoCategorias() {
  if (!chartCategorias) return;
  const novosTipos = contarTiposRelatos();
  chartCategorias.data.datasets[0].data = Object.values(novosTipos);
  chartCategorias.update();
}

// Toasts de notificação
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const bgColors = {
    success: "bg-emerald-900/90 border-emerald-500 text-emerald-200",
    error: "bg-red-900/90 border-red-500 text-red-200",
    warning: "bg-amber-900/90 border-amber-500 text-amber-200",
    info: "bg-gray-900/90 border-emerald-600 text-gray-200"
  };

  toast.className = `toast-item p-4 rounded-xl border shadow-xl flex items-center gap-3 min-w-[280px] max-w-md ${bgColors[type] || bgColors.info}`;
  toast.innerHTML = `
    <span class="text-base">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
    <span class="text-xs font-medium flex-1">${message}</span>
    <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-white text-xs">✕</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Alternar Menu Mobile
window.toggleMenuMobile = function() {
  const menu = document.getElementById("mobile-menu-drawer");
  if (menu) {
    menu.classList.toggle("hidden");
  }
};

// Exportar Relatos para CSV
window.exportarRelatosCSV = function() {
  if (!currentReports || currentReports.length === 0) {
    showToast("Nenhum relato disponível para exportação.", "warning");
    return;
  }

  const cabecalho = ["Protocolo", "Municipio", "Bairro", "Tipo", "Intensidade", "Proximidade", "DataHora", "Status", "Descricao", "Latitude", "Longitude"];
  const linhas = currentReports.map(r => [
    `"${r.protocolo}"`,
    `"${r.municipio}"`,
    `"${r.bairro || ''}"`,
    `"${r.tipo}"`,
    `"${r.intensidade}"`,
    `"${r.proximidade}"`,
    `"${r.dataHora}"`,
    `"${r.status}"`,
    `"${(r.descricao || '').replace(/"/g, '""')}"`,
    r.lat,
    r.lng
  ].join(","));

  const csvContent = "\uFEFF" + [cabecalho.join(","), ...linhas].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `fogozero_relatos_rondonia_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast("Relatório CSV exportado com sucesso!", "success");
};

// Exportar Relatos para JSON
window.exportarRelatosJSON = function() {
  if (!currentReports || currentReports.length === 0) {
    showToast("Nenhum relato disponível para exportação.", "warning");
    return;
  }

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentReports, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", `fogozero_dados_centelha3_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Base de dados JSON exportada com sucesso!", "success");
};

// ====================================================================
// AUTENTICAÇÃO E CONTROLE DE ACESSO (Spec: Login Funcional)
// ====================================================================

window.abrirModalLogin = function() {
  const modal = document.getElementById("modal-login");
  if (modal) modal.classList.remove("hidden");
};

window.fecharModalLogin = function() {
  const modal = document.getElementById("modal-login");
  if (modal) modal.classList.add("hidden");
};

window.realizarLogin = async function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();
    if (res.ok && data.sucesso) {
      localStorage.setItem("fogozero_usuario", JSON.stringify(data.usuario));
      atualizarInterfaceUsuario(data.usuario);
      fecharModalLogin();
      showToast(`Bem-vindo, ${data.usuario.nome}! Perfil: ${data.usuario.perfil.toUpperCase()}`, "success");
    } else {
      showToast(data.erro || "Falha na autenticação.", "error");
    }
  } catch (err) {
    // Simulação local em caso de uso estático
    if (email === "professor@fogozero.org" && senha === "admin123") {
      const usuarioSimulado = { id: 1, nome: "Professor Avaliador", email, perfil: "admin" };
      localStorage.setItem("fogozero_usuario", JSON.stringify(usuarioSimulado));
      atualizarInterfaceUsuario(usuarioSimulado);
      fecharModalLogin();
      showToast("Autenticado como Professor Avaliador (Admin)!", "success");
    } else {
      showToast("Credenciais incorretas. Use professor@fogozero.org / admin123", "error");
    }
  }
};

window.fazerLogout = function() {
  localStorage.removeItem("fogozero_usuario");
  const container = document.getElementById("user-status-container");
  if (container) {
    container.innerHTML = `
      <button id="btn-abrir-login" onclick="abrirModalLogin()" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900/90 transition-colors">
        <span>🔐</span> Entrar
      </button>
    `;
  }
  showToast("Sessão encerrada com sucesso.", "info");
};

function atualizarInterfaceUsuario(usuario) {
  const container = document.getElementById("user-status-container");
  if (!container || !usuario) return;

  container.innerHTML = `
    <div class="flex items-center gap-2 bg-emerald-950/90 border border-emerald-600/60 px-3 py-1 rounded-xl text-xs">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span class="text-white font-medium text-[11px]">${usuario.nome.split(" ")[0]} (${usuario.perfil.toUpperCase()})</span>
      <button onclick="fazerLogout()" class="text-red-400 hover:text-red-300 ml-1 text-xs" title="Sair">🚪</button>
    </div>
  `;
}

// Checagem de sessão salva ao carregar
document.addEventListener("DOMContentLoaded", () => {
  const salvo = localStorage.getItem("fogozero_usuario");
  if (salvo) {
    try {
      atualizarInterfaceUsuario(JSON.parse(salvo));
    } catch (e) {}
  }
});

