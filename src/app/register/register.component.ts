import { Component } from '@angular/core';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
 error:string='';
  constructor(private _AuthService:AuthService, private _Router:Router) {
    
  }
registerForm = new FormGroup({
name:new FormControl(null, [Validators.minLength(3), Validators.maxLength(10),Validators.required]), 
username:new FormControl(null,[Validators.minLength(3), Validators.maxLength(200),Validators.required]),  
// age:new FormControl(null , [Validators.required, Validators.min(16),Validators.max(80)]), 
email:new FormControl(null, [Validators.email, Validators.required]), 
phone:new FormControl(null , [Validators.required ]),
password:new FormControl(null , [Validators.required, Validators.minLength(3) ])
})

test(){
  console.log(this.registerForm.get('name')?.errors?.['minLength']);
  console.log(this.registerForm.get('name')?.errors)
  console.log(this.registerForm.get('name')?.touched)
  console.log(this.registerForm.get('name')?.errors !=null)
  console.log(this.registerForm.get('name')?.errors !=null && this.registerForm.get('name')?.touched)
}

submitRegisterForm(registerForm:FormGroup){
 console.log(registerForm.value);
 this._AuthService.register(registerForm.value).subscribe({
  next: (data) => {
    this._Router.navigate(['/login'])
  }, error: (err) => {
      console.error(err);
      // <insert code for what to do on failure>
  }
});

//  this._AuthService.register(registerForm.value).subscribe((response)=>{
//   if(response.message =='success'){
//     //registered
//     this._Router.navigate(['/login'])
//   }
//   else{
//     //moshkloa
//     this.error=response.errors.email.message
//     console.log(this.error)
//   }
//  },(err)=>{
  
//  })
//   }

 }}

