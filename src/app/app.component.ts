import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { DialogsComponent } from './dialogs/dialogs.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { HttpService } from './services/http.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userInfo: {
    id: string,
    names: string,
    lastNames: string,
    img: string,
    type: string,
    email: string,
    dataStudent?: {
      idNumber: string,
      career: string,
      free: boolean,
      teacherAssignment: string,
      cellphone: string,
      phone: string,
      address: string,
      schedule: string,
      hv: string,
      cardid: string,
      eps: string,
      enrollment: string,
      practice: string
    }
  } = {
    id: '',
    names: '',
    lastNames: '',
    img: '',
    type: '',
    email: '',
    dataStudent: {
      idNumber: '',
      career: '',
      free: null,
      teacherAssignment: '',
      cellphone: '',
      phone: '',
      address: '',
      schedule: '',
      hv: '',
      cardid: '',
      eps: '',
      enrollment: '',
      practice: ''
    }
  };

  constructor(
    public snackBar: MatSnackBar,
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
    if (this.url.path() === '/' && localStorage.getItem('us_token') != null) {
      this.userInfo = JSON.parse(localStorage.getItem('user'));
      this.router.navigate(['/inicio']);
    }
  }
}

export { DialogsComponent } from './dialogs/dialogs.component';
