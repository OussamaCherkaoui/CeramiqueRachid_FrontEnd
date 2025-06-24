import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {getLocaleDateFormat, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Message} from "../../models/message";
import {MessageService} from "../../services/message.service";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    MatLabel,
    MatError,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    NgIf,
    MatButton,
    MatProgressSpinner
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;


  constructor(private formBuilder: FormBuilder,private messageService:MessageService ) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      const formValue = this.contactForm.value;
      const message:Message={id:0,nomEtPrenom:formValue.name,telephone:formValue.phone,email:formValue.email,message:formValue.message,dateEnvoi:new Date(Date.now()),dateReponse:new Date(Date.now()),estRepondue:false,
        admin: {
          id: 0,
          username: '',
          password: '',
          email: ''
        }};

      setTimeout(() => {
        this.isSubmitting = false;
        this.contactForm.reset();
        this.messageService.saveMessage(message).subscribe(response=>{
          if (response){
            console.log(response);
          }
        })
      }, 2000);
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.contactForm.markAllAsTouched();
    }
  }

  // Méthodes d'aide pour la validation
  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);

    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} est requis`;
    }

    if (field?.hasError('email')) {
      return 'Email invalide';
    }

    if (field?.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength'].requiredLength;
      return `Minimum ${requiredLength} caractères requis`;
    }

    if (field?.hasError('pattern')) {
      return 'Format de téléphone invalide';
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nom et prénom',
      phone: 'Numéro de téléphone',
      email: 'Email',
      message: 'Message'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
