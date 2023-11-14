import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApicallService } from '../apicall.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

interface Attendance {
  _id: string;
  name: string;
  status: string;
  date: string;
  isEditMode: boolean;
  record: string;
}


@Component({
  selector: 'app-all-attendance',
  templateUrl: './all-attendance.component.html',
  styleUrls: ['./all-attendance.component.scss']
})
export class AllAttendanceComponent implements OnInit {
  employees: any[] = [];
  AttendanceByDateForm: FormGroup;
  resp: any
  showData: boolean = false;
  formattedDate: any;
  attendees: any[] = [];
  attendance: any[] = [];
  attendancee: Attendance = { _id: '', name: '', status: '', date: '', isEditMode: false, record: '' };
  dataAvailable: boolean = false;
  AttendanceForm: FormGroup;

  constructor(public route: Router, public apicallService: ApicallService) {
    this.AttendanceByDateForm = new FormGroup({
      date: new FormControl('')
    });
    this.AttendanceForm = new FormGroup({
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

  goToAttendance() {
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
    const status = found ? found.status : '';
    return status;
  }

  OnGetAttendanceByDate(attendancee:Attendance) {
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
    this.formattedDate = formattedDate;

    const existingData = this.checkAttendanceData(formattedDate);

    if (existingData) {
      this.showData = true;
      this.attendance = existingData;
      this.dataAvailable = true; // Data is available
    } else {
      this.showData = false;
      this.dataAvailable = false; // No data available
    }



    if (localStorage.getItem('token')) {
      console.log(formattedDate)
      this.apicallService.getAttendanceByDate(formattedDate, localStorage.getItem('token')).subscribe(
        (res: any) => {
          if (res && res['status'] === '200' && res['data']['attendance']) {
            console.log(res);
            this.resp = res;
            this.attendance = res.data.attendance;
            this.showData = true;

            this.attendance.forEach(attendee => {
              attendee.record = this.getAttendanceStatus1(attendee, this.resp.data.attendance[0]);
            });

            

        

            this.dataAvailable = true; // Data is available
            console.log('successful');
          } else {
            console.log('something went wrong');
            this.dataAvailable = false; // No data available
          }
        },
        (err) => {
          console.log('Error in the code', err);
          this.dataAvailable = false; // Error occurred, assume no data available
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

  checkAttendanceData(date: string) {
    // Assuming this.attendance contains the data from the server
    const existingData = this.attendance.find(record => record.date === date);
    return existingData;
  }

  OnUpdateAttendance(attendancee: Attendance) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("Issue in the token");
      return;
    }

    if (this.formattedDate === undefined) {
      console.log("Date is undefined. Cannot make the request.");
      return;
    }

    const updatedAttendees = this.getUniqueAttendees1();
    console.log("Updated Attendees:", updatedAttendees);
    const updatedData = {
      date: this.formattedDate,
      attendees: updatedAttendees.map((attendee: any) => ({ _id: attendee._id, status: attendee.record }))
    };

    console.log("Sending data for update:", updatedData);

    this.apicallService.updateAttendance(this.formattedDate, updatedData, token).subscribe((res: any) => {
      console.log(res);
      if (res && res["status"] === "200" && res['data']['updatedAttendance']) {
        console.log(res);
        console.log("Attendance update successfully");
        attendancee.isEditMode = false;
        // Update local data with the received data from the server
        const updatedRecord = res.data.updatedAttendance;
        const index = this.attendance.findIndex(record => record._id === updatedRecord._id);
        
        if (index !== -1) {
          this.attendance[index] = updatedRecord;
          console.log("Updated local data:", this.attendance);
        }
        
        attendancee.isEditMode = false; // Exit edit mode
      }
    }, (err: any) => {
      if (err) {
        console.log("Error in update Attendance", err);
      }
    });
  }

  toggleEditMode(attendancee: Attendance) {
    attendancee.isEditMode = !attendancee.isEditMode;

    if (this.showData && this.resp && this.resp.data && this.resp.data.attendance) {
      const foundDate = this.resp.data.attendance.find((record:any) => record.date === this.formattedDate);
      
      if (foundDate && foundDate.attendees) {
        const foundAttendee = foundDate.attendees.find((attendee: any) => attendee._id === attendancee._id);
        
        if (foundAttendee) {
          attendancee.record = foundAttendee.status;
        } else {
          attendancee.record = ''; // Set default value when attendee not found
        }
      }
    }

  }
  
  Cancel(attendancee: Attendance) {
    attendancee.isEditMode = false;
  }


  OnCreateAttendance() {
    const formData = this.AttendanceForm.value;
    const formData1 = this.AttendanceByDateForm.value;
    const date = formData1.date ? this.formatDate(formData1.date) : null; // Check if date is selected
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
