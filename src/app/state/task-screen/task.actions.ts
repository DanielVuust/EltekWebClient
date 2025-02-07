import { createAction, props } from '@ngrx/store';
import { TaskModel } from '../../classes/data-classes/task-model';
import { CommentModel } from '../../classes/data-classes/comment-model';
import { CustomerModel } from '../../classes/data-classes/customer-model';
import { UserModel } from '../../classes/data-classes/user-model';

export const setTask = createAction('[TaskAction] setTask', props<{ task: TaskModel }>());
export const setCustomers = createAction('[TaskAction] setCustomers', props<{ customers: CustomerModel[] }>());
export const setUsers = createAction('[TaskAction] setUsers', props<{ users: UserModel[] }>());
export const setTaskPhotos = createAction('[TaskAction] setTaskPhotos', props<{ photos: any }>());
export const setComments = createAction('[TaskAction] setComments', props<{ comments: CommentModel[] }>());

export const setIsLoading = createAction('[TaskAction] setIsLoading', props<{ isLoading: boolean }>());
export const setIsCommentsLoading = createAction('[TaskAction] setIsCommentsLoading', props<{ isLoading: boolean }>());
export const setIsCustomersLoading = createAction('[TaskAction] setIsCustomersLoading', props<{ isLoading: boolean }>());
export const setIsUsersLoading = createAction('[TaskAction] setIsUsersLoading', props<{ isLoading: boolean }>());
export const setIsPhotosLoading = createAction('[TaskAction] setIsPhotosLoading', props<{ isLoading: boolean }>());
