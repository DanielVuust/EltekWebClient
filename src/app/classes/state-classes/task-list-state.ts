import { TaskModel } from "../data-classes/task-model";
import { UserModel } from "../data-classes/user-model";

export class TaskListState {
    tasks: TaskModel[];
    isLoading: boolean;
    users: UserModel[];
    isUsersLoading: boolean;
    constructor() {
        this.tasks = [];
        this.isLoading = false;
        this.users = [];
        this.isUsersLoading = false;
    }
}