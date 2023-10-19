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
  
  

  constructor(public route: Router, public apicallService: ApicallService) {}

  ngOnInit(): void {
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

  goToDashboard(){
    this.route.navigate(['/dashboard']);
  }

  goToDayAttendance(){
    this.route.navigate(['/dayAttendance']);
  }

  toggleCreateAttendanceForm() {
    this.route.navigate(['/addAttendance']);
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


 

  OnLogout() {
    localStorage.removeItem('token');
    this.route.navigate(['/login']); 
  }

}