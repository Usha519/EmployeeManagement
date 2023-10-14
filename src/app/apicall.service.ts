import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class ApicallService {

  constructor(public http:HttpClient) { }

  login(userData:any){
    return this.http.post("http://localhost:5001/api/users/login",userData)
  }

  registerUser(userData:any){
    return this.http.post("http://localhost:5001/api/users/register",userData)
  }

  gotoDashboard(token:any){
    const headers=new HttpHeaders({
      "Content-type":"application/json",
      "Authorization":`Bearer ${token}`
    })
    return this.http.get("http://localhost:5001/api/users/dashboard",{headers:headers})
  }

 createEmployee(employeeData:any,token:any){
    const headers=new HttpHeaders({
      "Content-type":"application/json",
      "Authorization":`Bearer ${token}`
      
    })
    
    return this.http.post("http://localhost:5001/api/employee/createEmployee",employeeData,{headers:headers})
  
  }
  updateEmployee(id:any, updatedData: any,token:any){
    const headers=new HttpHeaders({
      "Content-type":"application/json",
      "Authorization":`Bearer ${token}`
      
    });
    return this.http.put(`http://localhost:5001/api/employee/updateEmployee/${id}`,updatedData,{headers:headers})
  
  }

  getAllEmployee(token:any){
    const headers=new HttpHeaders({
      "Content-type":"application/json",
      "Authorization":`Bearer ${token}`
    })
    return this.http.get("http://localhost:5001/api/employee/getAllEmployee",{headers:headers})
  }

  deleteEmployee(id:any,token:any){
    const headers=new HttpHeaders({
      "Content-type":"application/json",
      "Authorization":`Bearer ${token}`
    })
    return this.http.delete(`http://localhost:5001/api/employee/deleteEmployee/${id}`,{headers:headers})
  }

  getEmployee(id:any,token:any){
    const headers=new HttpHeaders({
      "Content-type":"application/json",
      "Authorization":`Bearer ${token}`
    })
    return this.http.get(`http://localhost:5001/api/employee/getEmployee/${id}`,{headers:headers})
  }

  createAttendance(employeesData:any,token:any){
    const headers=new HttpHeaders({
      "Content-type":"application/json",
      "Authorization":`Bearer ${token}`
      
    })
    
    return this.http.post("http://localhost:5001/api/attendance/createAttendance",employeesData,{headers:headers})
  
  }

  getAllAttendance(token:any){
    const headers=new HttpHeaders({
      "Content-type":"application/json",
      "Authorization":`Bearer ${token}`
    })
    return this.http.get("http://localhost:5001/api/attendance/getAllAttendance",{headers:headers})
  }


}

