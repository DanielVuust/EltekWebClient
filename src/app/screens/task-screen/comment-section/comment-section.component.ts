import { Component } from '@angular/core';
import { TaskService } from '../../../services/task-service/task.service';
import { Store } from '@ngrx/store';
import { TaskState } from '../../../classes/state-classes/task-state';
import { Observable } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SnackbarService } from '../../../services/snackbar-service/snackbar.service';
import { OrderByPipe } from "../../../pipes/order-by.pipe";
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-comment-section',
  imports: [MatProgressBarModule, MatListModule, MatCardModule, MatIconModule, MatDividerModule, CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule, MatProgressSpinnerModule, OrderByPipe],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.scss',
  standalone: true
})
export class CommentSectionComponent {
task$: Observable<TaskState>;
newComment: string = "";
  constructor(public taskService: TaskService, private store: Store<{ task: TaskState }>) {
    this.task$ = store.select('task');
  }

  saveComment() {
    this.taskService.addTaskComment(this.newComment);
    this.newComment = "";
  }
  deleteComment(commentId: string) {
    this.taskService.deleteTaskComment(commentId);
  }


}
