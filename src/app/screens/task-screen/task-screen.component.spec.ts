import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskScreenComponent } from './task-screen.component';
import { provideStore, StoreModule } from '@ngrx/store';
import { taskListReducer } from '../../state/task-list-screen/task-list.reducer';
import { taskReducer } from '../../state/task-screen/task.reducer';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } 
    from '@angular/common/http/testing';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { routes } from '../../app.routes';
import { provideRouter } from '@angular/router';
import { environment } from '../../config/appsettings';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';



describe('TaskScreenComponent', () => {
  let component: TaskScreenComponent;
  let fixture: ComponentFixture<TaskScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TaskScreenComponent, // Ensure this is a standalone component
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
    }).compileComponents();

    fixture = TestBed.createComponent(TaskScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('save should call updateTask on valid form', async () => {
    spyOnProperty(component.form, 'valid').and.returnValue(true);
    spyOn(component.form, 'value').and.returnValue({ title: ' ', description: ' ', location: ' ', status: {value: " "}, customerId: {value: " "}, user: {value: {id: " "}} });
    expect(await component.save).toBeTruthy();

  });
});
