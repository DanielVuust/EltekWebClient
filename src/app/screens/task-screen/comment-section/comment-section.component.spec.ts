import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentSectionComponent } from './comment-section.component';
import { provideStore, StoreModule } from '@ngrx/store';
import { taskListReducer } from '../../../state/task-list-screen/task-list.reducer';
import { taskReducer } from '../../../state/task-screen/task.reducer';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideRouter } from '@angular/router';
import { getAuth } from '@firebase/auth';
import { routes } from '../../../app.routes';
import { environment } from '../../../config/appsettings';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('CommentSectionComponent', () => {
  let component: CommentSectionComponent;
  let fixture: ComponentFixture<CommentSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentSectionComponent,],
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

    fixture = TestBed.createComponent(CommentSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('call saveComment should call addComment', async () => {
    spyOn(component.taskService, 'addTaskComment').and.returnValue(Promise.resolve());
    await component.saveComment();
    expect(component.taskService.addTaskComment).toHaveBeenCalled();
  });
  it('call deleteComment should call deleteComment', async () => {
    spyOn(component.taskService, 'deleteTaskComment').and.returnValue(Promise.resolve());
    await component.deleteComment("id");
    expect(component.taskService.deleteTaskComment).toHaveBeenCalled();
  });
});
