import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.css']
})
export class AuthDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AuthDialogComponent>,
  ) { }

  ngOnInit(): void { }

  public eventSuccess(msg: string): void {
    console.log(msg);
    this.dialogRef.close(msg);
  }

}
