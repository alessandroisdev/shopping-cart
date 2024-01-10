var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class HttpClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    request(url, method, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestOptions = {
                method,
                headers: headers || {},
            };
            if (data) {
                requestOptions.body = JSON.stringify(data);
            }
            const response = yield fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`ERROR: ${response.status}`);
            }
            return response.json();
        });
    }
    get(url, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(`${this.baseUrl}/${url}`, 'GET', undefined, headers);
        });
    }
    post(url, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(`${this.baseUrl}/${url}`, 'POST', data, headers);
        });
    }
    put(url, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(`${this.baseUrl}/${url}`, 'PUT', data, headers);
        });
    }
    patch(url, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(`${this.baseUrl}/${url}`, 'PATCH', data, headers);
        });
    }
    delete(url, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(`${this.baseUrl}/${url}`, 'DELETE', undefined, headers);
        });
    }
}
