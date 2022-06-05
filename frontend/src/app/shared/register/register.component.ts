import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterData } from 'src/app/models/registerData';
import { Result } from 'src/app/models/result';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder, private sharedService: SharedService, private router: Router) { }

  registerForm: FormGroup = this.fb.group({
    fname: ['', Validators.required],
    lname: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  register(): void {
    let registerData: RegisterData = {
      fname: this.registerForm.get('fname')?.value,
      lname: this.registerForm.get('lname')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value
    }
    this.sharedService.registerUser(registerData).subscribe({
      next: (data: Result) => {
        this.sharedService.successSnackbar(`${data.message}`, 'Ok');
        this.router.navigate(['/common/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.sharedService.failureSnackbar(`${err.error.message}`, 'Ok');
      }
    });
  }

  ngOnInit(): void {
  }

}
