import { Component, Input } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common'; 
import { NavbarComponent } from "../../shared-components/navbar/navbar.component";
import { LoginComponent } from "./login/login.component";
import { FooterComponent } from "../../shared-components/footer/footer.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  get user(){
    return this.auth.currentUser;
  }
  constructor(public auth: Auth, public router: Router) {
    
  }
  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
        console.log("User is signed out");
      } else if (user.emailVerified === false) {
        this.router.navigate(['/verify-email']);
        console.log("User is not verified");
      } 
      else {
        console.log("User is signed in");
        console.log(user);
      }
    });
  }
  @Input() showNavbar: boolean = true;
  @Input() showFooter: boolean = true;
}
