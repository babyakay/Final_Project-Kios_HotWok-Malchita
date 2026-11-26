const cartContainer = document.getElementById("cart-items");
const totalElement = document.getElementById("total-price");
const orderForm = document.getElementById("order-form");
const orderMessage = document.getElementById("order-message");

function readCart() {
    return JSON.parse(localStorage.getItem("hotWokCart")) || [];
}

function writeCart(cart) {
    localStorage.setItem("hotWokCart", JSON.stringify(cart));
}

function rupiah(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(value);
}

function renderCart() {
    const cart = readCart();
    let total = 0;

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart"><h3 class="h5">Keranjang masih kosong</h3><p class="text-secondary mb-3">Silakan pilih menu terlebih dahulu.</p><a href="menu.html" class="btn btn-dark">Lihat Menu</a></div>';
    }

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("div");
        details.className = "flex-grow-1";

        const title = document.createElement("h3");
        title.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = rupiah(item.price) + " per item";

        const controls = document.createElement("div");
        controls.className = "cart-item-controls";

        const decrease = document.createElement("button");
        decrease.type = "button";
        decrease.className = "quantity-button";
        decrease.dataset.action = "decrease";
        decrease.dataset.id = item.id;
        decrease.textContent = "−";
        decrease.setAttribute("aria-label", "Kurangi jumlah " + item.name);

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const increase = document.createElement("button");
        increase.type = "button";
        increase.className = "quantity-button";
        increase.dataset.action = "increase";
        increase.dataset.id = item.id;
        increase.textContent = "+";
        increase.setAttribute("aria-label", "Tambah jumlah " + item.name);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-button d-block";
        remove.dataset.action = "remove";
        remove.dataset.id = item.id;
        remove.textContent = "Hapus";

        controls.append(decrease, quantity, increase);
        details.append(title, price, controls, remove);

        const subtotalElement = document.createElement("div");
        subtotalElement.className = "cart-item-subtotal";
        subtotalElement.textContent = rupiah(subtotal);

        row.append(details, subtotalElement);
        cartContainer.appendChild(row);
    });

    totalElement.textContent = rupiah(total);

    if (typeof updateCartCount === "function") {
        updateCartCount();
    }
}

cartContainer.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const cart = readCart();
    const item = cart.find(product => product.id === button.dataset.id);

    if (!item) {
        return;
    }

    if (button.dataset.action === "increase") {
        item.quantity += 1;
    }

    if (button.dataset.action === "decrease") {
        item.quantity -= 1;

        if (item.quantity <= 0) {
            const index = cart.findIndex(product => product.id === item.id);
            cart.splice(index, 1);
        }
    }

    if (button.dataset.action === "remove") {
        const index = cart.findIndex(product => product.id === item.id);
        cart.splice(index, 1);
    }

    writeCart(cart);
    renderCart();
});

orderForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const cart = readCart();

    if (cart.length === 0) {
        orderMessage.textContent = "Keranjang masih kosong. Silakan pilih menu terlebih dahulu.";
        orderMessage.className = "small mt-3 text-danger";
        return;
    }

    const customerName = document.getElementById("customer-name").value.trim();
    const orderType = document.getElementById("order-type").value;
    const notes = document.getElementById("order-notes").value.trim();

    if (!customerName || !orderType) {
        orderMessage.textContent = "Lengkapi nama dan jenis pesanan terlebih dahulu.";
        orderMessage.className = "small mt-3 text-danger";
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let message = "Halo Kios Hot Wok, saya ingin memesan:%0A%0A";
    message += "Nama: " + customerName + "%0A";
    message += "Jenis pesanan: " + orderType + "%0A%0A";
    message += "Daftar pesanan:%0A";

    cart.forEach(item => {
        message += "- " + item.name + " x" + item.quantity + " = " + rupiah(item.price * item.quantity) + "%0A";
    });

    message += "%0ATotal: " + rupiah(total);

    if (notes) {
        message += "%0ACatatan: " + notes;
    }

    message += "%0A%0AMohon konfirmasi ketersediaan pesanan saya.";

    const phoneNumber = "6282347439209";

    if (phoneNumber.includes("x")) {
        orderMessage.textContent = "Fitur WhatsApp sudah disiapkan. Masukkan nomor WhatsApp Opa pada variabel phoneNumber di file js/cart.js sebelum digunakan.";
        orderMessage.className = "small mt-3 text-warning";
        return;
    }

    const whatsappUrl = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(decodeURIComponent(message));
    window.open(whatsappUrl, "_blank");
});

renderCart();
