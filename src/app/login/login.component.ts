import { Component, OnInit } from '@angular/core';
import { DialogsComponent } from '../dialogs/dialogs.component';
import { Md5 } from 'ts-md5/dist/md5';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends AppComponent implements OnInit {
  private typeuser = [
    {value: '1', viewValue: 'Estudiante'},
    {value: '2', viewValue: 'Empresa'},
    {value: '3', viewValue: 'Administrador'},
    {value: '4', viewValue: 'Docente'}
  ];
  private typeuserDefault: any = '2';
  private username: string;
  private password: string;
  private loginMethodState: boolean;

  ngOnInit() {
    this.username = '';
    this.password = '';
    this.loginMethodState = false;
  }

  public login(email: string, password: string) {


    if (this.loginMethodState === true) {
      return false;
    }

    this.loginMethodState = true;
    const md5 = new Md5();
    const data = {
      function: 'LoginUser',
      email,
      password: md5.appendStr(password).end(),
      type_u: this.typeuserDefault
    };
    if (email === '') {
      this.dialog.open(DialogsComponent, {
        width: '350px',
        height: 'auto',
        data: { typeDialog: 'alert', title: 'Espera...', msg: 'La dirección de correo electrónico esta vacia.'}
      });
      this.loginMethodState = false;
      return false;
    }
    if (password === '') {
      this.dialog.open(DialogsComponent, {
        width: '350px',
        height: 'auto',
        data: { typeDialog: 'alert', title: 'Espera...', msg: 'La contraseña esta vacia.'}
      });
      this.loginMethodState = false;
      return false;
    }

    console.log(data);
    console.log('pase1');
    this.service.get(data).subscribe(response => {
      console.log('pase2');
      console.log(response);
      if (response.data === 'unauthorized') {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'Correo electrónico o contraseña no validos.'}
        });
      } else if (response.data === 'account_disabled') {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'La cuenta esta deshabilitada.'}
        });
      } else if (response.data === 'error-token') {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'No se ha podido iniciar, inténtalo mas tarde'}
        });
      } else {
        localStorage.setItem('us_token', response.ustk_token);
        this.userInfo.id = response.additional_data.us_id ? response.additional_data.us_id : '';
        this.userInfo.names = response.additional_data.us_names ? response.additional_data.us_names : '';
        this.userInfo.lastNames = response.additional_data.us_lastnames ? response.additional_data.us_lastnames : '';
        this.userInfo.img = response.additional_data.us_img ? response.additional_data.us_img : '';
        this.userInfo.type = response.additional_data.us_type ? response.additional_data.us_type : '';
        this.userInfo.email = response.additional_data.us_email ? response.additional_data.us_email : '';
        if (this.userInfo.type === '1') {
          this.userInfo.dataStudent.idNumber = response.additional_data.st_idnumber ? response.additional_data.st_idnumber : '';
          this.userInfo.dataStudent.career = response.additional_data.st_career ? response.additional_data.st_career : '';
          this.userInfo.dataStudent.free = response.additional_data.st_isfree ? response.additional_data.st_isfree : '';
          this.userInfo.dataStudent.teacherAssignment = response.additional_data.st_teacherassc ?
            response.additional_data.st_teacherassc : '';
          this.userInfo.dataStudent.cellphone = response.additional_data.st_celphone ? response.additional_data.st_celphone : '';
          this.userInfo.dataStudent.phone = response.additional_data.st_phone ? response.additional_data.st_phone : '';
          this.userInfo.dataStudent.address = response.additional_data.st_address ? response.additional_data.st_address : '';
          this.userInfo.dataStudent.hv = response.additional_data.st_hv ? response.additional_data.st_hv : '';
          this.userInfo.dataStudent.cardid = response.additional_data.st_cardid ? response.additional_data.st_cardid : '';
          this.userInfo.dataStudent.eps = response.additional_data.st_eps ? response.additional_data.st_eps : '';
          this.userInfo.dataStudent.enrollment = response.additional_data.st_enrollment ? response.additional_data.st_enrollment : '';
          this.userInfo.dataStudent.practice = response.additional_data.st_practice ? response.additional_data.st_practice : '';
        }
        localStorage.setItem('user', JSON.stringify(this.userInfo));
        console.log(localStorage.getItem('user'));
        this.router.navigate(['/inicio']);
        this.snackBar.open('Bienvenid@ a SGVP ' + response.additional_data.us_names, 'Cerrar', {
          duration: 4000
        });
      }
      this.loginMethodState = false;
    });

  }

  public openForgot(): void {
    const dialogRef = this.dialog.open(DialogsComponent, {
      width: '350px',
      height: 'auto',
      data: { typeDialog: 'forgot', title: 'Restablecer Contraseña', msg: 'Ingresa el correo electrónico con el que inicias sesión'}
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result !== undefined) {
        const data = {
          function: 'Forgot',
          emailforgot: result
        };
        this.service.get(data).subscribe(res => {
          console.log(res);
          const response: any = {};
          if (response.data === 'no-exist') {
            this.dialog.open(DialogsComponent, {
              width: '350px',
              height: 'auto',
              data: { typeDialog: 'alert', title: 'Espera...', msg: 'El correo ingresado no pertenece a ninguna cuenta.'}
            });
          } else if (response.data === 'reset-password') {
            this.dialog.open(DialogsComponent, {
              width: '350px',
              height: 'auto',
              data: { typeDialog: 'alert',
                title: 'Restablecer Contraseña',
                msg: 'La contraseña se ha restablecido, revisa tu correo por favor.'
              }
            });
          }
        });
      }
    });

  }

  public newCompany(): void {
    const dialogRef = this.dialog.open(DialogsComponent, {
      width: '350px',
      height: 'auto',
      data: { typeDialog: 'new-company',
        title: 'Crear cuenta empresa',
        msg: 'Ingresa un correo electrónico y una contraseña para crear tu cuenta '
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.emailnew !== '' && result.passnew !== '') {
          const data = {
            function: 'NewCompany',
            emailnew: result.emailnew,
            passnew: result.passnew
          };
          this.service.get(data).subscribe(res => {
            console.log(res);
            const response: any = {};
            if (response.data === 'exist') {
              this.dialog.open(DialogsComponent, {
                width: '350px',
                height: 'auto',
                data: { typeDialog: 'alert',
                  title: 'Espera...',
                  msg: 'La cuenta ya esta en uso.'
                }
              });
            } else {
              localStorage.setItem('us_token', response.data.us_token);
              localStorage.setItem('us_email', response.additional_data.us_email);
              localStorage.setItem('us_id', response.additional_data.us_id);
              localStorage.setItem('us_type', response.additional_data.us_type);
              localStorage.setItem('us_img', response.additional_data.us_img);
              this.router.navigate(['/inicio']);
              this.snackBar.open('Bienvenid@ a SGVP', 'Cerrar', {
                duration: 4000
              });
            }
          });
        }
      }
    });
  }
}
