import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { Auth, getAuth, provideAuth, User } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from '../../app.routes';
import { environment } from '../../config/appsettings';
import { taskListReducer } from '../../state/task-list-screen/task-list.reducer';
import { taskReducer } from '../../state/task-screen/task.reducer';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthComponent],
            providers: [
                    provideHttpClient(),
                    provideHttpClientTesting(),
                    provideStore({ taskList: taskListReducer, task: taskReducer }),
                    provideAuth(() => getAuth()),
                    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
                    provideRouter(routes), 
                  ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('user should return currentUser', async () => {
    expect(component.user);
  });

  it('should not redirect if user is not logged in', () => {
    const auth = TestBed.inject(Auth);
    spyOn(auth, 'onAuthStateChanged').and.callFake((nextOrObserver: (user: User | null) => void) => {
      nextOrObserver({ uid: '12345' } as User);
      return () => {};
    });
    spyOn(component.router, 'navigate');
    expect(component.ngOnInit());
    expect(component.router.navigate).not.toHaveBeenCalled();
  });
});
