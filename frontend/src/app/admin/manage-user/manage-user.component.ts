import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Result } from 'src/app/models/result';
import { User } from 'src/app/models/user';
import { SharedService } from 'src/app/shared/shared.service';
import { AdminService } from '../admin.service';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {

  constructor(private adminService: AdminService, private dialog: MatDialog, private sharedService: SharedService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<User>();

  // Mat Table requirements
  displayedColumns: string[] = ['id', 'fname', 'lname', 'email', 'isAdmin', 'createdAt', 'delete'];

  page: number = 0;
  limit: number = 5;
  total: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  sortActive: string = "";
  sortDirection: SortDirection = "";

  userList: User[] = [];
  searchForm = new FormControl('', [Validators.required, Validators.minLength(3)]);
  searchVal: string = "";

  getUserList(): void {
    this.adminService.getAllUsers(this.paginator.pageIndex + 1, this.limit, this.sortActive, this.sortDirection, this.searchVal).subscribe({
      next: (data) => {
        this.userList = data.result;
        console.log(data);
        this.total = data.totalCount;
        this.dataSource = new MatTableDataSource(this.userList);
      },
      error: (err: HttpErrorResponse) => {
        this.sharedService.failureSnackbar(err.error.message, 'Ok');
      }
    });
  }

  // Delete User Dialog Box
  deleteDialog(user: User) {
    const dialogRef = new MatDialogConfig();
    dialogRef.data = {
      metaData: {
        name: 'User',
        action: 'delete'
      },
      data: user
    };
    dialogRef.autoFocus = false;
    this.dialog.open(ConfirmDialogComponent, dialogRef).afterClosed().subscribe(result => {
      if (result) {
        this.adminService.deleteUser(user._id).subscribe({
          next: (data: Result) => {
            this.getUserList();
            this.sharedService.successSnackbar(`${user.email} ${data.message}`, 'Ok');
          },
          error: (err: HttpErrorResponse) => {
            this.sharedService.failureSnackbar(`${err.error.message}`, 'Ok');
          }
        });
      }
    });
  }

  adminToggle(event: MatSlideToggleChange, user: User): void {
    event.source.checked = !event.source.checked;
    // Next line is done to protect slide toggle change before confirmation dialog
    if (event.source.checked) {
      this.makeAdminDialog(user);
    } else {
      this.removeAdminDialog(user);
    }
  }

  removeAdminDialog(user: User) {
    const dialogRef = new MatDialogConfig();
    dialogRef.data = {
      metaData: {
        name: 'User',
        action: 'Remove Admin'
      },
      data: user
    };
    dialogRef.autoFocus = false;
    this.dialog.open(ConfirmDialogComponent, dialogRef).afterClosed().subscribe(result => {
      if (result) {
        this.adminService.removeAdmin(user._id).subscribe({
          next: (data: Result) => {
            this.sharedService.successSnackbar(`${data.message}`, 'Ok');
            this.getUserList();
          },
          error: (err: HttpErrorResponse) => {
            this.sharedService.failureSnackbar(err.error.message, 'Ok');
          }
        });
      }
    });
  }

  makeAdminDialog(user: User) {
    const dialogRef = new MatDialogConfig();
    dialogRef.data = {
      metaData: {
        name: 'User',
        action: 'Make Admin'
      },
      data: user
    };
    this.dialog.open(ConfirmDialogComponent, dialogRef).afterClosed().subscribe(result => {
      if (result) {
        this.adminService.makeAdmin(user._id).subscribe({
          next: (data: Result) => {
            this.sharedService.successSnackbar(`${data.message}`, 'Ok');
            this.getUserList();
          },
          error: (err: HttpErrorResponse) => {
            this.sharedService.failureSnackbar(err.error.message, 'Ok');
          }
        });
      }
    });
  }

  // reset(): void {
  //   this.sortDirection = "";
  //   this.sortActive = "";
  //   this.searchForm.reset();
  //   this.searchForm.setValue("");
  //   this.page = 0;
  //   this.limit = 5;
  //   this.getUserList();
  // }

  ngOnInit(): void {
    // this.getUserList();
  }

  pageChanged(event: PageEvent) {
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.getUserList();
  }

  sortChange(event: Sort) {
    console.log(event);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    // Resetting Page Index
    this.sortActive = event.active;
    this.sortDirection = event.direction;
    this.getUserList();
  }

  searchTable(): void {
    this.searchVal = this.searchForm.value;
    this.getUserList();
  }

  ngAfterViewInit(): void {
    this.getUserList();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
