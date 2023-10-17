import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { ApicallService } from '../apicall.service';

interface Employee {
  _id: string;
  name: string;
  email: string;
  status: string;
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
  AttendanceByDateForm: FormGroup;
  date: any
  resp: any

  constructor(public route: Router, public apicallService: ApicallService) {
    this.AttendanceForm = new FormGroup({
      myDate: new FormControl(''),
      employees: new FormArray([])
    });

    this.AttendanceByDateForm = new FormGroup({
      date: new FormControl('')
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

  getUniqueAttendees() {
    const uniqueAttendees: any = [];
    this.attendance.forEach(record => {
      record.attendees.forEach((attendee: any) => {
        if (!uniqueAttendees.some((item: any) => item.name === attendee.name)) {
          uniqueAttendees.push(attendee);
        }
      });
    });
    return uniqueAttendees;
  }

  getAttendanceStatus(attendee: any, record: any) {
    const found = record.attendees.find((a: any) => a.name === attendee.name);
    return found ? found.status : '-';
  }


  OnGetAttendanceByDate() {


    const dateControl = this.AttendanceByDateForm.get('date');


    if (!dateControl) {
      console.log('Date control is null');
      return;
    }

    const selectedDate = dateControl.value;

    if (!selectedDate) {
      console.log('Error: Date is not selected');
      return;
    }

    const formattedDate = this.formatDate1(selectedDate);


    if (localStorage.getItem('token')) {
      console.log(formattedDate)
      this.apicallService.getAttendanceByDate(formattedDate, localStorage.getItem('token')).subscribe(
        (res: any) => {
          if (res && res['status'] === '200' && res['data']['attendance']) {
            console.log(res);
            this.resp = res;
            console.log('successful');
          } else {
            console.log('something went wrong');
          }
        },
        (err) => {
          console.log('Error in the code', err);
        }
      );
    }
  }

  formatDate1(date: Date): string {
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