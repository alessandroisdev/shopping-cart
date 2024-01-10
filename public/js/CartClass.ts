import {HttpClient} from "./HttpClient.js";

export class CartClass {

    private _httpClient: HttpClient | null = null;
    private _products: any | null = null;
    private _quatity: number = 0;
    private _divQuatity: HTMLElement | null = null;
    private _total: number = 0;
    private _divTotal: HTMLElement | null = null;
    private _cart: Array<any> = [];

    constructor(baseUrl: string) {
        this.httpClient = baseUrl;
        if (localStorage.getItem('cart')) {
            let json: any = localStorage.getItem('cart');
            let array = JSON.parse(json);
            if (array.length) {
                this._cart = array;
            } else {
                localStorage.removeItem('cart');
            }
        }
    }

    get httpClient(): HttpClient | null {
        return this._httpClient;
    }

    set httpClient(baseUrl: string) {
        this._httpClient = new HttpClient(baseUrl);
    }

    get products(): any {
        return this._products;
    }

    set products(products: any) {
        this._products = products;
    }

    get quatity(): number {
        return this._quatity;
    }

    set quatity(value: number) {
        this._quatity = value;
        if (this.divQuatity) {
            this.divQuatity.innerHTML = this.quatity.toString();
        }
    }

    get total(): string {
        return this.formatMoney(this._total);
    }

    set total(value: number) {
        this._total = value;
        if (this.divTotal) {
            this.divTotal.innerHTML = this.total;
        }
    }

    get divQuatity(): HTMLElement | null {
        return this._divQuatity;
    }

    set divQuatity(div: HTMLElement) {
        div.innerHTML = this.quatity.toString();
        this._divQuatity = div;
    }

    get divTotal(): HTMLElement | null {
        return this._divTotal;
    }

    set divTotal(div: HTMLElement) {
        this.total;
        this._divTotal = div;
    }

    get cart(): Array<any> {
        return this._cart;
    }

    set cart(product: any) {
        const indexProdutoExistente = this.cart.findIndex(produto => produto.id === product.id);
        if (indexProdutoExistente !== -1) {
            if (product.quantidade < 1) {
                this.cart.splice(indexProdutoExistente, 1);
                this.save();
            } else {
                this.cart[indexProdutoExistente].quantidade = product.quantidade;
            }
        } else {
            this._cart.push(product);
        }

        this.loadCart();
    }

    private save() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    private clean() {
        localStorage.removeItem('cart');
        this._cart = [];
        this.loadCart();
    }

    public loadCart(fn: (() => void) | null = null) {
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

    public add(quatity: number, productJson: string) {
        const product = JSON.parse(productJson);
        product.id = product._id!;
        delete product._id;
        product.quantidade = quatity;
        this.cart = product;
    }

    public searchProducts(uri: string) {
        return this.httpClient?.get(uri)
            .then(d => {
                this.products = d.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    public truncateText(text: string, maxLength: number): string {
        if (text.length <= maxLength) {
            return text;
        } else {
            // Encontrar a última posição de espaço antes do limite de caracteres
            const lastSpaceIndex = text.lastIndexOf(' ', maxLength);

            // Verificar se encontrou um espaço antes do limite
            if (lastSpaceIndex !== -1) {
                return text.slice(0, lastSpaceIndex) + '...';
            } else {
                // Se não encontrar um espaço, simplesmente corta no limite
                return text.slice(0, maxLength) + '...';
            }
        }
    }

    public formatMoney(price: number, locales: string = 'pt-BR', currency: string = 'BRL'): string {
        const formatedValue = (price / 100).toFixed(2);
        return new Intl.NumberFormat(locales, {style: 'currency', currency: currency}).format(Number(formatedValue));
    }
}