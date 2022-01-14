import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  @Output() resetPasswordSuccessEvent = new EventEmitter<string>();

  public resetPasswordForm: FormGroup;
  public resetPasswordError: string;
  public resetPasswordMessage: string;

  constructor(
    private authService: AuthService,
  ) {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  ngOnInit(): void { }

  public resetPassword(): void {
    this.resetPasswordError = null;
    this.authService.requestPasswordResetLink(this.resetPasswordForm.value)
      .then(response => {
        console.log(response);
        // save token and update isAuthorized
        this.resetPasswordMessage = response;
        this.resetPasswordForm.patchValue({
          email: null,
        });
        this.resetPasswordSuccessEvent.emit("Reset password sucess");
      }).catch(error => {
        console.log("LOG::Reset Password Error - ", error);
        if (error.status === 400) {
          this.resetPasswordError = "Account does not exist! Please sign up!"
        } else {
          this.resetPasswordError = "Oops! Please try again later!"
        }
        this.resetPasswordForm.patchValue({
          email: null,
        });
      });
  }

}
