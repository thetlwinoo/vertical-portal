import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomeModule) },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
