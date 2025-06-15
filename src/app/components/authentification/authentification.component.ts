import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-authentification',
  standalone: true,
  imports: [
    MatError,
    MatLabel,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatIcon,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatIconButton,
    MatButton,
    MatProgressSpinner,
    NgIf
  ],
  templateUrl: './authentification.component.html',
  styleUrl: './authentification.component.css'
})
export class AuthentificationComponent {

  authForm: FormGroup;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.authForm = this.formBuilder.group({
      username: ['admin', [Validators.required]],
      password: ['admin@123', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.authForm.valid) {
      const { username, password } = this.authForm.value;
      // Logique d'authentification ici
      console.log('Tentative de connexion:', { username, password });

      this.snackBar.open('Connexion en cours...', 'Fermer', {
        duration: 2000
      });
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
