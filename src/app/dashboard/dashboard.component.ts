import { Component, OnInit } from '@angular/core';
import { ApicallService } from '../apicall.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  employees: any[] = []; 
  createEmployeeForm: FormGroup;
  updateEmployeeForm: FormGroup;
  _id:any;
  EmployeeForm: FormGroup;


  constructor(public apicallService: ApicallService, public route: Router) {

    //create employee form
    this.createEmployeeForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl('')
    })

    //update employee form
    this.updateEmployeeForm = new FormGroup({
      selectedId: new FormControl(''),
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl('')
    })

    this.EmployeeForm=new FormGroup({
      selectedId: new FormControl('')
    })
  }

    //ngOnInit method displays which applied authentication the dashboard
  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.apicallService.gotoDashboard(localStorage.getItem('token')).subscribe((res: any) => {
        if (res && res['status'] === "200") {
          console.log("we are in dashboard");
        } else {
          console.log("token problem");
        }
      }, (err) => {
        if (err) {
          console.log("err in dashboard", err)
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
    this.apicallService.createEmployee(this.createEmployeeForm.value,token).subscribe((res: any) => {
      if (res && res["status"] === "200" && res['data']['employee']) {
        console.log("Employee created successfully");
        alert("Created Employee Data");
      }
    }, (err) => {
      if (err) {
        console.log("Error in creating employee", err);
        
      }
    });
  }

  //get all employees method

  OnGetAllEmployee(){
    if (localStorage.getItem('token')) {
      this.apicallService.getAllEmployee(localStorage.getItem('token')).subscribe((res: any) => {
        if (res && res['status'] === "200" && res['data']['employees']) {
          console.log(res);
          console.log("getAllEmployee Sucessfull");
          this.employees = res['data']['employees'];

          alert("fetched all the employees")
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
  
  //passing id value to updateEmployee method
  setEmployeeId(id: any) {
    this._id = id;
  }

  //created update employee method
  OnUpdateEmployee(){
    const token = localStorage.getItem('token');
    if (!token) {
     console.log("issue in the token");
    
    }

    if (this._id === undefined) {
      console.log("ID is undefined. Cannot make the request.");
      return;
    }
    
    console.log(this.updateEmployeeForm.value);
    this.apicallService.updateEmployee(this._id,this.updateEmployeeForm.value,token).subscribe((res: any) => {
      
      if (res && res["status"] === "200" && res['data']['updatedEmployee']) {
        console.log(res);
        console.log("Employee update successfully");
        alert("Updated Employee Data");
      }
    }, (err) => {
      if (err) {
        console.log("Error in update employee", err);
        
      }
    });
  }

  //delete employee method
  OnDeleteEmployee(){
    const token = localStorage.getItem('token');
    if (!token) {
     console.log("issue in the token");
    
    }

    if (this._id === undefined) {
      console.log("ID is undefined. Cannot make the request.");
      return;
    }
    
    console.log(this.EmployeeForm.value);
    this.apicallService.deleteEmployee(this._id,token).subscribe((res: any) => {
      
      if (res && res["status"] === "200" && res['data']['employee']) {
        console.log(res);
        console.log("Employee delete successfully");
        alert("deleted Employee Data");
      }
    }, (err) => {
      if (err) {
        console.log("Error in delete employee", err);
        
      }
    });
  }

  //Getting element by id method

  OnGetEmployee(){
    const token = localStorage.getItem('token');
    if (!token) {
     console.log("issue in the token");
    
    }

    if (this._id === undefined) {
      console.log("ID is undefined. Cannot make the request.");
      return;
    }
    
    console.log(this.EmployeeForm.value);
    this.apicallService.getEmployee(this._id,token).subscribe((res: any) => {
      
      if (res && res["status"] === "200" && res['data']['employee']) {
        console.log(res);
        console.log("Employee fetched successfully");
        alert("fetched Employee Data");
      }
    }, (err) => {
      if (err) {
        console.log("Error in fetched employee", err);
        
      }
    });
  }


  // logout method

  OnLogout() {
    localStorage.removeItem('token')
    this.route.navigate(['/login'])
  }

  
}


