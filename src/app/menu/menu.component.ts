import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends AppComponent implements OnInit {
  public HCemail: string;
  private userType: string;

  ngOnInit() {
    this.HCemail = localStorage.getItem('us_email');
    this.userType = localStorage.getItem('us_type');
  }

  public logout() {
    const data = {
      function: 'Logout',
      ustk_token: localStorage.getItem('ustk_token'),
      us_id: localStorage.getItem('us_id'),
    };
    this.service.update(data).subscribe(response => {
      console.log(response);
      localStorage.clear();
      this.router.navigate(['/']);
    });
  }
}
