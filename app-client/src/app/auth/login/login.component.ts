import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() loginSuccessEvent = new EventEmitter<string>();

  public loginForm: FormGroup;
  public loginError: string;
  public isPasswordVisible: boolean;

  constructor(
    public authService: AuthService,
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
    this.isPasswordVisible = false;
  }

  ngOnInit(): void { }

  public login(): void {
    this.loginError = null;
    this.authService.attemptLogin(this.loginForm.value)
      .then(response => {
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
        this.loginForm.patchValue({
          email: null,
          password: null,
        });
        this.loginSuccessEvent.emit("Login sucess");
      }).catch(error => {
        console.log("LOG::Login Error - ", error);
        if (error.status === 400 || error.status === 401) {
          this.loginError = "Incorrect email or password!";
        } else {
          this.loginError = "Oops! Please try again after sometime!";
        }
        this.loginForm.patchValue({
          email: null,
          password: null,
        });
      });
  }

}
