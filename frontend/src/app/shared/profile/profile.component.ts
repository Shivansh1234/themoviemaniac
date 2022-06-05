import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { AdminRequestDialogComponent } from '../dialog/admin-request-dialog/admin-request-dialog.component';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private sharedService: SharedService, private dialog: MatDialog) { }

  userData: User = {
    fname: '',
    lname: '',
    _id: '',
    email: '',
    isAdmin: false,
    createdAt: new Date
  }

  getProfileDetails(): void {
    this.sharedService.getUserData().subscribe({
      next: (data: User) => {
        this.userData = data;
      },
      error: (err: HttpErrorResponse) => {
        this.sharedService.failureSnackbar(err.error.message, 'Ok');
      }
    });
  }

  requestDialog(): void {
    this.dialog.open(AdminRequestDialogComponent);
  }

  ngOnInit(): void {
    this.getProfileDetails();
  }

}
