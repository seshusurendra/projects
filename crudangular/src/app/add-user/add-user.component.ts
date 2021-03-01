import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DataServiceService } from '../data-service.service';
import { userDataPostModel } from '../model/userDataPost.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router'



/** This class shows the validation errors */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  constructor(private fb : FormBuilder, private dataService : DataServiceService, private snackbar : MatSnackBar, public  router : Router) { }

  
  ngOnInit(): void {

  }
openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 2000
    });
  }

  
  getLatitudeCoord(event) : void {
    event.preventDefault();
    if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
              const latitude = position.coords.latitude;  
              this.latitude.setValue(latitude);
            });
        } else {
           console.log("No support for geolocation")
        }
  }

  getLongitudeCoord(event) : void {
    event.preventDefault();
    if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
              const longitude = position.coords.longitude;
              this.longitude.setValue(longitude);
            });
        } else {
           console.log("No support for geolocation")
        }
  }
  
  userDataForm = this.fb.group({
                name : ['', [Validators.required,Validators.minLength(5), Validators.maxLength(15)]],
                username : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
                email : ['', [Validators.required, Validators.email]],
                address : this.fb.group({
                  street : ['', [Validators.required, Validators.minLength(7)]],
                  suite : ['', [Validators.required, Validators.minLength(5)]],
                  city : ['',[Validators.required, Validators.minLength(5), Validators.pattern(/^[a-zA-Z ,.]+$/)]],
                  zipcode : ['',[Validators.required, Validators.minLength(5), Validators.pattern(/^[0-9]+$/)]],
                  geolocation : this.fb.group({
                      latitude: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/-?[0-9]{1,3}[.][0-9]+/)]],
                      longitude : ['',[Validators.required, Validators.minLength(5), Validators.pattern(/-?[0-9]{1,3}[.][0-9]+/)]]
                    })
                }),
                phone : ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
                website : ['', [Validators.required, Validators.minLength(10)]],
                company : this.fb.group({
                    companyname : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
                    catchPhrase : ['', [Validators.required, Validators.pattern(/^[a-zA-Z ,.]+$/)]],
                    business : ['', [Validators.required, Validators.minLength(5)]]
                })  
  })
  
  matcher = new MyErrorStateMatcher();


  onSubmit(){
    const userData = this.userDataForm.value;
    const headers = { 'Content-type': 'application/json; charset=UTF-8' };
    const body : userDataPostModel = {
      name: userData.name,
      username: userData.username,
      email: userData.email,
      address: {
        street: userData.address.street,
        suite: userData.address.suite,
        city: userData.address.city,
        zipcode: userData.address.zipcode,
        geo: {
          lat: userData.address.geolocation.latitude,
          lng: userData.address.geolocation.latitude
        }
      },
      phone : userData.phone,
      website: userData.website,
      company: {
        name: userData.company.companyname,
        catchPhrase: userData.company.catchPhrase,
        bs: userData.company.business
      }
    }
    // console.log(body);
    // console.log(this.dataService.postData(headers, body));
    this.dataService.postData(headers, body).subscribe(data => {
      // console.log(data);
      if(!!localStorage.getItem('userData')){
        var alreadyStoredDAta = JSON.parse(localStorage.getItem("userData"));
        console.log(alreadyStoredDAta);
        alreadyStoredDAta.push(data);
        localStorage.removeItem('userData');
        localStorage.setItem("userData", JSON.stringify(alreadyStoredDAta));
        this.openSnackBar('User Added', 'close' );
        this.router.navigate(['/viewusers']);
      }else{
        let userDataArr = [];
        userDataArr.push(data);
        localStorage.setItem("userData", JSON.stringify(userDataArr));
        this.openSnackBar('User Added', 'close' );
        this.router.navigate(['/viewusers']);
      }
    }, (err) => {
      this.openSnackBar(`${err.statusText} Status Code  ${err.status}`, 'close' );
    })
  }

  get name (){
    return this.userDataForm.get('name');
  }
  
  get username (){
    return this.userDataForm.get('username');
  }
  get email (){
    return this.userDataForm.get('email');
  }
  get street (){
    return this.userDataForm.get('address').get('street');
  }
  get suite (){
    return this.userDataForm.get('address').get('suite');
  }
  get city (){
    return this.userDataForm.get('address').get('city');
  }
  get zipcode (){
    return this.userDataForm.get('address').get('zipcode');
  }
  get latitude (){
    return this.userDataForm.get('address').get('geolocation').get('latitude');
  }
  get longitude (){
    return this.userDataForm.get('address').get('geolocation').get('longitude');
  }

  get phone (){
    return this.userDataForm.get('phone');
  }
  get website (){
    return this.userDataForm.get('website');
  }
  get companyname (){
    return this.userDataForm.get('company').get('companyname');
  }
  get catchPhrase (){
    return this.userDataForm.get('company').get('catchPhrase');
  }
  get business (){
    return this.userDataForm.get('company').get('business');``
  }
  

}


//Geo Code
// function getLocation(){
//   if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position)=>{
//         const longitude = position.coords.longitude;
//         const latitude = position.coords.latitude;
// console.log(longitude, latitude);
// //           this.callApi(longitude, latitude);
//       });
//   } else {
//      console.log("No support for geolocation")
//   }
// }

