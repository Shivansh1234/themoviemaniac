import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Notif } from 'src/app/models/notif';
import { AuthService } from 'src/app/shared/auth.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService, private sharedService: SharedService) { }

  isLoggedIn: boolean = false;
  notifList: Notif[] = [];
  public readonly notifValue: Observable<Notif[]> = this.sharedService.notifObservable;

  logout(): void {
    this.authService.logout();
  }

  checkLoginStatus(): void {
    console.log('checking login status');
    this.authService.isLoginSubject.subscribe({
      next: (data) => {
        this.isLoggedIn = data;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error.message);
      }
    });
  }

  getUserNotifs(): void {
    this.sharedService.getUserNotifs().subscribe({
      next: (data: Notif[]) => {
        this.notifList = data;
        this.sharedService.setNotif(this.notifList);
      }
    });
  }

  ngOnInit(): void {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.getUserNotifs();
    }
  }

}
