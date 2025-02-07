import { createAction, props } from '@ngrx/store';
import { TaskModel } from '../../classes/data-classes/task-model';
import { UserModel } from '../../classes/data-classes/user-model';

export const setTasks = createAction('[TaskListAction] setTasks', props<{ tasks: TaskModel[] }>());
export const setUsers = createAction('[TaskListAction] setUsers', props<{ users: UserModel[] }>());

export const setIsLoading = createAction('[TaskListAction] setIsLoading', props<{ isLoading: boolean }>());
export const setIsUsersLoading = createAction('[TaskListAction] setIsUsersLoading', props<{ isLoading: boolean }>());
