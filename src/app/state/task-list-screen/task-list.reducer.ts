import { createReducer, on } from '@ngrx/store';
import { setIsLoading, setIsUsersLoading, setTasks, setUsers } from './task-list.actions';
import { TaskListState } from '../../classes/state-classes/task-list-state';

const initialState: TaskListState = {
  tasks: [],
  isLoading: false,
  users: [],
  isUsersLoading: false
};

export const taskListReducer = createReducer(
  initialState,
  on(setTasks, (state, {tasks}) => ({
    ...state,
    tasks: tasks
  })),
  on(setIsLoading, (state, {isLoading}) => ({
    ...state,
    isLoading: isLoading
  })),
  on(setUsers, (state, {users}) => ({
    ...state,
    users: users
  })),
  on(setIsUsersLoading, (state, {isLoading}) => ({
    ...state,
    isUsersLoading: isLoading
  }))
  
);