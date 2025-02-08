import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from 'express';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthComponent } from "../auth/auth.component";
import { Auth, updateProfile } from '@angular/fire/auth';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ 
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    RouterModule, 
    AuthComponent, 
    MatCardModule],
  providers: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(public auth: Auth, private formBuilder: FormBuilder, ) {
  }
  profileForm: FormGroup = new FormGroup({});
  errorMessage: String | undefined;
  successMessage: String | undefined;

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      email: [{ value: this.auth.currentUser?.email, disabled: true }, [Validators.required]],
      username: [{value: this.auth.currentUser?.providerData[0].displayName ??  "", disabled: false}, [Validators.required]],
    });
  }
  async save(){
    if(!this.profileForm.valid){
      this.profileForm.markAllAsTouched();
      return;
    }
    await this.updateProfileWrapper(this.auth.currentUser!, {displayName: this.profileForm.value.username})
    .then(async () => {
      
      this.successMessage = $localize`Profile updated`;
    })
  }
  async updateProfileWrapper(user: any, profile: any) {
    return updateProfile(user!, profile);
  }
}
