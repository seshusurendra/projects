import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { DisplayDataComponent } from './display-data/display-data.component';
import { UpdateUserComponent } from './update-user/update-user.component';


const routes: Routes = [
  {
    path : 'adduser', component: AddUserComponent
}, 
{
  path : 'viewusers', component : DisplayDataComponent
}, 
{
  path : '', redirectTo : '/viewusers', pathMatch: 'full'
},
{
  path : 'updateuser', component : UpdateUserComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
