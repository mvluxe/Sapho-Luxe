const products = [
  {
    id: "turmeric-soap",
    name: "Lasss Natural Turmeric Soap",
    category: "Body Care",
    price: 110,
    image: "images/turmeric-soap.jpg",
    description: "Natural turmeric soap for an everyday body-care routine. 140g."
  },
  {
    id: "brightening-serum",
    name: "Lasss Brightening Serum",
    category: "Skincare",
    price: 155,
    image: "images/brightening-serum.jpg",
    description: "Brightening serum for an everyday skincare routine. 30ml."
  },
  {
    id: "turmeric-honey-mask",
    name: "Lasss Turmeric & Honey Mask",
    category: "Face Care",
    price: 162,
    image: "images/turmeric-honey-mask.jpg",
    description: "Turmeric and honey face mask for your skincare routine."
  },
  {
    id: "roll-on",
    name: "Lasss Roll On Anti-Perspirant",
    category: "Personal Care",
    price: 97,
    image: "images/roll-on.jpg",
    description: "Roll-on anti-perspirant for everyday personal care. 50ml."
  },
  {
    id: "pomegranate-body-butter",
    name: "Lasss Pomegranate Body Butter",
    category: "Body Care",
    price: 130,
    image: "images/pomegranate-body-butter.jpg",
    description: "Pomegranate body butter for everyday body-care and moisturising. 150ml."
  },
  {
    id: "anti-blemish-face-cream",
    name: "Lasss Anti-Blemish Moisturising Face Cream",
    category: "Face Care",
    price: 96,
    image: "images/anti-blemish-face-cream.jpg",
    description: "Moisturising face cream for an everyday skincare routine."
  },
  {
    id: "tissue-oil",
    name: "Lasss Tissue Oil",
    category: "Body Care",
    price: 120,
    image: "images/tissue-oil.jpg",
    description: "Tissue oil for everyday body-care and moisturising. 150ml."
  },
  {
    id: "turmeric-face-scrub",
    name: "Lasss Turmeric Exfoliating Face Scrub",
    category: "Face Care",
    price: 162,
    image: "images/turmeric-face-scrub.jpg",
    description: "Turmeric exfoliating face scrub for an everyday skincare routine. 150ml."
  },
  {
    id: "lemon-face-wash",
    name: "Lasss Brightening Exfoliating Face Wash — Lemon",
    category: "Face Care",
    price: 130,
    image: "images/lemon-face-wash.jpg",
    description: "Lemon brightening exfoliating face wash for an everyday cleansing routine. 150ml."
  },
  {
    id: "turmeric-skin-detox-tea",
    name: "Lasss Turmeric Skin Detox Tea",
    category: "Wellness",
    price: 195,
    image: "images/turmeric-skin-detox-tea.jpg",
    description: "Turmeric & chai mix with rooibos extract. 20 tea bags."
  }
];

let cart = JSON.parse(localStorage.getItem("saphoLuxeCart") || "[]");

function money(n) {
  return "R" + Number(n).toLocaleString("en-ZA");
}

function saveCart() {
  localStorage.setItem("saphoLuxeCart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  openCart();
}

function changeQty(id, amount) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart();
}

function removeItem(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
}

function renderProducts() {
  const box = document.getElementById("products");
  box.innerHTML = products.map(p => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${p.image}" alt="${p.name}">
      </div>
      <div class="product-info">
        <div class="product-tag">${p.category}</div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-bottom">
          <span class="price">${money(p.price)}</span>
          <button class="add-btn" onclick="addToCart('${p.id}')">ADD TO CART</button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const itemsBox = document.getElementById("cartItems");
  const empty = document.getElementById("cartEmpty");
  const checkout = document.getElementById("checkout");
  const count = cart.reduce((sum, x) => sum + x.qty, 0);
  document.getElementById("cartCount").textContent = count;

  if (!cart.length) {
    itemsBox.innerHTML = "";
    empty.classList.remove("hidden");
    checkout.classList.add("hidden");
    return;
  }

  empty.classList.add("hidden");
  checkout.classList.remove("hidden");

  let total = 0;
  itemsBox.innerHTML = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    if (!p) return "";
    const line = p.price * item.qty;
    total += line;
    return `
      <div class="cart-line">
        <img src="${p.image}" alt="${p.name}">
        <div>
          <h3>${p.name}</h3>
          <p>${money(p.price)} each</p>
          <div class="qty">
            <button onclick="changeQty('${p.id}', -1)">−</button>
            <strong>${item.qty}</strong>
            <button onclick="changeQty('${p.id}', 1)">+</button>
          </div>
          <button class="remove" onclick="removeItem('${p.id}')">Remove</button>
        </div>
        <strong>${money(line)}</strong>
      </div>
    `;
  }).join("");

  document.getElementById("cartTotal").textContent = money(total);
}

function openCart() {
  document.getElementById("cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
  renderCart();
}

function closeCart(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

function sendWhatsApp() {
  if (!cart.length) return;

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const note = document.getElementById("customerNote").value.trim();

  if (!name || !phone || !address) {
    alert("Please enter your name, WhatsApp number and delivery address.");
    return;
  }

  let total = 0;
  const lines = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    if (!p) return "";
    total += p.price * item.qty;
    return `• ${p.name} × ${item.qty} — ${money(p.price * item.qty)}`;
  }).filter(Boolean);

  const message = [
    "Hello Sapho Luxe 👋🏽",
    "",
    "I'd like to place an order:",
    "",
    ...lines,
    "",
    `TOTAL: ${money(total)}`,
    "",
    `Name: ${name}`,
    `WhatsApp: ${phone}`,
    `Delivery address: ${address}`,
    note ? `Note: ${note}` : "",
    "",
    "Please confirm my order. Thank you! ✨"
  ].filter(Boolean).join("\n");

  window.open("https://wa.me/27630738143?text=" + encodeURIComponent(message), "_blank");
}

renderProducts();
renderCart();
