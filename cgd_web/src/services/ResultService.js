import Service from "./Service.js";

class ExpenseResultService extends Service{
    constructor(httpClient) {
        super();
        this.httpClient = httpClient;
    }

    async getExpenseResult(project_id) {
        try{
            const response = await this.httpClient.get(`${this.base_url}/projects/${project_id}/total_expense`)
            return response.json()
        }catch(error){
            console.error(error)
            throw error
        }
    }
    
    async getInvestResult(project_id) {
        try{
            const response = await this.httpClient.get(`${this.base_url}/projects/${project_id}/total_investment`)
            return response.json()
        }catch(error){
            console.error(error)
            throw error
        }
    }
}

export default ExpenseResultService;