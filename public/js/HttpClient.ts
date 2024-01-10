export class HttpClient {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request(url: string, method: string, data?: any, headers?: Record<string, string>): Promise<any> {
        const requestOptions: RequestInit = {
            method,
            headers: headers || {},
        };

        if (data) {
            requestOptions.body = JSON.stringify(data);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error(`ERROR: ${response.status}`);
        }

        return response.json();
    }

    public async get(url: string, headers?: Record<string, string>): Promise<any> {
        return this.request(`${this.baseUrl}/${url}`, 'GET', undefined, headers);
    }

    public async post(url: string, data: any, headers?: Record<string, string>): Promise<any> {
        return this.request(`${this.baseUrl}/${url}`, 'POST', data, headers);
    }

    public async put(url: string, data: any, headers?: Record<string, string>): Promise<any> {
        return this.request(`${this.baseUrl}/${url}`, 'PUT', data, headers);
    }

    public async patch(url: string, data: any, headers?: Record<string, string>): Promise<any> {
        return this.request(`${this.baseUrl}/${url}`, 'PATCH', data, headers);
    }

    public async delete(url: string, headers?: Record<string, string>): Promise<any> {
        return this.request(`${this.baseUrl}/${url}`, 'DELETE', undefined, headers);
    }
}