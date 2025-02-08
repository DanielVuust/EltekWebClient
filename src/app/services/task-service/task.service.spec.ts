import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
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
import { TaskState } from '../../classes/state-classes/task-state';
import { TaskModel } from '../../classes/data-classes/task-model';
import { provideAnimations } from '@angular/platform-browser/animations';
import exp from 'constants';
import { EffectRef } from '@angular/core';

describe('TaskService', () => {
  let service: TaskService;

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
              provideAnimations(),
            ],
    });
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should validate the task', async () => {
    const task = new TaskModel();
    task.id = '1';
    service.taskState = new TaskState(task);
    expect(await service.validateTask()).toBeTrue();
  });
  it('should not validate the task', async () => {
    const task = new TaskModel();
    task.id = undefined;
    service.taskState = new TaskState(task);
    expect(await service.validateTask()).toBeFalse();
  });

  it('loadTask should return a task', async () => {
    const mockTask = new TaskModel("id", "name", "description", "status", "userId", "location");
    spyOn(service.taskApiService, 'getTask').and.returnValue(Promise.resolve(mockTask));
    expect(await service.loadTask("id"));
  });
  it('loadTask should show snackbar on error', async () => {
    spyOn(service.taskApiService, 'getTask').and.throwError('Error');
    spyOn(service.snackbarService, 'showSnackbar');
    expect(await service.loadTask("id"));
    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith( 'Error loading task', 'Close' );
  });
  it("loadTask should show snackbar if get tasks fails", async () => {
    spyOn(service.taskApiService, 'getTask').and.throwError('Error');
    spyOn(service, 'validateTask').and.returnValue(Promise.resolve(true));
    spyOn(service.snackbarService, 'showSnackbar');
    expect(await service.loadTask("id"));
    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith($localize`Error loading task`, $localize`Close`);
  });
  it('loadTask should repect new tasks', async () => {
    spyOn(service.store, 'dispatch');
    expect(await service.loadTask("new")).toBeUndefined();
    expect(service.store.dispatch).toHaveBeenCalledTimes(2);
  });

  
  // #region saveTask
  it('saveTask should call saveTask on taskApiService', async () => {
    const task = new TaskModel();
    task.id = '1';
    service.taskState = new TaskState(task);
    spyOn(service.taskApiService, 'saveTask').and.returnValue(Promise.resolve("id"));
    spyOn(service, 'loadTask').and.returnValue(Promise.resolve());
    expect(await service.saveTask("title", "description", "location", "status", "customerId", "user"));
    expect(service.taskApiService.saveTask).toHaveBeenCalled();
  });
  it('saveTask should show snackbar on error', async () => {
    const task = new TaskModel();
    task.id = '1';
    service.taskState = new TaskState(task);
    spyOn(service.taskApiService, 'saveTask').and.throwError('Error');
    spyOn(service.snackbarService, 'showSnackbar');
    spyOn(service, 'loadTask').and.returnValue(Promise.resolve());
    expect(await service.saveTask("title", "description", "location", "status", "customerId", "user"));
    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith($localize`Error saving task`, $localize`Close`);
  });
  it('saveTask should repect new tasks', async () => {
    const task = new TaskModel();
    task.id = 'new';
    service.taskState = new TaskState(task);
    service.taskState.task = task;
    spyOn(service.taskApiService, 'createTask').and.returnValue(Promise.resolve("id"));
    spyOn(service, 'loadTask').and.returnValue(Promise.resolve());
    spyOn(service.store, 'dispatch').and.returnValue(Promise.resolve() as unknown as EffectRef);
    expect(await service.saveTask("title", "description", "location", "status", "customerId", "user"));
    expect(service.taskApiService.createTask).toHaveBeenCalled();
  });
  // #endregion saveTask

  // #region loadTaskPhotos
  it('loadTaskPhotos should return when validation fails', async () => {
    spyOn(service, 'validateTask').and.returnValue(Promise.resolve(false));
    expect(await service.loadTaskPhotos());
  });
  it('loadTaskPhotos should call getTask on taskApiService', async () => {
    const task = new TaskModel();
    task.id = '1';
    service.taskState = new TaskState(task);
    spyOn(service.taskApiService, 'getTask').and.returnValue(Promise.resolve(task));
    expect(await service.loadTaskPhotos());
    expect(service.taskApiService.getTask).toHaveBeenCalled();
  });
  it('loadTaskPhotos should show snackbar on error', async () => {
    const task = new TaskModel();
    task.id = '1';
    service.taskState = new TaskState(task);
    spyOn(service.taskApiService, 'getTask').and.throwError('Error');
    spyOn(service.snackbarService, 'showSnackbar');
    expect(await service.loadTaskPhotos());
    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith($localize`Error`, $localize`Close`);
  });
  it('LoadTaskPhotos should show snackbar if task is null', async () => {
    
    spyOn(service, 'validateTask').and.returnValue(Promise.resolve(true));
    spyOn(service.taskApiService, 'getTask').and.returnValue(Promise.resolve(null!));
    spyOn(service.snackbarService, 'showSnackbar');
    
    await service.loadTaskPhotos();
    
    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith($localize`Task not found`, $localize`Close`);
  });
  // #endregion loadTaskPhotos

  // #region addTaskPhotos
  it('addTaskPhotos should return when validation fails', async () => {
    spyOn(service, 'validateTask').and.returnValue(Promise.resolve(false));
    expect(await service.addTaskPhotos([]));
  });
  it('addTaskPhotos should call addTaskPhotos on taskApiService', async () => {
    const task = new TaskModel();
    task.id = '1';
    service.taskState = new TaskState(task);
    spyOn(service.taskApiService, 'addPhoto').and.returnValue(Promise.resolve("result"));
    spyOn(service, 'loadTaskPhotos').and.returnValue(Promise.resolve());
    expect(await service.addTaskPhotos([new File([], "test")]));
    expect(service.taskApiService.addPhoto).toHaveBeenCalled();
  });
  it('addTaskPhotos should show snackbar on error', async () => {
    const task = new TaskModel();
    task.id = '1';
    service.taskState = new TaskState(task);
    spyOn(service.taskApiService, 'addPhoto').and.throwError('Error');
    spyOn(service.snackbarService, 'showSnackbar');
    spyOn(service, 'loadTaskPhotos').and.returnValue(Promise.resolve());
    await service.addTaskPhotos([new File([], "test")]).catch(() => {});
    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith($localize`Error adding photo`, $localize`Close`);
  });
  // todo fix this test
  // it('addTaskPhotos should show snackbar on error reading file', async () => {
  //   const task = new TaskModel();
  //   task.id = '1';
  //   service.taskState = new TaskState(task);
  //   spyOn(service.snackbarService, 'showSnackbar');
  //   spyOn(service, 'loadTaskPhotos').and.returnValue(Promise.resolve());
  //   await service.addTaskPhotos([new File([], "test")]).catch(() => {});
  //   expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith("Error reading file`, $localize`Close`);
  // });

  // #endregion addTaskPhotos

  // #region removeTaskPhoto
  it('removeTaskPhoto should return when validation fails', async () => {
    spyOn(service, 'validateTask').and.returnValue(Promise.resolve(false));
    expect(await service.removeTaskPhoto({}));
  });
  it('removeTaskPhoto should call removeTaskPhoto on taskApiService', async () => {
    const task = new TaskModel();
    task.id = '1';
    service.taskState = new TaskState(task);
    spyOn(service.store, 'dispatch');
    await service.removeTaskPhoto({});
    expect(service.store.dispatch).toHaveBeenCalled();
  });
  // #endregion removeTaskPhoto

  // #region loadTaskCommets
  it('loadTaskCommets should return when validation fails', async () => {
    spyOn(service, 'validateTask').and.returnValue(Promise.resolve(false));
    expect(await service.loadTaskCommets());
  });
  it('loadTaskCommets should call getTask on taskApiService', async () => {
    const task = new TaskModel();
    task.id = '1';
    service.taskState = new TaskState(task);
    spyOn(service.taskApiService, 'getTask').and.returnValue(Promise.resolve(task));
    expect(await service.loadTaskCommets());
    expect(service.taskApiService.getTask).toHaveBeenCalled();
  });
  it('loadTaskCommets should show snackbar on error', async () => {
    const task = new TaskModel();
    task.id = '1';
    service.taskState = new TaskState(task);
    spyOn(service.taskApiService, 'getTask').and.throwError('Error');
    spyOn(service.snackbarService, 'showSnackbar');
    expect(await service.loadTaskCommets());
    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith($localize`Error loading comments`, $localize`Close`);
  });
  it('loadTaskCommets should show snackbar if task is null', async () => {
    
    spyOn(service, 'validateTask').and.returnValue(Promise.resolve(true));
    spyOn(service.taskApiService, 'getTask').and.returnValue(Promise.resolve(null!));
    spyOn(service.snackbarService, 'showSnackbar');
    
    await service.loadTaskCommets();
    
    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith($localize`Task not found`, $localize`Close`);
  });
  // #endregion loadTaskCommets

  // #region addTaskComment
  it('addTaskComment should return when validation fails', async () => {
    spyOn(service, 'validateTask').and.returnValue(Promise.resolve(false));
    expect(await service.addTaskComment("comment"));
  });
  it('addTaskComment should call createComment on taskApiService', async () => {
    const task = new TaskModel();
    task.id = '1';
    service.taskState = new TaskState(task);
    spyOn(service.taskApiService, 'createComment').and.returnValue(Promise.resolve("result"));
    spyOn(service.store, 'dispatch');
    spyOn(service, 'loadTaskCommets').and.returnValue(Promise.resolve());
    expect(await service.addTaskComment("comment"));
    expect(service.taskApiService.createComment).toHaveBeenCalled();
  });
  it('addTaskComment should show snackbar on error', async () => {
    const task = new TaskModel();
    task.id = '1';
    service.taskState = new TaskState(task);
    spyOn(service.taskApiService, 'createComment').and.throwError('Error');
    spyOn(service.snackbarService, 'showSnackbar');
    await service.addTaskComment("comment");
    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith($localize`Error adding comment`, $localize`Close`);
  });
  // #endregion addTaskComment

  // #region deleteTaskComment
  it('deleteTaskComment should return when validation fails', async () => {
    spyOn(service, 'validateTask').and.returnValue(Promise.resolve(false));
    expect(await service.deleteTaskComment("comment"));
  });
  it('deleteTaskComment should call deleteComment on taskApiService', async () => {
    const task = new TaskModel();
    task.id = '1';
    service.taskState = new TaskState(task);
    spyOn(service.taskApiService, 'deleteComment').and.returnValue(Promise.resolve("id"));
    spyOn(service.store, 'dispatch');
    spyOn(service, 'loadTaskCommets').and.returnValue(Promise.resolve());
    expect(await service.deleteTaskComment("comment"));
    expect(service.taskApiService.deleteComment).toHaveBeenCalled();
  });
  it('deleteTaskComment should show snackbar on error', async () => {
    const task = new TaskModel();
    task.id = '1';
    service.taskState = new TaskState(task);
    spyOn(service.taskApiService, 'deleteComment').and.throwError('Error');
    spyOn(service.snackbarService, 'showSnackbar');
    await service.deleteTaskComment("comment");
    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith($localize`Error deleting comment`, $localize`Close`);
  });
  // #endregion deleteTaskComment

  // #region loadCustomers
  it('loadCustomers should call getCustomers on customerService', async () => {
    spyOn(service.taskApiService, 'getCustomers').and.returnValue(Promise.resolve([]));
    await service.loadCustomers();
    expect(service.taskApiService.getCustomers).toHaveBeenCalled();
  });
  it('loadCustomers should show snackbar on error', async () => {
    spyOn(service.taskApiService, 'getCustomers').and.throwError('Error');
    spyOn(service.snackbarService, 'showSnackbar');
    await service.loadCustomers();
    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith($localize`Error loading customers`, $localize`Close`);
  });
  // #endregion loadCustomers


  // #region loadUsers
  it('loadUsers should call getUsers on userService', async () => {
    spyOn(service.taskApiService, 'getUsers').and.returnValue(Promise.resolve([]));
    await service.loadUsers();
    expect(service.taskApiService.getUsers).toHaveBeenCalled();
  });
  it('loadUsers should show snackbar on error', async () => {
    spyOn(service.taskApiService, 'getUsers').and.throwError('Error');
    spyOn(service.snackbarService, 'showSnackbar');
    await service.loadUsers();
    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith($localize`Error loading users`, $localize`Close`);
  });
});
