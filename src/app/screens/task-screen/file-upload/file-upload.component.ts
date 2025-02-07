import { Component, } from '@angular/core';
import { Observable, } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TaskService } from '../../../services/task-service/task.service';
import { TaskState } from '../../../classes/state-classes/task-state';
import { Store } from '@ngrx/store';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatDividerModule, MatListModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  standalone: true
})
export class FileUploadComponent {
  task$: Observable<TaskState>;
  constructor(public taskService: TaskService, private store: Store<{ task: TaskState }>) {
    this.task$ = store.select('task');
  }

  onFileSelected(event: any) {
    this.taskService.addTaskPhotos(event.target?.files);
  }


}