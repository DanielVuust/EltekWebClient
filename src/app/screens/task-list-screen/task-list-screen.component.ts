import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { Observable } from 'rxjs';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule, DatePipe} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TaskListState } from '../../classes/state-classes/task-list-state';
import { TaskListService } from '../../services/task-list-service/task-list.service';
import { TaskModel } from '../../classes/data-classes/task-model';
import { Store } from '@ngrx/store';
import { AuthComponent } from "../auth/auth.component";
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-task-list-screen',
  imports: [MatProgressBarModule, MatListModule, MatIconModule, MatDividerModule, MatButtonModule, MatCardModule, MatDialogModule, RouterLink, CommonModule, AuthComponent, MatPaginatorModule, MatSortModule, MatTableModule, MatInputModule, MatFormFieldModule],
  templateUrl: './task-list-screen.component.html',
  styleUrl: './task-list-screen.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListScreenComponent {
  displayedColumns: string[] = ['open_button', 'title', 'createdUtc', 'delete_button'];
  dataSource: MatTableDataSource<TaskModel> | undefined;
  lastFilterEvent: Event | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  readonly dialog = inject(MatDialog);
  taskList$: Observable<TaskListState> ;

    constructor(private taskListService: TaskListService, private store: Store<{ taskList: TaskListState }>) {
      this.taskList$ = store.select('taskList');
      this.taskList$.subscribe(taskList => {
        if(taskList.tasks) {
          this.dataSource = new MatTableDataSource(taskList.tasks || []);
          this.applyPaginatorAndSort();
          if(this.lastFilterEvent) {
            this.applyFilter(this.lastFilterEvent);
          }
        }
      });
    }
    ngAfterViewInit() {
      this.applyPaginatorAndSort();
      this.taskListService.loadTasks();
      this.taskListService.loadUsers();
    }
    applyFilter(event: Event) {
      this.lastFilterEvent = event;
      const filterValue = (event.target as HTMLInputElement)?.value;
      this.dataSource!.filter = filterValue?.trim()?.toLowerCase();
  
      if (this.dataSource!.paginator) {
        this.dataSource!.paginator.firstPage();
      }
    }
    confirmDelete(task: TaskModel) {
      const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {data: { task }});

      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.taskListService.removeTask(task);
          this.applyPaginatorAndSort();
        }
      });
    }
    public applyPaginatorAndSort() {
      if(this.dataSource?.data && this.dataSource.data.length > 0) {
        this.dataSource!.paginator = this.paginator!;
        this.dataSource!.sort = this.sort!;
      }
    }
}
