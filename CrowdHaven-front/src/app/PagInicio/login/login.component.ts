import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { CredentialsService } from '../../api/auth-services/credentials.service';
import { LoginInterface, RegisterInterface, UserInterface } from '../../api/models/auth';
import { Router } from '@angular/router';
import { PopupService } from '../loginservices/popup.service';
import { UserStateService } from '../loginservices/user-state.service';
import { TokenService } from '../../api/auth-services/token.service';



@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private router: Router,
    private popupService: PopupService,
    private userStateService: UserStateService,
    private tokenService : TokenService

  )

  {
    this.loginForm = this.formBuilder.group ({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  submit() {
    if (this.loginForm.invalid) {
      return;
    }

    
    this.credentialsService.login(this.loginForm.value as LoginInterface).subscribe({
      next: (data) => {

        this.popupService.loader("Iniciado sesion...", "Espere un momento");
        setTimeout(() => {

          this.tokenService.saveTokens(data.token, "234325423423")
          this.userStateService.save(data.username);
          sessionStorage.setItem('username', data.username);
          this.popupService.close();
          this.router.navigate(['/']);
          
        }, 1500)
      },

      error: err => {
        let message;
        if (err.error == "Invalid password") {
          message = "Contraseña incorrecta, inténtelo de nuevo."
        }
        else if (err.error == "User not found") {
          message = "El usuario no existe. Compruebe los datos o registrate en la plataforma"
        }
        else {
          message = err.error;
        }

        this.popupService.showMessage(
          'Ups ha ocurrido un error', message, 'error'
        );
      }
    })
      
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
