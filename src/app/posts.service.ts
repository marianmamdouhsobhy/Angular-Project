import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private _HttpClient:HttpClient) {}
  
  getPosts(endpoint: string) {
    return this._HttpClient.get(`https://jsonplaceholder.typicode.com/${endpoint}`);
  }
// getCommentsByPostId(postId: number): Observable<any[]> {
//   return this._HttpClient.get<any[]>(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
// }
getComments(): Observable<any[]> {
  return this._HttpClient.get<any[]>(`https://jsonplaceholder.typicode.com/comments`);
}

}
