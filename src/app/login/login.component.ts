import { Component } from '@angular/core';
import {FormControl, FormGroup,Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  error:string='';
  constructor(private _AuthService:AuthService, private _Router:Router){}
loginForm=new FormGroup({
  email:new FormControl(null, [Validators.email, Validators.required]), 
  password:new FormControl(null , [Validators.required])
})


submitLoginForm(loginForm:FormGroup){
  console.log("Login request received:", loginForm.value);
  this._AuthService.login(loginForm.value).subscribe({
    next: (data) => {
      localStorage.setItem('userToken',data.token);
   this._AuthService.saveCurrentUser();
      this._Router.navigate(['/home'])
    }, error: (err) => {
        console.error(err);
        // <insert code for what to do on failure>
    }
  });

  this._AuthService.login(loginForm.value).subscribe((response)=>{
    
    if(response.message =='success'){
  //   //   //registered
  //   //   // localStorage.setItem('userToken',response.token);
  //   //   // this._AuthService.saveCurrentUser();
   this._Router.navigate(['/home'])
    }
    else{
      //moshkloa
      this.error=response.errors.email.message
    }
    })
}


}
