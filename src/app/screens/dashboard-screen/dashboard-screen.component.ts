import { CommonModule } from '@angular/common';
import { Component, signal,  } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AuthComponent } from '../auth/auth.component';
import { Observable } from 'rxjs';
import { TaskListState } from '../../classes/state-classes/task-list-state';
import { Store } from '@ngrx/store';
import { TaskListService } from '../../services/task-list-service/task-list.service';
import {MatExpansionModule} from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { UserModel } from '../../classes/data-classes/user-model';

@Component({
  selector: 'app-dashboard-screen',
  imports: [RouterModule, MatExpansionModule, MatListModule, MatIconModule, MatDividerModule, MatButtonModule, MatCardModule, MatDialogModule, CommonModule, AuthComponent, MatPaginatorModule, MatSortModule, MatTableModule, MatInputModule, MatFormFieldModule, ],
  templateUrl: './dashboard-screen.component.html',
  styleUrl: './dashboard-screen.component.scss',
  standalone: true,
})
export class DashboardScreenComponent {
  
  taskList$: Observable<TaskListState>;
  users: UserModel[] = [];
  readonly panelOpenState = signal(false);
  readonly statuses = [{label: "New", value: "New"}, {label: "In-Progress", value: "InProgress"}, {label: "Done", value: "Done"}];

    constructor(private taskService: TaskListService, private store: Store<{ taskList: TaskListState }>) {
      this.taskList$ = store.select('taskList');
      this.taskList$.subscribe((taskList) => {
        this.users = taskList.users;
        console.log(this.users);
      });
    }
    ngOnInit() {
      this.taskService.loadTasks();
      this.taskService.loadUsers();
    }
    getUserName(userId: string): string | undefined {
      const user = this.users.find(x => x.userId === userId);
      return user ? user.name : 'Unknown';
    }
    
}
