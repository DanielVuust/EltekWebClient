import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { AuthModule, getAuth, provideAuth, updateProfile } from '@angular/fire/auth';
import { FirebaseApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from '../../app.routes';
import { environment } from '../../config/appsettings';
import { taskListReducer } from '../../state/task-list-screen/task-list.reducer';
import { taskReducer } from '../../state/task-screen/task.reducer';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent,],
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

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should mark all fields as touched if form is invalid', async () => {
    spyOnProperty(component.profileForm, 'valid').and.returnValue(false);
    spyOn(component.profileForm, 'markAllAsTouched');
    expect(await component.save()).toBe(undefined);
    expect(component.profileForm.markAllAsTouched).toHaveBeenCalled();
  });
  it('save should call updateProfile on valid form', async () => {
    spyOnProperty(component.profileForm, 'valid').and.returnValue(true);
    spyOn(component.profileForm, 'value').and.returnValue({ displayName: ' ' });
    spyOn(component, 'updateProfileWrapper').and.returnValue(Promise.resolve());
    await component.save();
  });
});
