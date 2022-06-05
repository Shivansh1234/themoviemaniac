import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { LoginGuard } from './guards/login.guard';
import { HomeComponent } from './shared/home/home.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'common', loadChildren: () => import('../app/shared/shared.module').then(s => s.SharedModule) },
  { path: 'feature', loadChildren: () => import('../app/feature/feature.module').then(f => f.FeatureModule), canActivate: [LoginGuard] },
  { path: 'admin', loadChildren: () => import('../app/admin/admin.module').then(a => a.AdminModule), canActivate: [AdminGuard, LoginGuard] },
  { path: 'home', component: HomeComponent },

  // Wildcard Route has to come at last
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
