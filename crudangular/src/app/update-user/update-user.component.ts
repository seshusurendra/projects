import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DataServiceService } from '../data-service.service';
import { userDataPostModel } from '../model/userDataPost.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router'



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})


export class UpdateUserComponent implements OnInit {

  constructor(public ActivatedRoute : ActivatedRoute, private fb : FormBuilder, private dataService : DataServiceService, private snackbar : MatSnackBar, public router : Router) { }
  
  
  userId : number;
  updateForm : FormGroup;
 
    updateFormValue(data){
      this.name.setValue(data.name);
      this.username.setValue(data.username);
      this.email.setValue(data.email);
      this.street.setValue(data.address.street);
      this.suite.setValue(data.address.suite);
      this.city.setValue(data.address.city);
      this.zipcode.setValue(data.address.zipcode);
      this.latitude.setValue(data.address.geo.lat);
      this.longitude.setValue(data.address.geo.lng);
      this.phone.setValue(data.phone);
      this.website.setValue(data.website);
      this.companyname.setValue(data.company.name);
      this.catchPhrase.setValue(data.company.catchPhrase);
      this.business.setValue(data.company.bs);
    }
   
  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe(params => {
      this.userId = params['id'];
    });
    this.dataService.getUser(this.userId).subscribe((resp) => {
      this.updateFormValue(resp);
      }, (err) => {
      console.log(err);
    })
    this.updateForm = this.fb.group({
      userId : [this.userId,[Validators.required]],
      name : ['', [Validators.required,Validators.minLength(5), Validators.maxLength(15)]],
      username : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      email : ['', [Validators.required, Validators.email]],
      address : this.fb.group({
        street : ['', [Validators.required, Validators.minLength(7)]],
        suite : ['', [Validators.required, Validators.minLength(5)]],
        city : ['',[Validators.required, Validators.minLength(5), Validators.pattern(/^[a-zA-Z ,.]+$/)]],
        zipcode : ['',[Validators.required, Validators.minLength(5), Validators.pattern(/^[0-9-/]+$/)]],
        geolocation : this.fb.group({
            latitude: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/-?[0-9]{1,3}[.][0-9]+/)]],
            longitude : ['',[Validators.required, Validators.minLength(5), Validators.pattern(/-?[0-9]{1,3}[.][0-9]+/)]]
          })
      }),
      phone : ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      website : ['', [Validators.required, Validators.minLength(10)]],
      company : this.fb.group({
          companyname : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
          catchPhrase : ['', [Validators.required, Validators.pattern(/^[a-zA-Z ,-/!@#$%&*(^()).]+$/)]],
          business : ['', [Validators.required, Validators.minLength(5)]]
      })  
  })
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

matcher = new MyErrorStateMatcher();


onSubmit(){
  const userData = this.updateForm.value;
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
  
  this.dataService.postEditData(headers, body , this.userId).subscribe((editedData) => {
   console.log(editedData);
  //  console.log(editedData['name']);
   var DataLocalStorage = JSON.parse(localStorage.getItem('userData'));
   var foundEle = DataLocalStorage.findIndex((user) => user.id === editedData['id']);
   DataLocalStorage[foundEle] = editedData;
   localStorage.removeItem('userData');
   localStorage.setItem('userData', JSON.stringify(DataLocalStorage));
   this.openSnackBar(`User Data Updated`, 'close' );
   this.router.navigate(['/viewusers']);
  }, (err) => {
    this.openSnackBar(`${err.statusText} Status Code  ${err.status}`, 'close' );
  })
}

get name (){
  return this.updateForm.get('name');
}

get username (){
  return this.updateForm.get('username');
}
get email (){
  return this.updateForm.get('email');
}
get street (){
  return this.updateForm.get('address').get('street');
}
get suite (){
  return this.updateForm.get('address').get('suite');
}
get city (){
  return this.updateForm.get('address').get('city');
}
get zipcode (){
  return this.updateForm.get('address').get('zipcode');
}
get latitude (){
  return this.updateForm.get('address').get('geolocation').get('latitude');
}
get longitude (){
  return this.updateForm.get('address').get('geolocation').get('longitude');
}

get phone (){
  return this.updateForm.get('phone');
}
get website (){
  return this.updateForm.get('website');
}
get companyname (){
  return this.updateForm.get('company').get('companyname');
}
get catchPhrase (){
  return this.updateForm.get('company').get('catchPhrase');
}
get business (){
  return this.updateForm.get('company').get('business');
}


}
