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
import {AdminService} from "../../services/admin.service";
import {AuthenticationRequest} from "../../models/authentication-request";
import {DecodejwtService} from "../../services/decodejwt.service";

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
  authRequest: AuthenticationRequest = { username: '', password: '' };


  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AdminService, private decodejwtService: DecodejwtService, private router: Router
  ) {
    this.authForm = this.formBuilder.group({
      username: ['admin', [Validators.required]],
      password: ['admin@123', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.authRequest.username = this.authForm.get('username')?.value!;
    this.authRequest.password = this.authForm.get('password')?.value!;

    console.log(this.authRequest);
    this.authService.login(this.authRequest).subscribe(
      response => {
        this.snackBar.open('Connexion en cours...', 'Fermer', {
          duration: 2000
        });

        if (response && response.token) {
          localStorage.setItem("jwt", response.token);
          this.decodejwtService.getToken();
          this.decodejwtService.getIdByUsername().subscribe(
            id => {
              this.authService.setIdUser(id);
              this.authService.loginActive();
              this.router.navigateByUrl("/administration");
            });
        } else {
          alert("username ou password incorrect");
        }
      },
      error => {
        alert("erreur lors d' authentification. Réssayer!!");
      });
  }


  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
