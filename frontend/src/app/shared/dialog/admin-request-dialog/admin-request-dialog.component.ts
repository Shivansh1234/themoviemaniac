import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-admin-request-dialog',
  templateUrl: './admin-request-dialog.component.html',
  styleUrls: ['./admin-request-dialog.component.scss']
})
export class AdminRequestDialogComponent implements OnInit {

  constructor(private sharedService: SharedService) { }

  adminList: User[] = [];

  selectedAdmin = new FormControl('', Validators.required);

  getAllAdmins(): void {
    this.sharedService.getAllAdmins().subscribe({
      next: (data: User[]) => {
        console.log(data);
        this.adminList = data;
      },
      error: (err: HttpErrorResponse) => {
        this.sharedService.failureSnackbar(`${err.error.message}`, 'Ok');
      }
    });
  }

  ngOnInit(): void {
    this.getAllAdmins();
  }

}
