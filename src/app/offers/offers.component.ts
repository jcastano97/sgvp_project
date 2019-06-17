import { Component, OnInit } from '@angular/core';
import {AppComponent, DialogsComponent} from '../app.component';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent extends AppComponent implements OnInit {

  offers;
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('user'));
    const data = {
      function: 'GetOffers',
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.get(data).subscribe(response => {
      console.log(response);
      this.offers = response.data;
    });
  }

  public crearOferta() {
    const dialogRef = this.dialog.open(DialogsComponent, {
      width: '350px',
      height: 'auto',
      data: { typeDialog: 'new-offer',
        title: 'Crear oferta',
        msg: 'Por favor ingresa los datos de la oferta'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.name !== '' && result.description !== '' && result.img !== '') {
          const data = {
            function: 'NewOffer',
            name: result.name,
            description: result.description,
            img: result.img,
            us_id: this.userInfo.id,
            token: localStorage.getItem('us_token'),
            us_type: this.userInfo.type
          };
          this.service.set(data).subscribe(response => {
            if (response.data === 'ok') {
              this.dialog.open(DialogsComponent, {
                width: '350px',
                height: 'auto',
                data: { typeDialog: 'alert', title: 'Completado', msg: 'La oferta se ha creado'}
              });
              location.reload();
            } else {
              this.dialog.open(DialogsComponent, {
                width: '350px',
                height: 'auto',
                data: { typeDialog: 'alert', title: 'Espera...', msg: 'La oferta no se a creado'}
              });
            }
          });
        } else {
          this.dialog.open(DialogsComponent, {
            width: '350px',
            height: 'auto',
            data: { typeDialog: 'alert', title: 'Espera...', msg: 'Información incorrecta'}
          });
        }
      }
    });
  }

  public eliminarOferta(offer) {
    const data = {
      function: 'DeleteOffer',
      offer_id: offer.id,
      us_id: this.userInfo.id,
      token: localStorage.getItem('us_token'),
      us_type: this.userInfo.type
    };
    this.service.set(data).subscribe(response => {
      if (response.data === 'ok') {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Completado', msg: 'La oferta se ha eliminado'}
        });
        location.reload();
      } else {
        this.dialog.open(DialogsComponent, {
          width: '350px',
          height: 'auto',
          data: { typeDialog: 'alert', title: 'Espera...', msg: 'Error al eliminar la oferta'}
        });
      }
    });
  }

}
