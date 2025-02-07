export class CustomerModel{
    id?: string;
    customerName?: string;
    email?: string;
    phoneNumber?: string;
    constructor(id: string, customerName: string, email: string, phoneNumber: string){
        this.id = id;
        this.customerName = customerName;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }
}
    