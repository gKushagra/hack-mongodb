import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { Application } from '../models';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {

  public displayedColumns: string[] = ['college', 'program', 'deadline', 'status', 'application_fee', 'tuition', 'actions'];
  public dataSource: MatTableDataSource<Application>;
  private applications: Application[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.apiService.getApplications({ id: this.authService.auth.user.id })
      .then(response => {
        console.log(response);
        this.applications = response.map(r => r.application);
        console.log(this.applications);
        this.authService.auth.user.applications = this.applications;
        this.dataSource = new MatTableDataSource(this.applications);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
      .catch(error => console.log(error));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
