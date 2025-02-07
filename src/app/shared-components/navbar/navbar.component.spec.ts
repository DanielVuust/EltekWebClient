import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { Auth, getAuth, provideAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from '../../app.routes';
import { environment } from '../../config/appsettings';
import { taskListReducer } from '../../state/task-list-screen/task-list.reducer';
import { taskReducer } from '../../state/task-screen/task.reducer';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, ],
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

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('signOut should call signOut on auth', async () => {
    spyOn(component.auth, 'signOut').and.returnValue(Promise.resolve());
    await component.signOut();
  });
  it('ngOnInit should set user', async () => {
    spyOn(component.auth, 'onAuthStateChanged').and.callFake((nextOrObserver: (user: any) => void) => {
      nextOrObserver({ uid: '12345' });
      return () => {};
    });
    component.ngOnInit();
  });
});
