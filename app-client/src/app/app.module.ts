import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ApiService } from "./api.service";
import { HttpClientModule } from '@angular/common/http';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterService } from './filter.service';
import { AuthService } from "./auth.service";
import { ResetComponent } from './auth/reset/reset.component';
import { AuthDialogComponent } from './auth/auth-dialog/auth-dialog.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ResetPassComponent } from './auth/reset-pass/reset-pass.component';
import { ApplicationsComponent } from './applications/applications.component';
import { NewDialogComponent } from './applications/new-dialog/new-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchResultsComponent,
    ToolbarComponent,
    ResetComponent,
    AuthDialogComponent,
    LoginComponent,
    SignupComponent,
    ResetPassComponent,
    ApplicationsComponent,
    NewDialogComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [
    ApiService,
    FilterService,
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
