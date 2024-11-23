(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0: { items: 2 },
            576: { items: 3 },
            768: { items: 4 },
            992: { items: 5 },
            1200: { items: 6 }
        }
    });

    // Related carousel
    $('.related-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0: { items: 1 },
            576: { items: 2 },
            768: { items: 3 },
            992: { items: 4 }
        }
    });

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach((button) => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            const productCard = event.target.closest('.product-item');
            const productName = productCard.querySelector('h6').textContent;
            const priceElement = productCard.querySelector('.d-flex h6');
            let productPrice = priceElement.textContent.trim();

            // Remove 'Kshs' or commas in the price
            productPrice = productPrice.replace(/[Kk]shs[\. ]*/g, '').replace(/,/g, '').trim();

            const productImgSrc = productCard.querySelector('img').src;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Check if the product is already in the cart
            let existingProduct = cart.find(item => item.name === productName);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                const product = {
                    name: productName,
                    price: parseFloat(productPrice),
                    image: productImgSrc,
                    quantity: 1
                };
                cart.push(product);
            }

            // Save updated cart
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        });
    });

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        document.getElementById('cart-count').textContent = totalItems;
    }

    // Update cart count on page load
    updateCartCount();

    // Cart page functionality
    function loadCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartBody = document.getElementById('cart-body');
        const cartSubtotal = document.getElementById('cart-subtotal');
        cartBody.innerHTML = '';
        let subtotal = 0;

        cart.forEach((item, index) => {
            const total = item.price * item.quantity;
            subtotal += total;

            const row = document.createElement('tr');
            row.id = `cart-item-${index}`;
            row.innerHTML = `
                <td style="width: 100px;"><img src="${item.image}" alt="${item.name}" style="width: 100%;"/></td>
                <td style="width: 80%;">
                    <span class="font-weight-bold cart-header" >${item.name}</span><br>
                    <span id="total-${index}">Kshs. ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span><br>
                    <button class="btn border btn-sm" onclick="decrementQuantity(${index})">-</button>
                        <span id="quantity-${index}">${item.quantity}</span>
                    <button class="btn border btn-sm" onclick="incrementQuantity(${index})">+</button>
                </td>
                <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})" style="border-radius: 10px;"><i class="fa fa-trash"></i></button></td>
            `;
            cartBody.appendChild(row);
        });

        cartSubtotal.textContent = `Kshs. ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    }

    function updateSubtotal() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let subtotal = 0;

        cart.forEach((item) => {
            subtotal += item.price * item.quantity;
        });

        document.getElementById('cart-subtotal').textContent = `Kshs. ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    }

    window.incrementQuantity = function(index) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateItemRow(index);
    }

    window.decrementQuantity = function(index) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cart));

            updateItemRow(index);
        }
    }

    window.removeItem = function(index) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }

    function updateItemRow(index) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart[index];
        const total = item.price * item.quantity;

        document.getElementById(`quantity-${index}`).textContent = item.quantity;
        document.getElementById(`total-${index}`).textContent = `Kshs. ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

        updateSubtotal();
    }

    window.onload = function () {
        const cartBody = document.getElementById('cart-body');
        if (cartBody) {
            loadCart();
        }
    };

})(jQuery);
