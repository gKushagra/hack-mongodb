import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @Output() signUpSuccessEvent = new EventEmitter<string>();

  public signUpForm: FormGroup;
  public signUpError: string;
  public isPasswordVisible: boolean;

  constructor(
    private authService: AuthService,
  ) {
    this.signUpForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required])
    });
    this.isPasswordVisible = false;
    this.signUpError = null;
  }

  ngOnInit(): void { }

  public signup(): void {
    this.signUpError = null;
    if (this.signUpForm.value.password !== this.signUpForm.value.confirmPassword) {
      this.signUpError = "Passwords do not match";
      return;
    }
    this.authService.attemptSignup({
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password
    }).then(response => {
      console.log(response);
      // save token and update isAuthorized
      localStorage.setItem('token', response.token);
      localStorage.setItem('id', response.data.id);
      localStorage.setItem('email', response.data.email);
      this.authService.auth.user = {
        id: response.data.id,
        email: response.data.email,
        applications: [],
        favorites: []
      };
      this.authService.auth.isAuthenticated = true;
      this.signUpForm.patchValue({
        email: null,
        password: null,
        confirmPassword: null
      });
      this.signUpSuccessEvent.emit("Signup sucess");
    }).catch(error => {
      console.log("LOG::Signup Error - ", error);
      if (error.status === 409) {
        this.signUpError = "Account exists! Please login or use reset password service!";
      } else {
        this.signUpError = "Oops! Please try again later!";
      }
      this.signUpForm.patchValue({
        email: null,
        password: null,
        confirmPassword: null
      });
    });
  }

}
