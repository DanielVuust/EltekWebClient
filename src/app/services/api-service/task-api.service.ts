import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TaskModel } from '../../classes/data-classes/task-model';
import { Observable, take } from 'rxjs';
import { OperationsService } from './operations.service';
import { SnackbarService } from '../snackbar-service/snackbar.service';
import { CustomerModel } from '../../classes/data-classes/customer-model';
import { UserModel } from '../../classes/data-classes/user-model';
import { SignalRService } from '../signal-r-service/signal-r.service';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {

  constructor(public apiService: ApiService, public operationService: OperationsService, public snackbarService: SnackbarService, public signalR: SignalRService) { }

  async createTask(title: string, description: string, location: string, status: string, customerId: string, userId: string): Promise<string> {
    return new Promise(async resolve => {
      (await this.apiService.post("tasks", {
          title: title,
          description: description,
          location: location,
          status: status,
          customerId: customerId,
          userId: userId,
      })).pipe(take(1)).subscribe({
        next: async (response: any) => {
          var taskId = await this.signalR.waitForRequestId(response.requestId);
          resolve(taskId);
        },
        error: (error: any) => {
          this.snackbarService.showSnackbar("Error creating task", "Close");
          console.error("Error creating task", error);
          resolve(error);
        }
      });
    });
  }

  async saveTask(taskId: string, title: string, description: string, location: string, status: string, customerId: string, userId: string): Promise<string> {
    return new Promise(async resolve => {
      (await this.apiService.patch(("tasks/" + taskId), {
        customerId: customerId,
        status: status,
        location: location,
        description: description,
        title: title,
        userId: userId
      })).pipe(take(1)).subscribe({
        next: async (operation: any) => {
          var taskId = await this.signalR.waitForRequestId(operation.requestId);
          resolve(taskId);
        },
        error: (error) => {
          this.snackbarService.showSnackbar(error.title, "Close");
          console.error("Error creating task", error);
          resolve(error);
        }
      });
    });
  }

  async getTask(taskId: string): Promise<TaskModel> {
    return new Promise(async resolve => {
      (await this.apiService.get("tasks/" + taskId)).pipe(take(1)).subscribe({
        next: (task: any) => {
          resolve(task);
        },
        error: (error: any) => {
          this.snackbarService.showSnackbar(error.title, "Close");
          console.error("Error getting task", error);
          resolve(error);
        }
      });
    });
  }

  async createComment(taskId: String, comment: String): Promise<string> {
    let body = {
      comment: comment
    };

    return new Promise(async (resolve, reject) => {
      (await this.apiService.post("tasks/" + taskId + "/comments", body)).pipe(take(1)).subscribe({
        next: async (operation: any) => {
          let id = (await this.operationService.getObjectIdFromOperation(operation.requestId)) as string;
          resolve(id);
        },
        error: (error: any) => {
          this.snackbarService.showSnackbar(error.title, "Close");
          console.error("Error creating comment", error);
          reject(error);
        }
      });
    });
  }

  async addPhoto(taskId: string, photoData: any): Promise<string> {
    let body = {
      photo: photoData
    };

    return new Promise(async (resolve, reject) => {
      (await this.apiService.post("tasks/" + taskId + "/photos", body)).pipe(take(1)).subscribe({
        next: async (operation: any) => {
          let id = (await this.operationService.getObjectIdFromOperation(operation.requestId)) as string;
          resolve(id);
        },
        error: (error: any) => {
          this.snackbarService.showSnackbar(error.title, "Close");
          console.log("Error adding photo", error);
          reject(error);
        }
      });
    });
  }

  async deletePhoto(photoId: string): Promise<string> {
    return "not implemented";
  }

  async deleteComment(commentId: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      (await this.apiService.delete("comments/" + commentId)).pipe(take(1)).subscribe({
        next: async (operation: any) => {
          let id = (await this.operationService.getObjectIdFromOperation(operation.requestId)) as string;
          resolve(id);
        },
        error: (error) => {
          this.snackbarService.showSnackbar(error.title, "Close");
          console.log("Error adding photo", error);
          reject(error);
        }
      });
    });
  }

  async getCustomers(): Promise<CustomerModel[]> {
    return new Promise(async (resolve, reject) => {
      (await this.apiService.get("customers")).pipe(take(1)).subscribe({
        next: (customers: any) => {
          resolve(customers);
        },
        error: (error: any) => {
          this.snackbarService.showSnackbar(error.title, "Close");
          console.log("Error getting customers", error);
          reject(error);
        }
      });
    });
  }
  async getUsers(): Promise<UserModel[]> {
    return new Promise(async (resolve, reject) => {
      (await this.apiService.get("users")).pipe(take(1)).subscribe({
        next: (users: any) => {
          resolve(users);
        },
        error: (error: any) => {
          this.snackbarService.showSnackbar(error.title, "Close");
          console.log("Error getting users", error);
          reject(error);
        }
      });
    });
  }
  async getTasks(): Promise<any> {
  
    return new Promise(async resolve => {
      (await this.apiService.get("tasks")).pipe(take(1)).subscribe({
        next: async (tasks: any) => {
          resolve(tasks);
        },
        error: (error: any) => {
          this.snackbarService.showSnackbar(error.title, "Close");
          console.error("Error getting tasks", error);
          resolve(error);
        }
        
      });
    });
    
  }
deleteTask(taskId: String): Promise<any>{
  return new Promise(async (resolve, reject)=> {
    (await this.apiService.delete("tasks/" + taskId)).pipe(take(1)).subscribe({
      next: async (operation: any) => {
        let id = (await this.operationService.getObjectIdFromOperation(operation.requestId)) as string;
        resolve(id);
      },
      error: (error: any) => {
        this.snackbarService.showSnackbar(error.title, "Close");
        console.error("Error deleting task", error);
        reject(error);
      }});
    });
}
}
