import { Component, OnInit } from '@angular/core';
import { UserModel } from '../model/userDataModel';
import { DataServiceService } from '../data-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-display-data',
  templateUrl: './display-data.component.html',
  styleUrls: ['./display-data.component.css']
})
export class DisplayDataComponent implements OnInit {

  
  constructor(private dataService : DataServiceService, private snackbar : MatSnackBar) { }
   userData : UserModel[];
   issue : boolean = false;
   obj : {};
   IsWait : boolean = true;
   
   openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action);
  }
  
  getUserData(): void {
    let checkData = localStorage.getItem('userData')
    if(!!localStorage.getItem('userData') && checkData !== null){
      this.userData = JSON.parse(localStorage.getItem("userData"));
      // console.log(!!localStorage.getItem("userData"));
      this.issue = false;
      this.IsWait = false;
    }else{
      this.dataService.getUserData().subscribe((response) =>{
        localStorage.setItem("userData", JSON.stringify(response))
        this.userData = JSON.parse(localStorage.getItem("userData"));
        this.issue = false;
        this.IsWait = false;
      }, 
      (err) => {
        if(err instanceof HttpErrorResponse && (err.status !== 200)){
          this.openSnackBar(`${err.statusText} Status Code  ${err.status}`, 'close' );
          this.issue = true;
          this.IsWait = false;
        }
        console.log(err)
      })
    }
    
  }
  ngOnInit(): void {
    console.log('data rendering started');
      this.getUserData(); 
  }

  deleteData(id){
    console.log('Delete user clicked');
    this.dataService.deleteUser(id).subscribe((response) => {
  if(response){
    console.log('user deleted successfull');
    let allUsersData = JSON.parse(localStorage.getItem('userData'));
    let filteredData = allUsersData.filter((data) => {
      if(data.id !== id){
        return data;
      }
      
    })
    localStorage.removeItem('userData');
    localStorage.setItem("userData", JSON.stringify(filteredData));
    this.openSnackBar(`Successfully Deleted`, 'close' );
    this.getUserData();
  }
    }, (err) => {
      if(err){
        console.log(err.message);
        this.openSnackBar(`Unable to delete right now..Please try after some time`, 'close' );
      }
    })
  }

}



// filteredData = allUsersData.filter((user) => {
//   if(user.id === 2){
//     return user;
//   }
// }

// this.dataService.deleteUser(id).subscribe((response) => {
//   console.log(response)
//   
//     )},
// }, (err) => {
//     console.log(err);
// })