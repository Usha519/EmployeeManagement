import { Component, OnInit } from '@angular/core';
import { ApicallService } from '../apicall.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { ElementRef} from '@angular/core';
interface Employee {
  _id: string;
  name: string;
  email: string;
  doj:string;
  phone: string;
  isEditing?: boolean;
  
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  employees: Employee[] = [];
  createEmployeeForm: FormGroup;
  showCreateEmployeeForm = false;

  constructor(public apicallService: ApicallService, public route: Router,public el: ElementRef) {

    //create employee form
    this.createEmployeeForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      doj:new FormControl(''),
      phone: new FormControl('')
    })

  }
   



  ngOnInit(): void {
    //get all employees method

    if (localStorage.getItem('token')) {
      this.apicallService.getAllEmployee(localStorage.getItem('token')).subscribe((res: any) => {
        if (res && res['status'] === "200" && res['data']['employees']) {
          console.log(res);
          console.log("getAllEmployee Sucessfull");
          this.employees = res['data']['employees'];

        } else {
          console.log("token problem");
        }
      }, (err) => {
        if (err) {
          console.log("err in the code", err)
        }
      })

    }

  }
  //creating employee method
  OnCreateEmployee() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("issue in the token");

    }
    console.log(this.createEmployeeForm.value);
    this.apicallService.createEmployee(this.createEmployeeForm.value, token).subscribe((res: any) => {
      if (res && res["status"] === "200" && res['data']['employee']) {
        const newEmployee = res['data']['employee'];
        this.employees.push(newEmployee);
        this.showSubmissionSuccessModal();
      
        this.clearForm();
        
        
      }
    }, (err) => {
      if (err) {
        console.log("Error in creating employee", err);

      }
    });
  }
  
  //This method executes when I click create employee button in nav bar it will show the create employee form

  toggleCreateEmployeeForm() {
    this.showCreateEmployeeForm = !this.showCreateEmployeeForm;
  }

  // this method executes when I click close button in the create Employee form the form will close
  CloseForm() {
    this.showCreateEmployeeForm = !this.showCreateEmployeeForm;
  }

  // clear the fields in the employee form
  clearForm() {
    this.createEmployeeForm.reset(); 
  }



  //delete employee method
  OnDeleteEmployee(employee: Employee) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("Issue with the token");

    }

    if (!employee._id) {
      console.log("Employee ID is undefined. Cannot make the request.");
    }

    this.apicallService.deleteEmployee(employee._id, token).subscribe((res: any) => {
      if (res && res["status"] === "200" && res['data']['employee']) {
        console.log(res);
        console.log("Employee deleted successfully");
       this. showSubmissionDeleteModal() ;
        const index = this.employees.indexOf(employee);
        if (index !== -1) {
          this.employees.splice(index, 1);
          
        }
      }
    }, (err) => {
      if (err) {
        console.log("Error in deleting employee", err);
      }
    });
  }

  // Update Employee method
  OnUpdateEmployee(employee: Employee) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("Issue in the token");
      return;
    }

    if (employee._id === undefined) {
      console.log("ID is undefined. Cannot make the request.");
      return;
    }

    const updatedData = {
      name: employee.name,
      email: employee.email,
      phone: employee.phone
    };

    this.apicallService.updateEmployee(employee._id, updatedData, token).subscribe((res: any) => {
      if (res && res["status"] === "200" && res['data']['updatedEmployee']) {
        console.log(res);
        console.log("Employee update successfully");
        this.showSubmissionUpdateModal();
        employee.isEditing = false;
      }
    }, (err) => {
      if (err) {
        console.log("Error in update employee", err);
      }
    });
  }

  //new data will be updated by using this method
  ToggleEditMode(employee: Employee) {
    employee.isEditing = !employee.isEditing;
  }

  // logout method

  OnLogout() {
    localStorage.removeItem('token')
    this.route.navigate(['/login'])
  }

  showSubmissionSuccessModal() {
    const modalRef = this.el.nativeElement.querySelector('#submitSuccessModal');
    modalRef.classList.add('show');
    modalRef.style.display = 'block';
  }
   

  showSubmissionUpdateModal() {
    const modalRef = this.el.nativeElement.querySelector('#updateSuccessModal');
    modalRef.classList.add('show');
    modalRef.style.display = 'block';
  }

  showSubmissionDeleteModal() {
    const modalRef = this.el.nativeElement.querySelector('#deleteSuccessModal');
    modalRef.classList.add('show');
    modalRef.style.display = 'block';
  }
  closeModal() {
    const modalRef = this.el.nativeElement.querySelector('#submitSuccessModal');
    modalRef.classList.remove('show');
    modalRef.style.display = 'none';
  }
  
  closeModal1() {
    const modalRef = this.el.nativeElement.querySelector('#updateSuccessModal');
    modalRef.classList.remove('show');
    modalRef.style.display = 'none';
  }

  closeModal2() {
    const modalRef = this.el.nativeElement.querySelector('#deleteSuccessModal');
    modalRef.classList.remove('show');
    modalRef.style.display = 'none';
  }
  
  goToAttendance() {
    this.route.navigate(['/attendance']);
  }
}


