import { TestBed } from '@angular/core/testing';

import { TaskListService as TaskListService } from './task-list.service';
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
import { TaskModel } from '../../classes/data-classes/task-model';

describe('TaskListStateService', () => {
  let service: TaskListService;

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
    service = TestBed.inject(TaskListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loadTaskList should return a list of tasks', async () => {
    const mockTasks = [{ id: 1, name: 'Test Task' }];
    spyOn(service.taskApiService, 'getTasks').and.returnValue(Promise.resolve(mockTasks));
    expect(await service.loadTasks());
  });
  it('loadTaskList should show snackbar on error', async () => {
    const mockTasks = [{ id: 1, name: 'Test Task' }];
    spyOn(service.taskApiService, 'getTasks').and.throwError('Error');
    spyOn(service.snackbarService, 'showSnackbar');
    expect(await service.loadTasks());
    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith($localize`Error loading tasks`, $localize`Close`);
  });

  it('deleteTask should delete a task', async () => {
    const mockTask = new TaskModel("id", "name", "description", "status", "userId", "location");
    spyOn(service.taskApiService, 'deleteTask').and.returnValue(Promise.resolve(mockTask));
    spyOn(service, 'loadTasks').and.returnValue(Promise.resolve());
    expect(await service.removeTask(mockTask as TaskModel));
  });
  it('deleteTask should show snackbar on error', async () => {
    const mockTask = new TaskModel("id", "name", "description", "status", "userId", "location");
    spyOn(service.taskApiService, 'deleteTask').and.throwError('Error');
    spyOn(service.snackbarService, 'showSnackbar');
    spyOn(service, 'loadTasks').and.returnValue(Promise.resolve());
    expect(await service.removeTask(mockTask as TaskModel));
    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith($localize`Error removing task`, $localize`Close`);
  });  
});
