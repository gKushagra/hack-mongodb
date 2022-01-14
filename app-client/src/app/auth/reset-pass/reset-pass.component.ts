import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {

  public resetPasswordForm: FormGroup;
  public resetPasswordError: string;
  public isPasswordVisible: boolean;
  private token: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required])
    });
    this.isPasswordVisible = false;
  }

  ngOnInit(): void {
    setTimeout(() => {
      console.log('here');
      this.route.queryParams.subscribe(params => {
        this.token = params['token'];
        console.log(this.token);
        if (!this.token) {
          this.router.navigate(['home']);
        }
      });
    }, 10000);
  }

  public resetPassword(): void {
    this.resetPasswordError = null;
    if (this.resetPasswordForm.value.password !== this.resetPasswordForm.value.confirmPassword) {
      this.resetPasswordError = "Passwords dont match!";
    }
    this.authService.attemptResetPassword({
      password: this.resetPasswordForm.value.password,
      token: this.token
    })
      .then(response => {
        console.log(response);
        // save token and update isAuthorized
        this.resetPasswordForm.patchValue({
          password: null,
          confirmPassword: null,
        });
        this.router.navigate(['home']);
      }).catch(error => {
        console.log("LOG::Password Reset Error - ", error);
        if (error.status === 400) {
          this.resetPasswordError = "Invalid request";
        } else {
          this.resetPasswordError = "Oops! Please try again after sometime!";
        }
        this.resetPasswordForm.patchValue({
          password: null,
          confirmPassword: null,
        });
      });
  }

}
