const products = [
  {
    id: "nuka-mist",
    name: "NUKA Modern Me Hair & Body Perfume Mist",
    category: "Hair & Body",
    price: 90,
    image: "images/nuka-mist.jpg",
    description: "A refreshing hair and body perfume mist for everyday fragrance."
  },
  {
    id: "nuka-lotion",
    name: "NUKA Luxury Lotion",
    category: "Body Care",
    price: 350,
    image: "images/nuka-luxury-lotion.jpg",
    description: "A luxurious body lotion for a smooth, beautifully scented routine."
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
    total += p.price * item.qty;
    return `• ${p.name} × ${item.qty} — ${money(p.price * item.qty)}`;
  });

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
