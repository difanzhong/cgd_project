import Service from "./Service.js";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

class AuthService extends Service{
    constructor(httpClient) {
        super();
        this.httpClient = httpClient;
        this.URL = `${this.base_url}`;
    }

    async getToken(data) {
        try{
            const response = await this.httpClient.getToken(`${this.URL}/token`, data)
            return response.json()
        }catch(error){
            console.error(error)
            throw error
        }
    }

    async register(data) {
        try{
            const response = await this.httpClient.post(`${this.URL}/register`, data)
            return response.json()
        }catch(error){
            console.error(error)
            throw error
        }
    }

    async getUser() {
        try{
            const response = await this.httpClient.get(`${this.URL}/user/me`, cookies.get('access_token'))
            return response.json()
        }catch(error){
            console.error(error)
            throw error
        }
    }
}

export default AuthService;