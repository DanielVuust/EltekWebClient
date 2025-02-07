import { CustomerModel } from "../data-classes/customer-model";

export class CustomerState{
    customer?: CustomerModel;
    isLoading?: boolean;
    constructor(customer: CustomerModel){
        this.customer = customer;
        this.isLoading = false;
    }
}