import { Injectable } from '@angular/core';
import { TaskState } from '../../classes/state-classes/task-state';
import { Store } from '@ngrx/store';
import { SnackbarService } from '../snackbar-service/snackbar.service';
import { TaskApiService } from '../api-service/task-api.service';
import { SignalRService } from '../signal-r-service/signal-r.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  taskState: TaskState | undefined;

  constructor(
    public store: Store<{ task: TaskState }>,
    public snackbarService: SnackbarService,
    public taskApiService: TaskApiService,
    public SignalRService: SignalRService
  ) {
    store.select(state => state.task).subscribe(task => {
      this.taskState = task;
    });
  }

  async validateTask(): Promise<boolean> {
    if (this.taskState?.task?.id === "new" || !this.taskState?.task?.id) {
      this.snackbarService.showSnackbar($localize`Please save the task first`, $localize`Close`);
      return false;
    }
    return true;
  }

  async loadTask(taskId: string) {
    if (taskId === "new") {
      this.store.dispatch({ type: '[TaskAction] setTask', task: { id: "new", title: "", description: "", location: "", status: "New", customerId: "" } });
      this.store.dispatch({ type: '[TaskAction] setIsLoading', isLoading: false });
      return;
    }

    this.store.dispatch({ type: '[TaskAction] setIsLoading', isLoading: true });

    try {
      let task = await this.taskApiService.getTask(taskId);
      this.store.dispatch({ type: '[TaskAction] setTask', task: task });
    } catch (error) {
      console.error("Error loading task", error);
      this.snackbarService.showSnackbar($localize`Error loading task`, $localize`Close`);
    } finally {
      this.store.dispatch({ type: '[TaskAction] setIsLoading', isLoading: false });
    }
  }

  async saveTask(title: string, description: string, location: string, status: string, customerId: string, userId: string) {
    this.store.dispatch({ type: '[TaskAction] setIsLoading', isLoading: true });

    let newTaskId = "";
    try {
      if (this.taskState?.task?.id === "new") {
        newTaskId = await this.taskApiService.createTask(title, description, location, status, customerId, userId);
      } else {
        await this.taskApiService.saveTask(this.taskState?.task?.id!, title, description, location, status, customerId, userId);
      }
    } catch (error) {
      console.error("Error saving task", error);
      this.snackbarService.showSnackbar($localize`Error saving task`, $localize`Close`);
    }
    if (this.taskState?.task?.id === "new") {
      await this.loadTask(newTaskId);
    } else {
      await this.loadTask(this.taskState?.task?.id!);
    }
  }

  async loadTaskPhotos() {
    if (await this.validateTask() === false) {
      return;
    }
    try {
      const task = await this.taskApiService.getTask(this.taskState?.task?.id!);
      if (task) {
        this.store.dispatch({ type: '[TaskAction] setTaskPhotos', photos: task.photos });
      } else {
        this.snackbarService.showSnackbar($localize`Task not found`, $localize`Close`);
      }
    } catch (error) {
      this.snackbarService.showSnackbar($localize`Error`, $localize`Close`);
    } finally {
      this.store.dispatch({ type: '[TaskAction] setIsPhotosLoading', isLoading: false });
    }
  }

  async addTaskPhotos(photoData: File[]) {
    if (await this.validateTask() === false) {
      return;
    }

    this.store.dispatch({ type: '[TaskAction] setIsPhotosLoading', isLoading: true });

    let addPhotoPromises: Promise<string>[] = [];

    for (let i = 0; i < photoData.length; i++) {
      let file = photoData[i];
      const fileReader = new FileReader();
      const fileReaderPromise = new Promise<string>((resolve, reject) => {
        fileReader.onload = async () => {
          //After file is read, send photo to server
          try {
            const result = await this.taskApiService.addPhoto(this.taskState?.task?.id!, fileReader.result as string);
            resolve(result);
          } catch (error: any) {
            console.error("Error adding photo", error);
            this.snackbarService.showSnackbar($localize`Error adding photo`, $localize`Close`);
            reject(error);
          }
        };
        fileReader.onerror = (error) => {
          this.snackbarService.showSnackbar($localize`Error reading file`, $localize`Close`);
          reject(error);
        };
      });
      fileReader.readAsDataURL(file);
      addPhotoPromises.push(fileReaderPromise);
    }
    //Wait for all photos to be added
    await Promise.all(addPhotoPromises);
    //Reload photos
    await this.loadTaskPhotos();
  }

  async removeTaskPhoto(data: any) {
    if (await this.validateTask() === false) {
      return;
    }
    this.store.dispatch({ type: '[TaskAction] removeTaskPhoto', data: data });
  }

  async loadTaskCommets() {
    if (await this.validateTask() === false) {
      return;
    }
    try {
      const task = await this.taskApiService.getTask(this.taskState?.task?.id!);
      if (task) {
        this.store.dispatch({ type: '[TaskAction] setComments', comments: task.comments });
      } else {
        this.snackbarService.showSnackbar($localize`Task not found`, $localize`Close`);
      }
    } catch (error) {
      this.snackbarService.showSnackbar($localize`Error loading comments`, $localize`Close`);
    } finally {
      this.store.dispatch({ type: '[TaskAction] setIsCommentsLoading', isLoading: false });
    }
  }

  async addTaskComment(commentText: string) {
    if (await this.validateTask() === false) {
      return;
    }

    this.store.dispatch({ type: '[TaskAction] setIsCommentsLoading', isLoading: true });
    try {
      const commentId = await this.taskApiService.createComment(this.taskState?.task?.id!, commentText);
    } catch (error: any) {
      console.error("Error adding comment", error);
      this.snackbarService.showSnackbar($localize`Error adding comment`, $localize`Close`);
      return;
    }
    this.loadTaskCommets();
  }

  async deleteTaskComment(commentId: any) {
    if (await this.validateTask() === false) {
      return;
    }
    this.store.dispatch({ type: '[TaskAction] setIsCommentsLoading', isLoading: true });
    try {
      await this.taskApiService.deleteComment(commentId);
    } catch (error: any) {
      console.error("Error removing comment", error);
      this.snackbarService.showSnackbar($localize`Error deleting comment`, $localize`Close`);
      return;
    }
    this.loadTaskCommets();
  }

  async loadCustomers() {
    this.store.dispatch({ type: '[TaskAction] setIsCustomersLoading', isLoading: true });

    try {
      let customers = await this.taskApiService.getCustomers();
      this.store.dispatch({ type: '[TaskAction] setCustomers', customers: customers });
    } catch (error) {
      console.error("Error loading tasks", error);
      this.snackbarService.showSnackbar($localize`Error loading customers`, $localize`Close`);
    } finally {
      this.store.dispatch({ type: '[TaskAction] setIsCustomersLoading', isLoading: false });
    }
  }

  async loadUsers() {
    this.store.dispatch({ type: '[TaskAction] setIsUserLoading', isLoading: true });

    try {
      let users = await this.taskApiService.getUsers();
      this.store.dispatch({ type: '[TaskAction] setUsers', users: users });
    } catch (error) {
      console.error("Error loading users", error);
      this.snackbarService.showSnackbar($localize`Error loading users`, $localize`Close`);
    } finally {
      this.store.dispatch({ type: '[TaskAction] setIsUserLoading', isLoading: false });
    }
  }
}
