function getSavedCart() {
    return JSON.parse(localStorage.getItem("hotWokCart")) || [];
}

function updateCartCount() {
    const cart = getSavedCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = count;
    });
}

document.querySelectorAll(".current-year").forEach(element => {
    element.textContent = new Date().getFullYear();
});

updateCartCount();
