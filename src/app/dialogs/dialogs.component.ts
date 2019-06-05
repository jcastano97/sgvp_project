import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.scss']
})
export class DialogsComponent {
  public nc;
  public cp;

  constructor(public dialogRef: MatDialogRef<DialogsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.nc = {
      emailnew: '',
      passnew: ''
    };
    this.cp = {
      passold: '',
      passnew: ''
    };
  }
}
