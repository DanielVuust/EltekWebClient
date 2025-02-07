import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor(public apiService: ApiService) { }

  async getObjectIdFromOperation(requestId: string): Promise<Object> {

    const response: Observable<Object> = await this.apiService.get("operations?requestId=" + requestId);
    return new Promise(resolve => {
      response?.pipe(take(1)).subscribe({
      next: (response: any) => {
        resolve(response.taskId);
      },
      error: (error) => {
        console.error("Error getting object id from operation", error);
      }
    })});
  }
}
