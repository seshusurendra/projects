import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private http : HttpClient) {   }
  
  getUserData(){
    return this.http.get('https://jsonplaceholder.typicode.com/users');
  }

  postData(headers, body){
    return this.http.post('https://jsonplaceholder.typicode.com/users', body, { headers });
  }
  
  deleteUser(id){
    return this.http.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
  }
  
  getUser(id){
    return this.http.get(`https://jsonplaceholder.typicode.com/users/${id}`)
  }

  postEditData(headers, body, id){
    return this.http.put(`https://jsonplaceholder.typicode.com/posts/${id}`, body, {headers});
  }
}
