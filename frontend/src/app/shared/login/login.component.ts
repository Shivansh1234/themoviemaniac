import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginData } from 'src/app/models/loginData';
import { Notif } from 'src/app/models/notif';
import { User } from 'src/app/models/user';
import { AuthService } from '../auth.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private sharedService: SharedService, private authService: AuthService, private router: Router) { }

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  login(): void {

    let loginData: LoginData = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }

    this.sharedService.loginUser(loginData).subscribe({
      next: (data: User) => {
        this.authService.storeUserData(data.token as string, data.isAdmin);
        this.getUserNotifs();
        this.router.navigate(['/common/profile']);
        this.sharedService.successSnackbar(`Welcome ${data.fname}`, 'Thanks');
      },
      error: (err: HttpErrorResponse) => {
        this.sharedService.failureSnackbar(err.error.message, 'Ok');
      }
    });
  }

  getUserNotifs(): void {
    this.sharedService.getUserNotifs().subscribe({
      next: (data: Notif[]) => {
        console.log(data);
        this.sharedService.setNotif(data);
      }
    });
  }

  ngOnInit(): void {
  }

}
