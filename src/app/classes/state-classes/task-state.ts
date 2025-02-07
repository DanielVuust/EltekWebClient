import { CustomerModel } from "../data-classes/customer-model";
import { TaskModel } from "../data-classes/task-model";
import { UserModel } from "../data-classes/user-model";

export class TaskState {
    task: TaskModel | null;
    isLoading: boolean;
    isCommentsLoading: boolean;
    isPhotosLoading: boolean;
    successMessage?: string | undefined;
    customers?: CustomerModel[];
    isCustomersLoading?: boolean;
    users?: UserModel[];
    isUsersLoading?: boolean;
    constructor(task: TaskModel) {
        this.task = task;
        this.isLoading = false;
        this.isCommentsLoading = false;
        this.isPhotosLoading = false;
        this.successMessage = undefined
        this.customers = [];
        this.isCustomersLoading = false;
    }
}