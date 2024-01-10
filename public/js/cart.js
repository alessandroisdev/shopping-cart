import {CartClass} from './CartClass.js';

const cart = new CartClass('api');
const vitrine = document.getElementById('vitrine');
const templateProducts = document.getElementById('template-produto').content;
const liLimpar = document.querySelector('.clean-cart');
document.getElementById('clean-cart').addEventListener('click', ev => {
    cart.clean();
    btnLimpar();
});

cart.divTotal = document.getElementById('cart-price');
cart.divQuatity = document.getElementById('cart-quatity');
cart.searchProducts('produtos').then(() => {
    vitrine.innerHTML = null;
    cart.products.forEach(product => {
        const templateProduct = templateProducts.cloneNode(true);
        const cover = templateProduct.querySelector('.card-img-top');
        const id = `product-${product._id ?? product.id}`;
        cover.setAttribute('src', product.imagem);
        cover.setAttribute('alt', product.nome);
        templateProduct.querySelector('.card-title').innerHTML = product.nome;
        templateProduct.querySelector('.card-text').innerHTML = cart.truncateText(product.descricao, 100);
        templateProduct.querySelector('.card-price').innerHTML = cart.formatMoney(product.valor);

        const btnIncreaseQuantity = templateProduct.querySelector('.increase-quantity');
        btnIncreaseQuantity.setAttribute('data-id', product._id ?? product.id);
        btnIncreaseQuantity.setAttribute('data-increase', id);
        const btnDecreaseQuantity = templateProduct.querySelector('.decrease-quantity');
        btnDecreaseQuantity.setAttribute('data-id', product._id ?? product.id);
        btnDecreaseQuantity.setAttribute('data-decrease', id);
        const viewQuantity = templateProduct.querySelector('.view-quantity');
        viewQuantity.classList.add(id);
        const btnAddToCart = templateProduct.querySelector('.add-to-cart');

        viewQuantity.value = localStorage.getItem(id) ?? 0;
        disableButtonForEmptyQuantity(viewQuantity.value, btnAddToCart);

        btnIncreaseQuantity.addEventListener('click', ev => {
            viewQuantity.value++;
            disableButtonForEmptyQuantity(viewQuantity.value, btnAddToCart);
            localStorage.setItem(id, viewQuantity.value);
            let prod = cart.cart.find(product => product.id == ev.currentTarget.dataset.id);
            let prodIndex = cart.cart.findIndex(product => product.id == ev.currentTarget.dataset.id);
            if (prod && viewQuantity.value > 0) {
                cart.add(parseInt(viewQuantity.value), JSON.stringify(prod));
            } else {
                cart.cart.splice(prodIndex, 1);
                localStorage.removeItem(id);
            }
        });

        btnDecreaseQuantity.addEventListener('click', ev => {
            if (viewQuantity.value > 0) {
                viewQuantity.value--;
            }
            disableButtonForEmptyQuantity(viewQuantity.value, btnAddToCart);
            localStorage.setItem(id, viewQuantity.value);
            let prod = cart.cart.find(product => product.id == ev.currentTarget.dataset.id);
            let prodIndex = cart.cart.findIndex(product => product.id == ev.currentTarget.dataset.id);
            if (prod && viewQuantity.value > 0) {
                cart.add(parseInt(viewQuantity.value), JSON.stringify(prod));
            } else {
                cart.cart.splice(prodIndex, 1);
                localStorage.removeItem(id);
            }
        });

        btnAddToCart.setAttribute('data-product', JSON.stringify(product));
        btnAddToCart.addEventListener('click', ev => {
            cart.add(ev.currentTarget.getAttribute('data-quantity'), ev.currentTarget.getAttribute('data-product'));
            btnLimpar();
        });

        templateProduct.childNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                node.setAttribute('id', id);
            }
        });

        vitrine.appendChild(templateProduct);
    });

    cart.loadCart(btnLimpar);
});

function btnLimpar() {
    if (cart.cart.length) {
        liLimpar.classList.remove('d-none');
    } else {
        liLimpar.classList.add('d-none');
    }
}

function disableButtonForEmptyQuantity(quantity, btn) {
    btn.setAttribute('data-quantity', quantity);
    if (quantity >= 1) {
        btn.removeAttribute('disabled');
        return;
    }
    btn.setAttribute('disabled', 'disabled');
}