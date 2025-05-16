import {Component, OnInit} from '@angular/core';
import { PopupService } from '../../utils/popup.service';
import { TokenService } from '../../../api/auth-services/token.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [],
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  isActiveMenuHeader: boolean = true;
  constructor(
    private tokenService: TokenService,
    private popupService: PopupService,
    private router: Router,
  )
  {}

  ngOnInit(): void {/*
    this.sidebarStatusService.status$.subscribe(status => {
      this.isActiveMenuHeader = status;
    })
      */
  }
/*
  closeSession(): void {
    this.popupService.loader(
      "Cerrando sesión",
      "Vuelva pronto"
    );

    this.tokenService.removeToken();
    this.userStateService.removeSession()
    setTimeout(() => {
      this.popupService.close()
      this.router.navigate(['/login']);
    }, 1500)
  }
  
  goToProfile() {
  //this.router.navigate(['']);
}

goToCom() {
  //this.router.navigate(['']);
}
goToFeed() {
  this.router.navigate(['']);
}
*/
}



