import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../config/appsettings';
import { SnackbarService } from '../snackbar-service/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | undefined;

  constructor(private snackbarService: SnackbarService) {}

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.backendWorkerUrl) 
      .build();

    this.hubConnection
      .start()
      .then(() =>{
        console.log('SignalR Connection started')
      })
      .catch(err => {
        this.snackbarService.showSnackbar($localize`Error establishing SignalR connection, please try again later`, 'Close');
        console.log('Error establishing SignalR connection: ' + err)
      }
      );
  }

  public waitForRequestId = (requestId: string) => {
    return new Promise<string>((resolve, reject) => {
      this.hubConnection!.on('NotifyTaskRequestId', (id: string, taskId: string) => {
        if (id === requestId) {
          resolve(taskId);
        }
      });
    });
  }
}
