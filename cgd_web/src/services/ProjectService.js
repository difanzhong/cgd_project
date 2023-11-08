import Service from "./Service.js";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

class BasicArgsService extends Service{
    constructor(httpClient) {
        super();
        this.httpClient = httpClient;
        this.URL = `${this.base_url}/projects`;
        this.token = cookies.get('access_token')
    }

    async get_all() {
        try{
            const response = await this.httpClient.get(`${this.URL}`, this.token)
            return response.json()
        }catch(error){
            console.error(error)
            throw error
        }
    }

    async get(project_id) {
        try{
            const response = await this.httpClient.get(`${this.URL}/${project_id}`, this.token)
            return response.json()
        }catch(error){
            console.error(error)
            throw error
        }
    }
    
    async post(body) {
        try {
            const response = await this.httpClient.post(this.URL, body, this.token)
            return response.json()
        }catch(error){
            console.error(error)
            throw error
        }
    }

    async put(body) {
        try {
            const response = await this.httpClient.put(this.URL, body, this.token)
            return response.json()
        }catch(error){
            console.error(error)
            throw error
        }
    }
}

export default BasicArgsService;