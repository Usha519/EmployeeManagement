import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms'
import { ApicallService } from '../apicall.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginUserForm:FormGroup
  constructor(public apicallService:ApicallService,public router:Router){
    this.loginUserForm=new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }
onSubmit(){
  console.log(this.loginUserForm.value)
  if(this.loginUserForm.valid){
    this.apicallService.login(this.loginUserForm.value).subscribe((res:any)=>{
      if(res && res["status"]==="200" && res['data']['accessToken']){
          localStorage.setItem("token",res["data"]["accessToken"])
          this.router.navigate(["/dashboard"])
      }
    },(err)=>{
      if(err){
        alert("invalid credentials");
        console.log("err in login",err)
      }
    })
  }
}
}