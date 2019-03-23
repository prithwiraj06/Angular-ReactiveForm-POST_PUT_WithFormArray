import { Component, OnInit } from '@angular/core';
import { IEmployee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {
  employees:IEmployee[] = [];
  constructor(private _employeeService: EmployeeService, private _router: Router) { }

  ngOnInit() {
    this._employeeService.getAllEmployees().subscribe((data: IEmployee[]) => {
      this.employees = data;
    }, (error) => {
      console.log(error);
    })
  }

  editButtonClicked(employeeId: number) {
    this._router.navigate(['/edit',employeeId]);
  }

}
