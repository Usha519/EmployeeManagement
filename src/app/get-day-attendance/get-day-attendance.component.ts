import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApicallService } from '../apicall.service';
import { FormGroup ,FormControl} from '@angular/forms';

@Component({
  selector: 'app-get-day-attendance',
  templateUrl: './get-day-attendance.component.html',
  styleUrls: ['./get-day-attendance.component.scss']
})
export class GetDayAttendanceComponent implements OnInit {

  AttendanceByDateForm: FormGroup;
  date: any
  resp: any
  showData: boolean = false;
  attendance: any[] = [];


  

  constructor(public route:Router ,public apicallService:ApicallService){
    this.AttendanceByDateForm = new FormGroup({
      date: new FormControl('')
    });
  }

  ngOnInit(): void {
    
  }
  
  goToAttendance(){
    this.route.navigate(['/attendance']);
  }

  getUniqueAttendees1() {
    const uniqueAttendees: any = [];
    this.attendance.forEach((record: any) => {
        record.attendees.forEach((attendee: any) => {
            if (!uniqueAttendees.some((item: any) => item.name === attendee.name)) {
                uniqueAttendees.push(attendee);
            }
        });
    });
    console.log('Unique Attendees:', uniqueAttendees);
    return uniqueAttendees;
}

  getAttendanceStatus1(attendee: any, record: any) {
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
            this.attendance = res.data.attendance;
            this.showData = true; 
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
