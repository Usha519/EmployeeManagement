import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { ApicallService } from '../apicall.service';

interface Employee {
  _id: string;
  name: string;
  email: string;
  status:string;
  isEditing?: boolean;
}
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  employees: any[] = [];
  attendance: any[] = [];
  AttendanceForm: FormGroup;

  constructor(public route: Router, public apicallService: ApicallService) {
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

    if (localStorage.getItem('token')) {
      this.apicallService.getAllAttendance(localStorage.getItem('token')).subscribe(
        (res: any) => {
          if (res && res['status'] === "200" && res['data']['allAttendance']) {
            console.log(res);
            console.log("getAllAttendance Successful");
            this.attendance = res['data']['allAttendance'];
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
    const date = formData.myDate;
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
  
   
    this.apicallService.createAttendance(dataToSubmit,token).subscribe(
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

  getUniqueAttendees() {
    const uniqueAttendees:any = [];
    this.attendance.forEach(record => {
      record.attendees.forEach((attendee:any) => {
        if (!uniqueAttendees.some((item:any) => item.name === attendee.name)) {
          uniqueAttendees.push(attendee);
        }
      });
    });
    return uniqueAttendees;
  }

  getAttendanceStatus(attendee:any, record:any) {
    const found = record.attendees.find((a:any) => a.name === attendee.name);
    return found ? found.status : '-';
  }
  
  OnLogout() {
    localStorage.removeItem('token');
    this.route.navigate(['/login']);
  }

  // ToggleEditMode(employee: Employee) {
  //   employee.isEditing = !employee.isEditing;
  // }

  // OnUpdateEmployee(employee: Employee) {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     console.log("Issue in the token");
  //     return;
  //   }

  //   if (employee._id === undefined) {
  //     console.log("ID is undefined. Cannot make the request.");
  //     return;
  //   }

  //   const updatedData = {
  //     name: employee.name,
  //     email: employee.email,
  //     phone: employee.status
  //   };

  //   this.apicallService.updateEmployee(employee._id, updatedData, token).subscribe((res: any) => {
  //     if (res && res["status"] === "200" && res['data']['updatedEmployee']) {
  //       console.log(res);
  //       console.log("Employee update successfully");
        
  //       employee.isEditing = false;
  //     }
  //   }, (err) => {
  //     if (err) {
  //       console.log("Error in update employee", err);
  //     }
  //   });
  // }
}
