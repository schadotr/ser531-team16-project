import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public commonService: CommonService, public router: Router) { }

  otpVerification = false;
  userName = "";
  password = "";
  sUserName = "";
  sPassword = "";
  confirmSPassword = "";
  loading = false;

  ngOnInit(): void {
    this.commonService.routeName = 'login';
  }

  ngAfterViewInit() {
    this.loginText = <HTMLElement>document.querySelector(".title-text .login");
    this.loginForm = <HTMLElement>document.querySelector("form.login");
    this.loginBtn = document.querySelector("label.login");
    this.signupBtn = document.querySelector("label.signup");
    this.signupLink = document.querySelector("form .signup-link a");
  }

  loginText = <HTMLElement>document.querySelector(".title-text .login");
  loginForm = <HTMLElement>document.querySelector("form.login");
  loginBtn = document.querySelector("label.login");
  signupBtn = <HTMLElement>document.querySelector("label.signup");
  signupLink = document.querySelector("form .signup-link a");



  login() {
    this.loginForm.style.marginLeft = "0%";
    this.loginText.style.marginLeft = "0%";
  }

  signUp() {
    this.signupBtn.click();
    this.loginForm.style.marginLeft = "-50%";
    this.loginText.style.marginLeft = "-50%";
  }


  finalLogin() {
    this.commonService.loginSubscription({ "username": this.userName, "password": this.password }).pipe(take(1)).subscribe((response) => {
      console.log('hheelloo');
      this.router.navigate(['recommender'])
    })

  }

  finalSignUp() {
    // fetch('http:')
  }

  finalValidate() {

  }

}
