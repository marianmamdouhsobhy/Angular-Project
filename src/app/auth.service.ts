import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {  Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { DecodedUser } from './models/decoded-user';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = new BehaviorSubject<DecodedUser | null>(null); // Define type properly
  userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();
 
  constructor(private _Httpclient:HttpClient, private _Router:Router) {
    if(localStorage.getItem('userToken')!=null){
      this.saveCurrentUser();
    }

   }



  saveCurrentUser(){
    let token:any=localStorage.getItem('userToken');

    if (token) {
      const decodedToken: DecodedUser = jwtDecode(token) as DecodedUser; 
      console.log("Decoded Token:", decodedToken);
      this.currentUser.next(decodedToken);
      this.userRoleSubject.next(decodedToken.role);  // Store user role
      console.log(this.userRoleSubject);
    }
    else {
      this.currentUser.next(null);  // Emit null when no user is found
      this.userRoleSubject.next(null);
    }
  }
  register(formData:any):Observable<any>
  {
     return this._Httpclient.post('http://localhost:4000/register', formData);

  }
  login(formData:any):Observable<any>
  {
    
     return this._Httpclient.post('http://localhost:4000/login', formData);

  }
  setUserRole(role: string) {
    this.userRoleSubject.next(role);
  }


logout(){
  this.currentUser.next(null);
  localStorage.removeItem('userToken');
  this._Router.navigate(['/login'])
}
getUsers() {
  return this. _Httpclient.get('http://localhost:3000/users');
 
 
}
}