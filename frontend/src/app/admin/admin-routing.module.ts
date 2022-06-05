import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ManageRequestComponent } from './manage-request/manage-request.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

const routes: Routes = [
  // Admin and Login Guard has already been added in app-routing.module.ts
  {
    path: '', component: AdminComponent, children: [
      { path: '', redirectTo: 'manage-user' },
      { path: 'manage-user', component: ManageUserComponent },
      { path: 'manage-requests', component: ManageRequestComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
