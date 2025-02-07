import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, user } from '@angular/fire/auth';
import { provideRouter } from '@angular/router';
import { getAuth } from '@firebase/auth';
import { provideStore } from '@ngrx/store';
import { routes } from '../../app.routes';
import { environment } from '../../config/appsettings';
import { taskListReducer } from '../../state/task-list-screen/task-list.reducer';
import { taskReducer } from '../../state/task-screen/task.reducer';
import { Observable } from 'rxjs';

describe('ApiService', () => {
  let service: ApiService;

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
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('post should return a promise', async () => {
    const url = 'testUrl';
    const data = { test: 'test' };
    spyOn(service.http, 'post').and.returnValue(new Observable());
    spyOn(service, "currentUserJwt").and.returnValue(Promise.resolve('test'));
    expect(await service.post(url, data));
  });
  it('put should return a promise', async () => {
    const url = 'testUrl';
    const data = { test: 'test' };
    spyOn(service.http, 'put').and.returnValue(new Observable());
    spyOn(service, "currentUserJwt").and.returnValue(Promise.resolve('test'));
    expect(await service.put(url, data));
  });
  it('patch should return a promise', async () => {
    const url = 'testUrl';
    const data = { test: 'test' };
    spyOn(service.http, 'patch').and.returnValue(new Observable());
    spyOn(service, "currentUserJwt").and.returnValue(Promise.resolve('test'));
    expect(await service.patch(url, data));
  });

  it('delete should return a promise', async () => {
    const url = 'testUrl';
    spyOn(service.http, 'delete').and.returnValue(new Observable());
    spyOn(service, "currentUserJwt").and.returnValue(Promise.resolve('test'));
    expect(await service.delete(url));
  });
//Todo fix this test
  // it('currentUserJwt should return a promise', async () => {
  //   spyOnProperty(service.auth, 'currentUser').and.returnValue(undefined!);
  //   expect(await service.currentUserJwt());
  // });
});
