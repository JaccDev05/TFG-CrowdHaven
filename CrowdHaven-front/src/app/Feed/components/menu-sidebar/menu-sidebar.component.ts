import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { PopupService } from '../../utils/popup.service';
import { Router } from '@angular/router';
import { UserStateService } from '../../../PagInicio/loginservices/user-state.service';
import { User } from '../../../api/models/user.model';
import { UserService } from '../../../api/services/user/user.service';

@Component({
  selector: 'app-menu-sidebar',
  imports: [],
  templateUrl: './menu-sidebar.component.html',
  styleUrl: './menu-sidebar.component.scss'
})
export class MenuSidebarComponent implements OnInit {

  @Input() isOpen: boolean = false; // <- controla si está abierto
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();

  user: User | null = null;
  username: string | null = null;

  
  constructor(
    private popupService: PopupService,
    private router: Router,
    private userStateService: UserStateService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  onClose() {
    this.close.emit();
  }

  
  goToHome() {

    this.popupService.loader("Cargando...");
        setTimeout(() => {  
          this.popupService.close();
          this.router.navigate([`/`]); // <- ruta correcta sin ':'
                    
        }, 800)
    
    this.onClose();
  }
  goToUserComs() {
    if (!this.user?.id) return;
    
    this.popupService.loader("Cargando...");
    setTimeout(() => {
      this.popupService.close();
      this.router.navigate([`/user/comunidades-user/${this.user?.id}`]); // <- ruta correcta sin ':'
    }, 800);

    this.onClose();
  }

  goToUserPosts() {
    if (!this.user?.id) return;
    
    this.popupService.loader("Cargando...");
    setTimeout(() => {
      this.popupService.close();
      this.router.navigate([`/user/posts-user/${this.user?.id}`]); // <- ruta correcta sin ':'
    }, 800);

    this.onClose();
  }

  goToUserRewards() {
    if (!this.user?.id) return;
    
    this.popupService.loader("Cargando...");
    setTimeout(() => {
      this.popupService.close();
      this.router.navigate([`/user/rewards-user/${this.user?.id}`]); // <- ruta correcta sin ':'
    }, 800);

    this.onClose();
  }
  loadUserInfo() {
    this.username = this.userStateService.getUsername();
    if (this.username) {
      this.userService.getUserProfile(this.username).subscribe((user) => {
        this.user = user;
      })
    }
  }

  removeSession(): void {
    this.popupService.loader("Cerrando Sesion...");
        setTimeout(() => {  
          this.userStateService.removeSession();
          this.popupService.close();
          this.router.navigate(['/auth/login']);
                    
        }, 800)
  }
}
