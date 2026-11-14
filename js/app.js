/* ============================================
   DUMMY STORE — cart & product logic
   ============================================ */

// ----- Product data (fake catalog) -----
const products = [
    { id: 1, name: "Wireless Headphones", price: 79.99, emoji: "🎧", desc: "Noise-cancelling, 30h battery" },
    { id: 2, name: "Mechanical Keyboard", price: 129.5, emoji: "⌨️", desc: "Hot-swappable, RGB backlight" },
    { id: 3, name: "Smart Watch", price: 199.0, emoji: "⌚", desc: "Heart rate + GPS tracking" },
    { id: 4, name: "Portable Speaker", price: 59.99, emoji: "🔊", desc: "Waterproof, 12h playtime" },
    { id: 5, name: "Gaming Mouse", price: 49.95, emoji: "🖱️", desc: "16000 DPI, lightweight" },
    { id: 6, name: "USB-C Hub", price: 34.99, emoji: "🔌", desc: "7-in-1 multiport adapter" },
    { id: 7, name: "Desk Lamp", price: 42.0, emoji: "💡", desc: "LED, touch dimming" },
    { id: 8, name: "Backpack", price: 89.0, emoji: "🎒", desc: "Laptop compartment, water-resistant" },
];

// ----- Cart state -----
let cart = [];

// ----- DOM references -----
const productGrid = document.getElementById("productGrid");
const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// ----- Render products -----
function renderProducts() {
    productGrid.innerHTML = products
        .map(
            (p) => `
        <div class="product-card">
            <div class="product-img">${p.emoji}</div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <div class="product-price">$${p.price.toFixed(2)}</div>
                <button class="add-btn" data-id="${p.id}">Add to cart</button>
            </div>
        </div>
    `
        )
        .join("");

    // Attach add-to-cart listeners
    document.querySelectorAll(".add-btn").forEach((btn) => {
        btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
    });
}

// ----- Add item to cart -----
function addToCart(id) {
    const product = products.find((p) => p.id === id);
    const existing = cart.find((item) => item.id === id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    openCart();
}

// ----- Remove item from cart -----
function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    updateCartUI();
}

// ----- Update cart UI -----
function updateCartUI() {
    // Count badge
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalQty;

    // Cart items list
    if (cart.length === 0) {
        cartItemsEl.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
        cartTotalEl.textContent = "$0.00";
        return;
    }

    cartItemsEl.innerHTML = cart
        .map(
            (item) => `
        <div class="cart-item">
            <div class="cart-item-emoji">${item.emoji}</div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.qty} × $${item.price.toFixed(2)}</p>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `
        )
        .join("");

    // Attach remove listeners
    cartItemsEl.querySelectorAll(".cart-item-remove").forEach((btn) => {
        btn.addEventListener("click", () =>
            removeFromCart(Number(btn.dataset.id))
        );
    });

    // Total
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

// ----- Cart drawer open/close -----
function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("active");
}

function closeCartDrawer() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("active");
}

// ----- Checkout (fake) -----
function fakeCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty — add something first!");
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    alert(
        `✅ Order placed (pretend)!\n\nItems: ${cart.reduce(
            (s, i) => s + i.qty,
            0
        )}\nTotal: $${total.toFixed(2)}\n\nThanks for trying the dummy store!`
    );
    cart = [];
    updateCartUI();
    closeCartDrawer();
}

// ----- Event listeners -----
cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);
cartOverlay.addEventListener("click", closeCartDrawer);
checkoutBtn.addEventListener("click", fakeCheckout);

// Close drawer with Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCartDrawer();
});

// ----- Init -----
renderProducts();
updateCartUI();