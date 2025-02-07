import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideRouter } from '@angular/router';
import { getAuth } from '@firebase/auth';
import { provideStore } from '@ngrx/store';
import { routes } from '../../../app.routes';
import { environment } from '../../../config/appsettings';
import { taskListReducer } from '../../../state/task-list-screen/task-list.reducer';
import { taskReducer } from '../../../state/task-screen/task.reducer';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';

describe('ConfirmDeleteDialogComponent', () => {
  let component: ConfirmDeleteDialogComponent;
  let fixture: ComponentFixture<ConfirmDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteDialogComponent],
            providers: [
                    provideHttpClient(),
                    provideHttpClientTesting(),
                    provideStore({ taskList: taskListReducer, task: taskReducer }),
                    provideAuth(() => getAuth()),
                    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
                    provideRouter(routes), 
                    { provide: MAT_DIALOG_DATA, useValue: {} }
                  ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
