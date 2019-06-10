import { Component, OnInit } from '@angular/core';
import { AppComponent, DialogsComponent } from '../app.component';
import { FormGroup, Validators} from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']

})
export class HomeComponent extends AppComponent implements OnInit {

  basicInfoFormGroup: FormGroup;
  documentsFormGroup: FormGroup;
  private greeting: string;
  private firstName: string;
  private userType: string;
  private email: string;
  spinnerSendUserInfo: boolean;
  doneSendUserInfo: boolean;
  isLinear = false;
  srcResult;

  ngOnInit( ) {
    this.userInfo = JSON.parse(localStorage.getItem('user'));
    console.log(this.userInfo);
    this.firstName = this.userInfo.names;
    this.userType = this.userInfo.type;
    this.email = this.userInfo.email;

    this.basicInfoFormGroup = this.formBuilder.group({
      us_email: [this.userInfo.email, Validators.required],
      us_names: [this.userInfo.names, Validators.required],
      us_lastNames: [this.userInfo.lastNames, Validators.required],
      st_program: [this.userInfo.dataStudent.career, Validators.required],
      st_idNumber: [this.userInfo.dataStudent.idNumber, Validators.required],
      st_cellphone: [this.userInfo.dataStudent.cellphone, Validators.required],
      st_phone: [this.userInfo.dataStudent.phone, Validators.required],
      st_address: [this.userInfo.dataStudent.address, Validators.required],
      st_schedule: [this.userInfo.dataStudent.schedule, Validators.required]
    });

    this.documentsFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.time();
    setInterval(() => {
      this.time();
    }, 60000);
  }

  private time() {
    const now = new Date();
    const hour = now.getHours();
    if (hour <= 11) {
      this.greeting = 'Buenos Días';
    } else if (hour >= 12 && hour <= 18) {
      this.greeting = 'Buenas Tardes';
    } else if (hour > 18) {
      this.greeting = 'Buenas Noches';
    }
  }

  public changePassWord() {
    const dialogRef = this.dialog.open(DialogsComponent, {
      width: '350px',
      height: 'auto',
      data: { typeDialog: 'change-password',
        title: 'Cambiar contraseña',
        msg: 'Por favor ingresa tu contraseña antigua para verificar tu identidad.'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.passold !== '' && result.passnew !== '') {
          const data = {
            function: 'ChangePassWord',
            passnew: Md5.hashStr(result.passnew),
            passold: Md5.hashStr(result.passold),
            us_id: this.userInfo.id,
            token: localStorage.getItem('us_token'),
            us_type: this.userInfo.type
          };
          this.service.update(data).subscribe(response => {
            if (response.data === 'oldpass-incorrect') {
              this.dialog.open(DialogsComponent, {
                width: '350px',
                height: 'auto',
                data: { typeDialog: 'alert', title: 'Espera...', msg: 'La contraseña antigua es incorrecta'}
              });
            } else if (response.data === 'change-ok') {
              this.dialog.open(DialogsComponent, {
                width: '350px',
                height: 'auto',
                data: { typeDialog: 'alert', title: 'Completado', msg: 'La contraseña se ha actualizado'}
              });
            } else {
              this.dialog.open(DialogsComponent, {
                width: '350px',
                height: 'auto',
                data: { typeDialog: 'alert', title: 'Espera...', msg: 'La contraseña no se ha actualizado'}
              });
            }
          });
        }
      }
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
        this.savePhoto(base64Image);
      };
    }
  }

  public savePhoto(base64Image) {
    console.log('savePhoto');
    console.log(base64Image);
    const data = {
      function: 'ChangePhoto',
      base64Image,
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    console.log(data);
    this.service.update(data).subscribe(response => {
      console.log('subscribe');
      console.log(response);
      if (response.data === 'change-ok') {
        document.getElementById('img-profile-1').setAttribute('src', base64Image);
        this.userInfo.img = base64Image;
        localStorage.setItem('user', JSON.stringify(this.userInfo));
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Completado', msg: 'Foto de perfil actualizada'}
        });
      } else {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'No se pudo cambiar la foto.'}
        });
      }
    });
  }

  public sendUserInfo() {
    this.spinnerSendUserInfo = true;
    setTimeout(() => {
      this.dialog.open(DialogsComponent, {
        width: '350px',
        height: 'auto',
        data: { typeDialog: 'alert', title: 'Completado', msg: 'Información actualizada'}
      });
      this.spinnerSendUserInfo = false;
      this.doneSendUserInfo = true;
    }, 1000);
  }

  public onFileSelected(name_file: string) {
    const inputNode: any = document.querySelector('#' + name_file);

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
        console.log(this.srcResult);
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
      document.querySelector('#' + name_file + '_p').textContent = inputNode.files[0].name;
    }
  }

}
