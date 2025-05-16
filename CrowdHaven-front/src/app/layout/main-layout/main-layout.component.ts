import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../Feed/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../Feed/components/header/header.component';
import { SidebarComunidadesComponent } from '../../Feed/components/sidebar-comunidades/sidebar-comunidades.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent, SidebarComunidadesComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {}