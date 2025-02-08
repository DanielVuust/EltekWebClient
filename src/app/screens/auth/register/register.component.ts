import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Auth, sendEmailVerification } from '@angular/fire/auth';
import { RedirectCommand, RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-register',
  imports: [MatCardModule,MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true
})
export class RegisterComponent {
  constructor(private formBuilder: FormBuilder, public router: Router, public auth: Auth) {}
  
  registerForm: FormGroup = new FormGroup({});
  alertMessage: String | undefined;

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,]],
    });
  }

  register() {
    if(!this.registerForm.valid){
      this.registerForm.markAllAsTouched();
      return;
    }
    this.createUserWithEmailAndPasswordWrapper(this.auth, this.registerForm.value.email, this.registerForm.value.password)
    .then(async (userCredential) => {
      await sendEmailVerification(userCredential.user);
      this.router.navigate(['']);
    })
    .catch((error) => {
      if(error.code === "auth/email-already-in-use" || error.code === "auth/network-request-failed"){
        this.alertMessage = "Email already in use";
      }
      else if(error.code === "auth/invalid-email"){
        this.alertMessage = "Invalid email";
      }
      else if(error.code === "auth/weak-password"){
        this.alertMessage = "Weak password";
      }
      else if (error.code === "auth/missing-password"){
        this.alertMessage = "Missing password";
      }
      else if (error.code == "auth/password-does-not-meet-requirements"){
        this.alertMessage = "Password does not meet requirements";
      }
      else{
        this.alertMessage = "An error occurred";
      }
    });
  }
  public createUserWithEmailAndPasswordWrapper(auth: Auth, email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  } 
}
