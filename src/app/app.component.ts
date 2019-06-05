import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { DialogsComponent } from './dialogs/dialogs.component';
import { MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { HttpService } from './services/http.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public router: Router,
    public dialog: MatDialog,
    private url: LocationStrategy,
    public formBuilder: FormBuilder,
    public service: HttpService,
    public http: HttpClient
  ) {
    this.LogInLogin();
  }

  private LogInLogin() {
    if (this.url.path() === '/' && localStorage.getItem('ustk_token') != null) {
      this.router.navigate(['/inicio']);
    }
  }
}

export { DialogsComponent } from './dialogs/dialogs.component';
