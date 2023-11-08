import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApicallService } from '../apicall.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})

export class AttendanceComponent implements OnInit {
  employees: any[] = [];
  attendance: any[] = [];
  Page = 1;
  PageSize = 7;
  totalItems = 0;
  AttendanceBetweenDatesForm: FormGroup;
  currentPage = 0;
  columnsPerPage = 7;

  displayedColumns: string[] = ['name'];
  dataSources = new MatTableDataSource<any>();
  uniqueDates: string[] = [];

  @ViewChild(MatPaginator)paginator?:MatPaginator


  constructor(public route: Router, public apicallService: ApicallService) {
    this.AttendanceBetweenDatesForm = new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl('')
    });
  }

  ngOnInit(): void { }

  OnGetAttendanceBetweenDates() {
    const formData = this.AttendanceBetweenDatesForm.value;
    const startDate = formData.startDate ? this.formatDate(formData.startDate) : null;
    const endDate = formData.endDate ? this.formatDate(formData.endDate) : null;
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('Issue with the token');
      return;
    }

    if (localStorage.getItem('token')) {
      this.apicallService.getAttendanceBetweenDates(startDate, endDate, token).subscribe(
        (res: any) => {
          if (res && res['status'] === '200' && res['data']['allAttendance']) {
            console.log(res);
            console.log('getAllAttendance Successful');
            this.attendance = res['data']['allAttendance'];
            console.log(this.attendance);
            this.totalItems = this.attendance.length;
            this.uniqueDates = this.getUniqueDates();
            this.displayedColumns = ['name', ...this.uniqueDates];
            
            this.dataSources.data = this.getUniqueAttendees1(); 
            if (this.paginator) {
              this.dataSources.paginator = this.paginator;
            }
            console.log(this.dataSources.data)
            console.log(this.getUniqueAttendees1())

          } else {
            console.log('token problem');
          }
        },
        (err) => {
          if (err) {
            console.log('err in the code', err);
          }
        }
      );
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  goToDashboard() {
    this.route.navigate(['/dashboard']);
  }

  goToDayAttendance() {
    this.route.navigate(['/dayAttendance']);
  }

  toggleCreateAttendanceForm() {
    this.route.navigate(['/addAttendance']);
  }

  getUniqueDates() {
    const uniqueDates: string[] = [];

    this.attendance.forEach(record => {
      record.attendees.forEach((attendee: any) => {
        const date = new Date(record.date);

        if (!isNaN(date.getTime())) { // Check if the date is valid
          const isoDate = date.toISOString();

          if (!uniqueDates.includes(isoDate)) { // Check if it's already in the array
            uniqueDates.push(isoDate);
          }
        } else {
          console.error(`Invalid date format: ${record.date}`);
        }
      });
    });

    return uniqueDates;
  }



  // Modify your getUniqueAttendees1 function to restructure the data
  getUniqueAttendees1() {
    const uniqueDates: any[] = [];

    this.attendance.forEach(record => {
      const { _id, date, attendees } = record;

      const modifiedAttendees = attendees.map((attendee: any) => {
        const { name, status, _id } = attendee;
        return { name, status, _id };
      });

      uniqueDates.push({ _id, date, attendees: modifiedAttendees });
    });

    return uniqueDates;
  }


  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  // Function to go to the next page
  nextPage() {
    if ((this.currentPage + 1) * this.columnsPerPage < this.uniqueDates.length) {
      this.currentPage++;
    }
  }

  // Calculate which columns to display based on currentPage and columnsPerPage
  getDisplayedColumns(): string[] {
    const startIndex = this.currentPage * this.columnsPerPage;
    const endIndex = startIndex + this.columnsPerPage;
    const datesToShow = this.uniqueDates.slice(startIndex, endIndex);
    return ['name', ...datesToShow];
  }
  
  

  getTotalPages(): number {
    return Math.ceil(this.uniqueDates.length / this.columnsPerPage);
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

  getAttendanceStatus1(attendee: any, record: any) {
    if (record && record.attendees) {
      const found = record.attendees.find((a: any) => a.name === attendee.name);
      return found ? found.status : '-';
    } else {
      return '-';
    }
  }

  getAttendanceStatus(row: any, date: string) {
    const record = this.attendance.find(r => r.date === date);
    if (record && record.attendees) {
      const attendee = record.attendees.find((a:any) => a.name === row.name);
      return attendee ? attendee.status : '-';
    } else {
      return '-';
    }
  }
  
  


  OnLogout() {
    localStorage.removeItem('token');
    this.route.navigate(['/login']);
  }
}
