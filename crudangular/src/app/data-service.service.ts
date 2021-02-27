import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private http : HttpClient) {   }
  getUserData(){
    return this.http.get('https://jsonplaceholer.typicode.com/users');
  }
}
