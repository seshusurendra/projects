import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { DataServiceService } from '../data-service.service';
import { HttpErrorResponse } from '@angular/common/http'
 
@Component({
  selector: 'app-display-data',
  templateUrl: './display-data.component.html',
  styleUrls: ['./display-data.component.css']
})
export class DisplayDataComponent implements OnInit {

  
  constructor(private dataService : DataServiceService) { }
   userData : any;
   issue : boolean;
   noIssue : boolean;
   obj : any;
  ngOnInit(): void {
    this.dataService.getUserData().subscribe((response : any) =>{
      // console.log(response);
      // console.log(typeof response)
      this.obj = {
        "id": 11,
    name: "koushik Prajwal",
    "username": "Like",
    "email": "koushikDoremon@disney.com",
    "address": {
      "street": "SEZ",
      "suite": "Apt. 556",
      "city": "Moolapeta",
      "zipcode": "1236",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
        }
       }
      };
      // response.push(this.obj);
      // response = {...this.obj}
      response.push(this.obj);
      localStorage.setItem("userData", JSON.stringify(response))
      console.log(JSON.parse(localStorage.getItem("userData")));
      this.userData = JSON.parse(localStorage.getItem("userData"));
      this.noIssue = true;
      this.issue = false;
    }, 
    (err) => {
      if(err instanceof HttpErrorResponse && (err.status !== 200)){
        console.log(err.message);
        this.noIssue = false;
        this.issue = true;        // this.userData = err.message;
      }
      console.log(err)
    })
  }

  deleteData(id){
    console.log(id);
  }

}
