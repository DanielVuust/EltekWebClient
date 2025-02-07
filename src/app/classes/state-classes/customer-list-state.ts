import { CustomerModel } from "../data-classes/customer-model";

export class CustomerListState {
    customers: CustomerModel[];
    isLoading: boolean;
    constructor() {
        this.customers = [];
        this.isLoading = false;
    }
}