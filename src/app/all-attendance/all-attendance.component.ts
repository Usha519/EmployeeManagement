import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApicallService } from '../apicall.service';
import { FormGroup,FormControl,FormArray } from '@angular/forms';

@Component({
  selector: 'app-all-attendance',
  templateUrl: './all-attendance.component.html',
  styleUrls: ['./all-attendance.component.scss']
})
export class AllAttendanceComponent implements OnInit{
  employees: any[] = [];
  AttendanceForm: FormGroup;
  showCreateAttendanceForm=false

  constructor(public route:Router,public apicallService:ApicallService){
    this.AttendanceForm = new FormGroup({
      myDate: new FormControl(''),
      employees: new FormArray([])
    });
  }


  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.apicallService.getAllEmployee(localStorage.getItem('token')).subscribe(
        (res: any) => {
          if (res && res['status'] === "200" && res['data']['employees']) {
            console.log(res);
            console.log("getAllEmployee Successful");
            this.employees = res['data']['employees'];
            this.initializeFormArray();
          } else {
            console.log("token problem");
          }
        },
        (err) => {
          if (err) {
            console.log("err in the code", err);
          }
        }
      );
    }
  }

  initializeFormArray() {
    const employeesArray = this.AttendanceForm.get('employees') as FormArray;
    this.employees.forEach(employee => {
      employeesArray.push(new FormGroup({
        _id: new FormControl(employee._id),
        name: new FormControl(employee.name),
        status: new FormControl('')
      }));
    });
  }

  OnCreateAttendance() {
    const formData = this.AttendanceForm.value;
    const date = formData.myDate ? this.formatDate(formData.myDate) : null; // Check if date is selected
    const employeesData = formData.employees.map((employee: any) => {
      return {
        _id: employee._id,
        name: employee.name,
        status: employee.status
      };
    });

    const dataToSubmit = {
      date: date,
      attendees: employeesData
    };
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("issue in the token");

    }


    this.apicallService.createAttendance(dataToSubmit, token).subscribe(
      (res: any) => {
        if (res && res['status'] === "200" && res['data']['attendance']) {
          console.log("Attendance created successfully", res['data']['attendance']);

        } else {
          console.log("Error creating attendance", res);

        }
      },
      (err) => {
        console.log("Error in the code", err);

      }
    );
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  OnLogout() {
    localStorage.removeItem('token');
    this.route.navigate(['/login']);
  }

}
