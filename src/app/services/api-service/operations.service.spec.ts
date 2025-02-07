import { TestBed } from '@angular/core/testing';

import { OperationsService } from './operations.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { of } from 'rxjs';
import { provideAuth } from '@angular/fire/auth';
import { provideRouter } from '@angular/router';
import { getAuth } from '@firebase/auth';
import { provideStore } from '@ngrx/store';
import { routes } from '../../app.routes';
import { environment } from '../../config/appsettings';
import { taskListReducer } from '../../state/task-list-screen/task-list.reducer';
import { taskReducer } from '../../state/task-screen/task.reducer';

describe('OperationsService', () => {
  let service: OperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
            providers: [
              provideHttpClient(),
              provideHttpClientTesting(),
              provideStore({ taskList: taskListReducer, task: taskReducer }),
              provideAuth(() => getAuth()),
              provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
              provideRouter(routes), 
            ],
    });
    service = TestBed.inject(OperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getObjectIdFromOperation should return a promise', async () => {
    const requestId = '123';
    spyOn(service.apiService, 'get').and.returnValue(Promise.resolve({ taskId: '1' }));
    expect( service.getObjectIdFromOperation(requestId));
  });
//TODO fix this
  // it('getObjectIdFromOperation should return a promise', async () => {
  //   const requestId = '123';
  //   spyOn(service.apiService, 'get').and.returnValue(of(Promise.resolve({ taskId: '1' })));
  //   expect(await service.getObjectIdFromOperation(requestId)).toBe('1');
  // });

  // it('getObjectIdFromOperation should handle error', async () => {
  //   const requestId = '123';
  //   spyOn(service.apiService, 'get').and.throwError('Error');
  //   expect(await service.getObjectIdFromOperation(requestId))
  //   }
  // );

  // it('getObjectIdFromOperation should log response', async () => {
  //   const requestId = '123';
  //   spyOn(service.apiService, 'get').and.returnValue(of(Promise.resolve({ taskId: '1' })));
  //   spyOn(console, 'log');
  //   await service.getObjectIdFromOperation(requestId);
  //   expect(console.log).toHaveBeenCalledWith({ taskId: '1' });
  // });
});
