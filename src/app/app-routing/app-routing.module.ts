import { NgModule } from '@angular/core';
import { CreateEmployeeComponent } from '../employee/create-employee/create-employee.component';
import {Routes, RouterModule} from '@angular/router';
import { ListEmployeeComponent } from '../employee/list-employee/list-employee.component';
const appRoutes: Routes = [
    {path: 'create', component: CreateEmployeeComponent},
    {path: 'list', component: ListEmployeeComponent},
    {path: 'edit/:id', component: CreateEmployeeComponent},
    {path: '', redirectTo: '/list', pathMatch: 'full'}
];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
