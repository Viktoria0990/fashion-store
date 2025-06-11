// Shopping Cart functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.bindEvents();
        this.loadCartFromStorage();
    }

    bindEvents() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const name = e.target.dataset.name;
                const price = parseInt(e.target.dataset.price);
                this.addItem(id, name, price);
            });
        });

        // Product page add to cart
        const productAddBtn = document.getElementById('add-to-cart-product');
        if (productAddBtn) {
            productAddBtn.addEventListener('click', () => {
                this.addProductToCart();
            });
        }

        // Quantity controls
        const decreaseBtn = document.getElementById('decrease-qty');
        const increaseBtn = document.getElementById('increase-qty');
        const qtyInput = document.getElementById('quantity');

        if (decreaseBtn && increaseBtn && qtyInput) {
            decreaseBtn.addEventListener('click', () => {
                let qty = parseInt(qtyInput.value);
                if (qty > 1) {
                    qtyInput.value = qty - 1;
                }
            });

            increaseBtn.addEventListener('click', () => {
                let qty = parseInt(qtyInput.value);
                qtyInput.value = qty + 1;
            });
        }

        // Wishlist button
        const wishlistBtn = document.getElementById('add-to-wishlist');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                this.toggleWishlist(wishlistBtn);
            });
        }

        // Cart button click
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCartModal();
            });
        }
    }

    addItem(id, name, price, quantity = 1) {
        const existingItem = this.items.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: id,
                name: name,
                price: price,
                quantity: quantity
            });
        }

        this.saveToStorage();
        this.updateCartCount();
        this.showSuccessMessage(`${name} добавлен в корзину!`);
    }

    addProductToCart() {
        const selectedSize = document.querySelector('input[name="size"]:checked');
        const selectedColor = document.querySelector('input[name="color"]:checked');
        const quantity = parseInt(document.getElementById('quantity').value);

        if (!selectedSize) {
            this.showErrorMessage('Пожалуйста, выберите размер');
            return;
        }

        const productData = {
            id: '2',
            name: 'Вечернее платье',
            price: 5990,
            size: selectedSize.value,
            color: selectedColor.value,
            quantity: quantity
        };

        this.addItem(productData.id, `${productData.name} (${productData.size}, ${productData.color})`, productData.price, quantity);
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveToStorage();
        this.updateCartCount();
    }

    updateCartCount() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    }

    getTotalPrice() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartCount();
        }
    }

    showCartModal() {
        let cartHTML = `
            <div class="modal fade" id="cartModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Корзина покупок</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
        `;

        if (this.items.length === 0) {
            cartHTML += '<p class="text-center">Корзина пуста</p>';
        } else {
            cartHTML += '<div class="cart-items">';
            this.items.forEach(item => {
                cartHTML += `
                    <div class="cart-item d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                        <div>
                            <h6>${item.name}</h6>
                            <small class="text-muted">Количество: ${item.quantity}</small>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="me-3">${(item.price * item.quantity).toLocaleString()} ₽</span>
                            <button class="btn btn-sm btn-outline-danger" onclick="cart.removeItem('${item.id}'); this.closest('.modal').querySelector('.btn-close').click(); cart.showCartModal();">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            cartHTML += '</div>';
            cartHTML += `<div class="cart-total mt-3 pt-3 border-top">
                <h5>Итого: ${this.getTotalPrice().toLocaleString()} ₽</h5>
            </div>`;
        }

        cartHTML += `
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                            ${this.items.length > 0 ? '<button type="button" class="btn btn-primary">Оформить заказ</button>' : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('cartModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', cartHTML);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('cartModal'));
        modal.show();
    }

    toggleWishlist(button) {
        const icon = button.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            button.classList.remove('btn-outline-danger');
            button.classList.add('btn-danger');
            this.showSuccessMessage('Добавлено в избранное!');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            button.classList.remove('btn-danger');
            button.classList.add('btn-outline-danger');
            this.showSuccessMessage('Удалено из избранного!');
        }
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'danger');
    }

    showMessage(message, type) {
        const alertHTML = `
            <div class="alert alert-${type} alert-dismissible fade show position-fixed" 
                 style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', alertHTML);

        // Auto remove after 3 seconds
        setTimeout(() => {
            const alert = document.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 3000);
    }
}

// Product filtering and search
class ProductFilter {
    constructor() {
        this.products = [];
        this.init();
    }

    init() {
        this.loadProducts();
        this.bindSearchEvents();
    }

    loadProducts() {
        // Simulate loading products (in real app, this would be an API call)
        this.products = [
            { id: 1, name: 'Летнее платье', price: 2990, category: 'dress', image: 'img/dress1.jpg' },
            { id: 2, name: 'Вечернее платье', price: 5990, category: 'dress', image: 'img/dress2.jpg' },
            { id: 3, name: 'Повседневное платье', price: 3490, category: 'dress', image: 'img/dress3.jpg' },
            { id: 4, name: 'Деловое платье', price: 4290, category: 'dress', image: 'img/dress4.jpg' }
        ];
    }

    bindSearchEvents() {
        // Add search functionality if search input exists
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProducts(e.target.value);
            });
        }
    }

    filterProducts(searchTerm) {
        const filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderProducts(filteredProducts);
    }

    renderProducts(products) {
        const container = document.getElementById('products-container');
        if (!container) return;

        container.innerHTML = '';

        products.forEach(product => {
            const productHTML = `
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="card product-card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text text-muted">Описание товара</p>
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="h5 mb-0 text-primary">${product.price.toLocaleString()} ₽</span>
                                    <button class="btn btn-outline-primary btn-sm add-to-cart" 
                                            data-id="${product.id}" 
                                            data-name="${product.name}" 
                                            data-price="${product.price}">
                                        <i class="fas fa-cart-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', productHTML);
        });

        // Re-bind cart events for new products
        cart.bindEvents();
    }
}

// Smooth scrolling for anchor links
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Loading animation
function showLoading(element) {
    const originalText = element.innerHTML;
    element.innerHTML = '<span class="loading"></span>';
    element.disabled = true;

    setTimeout(() => {
        element.innerHTML = originalText;
        element.disabled = false;
    }, 1000);
}

// Form validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    });

    return isValid;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize shopping cart
    window.cart = new ShoppingCart();
    
    // Initialize product filter
    const productFilter = new ProductFilter();
    
    // Initialize smooth scrolling
    smoothScroll();
    
    // Add loading animation to buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('add-to-cart') && !this.id.includes('cart')) {
                showLoading(this);
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }
    });

    // Image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    console.log('Fashion Store initialized successfully!');
});

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
