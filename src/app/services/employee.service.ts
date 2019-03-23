import {Injectable} from '@angular/core';
import { IEmployee } from '../models/employee.model';
import { Observable, of, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http'

export class EmployeeService {
    employees:IEmployee[] = [];
    constructor() {
        this.employees = [
            {
                id:101,
                employeeName: 'Prithwi',
                email: 'prethwiraj06@gmail.com',
                phone: 8340203933,
                contactPrefrence: 'email',
                skills: [
                    {
                        skillName: 'C#',
                        experienceInYears: 2,
                        proficiency: 'intermediate'
                    }
                ]
            },
            {
                id:102,
                employeeName: 'Dilip',
                email: 'dilip@gmail.com',
                phone: 8340203933,
                contactPrefrence: 'email',
                skills: [
                    {
                        skillName: 'Java',
                        experienceInYears: 2,
                        proficiency: 'intermediate'
                    },
                    {
                        skillName: 'Angular 6',
                        experienceInYears: 3,
                        proficiency: 'intermediate'
                    }
                ]
            }
        ]
    }
    getAllEmployees(): Observable<IEmployee[]> {
        return of(this.employees).pipe(catchError(this.handleError));
    }
    getEmployeeById(employeeId: number) :Observable<IEmployee> {
        return of(this.employees.find(x=> x.id == employeeId));
    }

    updateEmployee(employee: IEmployee):Observable<any> {
        
        return of(this.employees.filter(x => x.id === employee.id)[0] = employee);
    }

    addEmployee(employee: IEmployee): Observable<any> {
        const maxEmployeeId = this.employees.length;
        employee.id = maxEmployeeId + 1;
        return of(this.employees.push(employee));
    }

    handleError(error: HttpErrorResponse) {
        if(error instanceof Event){
            console.log('client side error');
        }
        else{
            console.log('server side error');
        }
        return throwError(error);
    }
    
}