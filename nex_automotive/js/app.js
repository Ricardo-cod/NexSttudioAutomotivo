
const STORAGE_KEY = "nex_automotive_vehicles_v1";

const placeholderImage =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80";

// =====================================
// ESTOQUE INICIAL DEMONSTRATIVO
// =====================================

const initialVehicles = [
  {
    id: "car-1",
    brand: "Volkswagen",
    model: "Jetta GLI",
    year: 2022,
    km: 28000,
    transmission: "Automático",
    fuel: "Gasolina",
    price: 165900,
    description: "Sedã esportivo com excelente desempenho, tecnologia e conforto.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80",
    sold: false
  },
  {
    id: "car-2",
    brand: "BMW",
    model: "320i",
    year: 2021,
    km: 35000,
    transmission: "Automático",
    fuel: "Gasolina",
    price: 189900,
    description: "Design sofisticado, acabamento premium e experiência de condução diferenciada.",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80",
    sold: false
  },
  {
    id: "car-3",
    brand: "Ford",
    model: "Fusion Titanium",
    year: 2018,
    km: 62000,
    transmission: "Automático",
    fuel: "Gasolina",
    price: 99900,
    description: "Conforto, espaço interno e tecnologia em um sedã de categoria superior.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
    sold: false
  },
  {
    id: "car-4",
    brand: "Audi",
    model: "A3 Sedan",
    year: 2020,
    km: 44000,
    transmission: "Automático",
    fuel: "Gasolina",
    price: 139900,
    description: "Elegância e tecnologia em um sedã compacto premium.",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80",
    sold: false
  },
  {
    id: "car-5",
    brand: "Honda",
    model: "Civic Touring",
    year: 2020,
    km: 51000,
    transmission: "CVT",
    fuel: "Gasolina",
    price: 125900,
    description: "Um veículo que combina eficiência, conforto e personalidade.",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1000&q=80",
    sold: false
  },
  {
    id: "car-6",
    brand: "Mercedes-Benz",
    model: "C180",
    year: 2019,
    km: 58000,
    transmission: "Automático",
    fuel: "Gasolina",
    price: 149900,
    description: "Acabamento refinado e experiência premium ao dirigir.",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80",
    sold: true
  }
];

// =====================================
// ELEMENTOS E VARIÁVEIS PRINCIPAIS
// =====================================

const $ = (id) => document.getElementById(id);

function loadVehicles() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) {
      return initialVehicles.map(v => ({ ...v }));
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : initialVehicles.map(v => ({ ...v }));

  } catch (error) {
    console.error("Erro ao carregar estoque:", error);
    return initialVehicles.map(v => ({ ...v }));
  }
}

let vehicles = loadVehicles();
let selectedImages = [];

const CONFIG_KEY = "nex_automotive_config_v1";

const defaultConfig = {
  storeName: "NEX Automotive",
  whatsapp: "5551999999999"
};

function loadConfig() {
  try {
    return {
      ...defaultConfig,
      ...JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}")
    };
  } catch {
    return { ...defaultConfig };
  }
}

let storeConfig = loadConfig();

// =====================================
// PRÉVIA E ESCOLHA DA FOTO DE CAPA
// =====================================

function renderImagePreview() {
  const preview = $("imagePreview");

  if (!selectedImages.length) {
    preview.textContent = "Prévia da imagem";
    return;
  }

  preview.innerHTML = `
    <div style="
      display:flex;
      flex-wrap:wrap;
      gap:12px;
    ">
      ${selectedImages.map((image, index) => `
        <div style="
          text-align:center;
          width:115px;
        ">
          <img
            src="${escapeHTML(image)}"
            alt="Foto ${index + 1}"
            style="
              width:110px;
              height:80px;
              object-fit:cover;
              border-radius:8px;
              border:${index === 0
                ? "2px solid #c9a45c"
                : "2px solid transparent"};
            "
          >

          <div style="margin-top:7px">
            ${index === 0
              ? `
                <strong style="
                  color:#c9a45c;
                  font-size:11px;
                ">
                  ★ FOTO DE CAPA
                </strong>
              `
              : `
                <button
                  type="button"
                  class="choose-cover"
                  data-index="${index}"
                  style="
                    padding:6px 8px;
                    font-size:10px;
                    cursor:pointer;
                  "
                >
                  Definir como capa
                </button>
              `
            }
          </div>
        </div>
      `).join("")}
    </div>

    <p style="margin-top:12px">
      ${selectedImages.length} fotos selecionadas.
    </p>
  `;
}

// Evento para escolher a foto de capa
$("imagePreview").addEventListener("click", event => {
  const button = event.target.closest(".choose-cover");

  if (!button) return;

  const index = Number(button.dataset.index);

  if (
    !Number.isInteger(index) ||
    !selectedImages[index]
  ) {
    return;
  }

  // Move a foto escolhida para a primeira posição
  const [chosenImage] = selectedImages.splice(index, 1);

  selectedImages.unshift(chosenImage);

  renderImagePreview();
});

// =====================================
// CONFIGURAÇÕES E ARMAZENAMENTO
// =====================================

function saveConfig() {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(storeConfig));
    return true;
  } catch {
    alert("Não foi possível salvar as configurações.");
    return false;
  }
}

function saveVehicles() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    return true;
  } catch (error) {
    alert("Não foi possível salvar. A imagem pode ser muito grande. Tente fotos menores ou reduza a quantidade de imagens.");
    console.error(error);
    return false;
  }
}

function formatPrice(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function getVehicle(id) {
  return vehicles.find(vehicle => vehicle.id === id);
}

// =====================================
// CATÁLOGO PÚBLICO
// =====================================

function renderVehicles() {
  const search = $("searchInput").value.toLowerCase().trim();
  const brand = $("brandFilter").value;
  const maxPrice = Number($("priceFilter").value);
  const minYear = Number($("yearFilter").value);

  const filtered = vehicles.filter(vehicle => {
    const searchable = `${vehicle.brand} ${vehicle.model}`.toLowerCase();

    return searchable.includes(search) &&
      (!brand || vehicle.brand === brand) &&
      (!maxPrice || Number(vehicle.price) <= maxPrice) &&
      (!minYear || Number(vehicle.year) >= minYear);
  });

  $("vehicleCount").textContent =
    `${filtered.length} ${filtered.length === 1 ? "veículo encontrado" : "veículos encontrados"}`;

  $("emptyState").classList.toggle("hidden", filtered.length > 0);

  $("vehicleGrid").innerHTML = filtered.map(vehicle => `
    <article class="vehicle-card">
      <div class="vehicle-image">
        <img
          src="${escapeHTML(vehicle.image || placeholderImage)}"
          alt="${escapeHTML(vehicle.brand)} ${escapeHTML(vehicle.model)}"
          loading="lazy"
        >

        <span class="vehicle-status ${vehicle.sold ? "sold" : ""}">
          ${vehicle.sold ? "VENDIDO" : "DISPONÍVEL"}
        </span>
      </div>

      <div class="vehicle-info">
        <span class="vehicle-year">
          ${escapeHTML(vehicle.year)} · ${escapeHTML(vehicle.brand)}
        </span>

        <h3>${escapeHTML(vehicle.model)}</h3>

        <div class="vehicle-meta">
          <span>${Number(vehicle.km).toLocaleString("pt-BR")} km</span>
          <span>${escapeHTML(vehicle.transmission)}</span>
          <span>${escapeHTML(vehicle.fuel)}</span>
        </div>

        <div class="vehicle-price">
          <small>VALOR DO VEÍCULO</small>
          ${formatPrice(vehicle.price)}
        </div>

        <button class="btn-gold" data-details="${escapeHTML(vehicle.id)}">
          ${vehicle.sold ? "Ver detalhes" : "Conhecer veículo"} ↗
        </button>
      </div>
    </article>
  `).join("");
}

function renderBrandFilter() {
  const current = $("brandFilter").value;
  const brands = [...new Set(vehicles.map(v => v.brand))].sort();

  $("brandFilter").innerHTML =
    '<option value="">Todas as marcas</option>' +
    brands.map(brand =>
      `<option value="${escapeHTML(brand)}">${escapeHTML(brand)}</option>`
    ).join("");

  if (brands.includes(current)) {
    $("brandFilter").value = current;
  }
}

// =====================================
// DETALHES DO VEÍCULO - MODAL ANTIGO
// =====================================

function openDetails(id) {
  const vehicle = getVehicle(id);
  if (!vehicle) return;

  const phone = storeConfig.whatsapp;

  const message = encodeURIComponent(
    `Olá! Tenho interesse no ${vehicle.brand} ${vehicle.model} ${vehicle.year}.`
  );

  $("detailsContent").innerHTML = `
    <img
      class="details-image"
      src="${escapeHTML(vehicle.image || placeholderImage)}"
      alt="${escapeHTML(vehicle.model)}"
    >

    <span class="eyebrow">
      ${escapeHTML(vehicle.brand)} · ${escapeHTML(vehicle.year)}
    </span>

    <h2>${escapeHTML(vehicle.model)}</h2>

    <div class="vehicle-price">${formatPrice(vehicle.price)}</div>

    <div class="vehicle-meta">
      <span>${Number(vehicle.km).toLocaleString("pt-BR")} km</span>
      <span>${escapeHTML(vehicle.transmission)}</span>
      <span>${escapeHTML(vehicle.fuel)}</span>
    </div>

    <p>${escapeHTML(vehicle.description || "Entre em contato para mais informações.")}</p>

    ${vehicle.sold
      ? '<p><strong>Este veículo está marcado como vendido.</strong></p>'
      : `<a class="btn-gold" href="https://wa.me/${phone}?text=${message}" target="_blank" rel="noopener noreferrer">Consultar pelo WhatsApp ↗</a>`
    }
  `;

  $("detailsModal").classList.remove("hidden");
}

// =====================================
// PÁGINA INDIVIDUAL DO VEÍCULO
// =====================================

let hiddenMainSections = [];

function getVehicleImages(vehicle) {
  return [
    ...new Set(
      [
        vehicle.image || placeholderImage,
        ...(Array.isArray(vehicle.images) ? vehicle.images : [])
      ].filter(Boolean)
    )
  ];
}

function openVehiclePage(id, updateHistory = true) {
  const vehicle = getVehicle(id);

  if (!vehicle) {
    alert("Veículo não encontrado.");
    return;
  }

  const page = $("vehiclePage");
  const main = document.querySelector("main");

  if (!page || !main) return;

  if (page.classList.contains("hidden")) {
    hiddenMainSections = [];

    Array.from(main.children).forEach(section => {
      if (section !== page && !section.classList.contains("hidden")) {
        section.classList.add("hidden");
        hiddenMainSections.push(section);
      }
    });
  }

  // GALERIA DE IMAGENS

  const images = getVehicleImages(vehicle);

  $("detailMainImage").src = images[0];
  $("detailMainImage").alt = `${vehicle.brand} ${vehicle.model}`;

  $("detailThumbnails").innerHTML = images.map((image, index) => `
    <button
      class="vehicle-thumbnail ${index === 0 ? "active" : ""}"
      type="button"
      data-gallery-image="${index}"
      aria-label="Ver imagem ${index + 1}"
    >
      <img src="${escapeHTML(image)}" alt="">
    </button>
  `).join("");

  // INFORMAÇÕES PRINCIPAIS

  $("detailBrand").textContent =
    `${vehicle.brand} · ${vehicle.year}`;

  $("detailTitle").textContent =
    `${vehicle.brand} ${vehicle.model}`;

  $("detailPrice").textContent =
    formatPrice(vehicle.price);

  $("detailMeta").innerHTML = `
    <span>${Number(vehicle.km).toLocaleString("pt-BR")} km</span>
    <span>${escapeHTML(vehicle.transmission)}</span>
    <span>${escapeHTML(vehicle.fuel)}</span>
    <span>${vehicle.sold ? "VENDIDO" : "DISPONÍVEL"}</span>
  `;

  $("detailDescription").textContent =
    vehicle.description || "Entre em contato para mais informações.";

  // BOTÃO WHATSAPP

  const phone = storeConfig.whatsapp;

  const message = encodeURIComponent(
    `Olá! Tenho interesse no ${vehicle.brand} ${vehicle.model} ${vehicle.year}.`
  );

  $("detailActions").innerHTML = vehicle.sold
    ? "<strong>Este veículo está marcado como vendido.</strong>"
    : `
      <a
        class="btn-gold"
        href="https://wa.me/${escapeHTML(phone)}?text=${message}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Consultar pelo WhatsApp ↗
      </a>
    `;

  // FICHA TÉCNICA

  const specifications = [
    ["Marca", vehicle.brand],
    ["Modelo", vehicle.model],
    ["Ano", vehicle.year],
    ["Quilometragem", `${Number(vehicle.km).toLocaleString("pt-BR")} km`],
    ["Câmbio", vehicle.transmission],
    ["Combustível", vehicle.fuel],
    ["Preço", formatPrice(vehicle.price)]
  ];

  $("detailSpecifications").innerHTML = specifications.map(([label, value]) => `
    <div class="specification-item">
      <span>${escapeHTML(label)}</span>
      <strong>${escapeHTML(value)}</strong>
    </div>
  `).join("");

  // MOSTRA A PÁGINA

  page.classList.remove("hidden");

  // URL COMPARTILHÁVEL

  if (updateHistory) {
    const url = new URL(window.location.href);
    url.searchParams.set("veiculo", vehicle.id);

    history.pushState({}, "", url);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeVehiclePage(updateHistory = true) {
  $("vehiclePage").classList.add("hidden");

  hiddenMainSections.forEach(section => {
    section.classList.remove("hidden");
  });

  hiddenMainSections = [];

  if (updateHistory) {
    const url = new URL(window.location.href);
    url.searchParams.delete("veiculo");

    history.pushState({}, "", url);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// MINIATURAS DA GALERIA

$("detailThumbnails").addEventListener("click", event => {
  const button = event.target.closest("[data-gallery-image]");
  if (!button) return;

  const vehicleId = new URLSearchParams(window.location.search)
    .get("veiculo");

  const vehicle = getVehicle(vehicleId);
  if (!vehicle) return;

  const images = getVehicleImages(vehicle);

  const index = Number(button.dataset.galleryImage);

  if (!images[index]) return;

  $("detailMainImage").src = images[index];

  document.querySelectorAll(".vehicle-thumbnail").forEach(item => {
    item.classList.remove("active");
  });

  button.classList.add("active");
});

// BOTÃO VOLTAR AO ESTOQUE

$("backToInventory").addEventListener("click", () => {
  closeVehiclePage();
});

// HISTÓRICO DO NAVEGADOR

window.addEventListener("popstate", () => {
  const vehicleId = new URLSearchParams(window.location.search)
    .get("veiculo");

  if (vehicleId) {
    openVehiclePage(vehicleId, false);
  } else if (!$("vehiclePage").classList.contains("hidden")) {
    closeVehiclePage(false);
  }
});

// =====================================
// PAINEL ADMINISTRATIVO
// =====================================

function openAdmin() {
  if (sessionStorage.getItem("nex_demo_session") === "active") {
    showAdmin();
  } else {
    $("loginScreen").classList.remove("hidden");
  }
}

function showAdmin() {
  $("loginScreen").classList.add("hidden");
  $("adminScreen").classList.remove("hidden");

  document.body.style.overflow = "hidden";

  $("storeName").value = storeConfig.storeName;
  $("storeWhatsapp").value = storeConfig.whatsapp;

  renderAdmin();
}

function closeAdmin() {
  $("adminScreen").classList.add("hidden");
  document.body.style.overflow = "";

  resetForm();
}

function renderAdmin() {
  const available = vehicles.filter(v => !v.sold).length;
  const sold = vehicles.filter(v => v.sold).length;

  $("totalStat").textContent = vehicles.length;
  $("availableStat").textContent = available;
  $("soldStat").textContent = sold;

  $("adminListCount").textContent =
    `${vehicles.length} anúncios`;

  $("adminVehicleList").innerHTML = vehicles.map(vehicle => `
    <div class="admin-vehicle">
      <img
        src="${escapeHTML(vehicle.image || placeholderImage)}"
        alt="${escapeHTML(vehicle.model)}"
      >

      <div>
        <h4>${escapeHTML(vehicle.brand)} ${escapeHTML(vehicle.model)}</h4>
        <p>${formatPrice(vehicle.price)} · ${vehicle.sold ? "Vendido" : "Disponível"}</p>
      </div>

      <div class="admin-actions">
        <button data-edit="${escapeHTML(vehicle.id)}">Editar</button>

        <button data-toggle="${escapeHTML(vehicle.id)}">
          ${vehicle.sold ? "Reativar" : "Vendido"}
        </button>

        <button class="delete-btn" data-delete="${escapeHTML(vehicle.id)}">
          Excluir
        </button>
      </div>
    </div>
  `).join("");

  renderBrandFilter();
}

// =====================================
// CADASTRO E EDIÇÃO
// =====================================

function resetForm() {
  $("vehicleForm").reset();

  $("vehicleId").value = "";
  $("formTitle").textContent = "Cadastrar veículo";
  $("saveVehicle").textContent = "Salvar veículo";

  $("cancelEdit").classList.add("hidden");

  selectedImages = [];

  $("vehicleImage").value = "";

  renderImagePreview();
}

function editVehicle(id) {
  const vehicle = getVehicle(id);
  if (!vehicle) return;

  $("vehicleId").value = vehicle.id;
  $("vehicleBrand").value = vehicle.brand;
  $("vehicleModel").value = vehicle.model;
  $("vehicleYear").value = vehicle.year;
  $("vehicleKm").value = vehicle.km;
  $("vehicleTransmission").value = vehicle.transmission;
  $("vehicleFuel").value = vehicle.fuel;
  $("vehiclePrice").value = vehicle.price;
  $("vehicleDescription").value = vehicle.description || "";
  $("vehicleSold").checked = vehicle.sold;

  // Carrega as fotos já existentes
  selectedImages = getVehicleImages(vehicle);

  // Mostra as fotos e permite escolher outra capa
  renderImagePreview();

  $("formTitle").textContent = "Editar veículo";
  $("saveVehicle").textContent = "Atualizar veículo";

  $("cancelEdit").classList.remove("hidden");

  $("vehicleForm").scrollIntoView({ behavior: "smooth" });
}

// =====================================
// UPLOAD DE VÁRIAS IMAGENS
// COMPRESSÃO AUTOMÁTICA
// =====================================

async function compressImage(file) {
  const bitmap = await createImageBitmap(file);

  const maxWidth = 1200;
  const maxHeight = 900;

  const scale = Math.min(
    1,
    maxWidth / bitmap.width,
    maxHeight / bitmap.height
  );

  const canvas = document.createElement("canvas");

  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");

  context.drawImage(
    bitmap,
    0,
    0,
    canvas.width,
    canvas.height
  );

  bitmap.close();

  const blob = await new Promise(resolve => {
    canvas.toBlob(resolve, "image/jpeg", 0.68);
  });

  if (!blob) {
    throw new Error("Não foi possível comprimir a imagem.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(blob);
  });
}

// SELEÇÃO DE IMAGENS

$("vehicleImage").addEventListener("change", async event => {
  const files = Array.from(event.target.files);

  if (!files.length) return;

  if (files.length > 5) {
    alert("Selecione no máximo 5 fotos por veículo.");
    event.target.value = "";
    return;
  }

  const invalidFile = files.find(file =>
    !file.type.startsWith("image/")
  );

  if (invalidFile) {
    alert("Todos os arquivos precisam ser imagens.");
    event.target.value = "";
    return;
  }

  try {
    $("imagePreview").textContent = "Comprimindo imagens...";

    const compressedImages = await Promise.all(
      files.map(file => compressImage(file))
    );

    // As novas imagens substituem as anteriores
    selectedImages = compressedImages;

    // Mostra as fotos com a opção de escolher a capa
    renderImagePreview();

  } catch (error) {
    console.error("Erro ao processar imagens:", error);

    alert("Não foi possível processar uma das imagens.");

    selectedImages = [];

    renderImagePreview();

  } finally {
    event.target.value = "";
  }
});

// =====================================
// SALVAR VEÍCULO
// =====================================

$("vehicleForm").addEventListener("submit", event => {
  event.preventDefault();

  const id = $("vehicleId").value;

  const vehicle = {
    id: id || `car-${Date.now()}`,
    brand: $("vehicleBrand").value.trim(),
    model: $("vehicleModel").value.trim(),
    year: Number($("vehicleYear").value),
    km: Number($("vehicleKm").value),
    transmission: $("vehicleTransmission").value,
    fuel: $("vehicleFuel").value,
    price: Number($("vehiclePrice").value),
    description: $("vehicleDescription").value.trim(),

    // A primeira imagem será sempre a capa
    image: selectedImages[0] || placeholderImage,

    // Todas as imagens ficam disponíveis na galeria
    images: selectedImages.length
      ? [...selectedImages]
      : [placeholderImage],

    sold: $("vehicleSold").checked
  };

  if (
    !vehicle.brand ||
    !vehicle.model ||
    vehicle.price <= 0 ||
    vehicle.year < 1900 ||
    vehicle.km < 0
  ) {
    alert("Confira os dados preenchidos.");
    return;
  }

  const oldVehicles = [...vehicles];

  if (id) {
    vehicles = vehicles.map(v =>
      v.id === id ? vehicle : v
    );
  } else {
    vehicles.unshift(vehicle);
  }

  if (!saveVehicles()) {
    vehicles = oldVehicles;
    return;
  }

  resetForm();
  renderAdmin();
  renderVehicles();

  alert(id ? "Veículo atualizado!" : "Veículo cadastrado com sucesso!");
});

// =====================================
// AÇÕES DO ESTOQUE
// =====================================

function toggleSold(id) {
  const vehicle = getVehicle(id);
  if (!vehicle) return;

  const previousStatus = vehicle.sold;

  vehicle.sold = !vehicle.sold;

  if (saveVehicles()) {
    renderAdmin();
    renderVehicles();
  } else {
    vehicle.sold = previousStatus;
  }
}

function deleteVehicle(id) {
  const vehicle = getVehicle(id);
  if (!vehicle) return;

  const confirmed = confirm(
    `Deseja realmente excluir ${vehicle.brand} ${vehicle.model}?`
  );

  if (!confirmed) return;

  const oldVehicles = [...vehicles];

  vehicles = vehicles.filter(v => v.id !== id);

  if (!saveVehicles()) {
    vehicles = oldVehicles;
    return;
  }

  renderAdmin();
  renderVehicles();
}

// =====================================
// EVENTOS
// =====================================

// CLIQUE NOS VEÍCULOS DO CATÁLOGO

$("vehicleGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-details]");

  if (button) {
    openVehiclePage(button.dataset.details);
  }
});

// AÇÕES DO PAINEL ADMINISTRATIVO

$("adminVehicleList").addEventListener("click", event => {
  const edit = event.target.closest("[data-edit]");
  const toggle = event.target.closest("[data-toggle]");
  const remove = event.target.closest("[data-delete]");

  if (edit) editVehicle(edit.dataset.edit);
  if (toggle) toggleSold(toggle.dataset.toggle);
  if (remove) deleteVehicle(remove.dataset.delete);
});

// FILTROS

$("searchInput").addEventListener("input", renderVehicles);
$("brandFilter").addEventListener("change", renderVehicles);
$("priceFilter").addEventListener("change", renderVehicles);
$("yearFilter").addEventListener("change", renderVehicles);

// ADMIN

$("adminOpen").addEventListener("click", openAdmin);
$("adminClose").addEventListener("click", closeAdmin);
$("cancelEdit").addEventListener("click", resetForm);

// FECHAMENTO DE ELEMENTOS

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => {
    $(button.dataset.close).classList.add("hidden");
  });
});

$("detailsModal").addEventListener("click", event => {
  if (event.target === $("detailsModal")) {
    $("detailsModal").classList.add("hidden");
  }
});

// MENU MOBILE

$("menuToggle").addEventListener("click", () => {
  document.querySelector(".nav").classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector(".nav").classList.remove("open");
  });
});

// =====================================
// INICIALIZAÇÃO
// =====================================

renderBrandFilter();
renderVehicles();

// ABRE VEÍCULO PELO LINK COMPARTILHADO

const vehicleFromUrl = new URLSearchParams(window.location.search)
  .get("veiculo");

if (vehicleFromUrl) {
  openVehiclePage(vehicleFromUrl, false);
}

// =====================================
// LOGIN DEMONSTRATIVO
// =====================================

$("loginForm").addEventListener("submit", event => {
  event.preventDefault();

  const email = $("loginEmail").value.trim();
  const password = $("loginPassword").value;

  // CREDENCIAIS DE TESTE — NÃO USAR EM PRODUÇÃO

  if (
    email === "admin@nexautomotive.demo" &&
    password === "nex2026"
  ) {
    sessionStorage.setItem("nex_demo_session", "active");

    $("loginError").classList.add("hidden");
    $("loginForm").reset();

    showAdmin();

  } else {
    $("loginError").classList.remove("hidden");
  }
});

$("loginBack").addEventListener("click", () => {
  $("loginScreen").classList.add("hidden");
});

$("adminLogout").addEventListener("click", () => {
  sessionStorage.removeItem("nex_demo_session");

  $("adminScreen").classList.add("hidden");
  $("loginScreen").classList.add("hidden");

  document.body.style.overflow = "";

  resetForm();
});

// =====================================
// CONFIGURAÇÕES DA LOJA
// =====================================

$("settingsForm").addEventListener("submit", event => {
  event.preventDefault();

  const newConfig = {
    storeName: $("storeName").value.trim(),
    whatsapp: $("storeWhatsapp").value.replace(/\D/g, "")
  };

  if (!newConfig.storeName || newConfig.whatsapp.length < 12) {
    alert("Confira o nome da loja e o número do WhatsApp.");
    return;
  }

  const previousConfig = storeConfig;

  storeConfig = newConfig;

  if (!saveConfig()) {
    storeConfig = previousConfig;
    return;
  }

  alert("Configurações salvas!");
});
