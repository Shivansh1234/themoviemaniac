import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Notif } from 'src/app/models/notif';
import { Result } from 'src/app/models/result';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(private sharedService: SharedService) { }

  public readonly notifValue: Observable<Notif[]> = this.sharedService.notifObservable;

  markAsRead(notifId: string): void {
    this.sharedService.markAsRead(notifId).subscribe({
      next: (data: Result) => {
        console.log('mark');
      },
      error: (err: HttpErrorResponse) => {
        this.sharedService.failureSnackbar(`${err.error.message}`, 'Ok');
      }
    });
  }

  ngOnInit(): void {
  }

}
