import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../config/appsettings';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | undefined;

  constructor() {}

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.backendWorkerUrl) 
      .build();

    this.hubConnection
      .start()
      .then(() =>{
        console.log('SignalR Connection started')
      })
      .catch(err => console.log('Error establishing SignalR connection: ' + err));
  }

  public waitForRequestId = (requestId: string) => {
    return new Promise<string>((resolve, reject) => {
      this.hubConnection!.on('NotifyTaskRequestId', (id: string, taskId: string) => {
        console.log(`Request ID: ${id}, Task ID: ${taskId}`);
        if (id === requestId) {
          console.log(`Request ID: ${id}, is done`);
          resolve(taskId);
        }
      });
    });
  }
}
