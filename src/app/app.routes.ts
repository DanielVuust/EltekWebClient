import { Routes } from '@angular/router';
import { TaskListScreenComponent } from './screens/task-list-screen/task-list-screen.component';
import { TaskScreenComponent } from './screens/task-screen/task-screen.component';
import { LoginComponent } from './screens/auth/login/login.component';
import { RegisterComponent } from './screens/auth/register/register.component';
import { ProfileComponent } from './screens/profile/profile.component';
import { DashboardScreenComponent } from './screens/dashboard-screen/dashboard-screen.component';
import { VerifyEmailComponent } from './screens/auth/verify-email/verify-email.component';

export const routes: Routes = [
    { path: 'taskList', component: TaskListScreenComponent },
    { path: 'task/:id', component: TaskScreenComponent},
    { path: 'dashboard', component: DashboardScreenComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'profile', component: ProfileComponent},
    { path: 'verify-email', component: VerifyEmailComponent},
    { path: '', redirectTo: 'taskList', pathMatch: 'full' },
    { path: '*', redirectTo: 'taskList', pathMatch: 'full' },
    
];
