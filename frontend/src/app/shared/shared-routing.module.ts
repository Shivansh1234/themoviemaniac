import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../guards/login.guard';
import { LogoutGuard } from '../guards/logout.guard';
import { LoginComponent } from './login/login.component';
import { NotificationComponent } from './notification/notification.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: PageNotFoundComponent },
  { path: 'login', component: LoginComponent, canActivate: [LogoutGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LogoutGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [LoginGuard] },
  { path: 'notification', component: NotificationComponent, canActivate: [LoginGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [LoginGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
