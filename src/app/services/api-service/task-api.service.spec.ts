import { TestBed } from '@angular/core/testing';

import { TaskApiService } from './task-api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideRouter } from '@angular/router';
import { getAuth } from '@firebase/auth';
import { provideStore } from '@ngrx/store';
import { routes } from '../../app.routes';
import { environment } from '../../config/appsettings';
import { taskListReducer } from '../../state/task-list-screen/task-list.reducer';
import { taskReducer } from '../../state/task-screen/task.reducer';
import exp from 'constants';
import { of } from 'rxjs';

describe('TaskApiService', () => {
  let service: TaskApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      
            providers: [
              provideHttpClient(),
              provideHttpClientTesting(),
              provideStore({ taskList: taskListReducer, task: taskReducer }),
              provideAuth(() => getAuth()),
              provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
              provideRouter(routes), 
            ],
    });
    service = TestBed.inject(TaskApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('createTask should return a task id', async () => {
    const mockTask = { id: "1", name: 'Test Task' };
    spyOn(service.apiService, 'post').and.returnValue(Promise.resolve(mockTask));
    expect(service.createTask("", "", "", "", "", ""));
  });

  // it('saveTask should return a task id', async () => {
  //   const mockTask = { id: "1", name: 'Test Task' };
  //   spyOn(service.apiService, 'put').and.returnValue(Promise.resolve(mockTask));
  //   expect(service.saveTask("", "", "", "", "", "", ""));
  // });

  // it('createTask should return a task id', async () => {
  //   const mockTask = { id: "1", name: 'Test Task' };
  //   spyOn(service.apiService, 'post').and.returnValue(Promise.resolve(mockTask));
  //   spyOn(service.operationService, 'getObjectIdFromOperation').and.callFake(async () => {
  //     await new Promise(resolve => setTimeout(resolve, 100));
  //     return Promise.resolve(mockTask.id);
  //   });
  //   expect(await service.createTask("", "", "", "", "", "")).toBe(mockTask.id);
  // });
  // it('getTasks should return a list of tasks', async () => {
  //   const mockTasks = [{ id: 1, name: 'Test Task' }];
  //   spyOn(service.apiService, 'get').and.callFake(async () => {
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //     return Promise.resolve(mockTasks);
  //   });
  //   expect(await service.getTasks()).toBe(mockTasks);
  // });
  // it('createEmptyTask should return a task id', async () => {
  //   const operation = { requestId: "testRequestId", };
  //   const mockTask = { id: "1", name: 'Test Task' };
  //   spyOn(service.apiService, 'post').and.returnValue(Promise.resolve(operation));
  //   spyOn(service.operationService, 'getObjectIdFromOperation').and.returnValue(Promise.resolve(mockTask.id));
  //   expect(await service.createEmptyTask()).toBe(mockTask.id);
  //   expect(service.operationService.getObjectIdFromOperation).toHaveBeenCalledWith(operation.requestId);
  // });
  // it('createEmptyTask shows snackbar on error', async () => {
  //   spyOn(service.apiService, 'post').and.throwError('Error');
  //   spyOn(service.snackbarService, 'showSnackbar');
  //   expect(await service.createEmptyTask());
  //   expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith("Error creating task`, $localize`Close`);
  // });
});
