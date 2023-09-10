import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import { ApicallService } from '../apicall.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})


export class RegisterComponent {

  userRegistrationForm: FormGroup
  constructor(public apicallService:ApicallService,public router:Router) {
    this.userRegistrationForm = new FormGroup({
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl('')
    })
  }


  onSubmit() {
    console.log(this.userRegistrationForm.value);
    this.apicallService.registerUser(this.userRegistrationForm.value).subscribe((res:any)=>{
      if(res && res['status']==="ok" && res['data']['_id']){
        this.router.navigate(["/login"]) 
      }
  },(err)=>{
    if(err){
      console.log(" err in register ",err);
    }
  })
  }
}