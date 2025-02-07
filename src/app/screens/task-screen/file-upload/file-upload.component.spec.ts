import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';
import { taskReducer } from '../../../state/task-screen/task.reducer';
import { taskListReducer } from '../../../state/task-list-screen/task-list.reducer';
import { provideStore, StoreModule } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideRouter } from '@angular/router';
import { getAuth } from '@firebase/auth';
import { routes } from '../../../app.routes';
import { environment } from '../../../config/appsettings';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadComponent,],
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

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onFileSelected should call addTaskPhotos', async () => {
    spyOn(component.taskService, 'addTaskPhotos').and.returnValue(Promise.resolve());
    await component.onFileSelected(new Event(''));
    expect(component.taskService.addTaskPhotos).toHaveBeenCalled();
  });
});
