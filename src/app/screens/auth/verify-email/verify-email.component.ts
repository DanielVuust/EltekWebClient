import { Component } from '@angular/core';
import { Auth, sendEmailVerification } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { SnackbarService } from '../../../services/snackbar-service/snackbar.service';
import { AuthComponent } from "../auth.component";

@Component({
  selector: 'app-verify-email',
  imports: [MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule, AuthComponent],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
  standalone: true
})
export class VerifyEmailComponent {
  constructor(private auth: Auth, private snackbarService: SnackbarService, public router: Router) {}
  ngOnInit() {
    this.checkEmailVerification();
  }

  ngOnDestroy() {
    if (this.verificationCheckInterval) {
      clearInterval(this.verificationCheckInterval);
    }
  }

  private verificationCheckInterval: any;

  private checkEmailVerification() {
    this.verificationCheckInterval = setInterval(async () => {
      if (this.auth.currentUser) {
        await this.auth.currentUser.reload();
        if (this.auth.currentUser.emailVerified) {
          clearInterval(this.verificationCheckInterval);
          this.router.navigate(['/']);
        }
      }
    }, 5000);
  }
  async sendVerificationEmail() {
    if (this.auth.currentUser) {
      await sendEmailVerification(this.auth.currentUser);
      this.snackbarService.showSnackbar($localize`Verification email sent!`, $localize`Close`);      
      
    } else {
      this.snackbarService.showSnackbar('No user is currently signed in.', $localize`Close`);      
    }
  }

}
