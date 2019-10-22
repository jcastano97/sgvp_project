import { Component, OnInit } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import { HttpService } from '../services/http.service';
import { MatDialog } from '@angular/material';
import { DialogsComponent } from '../dialogs/dialogs.component';
import { AppComponent } from '../app.component';

import * as XLSX from 'xlsx';

type AOA = any[][];


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends AppComponent implements OnInit {
  private typeUser: any;
  private typeUserDefault: any = '1';
  private newU: any;
  private newUserMethodState: boolean;
  private getUserMethodState: boolean;
  private users: any;
  private programs: any[];
  private totalUsers: number;
  private getUsersParam: any = {
    us_id: '',
    text: '',
    rol: ''
  };
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
  private currentUview: any = null;
  private currentCview: any = null;
  private currentOtherUserview: any = null;
  private editUser = false;
  private editUserData: any;
  private usersDocente: any = [];

  dataUsers: any;
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName = 'SheetJS.xlsx';


  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('user'));
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
      lastnames: '',
      us_type: '',
      st_career: ''
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
    this.currentCview = { us_img: null };
    this.currentOtherUserview = { us_img: null };
    this.getUsersDocente();
  }

  public createUser(typeUserDefault) {
    this.newU.us_type = typeUserDefault;
    if (this.newU.email !== '' && this.newU.pass !== '' && this.newU.names !== ''
      && this.newU.lastNames !== '' && this.newU.us_type !== '') {
      this.newU.pass = Md5.hashStr(this.newU.pass);
      const data = {
        function: 'NewUser',
        query: this.newU,
        us_id: this.userInfo.id,
        token: localStorage.getItem('us_token'),
        us_type: this.userInfo.type
      };
      this.newUserMethodState = true;
      this.service.set(data).subscribe(response => {
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
      param: JSON.stringify(this.getUsersParam),
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.get(data).subscribe(response => {
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
    this.editUser = false;
    this.currentUview = data;
    document.getElementById('view-u').style.width = '420px';
    document.getElementById('view-u').style.padding = '20px';
    /*if (data.us_type == 1) {
      this.currentUview = data;
      document.getElementById('view-u').style.width = '420px';
      document.getElementById('view-u').style.padding = '20px';
    } else if (data.us_type === 2) {
      this.currentCview = data;
      document.getElementById('view-c').style.width = '420px';
      document.getElementById('view-c').style.padding = '20px';
    } else {
      this.currentOtherUserview = data;
      document.getElementById('view-other').style.width = '420px';
      document.getElementById('view-other').style.padding = '20px';
    }*/
    console.log(data);
  }

  public closeviewUser() {
    document.getElementById('view-u').style.width = '0px';
    document.getElementById('view-u').style.padding = '0px';
  }
  /*
  public closeviewCompany() {
    document.getElementById('view-c').style.width = '0px';
    document.getElementById('view-c').style.padding = '0px';
  }

  public closeviewOtherUser() {
    document.getElementById('view-other').style.width = '0px';
    document.getElementById('view-other').style.padding = '0px';
  }
  */

  public getPrograms() {

    const data = {
      function: 'GetPrograms',
      us_id: localStorage.getItem('us_id'),
      token: localStorage.getItem('us_token'),
      us_type: localStorage.getItem('us_type')
    };
    this.service.get(data).subscribe(response => {
      this.programs = response.data;
    });
  }

  onFileChange(evt: any) {
    const inputNode: any = document.querySelector('#fileExcel');
    document.querySelector('#fileExcel_p').textContent = inputNode.files[0].name;
    /* wire up file reader */
    const target: DataTransfer = (evt.target) as DataTransfer;
    if (target.files.length !== 1) { throw new Error('Cannot use multiple files'); }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws, {header: 1});
      const validate = this.validateUsers('1', data);
      if (validate.state == 'ok') {
        console.log(validate.data);
        this.dataUsers = validate.data;
      } else {
        console.log(validate);
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  validateUsers(type: '1', data: any) {
    console.log(data);
    let response: any = { state: 'ok' };
    const colums = data[0];
    data.splice(0, 1);
    if (colums[0] !== 'nombres') {
      response = { state: 'error', message: 'El formato del excel no coincide, la columna 1 fila 1 debe contener los nombres' };
    }
    if (colums[1] !== 'apellidos') {
      response = { state: 'error', message: 'El formato del excel no coincide, la columna 2 fila 1 debe contener los apellidos' };
    }
    if (colums[2] !== 'carrera') {
      response = { state: 'error', message: 'El formato del excel no coincide, la columna 3 fila 1 debe contener la carrera' };
    }
    if (colums[3] !== 'correo') {
      response = { state: 'error', message: 'El formato del excel no coincide, la columna 4 fila 1 debe contener el correo' };
    }
    if (colums[4] !== 'cedula') {
      response = { state: 'error', message: 'El formato del excel no coincide, la columna 5 fila 1 debe contener el correo' };
    }
    if (response.state === 'ok') {
      response.data = [];
      for (const x in data) {
        console.log(data[x][4]);
        let errorMessage = '';
        const user: any = {};
        if (data[x][0] && data[x][0] != '') {
          user.names = data[x][0];
        } else {
          errorMessage = 'El formato del excel no coincide, la columna 1 fila ' + x +
              ' debe contener un nombre valido del usuario';
        }
        if (data[x][1] && data[x][1] != '') {
          user.lastnames = data[x][1];
        } else {
          errorMessage = 'El formato del excel no coincide, la columna 2 fila ' + x +
              ' debe contener un apellido valido del usuario';
        }
        if (data[x][2] && data[x][2] != '') {
          user.career = data[x][2];
        } else {
          errorMessage = 'El formato del excel no coincide, la columna 3 fila ' + x +
              ' debe contener una carrera valida del usuario';
        }
        if (data[x][3] && data[x][3] != '') {
          user.email = data[x][3];
        } else {
          errorMessage = 'El formato del excel no coincide, la columna 4 fila ' + x +
              ' debe contener un correo valido del usuario';
        }
        if (data[x][4] && data[x][4] != '') {
          console.log("id number");
          user.idNumber = data[x][4];
        } else {
          console.log("no id number");
          errorMessage = 'El formato del excel no coincide, la columna 5 fila ' + x +
              ' debe contener un número de cedula';
        }
        if (!user.names && !user.lastnames && !user.career && !user.email && !user.idNumber) {
          // campo vacio
        } else {
          user.errorMessage = errorMessage;
          user.password = 'e10adc3949ba59abbe56e057f20f883e';
          response.data.push(user);
        }
      }
    }
    return response;
  }

  saveUsers() {
    console.log('saveUsers');
    const validUsers = [];
    for (let i = 0; i < this.dataUsers.length; i++) {
      if (!this.dataUsers[i].errorMessage) {
        validUsers.push(this.dataUsers[i]);
      }
    }
    if (validUsers.length != 0) {
      const data = {
        function: 'NewUsers',
        param: '{ "data": ' + JSON.stringify(validUsers) + '}',
        us_id: this.userInfo.id,
        token: localStorage.getItem('us_token'),
        us_type: this.userInfo.type
      };
      this.service.set(data).subscribe(response => {
        console.log('ok');
        console.log(response);
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Los usuarios han sido creados', msg: response.data}
        });
      });
    } else {
      this.dialog.open(DialogsComponent, {
        width: '350px',
        height: 'auto',
        data: { typeDialog: 'alert', title: 'No hay usuarios validos', msg: ''}
      });
    }
  }

  public onFileSelected(nameFile: string, nameToSave: string, studentId?: number) {
    const inputNode: any = document.querySelector('#' + nameFile);
    document.querySelector('#' + nameFile + '_p').textContent = inputNode.files[0].name;
    console.log(inputNode.files);
    const fileList: FileList = inputNode.files;
    if (fileList.length > 0) {
      const fileToUpload = fileList.item(0);
      const formData: FormData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      console.log(formData.getAll('file'));
      this.service.sendData(this.userInfo, formData, nameToSave, studentId, {id: this.currentUview.us_id, type: this.currentUview.us_type}).subscribe(response => {
        console.log('subscribe');
        console.log(response);
        if (response.data === 'ok') {
          if (nameToSave === 'hv.pdf') {
            this.currentUview.st_hv = response.url;
          }
          if (nameToSave === 'cardid.pdf') {
            if (this.currentUview.us_type == 1) {
              this.currentUview.st_cardid = response.url;
            } else if (this.currentUview.us_type == 2) {
              this.currentUview.comin_cardid = response.url;
            }
          }
          if (nameToSave === 'eps.pdf') {
            this.currentUview.st_eps = response.url;
          }
          if (nameToSave === 'enrollment.pdf') {
            this.currentUview.st_enrollment = response.url;
          }
          if (nameToSave === 'practice.pdf') {
            this.currentUview.st_practice = response.url;
          }
          if (nameToSave === 'commerce.pdf') {
            this.currentUview.comin_commerce = response.url;
          }
          if (nameToSave === 'rut.pdf') {
            this.currentUview.comin_rut = response.url;
          }
          if (nameToSave === 'possesion.pdf') {
            this.currentUview.comin_possesion = response.url;
          }
          if (nameToSave === 'conveniomarco.pdf') {
            this.currentUview.comin_agreement = response.url;
          }
          if (nameToSave === 'decretodep.pdf') {
            this.currentUview.comin_resolution = response.url;
          }
          if (nameToSave === 'conveniopractica.pdf') {
            this.currentUview.st_agreement_practice = response.url;
          }
          if (nameToSave === 'actapractica.pdf') {
            this.currentUview.st_acta_practice = response.url;
          }
          if (nameToSave === 'actacumplimiento.pdf') {
            this.currentUview.st_acta_cumplimiento = response.url;
          }
          if (nameToSave === 'informefinalpractica.pdf') {
            this.currentUview.st_informefinal_practice = response.url;
          }
          if (nameToSave === 'avancemensual.pdf') {
            this.currentUview.advance.push({stav_document: response.url});
          }
          if (nameToSave === 'seguimientoasesoria.pdf') {
            this.currentUview.tracing.push({stseas_document: response.url});
          }
          if (nameToSave === 'pazysalvo.pdf') {
            this.currentUview.st_paz_salvo = response.url;
          }
          this.dialog.open(DialogsComponent, {
            width: '350px',
            height: 'auto',
            data: { typeDialog: 'alert', title: 'Proceso', msg: 'Información actualizada'}
          });
        } else {
          this.dialog.open(DialogsComponent, {
            width: '350px',
            height: 'auto',
            data: {
              typeDialog: 'alert',
              title: 'Espera...', msg: 'No fue posible actualizar el documento, por favor vuelva a intentarlo.'
            }
          });
        }
      });
    }
  }

  public toogleEditUser() {
    console.log(this.currentUview);
    console.log(this.editUserData);
    this.editUserData = this.currentUview;
    this.editUser = !this.editUser;
  }

  public saveEditUser() {
    console.log(this.editUserData);
    this.editUser = false;
    console.log('UpdateUser');
    let data;
    if (this.editUserData.us_type === 1) {
      data = {
        function: 'UpdateUser',
        us_id: this.editUserData.us_id,
        token: localStorage.getItem('us_token'),
        us_type: this.editUserData.us_type,
        us_email: this.editUserData.us_email,
        us_names: this.editUserData.us_names,
        us_lastnames: this.editUserData.us_lastnames,
        us_state: this.editUserData.us_state,
        st_idnumber: this.editUserData.st_idnumber,
        st_career: this.editUserData.st_career,
        st_isfree: this.editUserData.st_isfree,
        st_teacherassc: this.editUserData.st_teacherassc,
        st_celphone: this.editUserData.st_celphone,
        st_phone: this.editUserData.st_phone,
        st_address: this.editUserData.st_address,
        st_schedule: this.editUserData.st_schedule
      };
    }

    if (this.editUserData.us_type == 2) {
      data = {
        function: 'UpdateUser',
        us_id: this.editUserData.us_id,
        token: localStorage.getItem('us_token'),
        us_type: this.editUserData.us_type,
        us_email: this.editUserData.us_email,
        us_names: this.editUserData.us_names,
        us_lastnames: this.editUserData.us_lastnames,
        us_state: this.editUserData.us_state,
        comin_name: this.editUserData.comin_name,
        comin_phone: this.editUserData.comin_phone,
        comin_nit: this.editUserData.comin_nit,
        comin_address: this.editUserData.comin_address,
        comin_razon: this.editUserData.comin_razon
      };
    }

    if (this.editUserData.us_type == 3 || this.editUserData.us_type == 4) {
      data = {
        function: 'UpdateUser',
        us_id: this.editUserData.us_id,
        token: localStorage.getItem('us_token'),
        us_type: this.editUserData.us_type,
        us_email: this.editUserData.us_email,
        us_names: this.editUserData.us_names,
        us_lastnames: this.editUserData.us_lastnames,
        us_state: this.editUserData.us_state
      };
    }

    //console.log(data);
    this.service.update(data).subscribe(response => {
      console.log('subscribe');
      console.log(response);
      if (response.data === 'ok') {
        localStorage.setItem('user', JSON.stringify(this.userInfo));
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Completado', msg: 'Información actualizada'}
        });
      } else {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'No se pudo actualizar la información.'}
        });
      }
    });
  }

  public getUsersDocente() {
    const data = {
      function: 'GetUsers',
      limit: 1000,
      offset: 0,
      param: '{"rol": "4"}',
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.get(data).subscribe(response => {
      this.usersDocente = response.data;
    });
  }

  public changePhoto(): void {
    document.getElementById('input-home-photo').click();
  }

  public fileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log('fileSelected');
    console.log(input);
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      let base64Image = '';
      reader.readAsDataURL(input.files[0]);
      reader.onload = () => {
        base64Image = reader.result.toString();
        console.log(base64Image);
        this.newU.us_img = base64Image;
      };
    }
  }
}
