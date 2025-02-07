import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { Auth, getAuth, provideAuth } from '@angular/fire/auth';
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
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ],
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

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('register should validate form and return if invalid', async () => {
    spyOnProperty(component.registerForm, 'valid').and.returnValue(false);
    spyOn(component.registerForm, 'markAllAsTouched');
    expect(await component.register()).toBe(undefined);
    expect(component.registerForm.markAllAsTouched).toHaveBeenCalled();
  });
  it('regiser should call router.navigate on valid form', async () => {
    spyOnProperty(component.registerForm, 'valid').and.returnValue(true);
    spyOn(component.registerForm, 'value').and.returnValue({ email: ' ', password: ' ' });
    spyOn(component, 'createUserWithEmailAndPasswordWrapper').and.returnValue(Promise.resolve({ user: {} } as UserCredential));
    spyOn(component.router, 'navigate');
    await component.register();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('register should catch email already in use error', async () => {
    spyOnProperty(component.registerForm, 'valid').and.returnValue(true);
    spyOn(component.registerForm, 'value').and.returnValue({ email: ' ', password: ' ' });
    spyOn(component, 'createUserWithEmailAndPasswordWrapper').and.callFake(() => {
      return Promise.reject({ code: 'auth/email-already-in-use' });
    });
    spyOn(component.router, 'navigate');
    await component.register();
    expect(component.router.navigate).not.toHaveBeenCalled();
  });

  it('register should catch invalid email error', async () => {
    spyOnProperty(component.registerForm, 'valid').and.returnValue(true);
    spyOn(component.registerForm, 'value').and.returnValue({ email: ' ', password: ' ' });
    spyOn(component, 'createUserWithEmailAndPasswordWrapper').and.callFake(() => {
      return Promise.reject({ code: 'auth/invalid-email' });
    });
    spyOn(component.router, 'navigate');
    await component.register();
    expect(component.router.navigate).not.toHaveBeenCalled();
  });

  it('register should catch weak password error', async () => {
    spyOnProperty(component.registerForm, 'valid').and.returnValue(true);
    spyOn(component.registerForm, 'value').and.returnValue({ email: ' ', password: ' ' });
    spyOn(component, 'createUserWithEmailAndPasswordWrapper').and.callFake(() => {
      return Promise.reject({ code: 'auth/weak-password' });
    });
    spyOn(component.router, 'navigate');
    await component.register();
    expect(component.router.navigate).not.toHaveBeenCalled();
  });

  it('register should catch missing password error', async () => {
    spyOnProperty(component.registerForm, 'valid').and.returnValue(true);
    spyOn(component.registerForm, 'value').and.returnValue({ email: ' ', password: ' ' });
    spyOn(component, 'createUserWithEmailAndPasswordWrapper').and.callFake(() => {
      return Promise.reject({ code: 'auth/missing-password' });
    });
    spyOn(component.router, 'navigate');
    await component.register();
    expect(component.router.navigate).not.toHaveBeenCalled();
  });

  it('register should catch generic error', async () => {
    spyOnProperty(component.registerForm, 'valid').and.returnValue(true);
    spyOn(component.registerForm, 'value').and.returnValue({ email: ' ', password: ' ' });
    spyOn(component, 'createUserWithEmailAndPasswordWrapper').and.callFake(() => {
      return Promise.reject({ code: 'unknown-error' });
    });
    spyOn(component.router, 'navigate');
    await component.register();
    expect(component.router.navigate).not.toHaveBeenCalled();
  });
});
