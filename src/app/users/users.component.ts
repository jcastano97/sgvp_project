import { Component, OnInit } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import { HttpService } from '../services/http.service';
import { MatDialog } from '@angular/material';
import { DialogsComponent } from '../dialogs/dialogs.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private typeUser: any;
  private typeUserDefault: any = '1';
  private newU: any;
  private newUserMethodState: boolean;
  private getUserMethodState: boolean;
  private users: any;
  private programs: any;
  private totalUsers: number;
  private readonly getUsersParam: any;
  private getUsersOffset: number;
  private listFilter = [
    {value: '0', viewValue: 'Todos'},
    {value: '1', viewValue: 'Estudiantes'},
    {value: '2', viewValue: 'Empresas'},
    {value: '3', viewValue: 'Admin'},
    {value: '4', viewValue: 'Docente'},
    {value: '5', viewValue: 'Est. con Contrato'},
    {value: '6', viewValue: 'Est. sin Contrato'}
  ];
  private currentUview: any;


  constructor( public service: HttpService, public dialog: MatDialog ) {
    this.typeUser = [
      {value: '1', viewValue: 'Estudiante'},
      {value: '2', viewValue: 'Empresa'},
      {value: '3', viewValue: 'Administrador'},
      {value: '4', viewValue: 'Docente'}
    ];
    this.newU = {
      email: '',
      pass: '',
      names: '',
      lastNames: '',
      us_type: '',
      st_career: ''
    };
    this.getUsersParam = {
      text: '',
      rol: '0'
    };
    this.getUsersOffset = 0;
    this.newUserMethodState = false;
    this.getUserMethodState = false;
    this.users = [];
    this.programs = [];
    this.totalUsers = 0;
    this.getPrograms();
    this.getUsers(10, this.getUsersOffset, this.getUsersParam);
    this.currentUview = { us_img: null };
  }

  ngOnInit() {
  }

  public createUser(typeUserDefault) {
    this.newU.us_type = typeUserDefault;
    if (this.newU.email !== '' && this.newU.pass !== '' && this.newU.names !== ''
      && this.newU.lastNames !== '' && this.newU.us_type !== '') {
      this.newU.pass = Md5.hashStr(this.newU.pass);
      const data = {
        function: 'NewUser',
        query: this.newU,
        us_id: localStorage.getItem('us_id'),
        token: localStorage.getItem('ustk_token'),
        us_type: localStorage.getItem('us_type')
      };
      this.newUserMethodState = true;
      this.service.set(data).subscribe(res => {
        const response = res.json();
        setTimeout(() => {
          this.newUserMethodState = false;
        }, 500);
        if (response.data === 'user-exist') {
          const dialogRef = this.dialog.open(DialogsComponent, {
            width: '350px',
            height: 'auto',
            data: { typeDialog: 'alert', title: 'Espera...', msg: 'El correo electrónico ya ha sido usado en otra cuenta.'}
          });
          return;
        } else if (response.data === 'user-create') {
          const dialogRef = this.dialog.open(DialogsComponent, {
            width: '350px',
            height: 'auto',
            data: { typeDialog: 'alert', title: 'Completado', msg: 'Nuevo usuario registrado.'}
          });
        }
        this.newU = {
          email: '',
          pass: '',
          names: '',
          lastNames: ''
        };
        this.getUsers(10, this.getUsersOffset, this.getUsersParam);
      });

    }

  }

  public createUserExcel() {
    document.getElementById('input-users-excel').click();

  }

  public filesSelectcreateUserExcel(): void {
  }

  public getUsers(limit, offset, param) {
    this.getUserMethodState = true;
    const data = {
      function: 'GetUsers',
      limit,
      offset,
      param,
      us_id: localStorage.getItem('us_id'),
      token: localStorage.getItem('ustk_token'),
      us_type: localStorage.getItem('us_type')
    };
    this.service.get(data).subscribe(res => {
      const response = res.json();
      this.getUserMethodState = false;
      if (this.getUsersOffset !== 0) {
        this.users = this.users.concat(response.data);
      } else {
        this.users = response.data;
        this.totalUsers = response.data_length;
      }
    });
  }

  public getUsersMore() {

    this.getUsersOffset = this.users.length;
    this.getUsers(10, this.getUsersOffset, this.getUsersParam);

  }

  public searchUser(ev) {
    this.getUsersOffset = 0;
    this.getUsers(10, this.getUsersOffset, this.getUsersParam);
  }

  public searchUserRol(ev) {
    this.getUsersOffset = 0;
    this.getUsers(10, this.getUsersOffset, this.getUsersParam);
  }


  public viewUser(data) {

    this.currentUview = data;
    document.getElementById('view-u').style.width = '420px';
    document.getElementById('view-u').style.padding = '20px';
    console.log(data);

  }

  public closeviewUser() {
    document.getElementById('view-u').style.width = '0px';
    document.getElementById('view-u').style.padding = '0px';
  }


  public getPrograms() {

    const data = {
      function: 'GetPrograms',
      us_id: localStorage.getItem('us_id'),
      token: localStorage.getItem('ustk_token'),
      us_type: localStorage.getItem('us_type')
    };
    this.service.get(data).subscribe(res => {
      const response = res.json();
      this.programs = response.data;
    });
  }
}
