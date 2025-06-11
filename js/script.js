// Тестовый JavaScript
console.log('JavaScript загружен!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена!');
    
    // Простая корзина
    let cartCount = 0;
    
    // Находим все кнопки "Добавить в корзину"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            cartCount++;
            alert(`Товар добавлен в корзину! Всего товаров: ${cartCount}`);
            
            // Обновляем счетчик корзины
            const cartCountElement = document.getElementById('cart-count');
            if (cartCountElement) {
                cartCountElement.textContent = cartCount;
                cartCountElement.style.display = 'inline';
            }
        });
    });
    
    // Кнопка корзины
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            alert(`В корзине ${cartCount} товаров`);
        });
    }
});
