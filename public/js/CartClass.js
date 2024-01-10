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
        this._product_list = null;
        this._product_list_li = null;
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
    get product_list() {
        return this._product_list;
    }
    set product_list(value) {
        this._product_list = value;
    }
    get product_list_li() {
        return this._product_list_li;
    }
    set product_list_li(value) {
        this._product_list_li = value;
    }
    set cart(product) {
        const indexProdutoExistente = this.findIndexByID(product.id);
        if (indexProdutoExistente !== -1) {
            if (parseInt(product.quantidade) < 1) {
                this._cart.splice(indexProdutoExistente, 1);
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
    findIndexByID(id) {
        return this.cart.findIndex(objeto => parseInt(objeto.id) === parseInt(id));
    }
    productList(id) {
        this.product_list = document.getElementById(id);
        if (this.product_list) {
            this.product_list_li = this.product_list.querySelector('li');
        }
    }
    save() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    clean() {
        localStorage.removeItem('cart');
        this.removerLocalStorageComPrefixo('product');
        this._cart = [];
        this.loadCart();
    }
    removerLocalStorageComPrefixo(prefixo) {
        for (let chave in localStorage) {
            if (chave.startsWith(prefixo)) {
                localStorage.removeItem(chave);
            }
        }
    }
    loadCart(fn = null) {
        this.save();
        let produtos = 0;
        let total = 0;
        if (this.cart.length) {
            if (this.product_list !== null) {
                this.product_list.innerHTML = '';
            }
            this.cart.forEach(produto => {
                produtos++;
                total += produto.valor * produto.quantidade;
                if (this.product_list !== null) {
                    let tmpLiContainer = document.createElement('li');
                    tmpLiContainer.setAttribute('class', 'd-block p-1');
                    let tmpLi = document.createElement('div');
                    tmpLi.setAttribute('class', 'd-flex justify-content-start align-items-center gap-2');
                    let tmpDiv = document.createElement('div');
                    let tmpH6 = document.createElement('p');
                    let tmpP = document.createElement('p');
                    tmpH6.setAttribute('class', 'fs-6 m-0 p-0 text-wrap');
                    tmpH6.setAttribute('style', 'min-width: 400px; width: 100%; max-width: 600px');
                    tmpH6.innerText = produto.nome;
                    tmpP.append(`${produto.quantidade}x ${this.formatMoney(produto.valor)}`);
                    tmpP.setAttribute('class', 'text-muted m-0 p-0 d-flex justify-content-start align-items-start flex-column');
                    let tmpBtn = document.createElement('a');
                    tmpBtn.setAttribute('class', 'text-danger remove-product-list dropdown-item w-50');
                    tmpBtn.setAttribute('data-id', produto.id);
                    tmpBtn.setAttribute('href', `javascript:void(0);`);
                    tmpBtn.innerHTML = '<i class="bi bi-cart-x"></i> Remover';
                    tmpP.appendChild(tmpBtn);
                    tmpDiv.appendChild(tmpH6);
                    tmpDiv.appendChild(tmpP);
                    this.redimensionarComFitCrop(produto.imagem, 50, 50)
                        .then(novaUrlBase64 => {
                        let imagemRedimensionada = new Image();
                        imagemRedimensionada.classList.add('img-thumbnail');
                        imagemRedimensionada.classList.add('rounded');
                        if (typeof novaUrlBase64 === "string") {
                            imagemRedimensionada.src = novaUrlBase64;
                        }
                        tmpLi.appendChild(imagemRedimensionada);
                        tmpLi.appendChild(tmpDiv);
                    })
                        .catch(error => {
                        console.error('Erro ao redimensionar a imagem:', error);
                    });
                    tmpLiContainer.appendChild(tmpLi);
                    this.product_list.appendChild(tmpLiContainer);
                    tmpBtn.addEventListener('click', () => this.removeItem(produto.id));
                }
            });
        }
        this.total = total;
        this.quatity = produtos;
        if (fn !== null && typeof fn === 'function') {
            fn();
        }
    }
    redimensionarImagemBase64(urlImage, w, h) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                let proporcao = Math.min(w / img.width, h / img.height);
                canvas.width = img.width * proporcao;
                canvas.height = img.height * proporcao;
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                let novaUrlBase64 = canvas.toDataURL('image/jpeg');
                resolve(novaUrlBase64);
            };
            img.onerror = function (error) {
                reject(error);
            };
            img.src = urlImage;
        });
    }
    redimensionarComFitCrop(urlImage, w, h) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                canvas.width = w;
                canvas.height = h;
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, 0, 0, w, h);
                let novaUrlBase64 = canvas.toDataURL('image/jpeg'); // ou 'image/png' para PNG
                resolve(novaUrlBase64);
            };
            img.onerror = function (error) {
                reject(error);
            };
            img.src = urlImage;
        });
    }
    add(quatity, productJson) {
        const product = JSON.parse(productJson);
        product.id = product._id;
        delete product._id;
        product.quantidade = quatity;
        this.cart = product;
    }
    update(product) {
        this.cart = product;
    }
    removeItem(id, fn = null) {
        const indexProdutoExistente = this.findIndexByID(id);
        if (indexProdutoExistente !== -1 && confirm('Deseja realmente remover esse item?')) {
            localStorage.removeItem(`product-${id}`);
            this._cart.splice(indexProdutoExistente, 1);
            this.save();
            this.loadCart();
            if (fn !== null && typeof fn === 'function') {
                fn();
            }
        }
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
