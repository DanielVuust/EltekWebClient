import { ActivatedRoute, Router } from '@angular/router';
import { Component, HostListener, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { SnackbarService } from '../../services/snackbar-service/snackbar.service';
import { AuthComponent } from "../auth/auth.component";
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task-service/task.service';
import { Store } from '@ngrx/store';
import { TaskState } from '../../classes/state-classes/task-state';
import { Observable, Subscription, take } from 'rxjs';
import {MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { CommentSectionComponent } from "./comment-section/comment-section.component";
import { unsubscribe } from 'node:diagnostics_channel';
import { TaskModel } from '../../classes/data-classes/task-model';
import { title } from 'node:process';

@Component({
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatIcon, MatCardModule, AuthComponent, CommonModule, RouterModule, MatProgressSpinnerModule, FileUploadComponent, CommentSectionComponent],
  selector: 'app-task-screen',
  templateUrl: './task-screen.component.html',
  styleUrl: './task-screen.component.scss',
  standalone: true
})
export class TaskScreenComponent {

  private readonly route = inject(ActivatedRoute);
  task$: Observable<TaskState>;
  constructor(private formBuilder: FormBuilder, public snarkbarService: SnackbarService, private taskService: TaskService, private store: Store<{ task: TaskState }>) {
    this.task$ = store.select('task');
  }
  
  statuses = [
    {label: "New", value: "New"}, {label: "In-Progress", value: "InProgress"}, {label: "Done", value: "Done"}];
    taskSubscription: Subscription |undefined;
  ngAfterContentInit() {
    const taskID = this.route.snapshot.paramMap.get('id');
    this.taskService.loadTask(taskID!);
    this.taskService.loadCustomers();
    this.taskService.loadUsers();

    this.form = this.formBuilder.group({
    title: [{ value: "", disabled: false }, [Validators.required]],
    description: [{ value: "", disabled: false }, [Validators.required]],
    status: [{ value: "new", disabled: false }, [Validators.required]],
    customer: [{ value: "", disabled: false }, [Validators.required]],
    location: [{ value: "", disabled: false }, []],
    user: [{ value: "", disabled: false }, [Validators.required]],
    });
     this.taskSubscription = this.task$.subscribe(task => {
      if (task.task) {
        this.form.patchValue({
          description: task.task?.description,
          location: task.task?.location,
          title: task.task?.title,
          status: this.statuses.find(status => status.value == task.task?.status),
        });
        if(task.customers){
          this.form.patchValue({
            customer: task.customers?.find(customer => customer.id == task.task?.customerId)
          });
        }
        if(task.users){
          this.form.patchValue({
            user: task.users?.find(user => user.userId == task.task?.userId)
          });
        }
      }
      if(task.task && task.customers && task.users){
        setTimeout(() => {
          this.taskSubscription?.unsubscribe();
        }, 1000);
      }

    });
    

  }

  form: FormGroup = new FormGroup({});
  errorMessage: String | undefined;
  successMessage: String | undefined;
  save(){
    if(!this.form.valid){
      console.log(this.form);
      this.errorMessage = "Please correct the errors in the form.";
      this.form.markAllAsTouched();
    }
    else{
      console.log(this.form.value);
      this.taskService.saveTask(this.form?.value?.title, this.form?.value?.description, this.form?.value?.location, this.form?.value?.status?.value, this.form?.value?.customer?.id, this.form.value?.user?.userId);
      this.successMessage = "Task saved successfully";
      this.errorMessage = undefined;
    }
  }

  

}
