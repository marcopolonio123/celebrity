const products = [
  { name: "Colar Vida G", description: "Criado por Lydia Sayeg exclusivamente para Hebe Camargo, este símbolo de amizade e força é confeccionado artesanalmente em Prata 925 e possui aproximadamente 47 cm.", images: ["https://dcdn-us.mitiendanube.com/stores/001/843/834/products/img_82301-5f708b5065b1fb9f7c16327677740793-1024-1024.webp"] },
  { name: "Colar Futuro", description: "Com a caligrafia de Lydia Sayeg, a palavra Futuro é confeccionada à mão em Prata 925. A peça possui aproximadamente 45 cm e celebra aquilo que ainda podemos construir.", images: ["https://dcdn-us.mitiendanube.com/stores/001/843/834/products/img_97971-ad1ab2bc937645af2616327667039530-1024-1024.webp", "assets/products/colar-futuro-madeira.webp"] },
  { name: "Colar Venci P", description: "Uma palavra para carregar perto do coração. Feito artesanalmente em Prata 925, representa luta, liberdade e superação, com aproximadamente 45 cm.", images: ["https://dcdn-us.mitiendanube.com/stores/001/843/834/products/img_8234-0faefa3f96e75f0fa616327678746619-1024-1024.webp"] },
  { name: "Colar Hope", description: "A palavra Hope em uma joia de presença delicada, apresentada em diferentes detalhes para facilitar sua escolha.", images: ["assets/products/colar-hope-modelo.webp", "assets/products/colar-hope-tecido.webp"] },
  { name: "Amor Amor", description: "Uma composição que celebra o afeto, fotografada sobre tecido de seda para destacar o acabamento das peças.", images: ["assets/products/amor-amor-seda.webp"] },
  { name: "Proteção", description: "Uma palavra de significado forte transformada em joia para acompanhar histórias e momentos especiais.", images: ["assets/products/protecao.webp"] },
  { name: "Pulseira Hope", description: "A palavra Hope em uma pulseira delicada, fotografada sob luz natural para evidenciar seus detalhes.", images: ["assets/products/pulseira-hope-sol.webp"] },
  { name: "Pulseira Preta", description: "Pulseira preta com detalhes prateados e visual contemporâneo. Consulte os canais oficiais para conhecer as opções.", images: ["assets/products/pulseira-preta.webp"] },
  { name: "Colar Respeito", description: "A palavra Respeito em uma peça de traço marcante, apresentada sob luz natural para destacar o acabamento.", images: ["assets/products/colar-respeito-pedra.webp"] }
];

const menu = document.querySelector("#menu");
const hamb = document.querySelector(".hamb");
let menuOpen = false;
let lastFocused = null;

function closeMenu(returnFocus = false) {
  menu.classList.remove("open");
  hamb.setAttribute("aria-expanded", "false");
  hamb.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("menu-open");
  menuOpen = false;
  if (returnFocus) hamb.focus();
}

function openMenu() {
  menu.classList.add("open");
  hamb.setAttribute("aria-expanded", "true");
  hamb.setAttribute("aria-label", "Fechar menu");
  document.body.classList.add("menu-open");
  menuOpen = true;
  menu.querySelector("a").focus();
}

hamb.addEventListener("click", () => menuOpen ? closeMenu() : openMenu());
menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => closeMenu()));

document.querySelectorAll(".faq button").forEach(button => button.addEventListener("click", () => {
  const item = button.parentElement;
  const wasOpen = item.classList.contains("open");
  document.querySelectorAll(".faq").forEach(faq => {
    faq.classList.remove("open");
    faq.querySelector("button").setAttribute("aria-expanded", "false");
    faq.querySelector("span").textContent = "+";
  });
  if (!wasOpen) {
    item.classList.add("open");
    button.setAttribute("aria-expanded", "true");
    button.querySelector("span").textContent = "−";
  }
}));

const backdrop = document.querySelector("#product-modal");
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalImage = document.querySelector("#modal-image");
const modalThumbnails = document.querySelector(".modal-thumbnails");

function handleImageError(image) {
  image.parentElement.classList.add("image-failed");
  image.hidden = true;
}

function setImage(image, source, alt) {
  image.hidden = false;
  image.parentElement.classList.remove("image-failed");
  image.src = source;
  image.alt = alt;
  image.addEventListener("error", () => handleImageError(image), { once: true });
}

function createThumbnail(product, imageIndex, selectedIndex, onSelect) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "thumbnail" + (imageIndex === selectedIndex ? " active" : "");
  button.setAttribute("aria-label", `Ver foto ${imageIndex + 1} de ${product.name}`);
  button.setAttribute("aria-pressed", String(imageIndex === selectedIndex));
  const image = document.createElement("img");
  image.src = product.images[imageIndex];
  image.alt = "";
  image.loading = "lazy";
  image.addEventListener("error", () => handleImageError(image), { once: true });
  button.appendChild(image);
  button.addEventListener("click", () => onSelect(imageIndex));
  return button;
}

document.querySelectorAll(".product").forEach(card => {
  const productIndex = Number(card.dataset.product);
  const product = products[productIndex];
  const strip = card.querySelector(".product-thumbnails");
  if (!strip) return;
  const mainImage = card.querySelector(".visual img");
  const select = imageIndex => {
    setImage(mainImage, product.images[imageIndex], `${product.name}, foto ${imageIndex + 1}`);
    card.dataset.selectedImage = String(imageIndex);
    strip.querySelectorAll(".thumbnail").forEach((thumbnail, index) => {
      thumbnail.classList.toggle("active", index === imageIndex);
      thumbnail.setAttribute("aria-pressed", String(index === imageIndex));
    });
  };
  product.images.forEach((_, imageIndex) => strip.appendChild(createThumbnail(product, imageIndex, 0, select)));
});

function openProduct(index, selectedImage = 0) {
  const product = products[index];
  lastFocused = document.activeElement;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
  const select = imageIndex => {
    setImage(modalImage, product.images[imageIndex], `${product.name}, foto ${imageIndex + 1}`);
    modalThumbnails.querySelectorAll(".thumbnail").forEach((thumbnail, thumbnailIndex) => {
      thumbnail.classList.toggle("active", thumbnailIndex === imageIndex);
      thumbnail.setAttribute("aria-pressed", String(thumbnailIndex === imageIndex));
    });
  };
  modalThumbnails.replaceChildren();
  product.images.forEach((_, imageIndex) => modalThumbnails.appendChild(createThumbnail(product, imageIndex, selectedImage, select)));
  modalThumbnails.hidden = product.images.length < 2;
  select(selectedImage);
  backdrop.hidden = false;
  document.body.classList.add("modal-open");
  document.querySelector(".close-modal").focus();
}

function closeProduct() {
  if (backdrop.hidden) return;
  backdrop.hidden = true;
  document.body.classList.remove("modal-open");
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll(".product .info button").forEach(button => button.addEventListener("click", () => {
  const card = button.closest(".product");
  openProduct(Number(card.dataset.product), Number(card.dataset.selectedImage || 0));
}));
document.querySelectorAll(".details-btn").forEach(button => button.addEventListener("click", () => openProduct(Number(button.dataset.product))));
document.querySelector(".close-modal").addEventListener("click", closeProduct);
backdrop.addEventListener("click", event => { if (event.target === backdrop) closeProduct(); });
backdrop.querySelector("a").addEventListener("click", closeProduct);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (!backdrop.hidden) closeProduct();
    else if (menuOpen) closeMenu(true);
  }
  if (event.key === "Tab" && !backdrop.hidden) {
    const focusable = [...modal.querySelectorAll("button,a[href]")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  if (event.key === "Tab" && menuOpen) {
    const links = [...menu.querySelectorAll("a")];
    const firstLink = links[0];
    const lastLink = links[links.length - 1];
    if (event.shiftKey && document.activeElement === firstLink) { event.preventDefault(); hamb.focus(); }
    else if (event.shiftKey && document.activeElement === hamb) { event.preventDefault(); lastLink.focus(); }
    else if (!event.shiftKey && document.activeElement === lastLink) { event.preventDefault(); hamb.focus(); }
    else if (!event.shiftKey && document.activeElement === hamb) { event.preventDefault(); firstLink.focus(); }
  }
});

document.querySelectorAll("img").forEach(image => image.addEventListener("error", () => handleImageError(image), { once: true }));

document.querySelector("#contact-form").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent("Celebrity — " + data.get("assunto"));
  const body = encodeURIComponent("Nome: " + data.get("nome") + "\nE-mail: " + data.get("email") + "\n\n" + data.get("mensagem"));
  event.currentTarget.querySelector(".form-status").textContent = "Abrindo seu programa de e-mail para concluir o envio.";
  location.href = "mailto:contato@celebrity.com.br?subject=" + subject + "&body=" + body;
});
