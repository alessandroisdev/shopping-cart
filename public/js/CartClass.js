import { HttpClient } from "./HttpClient.js";
export class CartClass {
    constructor(baseUrl) {
        this._httpClient = null;
        this._products = null;
        this._quatity = 0;
        this._divQuatity = null;
        this._total = 0;
        this._divTotal = null;
        this._cart = [];
        this.httpClient = baseUrl;
        if (localStorage.getItem('cart')) {
            let json = localStorage.getItem('cart');
            let array = JSON.parse(json);
            if (array.length) {
                this._cart = array;
            }
            else {
                localStorage.removeItem('cart');
            }
        }
    }
    get httpClient() {
        return this._httpClient;
    }
    set httpClient(baseUrl) {
        this._httpClient = new HttpClient(baseUrl);
    }
    get products() {
        return this._products;
    }
    set products(products) {
        this._products = products;
    }
    get quatity() {
        return this._quatity;
    }
    set quatity(value) {
        this._quatity = value;
        if (this.divQuatity) {
            this.divQuatity.innerHTML = this.quatity.toString();
        }
    }
    get total() {
        return this.formatMoney(this._total);
    }
    set total(value) {
        this._total = value;
        if (this.divTotal) {
            this.divTotal.innerHTML = this.total;
        }
    }
    get divQuatity() {
        return this._divQuatity;
    }
    set divQuatity(div) {
        div.innerHTML = this.quatity.toString();
        this._divQuatity = div;
    }
    get divTotal() {
        return this._divTotal;
    }
    set divTotal(div) {
        this.total;
        this._divTotal = div;
    }
    get cart() {
        return this._cart;
    }
    set cart(product) {
        const indexProdutoExistente = this.cart.findIndex(produto => produto.id === product.id);
        if (indexProdutoExistente !== -1) {
            if (product.quantidade < 1) {
                this.cart.splice(indexProdutoExistente, 1);
                this.save();
            }
            else {
                this.cart[indexProdutoExistente].quantidade = product.quantidade;
            }
        }
        else {
            this._cart.push(product);
        }
        this.loadCart();
    }
    save() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    clean() {
        localStorage.removeItem('cart');
        this._cart = [];
        this.loadCart();
    }
    loadCart(fn = null) {
        this.save();
        let produtos = 0;
        let total = 0;
        if (this.cart.length) {
            this.cart.forEach(produto => {
                produtos++;
                total += produto.valor * produto.quantidade;
            });
        }
        this.total = total;
        this.quatity = produtos;
        if (fn !== null && typeof fn === 'function') {
            fn();
        }
    }
    add(quatity, productJson) {
        const product = JSON.parse(productJson);
        product.id = product._id;
        delete product._id;
        product.quantidade = quatity;
        this.cart = product;
    }
    searchProducts(uri) {
        var _a;
        return (_a = this.httpClient) === null || _a === void 0 ? void 0 : _a.get(uri).then(d => {
            this.products = d.data;
        }).catch((error) => {
            console.log(error);
        });
    }
    truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        else {
            // Encontrar a última posição de espaço antes do limite de caracteres
            const lastSpaceIndex = text.lastIndexOf(' ', maxLength);
            // Verificar se encontrou um espaço antes do limite
            if (lastSpaceIndex !== -1) {
                return text.slice(0, lastSpaceIndex) + '...';
            }
            else {
                // Se não encontrar um espaço, simplesmente corta no limite
                return text.slice(0, maxLength) + '...';
            }
        }
    }
    formatMoney(price, locales = 'pt-BR', currency = 'BRL') {
        const formatedValue = (price / 100).toFixed(2);
        return new Intl.NumberFormat(locales, { style: 'currency', currency: currency }).format(Number(formatedValue));
    }
}
