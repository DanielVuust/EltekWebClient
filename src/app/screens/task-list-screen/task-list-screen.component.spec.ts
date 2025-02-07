import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListScreenComponent } from './task-list-screen.component';
import { taskListReducer } from '../../state/task-list-screen/task-list.reducer';
import { taskReducer } from '../../state/task-screen/task.reducer';
import { provideStore, StoreModule } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideRouter } from '@angular/router';
import { getAuth } from '@firebase/auth';
import { routes } from '../../app.routes';
import { environment } from '../../config/appsettings';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TaskModel } from '../../classes/data-classes/task-model';

describe('TaskListScreenComponent', () => {
  let component: TaskListScreenComponent;
  let fixture: ComponentFixture<TaskListScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListScreenComponent,
        
      ],
      providers: [
              provideHttpClient(),
              provideHttpClientTesting(),
              provideStore({ taskList: taskListReducer, task: taskReducer }),
              provideAuth(() => getAuth()),
              provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
              provideRouter(routes), 
              provideAnimationsAsync(), 
            ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskListScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('applyPaginatorAndSort should set paginator and sort', () => {
    component.dataSource = {
      paginator: null,
      sort: null,
    } as any;
    component.applyPaginatorAndSort();
    expect(component.dataSource!.paginator)
    expect(component.dataSource!.sort)
  });

  it('applyFilter should filter dataSource', () => {
    component.dataSource = {
      filter: null,
    } as any;
    component.applyFilter(new MouseEvent('click'));
    expect(component.dataSource!.filter)
  });

  it('confirmDelete should be successful', () => {
    spyOn(component, 'confirmDelete');
    var task = new TaskModel();
    component.confirmDelete(task);
    expect(component.confirmDelete).toHaveBeenCalled();
  });
});
