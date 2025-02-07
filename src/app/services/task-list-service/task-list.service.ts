import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TaskListState } from '../../classes/state-classes/task-list-state';
import { TaskModel } from '../../classes/data-classes/task-model';
import { delay } from 'rxjs';
import { SnackbarService } from '../snackbar-service/snackbar.service';
import { TaskApiService } from '../api-service/task-api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {
  taskListState: TaskListState | undefined;
  constructor(public store: Store<{ taskList: TaskListState }>, public taskApiService: TaskApiService, public snackbarService: SnackbarService) { 
    store.select(state => state.taskList).subscribe(task => {
      this.taskListState = task;
    });
  }

  async loadTasks() {
    this.store.dispatch({ type: '[TaskListAction] setIsLoading', isLoading: true });

    try{
      let tasks = await this.taskApiService.getTasks();
      this.store.dispatch({ type: '[TaskListAction] setTasks', tasks: tasks });

    } catch(error){
      console.error("Error loading tasks", error);
      this.snackbarService.showSnackbar("Error loading tasks", "Close");
    } finally{
      this.store.dispatch({ type: '[TaskListAction] setIsLoading', isLoading: false });
    }
  }

  async removeTask(task: TaskModel) {
    this.store.dispatch({ type: '[TaskListAction] setIsLoading', isLoading: true });

    try{
      await this.taskApiService.deleteTask(task.id!);
    } catch(error){
      console.error("Error removing task", error);
      this.snackbarService.showSnackbar("Error removing task", "Close");
    } finally{
      this.store.dispatch({ type: '[TaskListAction] setIsLoading', isLoading: false });
    }
    await this.loadTasks();
  }

  async loadUsers() {
    this.store.dispatch({ type: '[TaskListAction] setIsUserLoading', isLoading: true });

    try{
      let users = await this.taskApiService.getUsers();
      console.log(users)
      this.store.dispatch({ type: '[TaskListAction] setUsers', users: users });

    } catch(error){
      console.error("Error loading users", error);
      this.snackbarService.showSnackbar("Error loading users", "Close");
    } finally{
      this.store.dispatch({ type: '[TaskListAction] setIsUserLoading', isLoading: false });
    }
  }

}
