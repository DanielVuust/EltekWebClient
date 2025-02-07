import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { Auth, getAuth, provideAuth, signInWithEmailAndPassword as test2222, UserCredential} from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from '../../../app.routes';
import { environment } from '../../../config/appsettings';
import { taskListReducer } from '../../../state/task-list-screen/task-list.reducer';
import { taskReducer } from '../../../state/task-screen/task.reducer';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent,],
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

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login should validate form and return if invalid', async () => {
    spyOnProperty(component.loginForm, 'valid').and.returnValue(false);
    spyOn(component.loginForm, 'markAllAsTouched');
    expect(await component.login()).toBe(undefined);
    expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
  });
  it('should call signInWithEmailAndPassword on valid form', async () => {
    spyOnProperty(component.loginForm, 'valid').and.returnValue(true);
    spyOn(component.loginForm, 'value').and.returnValue({ email: 'test@example.com', password: 'password123' });
    const signInSpy = spyOn(component, "signInWithEmailAndPasswordWrapper").and.returnValue(Promise.resolve({ user: {} } as UserCredential));
    spyOn(component.router, 'navigate');
    await component.login();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('login should catch error', async () => {
    spyOnProperty(component.loginForm, 'valid').and.returnValue(true);
    spyOn(component.loginForm, 'value').and.returnValue({ email: 'test@example.com', password: 'password123' });
    const signInSpy = spyOn(component, "signInWithEmailAndPasswordWrapper").and.callFake(() => {
        return Promise.reject({ code: 'auth/invalid-credential' });
    });
    spyOn(component.router, 'navigate');

    await component.login();
    expect(component.router.navigate).not.toHaveBeenCalled();
  });

  it('login should catch error2', async () => {
    spyOnProperty(component.loginForm, 'valid').and.returnValue(true);
    spyOn(component.loginForm, 'value').and.returnValue({ email: 'test@example.com', password: 'password123' });
    const signInSpy = spyOn(component, "signInWithEmailAndPasswordWrapper").and.callFake(() => {
        return Promise.reject({ code: 'error' });
    });
    spyOn(component.router, 'navigate');

    await component.login();
    expect(component.router.navigate).not.toHaveBeenCalled();
  });

});
