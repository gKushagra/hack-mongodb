import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth.service';
import { ApplicationsComponent } from '../applications.component';

@Component({
  selector: 'app-new-dialog',
  templateUrl: './new-dialog.component.html',
  styleUrls: ['./new-dialog.component.css']
})
export class NewDialogComponent implements OnInit {

  public newApplicationForm: FormGroup;
  public saveApplicationError: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<NewDialogComponent>,
    private apiService: ApiService,
    private authService: AuthService,
  ) {
    this.newApplicationForm = new FormGroup({
      program: new FormControl('Program', [Validators.required]),
      deadline: new FormControl(null),
      status: new FormControl('Status', [Validators.required]),
      application_fee: new FormControl(null),
      tuition: new FormControl(null)
    });
  }

  ngOnInit(): void { }

  public saveNewApplication(): void {
    this.saveApplicationError = null;
    let application = this.newApplicationForm.value;
    application['id'] = null;
    application['school'] = this.dialogData.school.school;
    application['files'] = [];
    application['notes'] = [];
    console.log(application);
    this.apiService.saveApplication({
      id: this.authService.auth.user.id,
      application
    }).then(response => {
      console.log(response);
      this.dialogRef.close();
    })
      .catch(error => {
        console.log(error);
        this.saveApplicationError = "Oops! Please try again!"
      });
  }

}
