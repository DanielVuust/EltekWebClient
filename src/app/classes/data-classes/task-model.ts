import { CommentModel } from "./comment-model";
import { CustomerModel } from "./customer-model";
import { PhotoModel } from "./photo-model";

export class TaskModel{
    id?: string;
    title?: string;
    description?: string;
    userId?: string;
    status?: string;
    photos?: PhotoModel[] = [];
    comments?: CommentModel[] = [];
    deleted?: boolean = false;
    location?: string;
    customerId?: string;
    constructor(id?: string, title?: string, description?: string, status?: string, userId?: string, location?: string,){
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.userId = userId;
        this.location = location;
    }
}