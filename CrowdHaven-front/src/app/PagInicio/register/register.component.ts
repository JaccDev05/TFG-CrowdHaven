import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { CredentialsService } from '../../api/auth-services/credentials.service';
import { RegisterInterface, UserInterface } from '../../api/models/auth';
import { Router } from '@angular/router';



@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private router: Router
  )
   {
    this.registerForm = this.formBuilder.group({
      email : ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      
    })
  }


  submit() {
    if (this.registerForm.invalid) {
      return;
    }

    
    this.credentialsService.register(this.registerForm.value as RegisterInterface).subscribe({
      next: (data) => {
        console.log(data);
        window.location.href = '/auth/login';
      },
      error: err => {
        console.log(err)
      }
    })
      
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

}
