import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { SnackbarService } from '../../../services/snackbar-service/snackbar.service';
@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true
})
export class LoginComponent {
  constructor(private formBuilder: FormBuilder, public router: Router, private auth: Auth, public snackbarService: SnackbarService) {}
  
  loginForm: FormGroup = new FormGroup({});
  alertMessage: String | undefined;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    if(!this.loginForm.valid){
      this.loginForm.markAllAsTouched();
      return;
    }
    this.signInWithEmailAndPasswordWrapper(this.auth, this.loginForm.value.email, this.loginForm.value.password)
    .then((userCredential) => {
      //Navigate to homepage
      this.router.navigate(['']);
    })
    .catch((error) => {
      console.log(error.code);

      if(error.code === "auth/invalid-credential"){
        this.alertMessage = "Invalid credentials";
      }
      else{
        this.alertMessage = "An error occurred";
      }
    });
  }
  public signInWithEmailAndPasswordWrapper(auth: Auth, email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  resetPassword(){
    if (!this.loginForm.controls['email'].valid) {
      this.snackbarService.showSnackbar("Please enter a valid email address", "Close");
      return;
    }
    sendPasswordResetEmail(this.auth, this.loginForm.value.email)
  .then(() => {
    this.snackbarService.showSnackbar("Password reset email sent", "Close");
  })
  .catch((error) => {
    console.log(error);
    this.snackbarService.showSnackbar("Error could not send reset email", "Close");
  });
  }
}
