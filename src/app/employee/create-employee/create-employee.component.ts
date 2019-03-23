import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import {CustomValidator} from '../../CustomValidators/custom.validators';
import { ActivatedRoute, Router } from '@angular/router';
import { IEmployee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { ISkills } from 'src/app/models/skills.model';
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employee: IEmployee;
  pageTitle = '';
  validationErrorMessages = {
    'employeeName': {
      'required': 'Employee Name is required',
      'minlength': 'Employee name must have minimum of 2 characters',
      'maxlength': 'Employee name must be smaller than 10 charcters'
    },
    'email': {
      'required': 'Email is required',
      'invalidEmailDomain': 'Email domain can be only prithwi.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required'
    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm email does not match'
    },
    'phone': {
      'required': 'Phone is required'
    }
  };
  formErrors = {
  };
  constructor(private _formBuilder: FormBuilder, private _activatedRoute: ActivatedRoute,
              private _employeeService: EmployeeService, private router: Router) { }

  ngOnInit() {
    this.employeeForm = this._formBuilder.group({
      employeeName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      emailGroup: this._formBuilder.group({
        email: ['', [Validators.required, CustomValidator.checkEmail('prithwi.com')]],
        confirmEmail: ['', Validators.required],
      }, {validator: matchEmail}),
      phone: [''],
      contactPrefrence: ['email'],
      skills: this._formBuilder.array([
        this.addSkillFormGroup()
      ])
    });

    this.employeeForm.get('contactPrefrence').valueChanges.subscribe((data) => {
      this.onContactPrefrenceChanged(data);
    });

    this.employeeForm.valueChanges.subscribe(data => {
      this.logValidationErrorMessages(this.employeeForm);
    });
    this._activatedRoute.paramMap.subscribe(params => {
      const employeeId = +params.get('id');
      if(employeeId) {
        this.pageTitle = 'Edit Employee';
        this.getEmployeeById(employeeId);
      } else {
        this.pageTitle = 'Create Employee'
        this.employee = {
          id: null,
          employeeName: '',
          email: '',
          contactPrefrence: '',
          phone: null,
          skills: []
        }
      }
    })
  }

  getEmployeeById(employeeId: number)  {
    this._employeeService.getEmployeeById(employeeId).subscribe((employee: IEmployee) => {
      this.setEmployeeValueForEdit(employee);
      this.employee = employee;
    })
  }

  setEmployeeValueForEdit(employee: IEmployee) {
    this.employeeForm.patchValue({
      employeeName: employee.employeeName,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      contactPrefrence: employee.contactPrefrence,
      phone: employee.phone
    });
    this.employeeForm.setControl('skills', this.setExistingSkillsForEdit(employee.skills));
  }

  setExistingSkillsForEdit(skillSets: ISkills[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(skill => {
      formArray.push(this._formBuilder.group({
        skillName: skill.skillName,
        proficiency: skill.proficiency,
        experienceInYears: skill.experienceInYears
      }));
      });
      return formArray;    
  }

  addSkillFormGroup(): FormGroup {
    return this._formBuilder.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  addSkillButtonClicked(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  logValidationErrorMessages(form: FormGroup = this.employeeForm): void {
    Object.keys(form.controls).forEach((key: string) => {
      const abstractControl = form.get(key);
      this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
          const message = this.validationErrorMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += message[errorKey] + '';
            }
          }
        }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrorMessages(abstractControl);
      }
    });
  }

  onContactPrefrenceChanged(selectedValue: string) {

    const phoneControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  saveEmployee() {
    this.mapFormvValuesToEmployeeModel();
    if(this.employee.id) {     
      this._employeeService.updateEmployee(this.employee).subscribe(data => {
        this.router.navigate(['list'])
      },
      ((error:any) => {
        console.log(error)
      }));
    }
    else {
      this._employeeService.addEmployee(this.employee).subscribe(data => {
        this.router.navigate(['/list']);
      })
    }
    
  }

  mapFormvValuesToEmployeeModel() {
    this.employee.employeeName = this.employeeForm.value.employeeName;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.contactPrefrence = this.employeeForm.value.contactPrefrence;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }

  loadData() {
    // this.logValidationErrorMessages(this.employeeForm);
    // using new Keyword to create form array
  }
  removeSkills(skillIndex: number) {
    const skillsFormArray = (<FormArray>this.employeeForm.get('skills'));
    skillsFormArray.removeAt(skillIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }
}

function matchEmail(group: AbstractControl): {[key: string]: any} | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if (emailControl.value === confirmEmailControl.value || (confirmEmailControl.pristine && confirmEmailControl.value === '')) {
    return null;
  } else {
    return { 'emailMismatch': true };
  }
}
