import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatMenuModule, RouterModule, MatButtonModule, CommonModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true
})
export class NavbarComponent {
  companyName: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  constructor(public auth: Auth) {
    
  }
  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.companyName.next(user.email?.split('@')[1].split('.')[0].toUpperCase());
      }
    });
  }
  signOut() {
    this.auth.signOut().then(() => {
      console.log("User signed out");
    });
  }
}
