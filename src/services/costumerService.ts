import {CreateCustumerPayload, Customer, CustomerListResponse, CustomerResponse} from "src/models/customer";

import api from "./api";

export const getAllCostumersPaginaded = async(skip:number, take:number): Promise<CustomerListResponse> =>{
    const response = await api.get<CustomerListResponse>("/costumer");
    return response.data;
};