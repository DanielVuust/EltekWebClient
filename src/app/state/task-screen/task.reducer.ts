import { createReducer, on } from '@ngrx/store';
import { setTask, setIsLoading, setTaskPhotos, setIsCommentsLoading, setComments, setIsPhotosLoading, setCustomers, setUsers, setIsUsersLoading } from './task.actions';
import { TaskState } from '../../classes/state-classes/task-state';
import { TaskModel } from '../../classes/data-classes/task-model';

export const initialState: TaskState = {
  task: null,
  isLoading: false,
  isCommentsLoading: false,
  isPhotosLoading: false,
  isUsersLoading: false,
};

export const taskReducer = createReducer(
  initialState,
  on(setTask, (state, { task }) => ({
    ...state,
    task: {
      ...task,
      id: task.id || ''
    }
  })),
  on(setIsLoading, (state, { isLoading }) => ({
    ...state,
    isLoading: isLoading
  })),
  on(setTaskPhotos, (state, { photos }) => ({
    ...state,
    task: {
      ...state.task,
      photos: photos,
    }
  })),
  on(setComments, (state, { comments }) => ({
    ...state,
    task: {
      ...state.task,
      comments: comments,
    }
  })),
  on(setIsPhotosLoading, (state, { isLoading }) => ({
    ...state,
    isPhotosLoading: isLoading
  })),
  on(setCustomers, (state, { customers }) => ({
    ...state,
    customers: customers
  })),
  on(setIsCommentsLoading, (state, { isLoading }) => ({
    ...state,
    isCommentsLoading: isLoading
  })),
  on(setUsers, (state, { users }) => ({
    ...state,
    users: users
  })),
  on(setIsUsersLoading, (state, { isLoading }) => ({
    ...state,
    isUsersLoading: isLoading
  }),)
    
);