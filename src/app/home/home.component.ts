import { Component, OnInit } from '@angular/core';
import { AppComponent, DialogsComponent } from '../app.component';
import { FormGroup, Validators} from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']

})
export class HomeComponent extends AppComponent implements OnInit {

  basicInfoFormGroup: FormGroup;
  documentsFormGroup: FormGroup;
  private greeting: string;
  private imgProfile: string;
  private firstName: string;
  private userType: string;
  private email: string;

  ngOnInit( ) {
    this.firstName = localStorage.getItem('us_names');
    this.userType = localStorage.getItem('us_type');
    this.email = localStorage.getItem('us_email');

    this.basicInfoFormGroup = this.formBuilder.group({
      us_names: ['', Validators.required],
      us_lastnames: ['', Validators.required],
      st_idnumber: ['', Validators.required],
      st_celphone: ['', Validators.required],
      st_phone: ['', Validators.required],
      st_address: ['', Validators.required],
      st_schedule: ['', Validators.required]
    });

    this.documentsFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.time();
    setInterval(() => {
      this.time();
    }, 60000);

    if (localStorage.getItem('us_img') === 'null' || localStorage.getItem('us_img') === '') {
      this.imgProfile = 'assets/profile.png';
    } else {
      this.imgProfile = localStorage.getItem('us_img');
    }
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
            us_id: localStorage.getItem('us_id'),
            token: localStorage.getItem('ustk_token'),
            us_type: localStorage.getItem('us_type')
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
      us_id: localStorage.getItem('us_id'),
      token: localStorage.getItem('ustk_token'),
      us_type: localStorage.getItem('us_type')
    };
    console.log(data);
    this.service.update(data).subscribe(response => {
      console.log('subscribe');
      console.log(response);
      if (response.data === 'change-ok') {
        document.getElementById('img-profile-1').setAttribute('src', base64Image);
        localStorage.setItem('us_img', base64Image);
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

}
