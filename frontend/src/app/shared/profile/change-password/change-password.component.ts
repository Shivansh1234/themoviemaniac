import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ChangePassword } from 'src/app/models/changePasswordData';
import { Result } from 'src/app/models/result';
import { AuthService } from '../../auth.service';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private fb: FormBuilder, private sharedService: SharedService, private authService: AuthService) { }

  changePasswordForm: FormGroup = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, { validators: customCheck });

  changePassword(): void {
    let changePasswordData: ChangePassword = {
      oldPassword: this.changePasswordForm.get('oldPassword')?.value,
      newPassword: this.changePasswordForm.get('newPassword')?.value,
      confirmPassword: this.changePasswordForm.get('confirmPassword')?.value
    }
    this.sharedService.changePassword(changePasswordData).subscribe({
      next: (data: Result) => {
        this.authService.logout();
        this.sharedService.successSnackbar(`${data.message}`, 'Ok');
      },
      error: (err: HttpErrorResponse) => {
        this.sharedService.failureSnackbar(`${err.error.message}`, 'Ok');
      }
    });
  }

  ngOnInit(): void {
  }

}


export const customCheck: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const oldPassword = control.get('oldPassword')?.value;
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  console.log(oldPassword, newPassword, confirmPassword)
  if (oldPassword === newPassword) {
    return { samePassword: true }
  } else if (newPassword !== confirmPassword) {
    return { diffPassword: true }
  } else {
    return null;
  }
}