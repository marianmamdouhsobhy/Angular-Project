import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class AlbumsService {

  constructor(private _HttpClient:HttpClient) { }

  getAlbums(albums:string):Observable<any>
{
return this._HttpClient.get('https://jsonplaceholder.typicode.com/albums')
}
getPhotos(photos:string):Observable<any>
{
  
return this._HttpClient.get('https://jsonplaceholder.typicode.com/photos')
}


}
