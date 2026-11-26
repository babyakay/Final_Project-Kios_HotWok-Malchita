const addButtons = document.querySelectorAll(".add-to-cart");
const cartMessage = document.getElementById("cart-message");

addButtons.forEach(button => {
    button.addEventListener("click", function() {
        const product = this.closest(".product-card");

        const item = {
            id: product.dataset.id,
            name: product.dataset.name,
            price: Number(product.dataset.price),
            quantity: 1
        };

        let cart = JSON.parse(localStorage.getItem("hotWokCart")) || [];
        const existingItem = cart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(item);
        }

        localStorage.setItem("hotWokCart", JSON.stringify(cart));

        if (cartMessage) {
            cartMessage.textContent = item.name + " berhasil ditambahkan ke keranjang.";
        }

        updateCartCount();
    });
});

const filterButtons = document.querySelectorAll(".filter-button");
const productItems = document.querySelectorAll(".product-item");

filterButtons.forEach(button => {
    button.addEventListener("click", function() {
        const selectedFilter = this.dataset.filter;

        filterButtons.forEach(filter => {
            filter.classList.remove("active", "btn-dark");
            filter.classList.add("btn-outline-dark");
        });

        this.classList.add("active", "btn-dark");
        this.classList.remove("btn-outline-dark");

        productItems.forEach(item => {
            const category = item.dataset.category;
            item.style.display = selectedFilter === "all" || category === selectedFilter ? "" : "none";
        });

        document.querySelectorAll(".menu-section").forEach(section => {
            const visibleProducts = section.querySelectorAll('.product-item:not([style*="display: none"])');
            section.style.display = visibleProducts.length > 0 ? "" : "none";
        });
    });
});
