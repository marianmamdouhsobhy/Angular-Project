import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { NotfoundComponent } from './notfound/notfound.component';

import { AuthGuard } from './auth.guard';
import { GalleryComponent } from './gallery/gallery.component';

const routes: Routes = [
  {path:'',redirectTo:'home' ,pathMatch:'full'},
  {path:'home',canActivate: [AuthGuard],component:HomeComponent},
  {path:'about', canActivate: [AuthGuard], component:AboutComponent},
  {path:'gallery', canActivate: [AuthGuard], component:GalleryComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  
  
  {path:'**',component:NotfoundComponent},
  // { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/login' },
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
