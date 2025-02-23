import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser=new BehaviorSubject(null);
  private userRole: string | null = null;

  constructor(private _Httpclient:HttpClient, private _Router:Router) {
    if(localStorage.getItem('userToken')!=null){
      this.saveCurrentUser();
    }

   }



  saveCurrentUser(){
    let token:any=localStorage.getItem('userToken');

    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.currentUser.next(decodedToken);
      this.userRole = decodedToken.role;  // Store user role
      console.log(this.currentUser.value);
    }


    // this.currentUser.next(jwtDecode(token));
    // this.userRole = token.role;
    // console.log(this.currentUser.value);
  }
  register(formData:any):Observable<any>
  {
     return this._Httpclient.post('http://localhost:4000/register', formData);

  }
  login(formData:any):Observable<any>
  {
    
     return this._Httpclient.post('http://localhost:4000/login', formData);

  }
  // login(formData:any): Observable<any> {
  //   return this._Httpclient.post(`${this.'http://localhost:3000/users'}/login`, formData);
  // }


logout(){
  this.currentUser.next(null);
  localStorage.removeItem('userToken');
  this._Router.navigate(['/login'])
}
getUsers() {
  return this. _Httpclient.get('http://localhost:3000/users');
 
 
}
}