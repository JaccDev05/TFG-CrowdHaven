import { Component } from '@angular/core';
import { HeaderComponent } from '../../Feed/components/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-functions-layout',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './user-functions-layout.component.html',
  styleUrl: './user-functions-layout.component.scss'
})
export class UserFunctionsLayoutComponent {

}
