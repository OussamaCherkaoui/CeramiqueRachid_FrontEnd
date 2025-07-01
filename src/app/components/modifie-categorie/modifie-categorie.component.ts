import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {HttpErrorResponse} from "@angular/common/http";
import {Categorie} from "../../models/categorie";
import {ActivatedRoute, Router} from "@angular/router";
import {CategorieService} from "../../services/categorie.service";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";

@Component({
  selector: 'app-modifie-categorie',
  standalone: true,
  imports: [
    MatError,
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatCard,
    MatCardHeader,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    NgIf,
    MatInput,
    MatLabel,
    MatButton,
    MatHint,
    MatCardActions,
    MatProgressSpinner,
    MatDialogTitle,
    MatDialogActions
  ],
  templateUrl: './modifie-categorie.component.html',
  styleUrl: './modifie-categorie.component.css'
})
export class ModifieCategorieComponent {

  categorieForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private categorieService: CategorieService,
    private dialogRef: MatDialogRef<ModifieCategorieComponent>,
    @Inject(MAT_DIALOG_DATA) public categorie: Categorie
  ) {}

  ngOnInit(): void {
    this.categorieForm = this.fb.group({
      nom: [this.categorie.nom, [Validators.required, Validators.minLength(2)]],
      description: [this.categorie.description, Validators.required],
      // Si tu gères l’image, ajoute ici un contrôle (optionnel)
    });
  }

  onSubmit(): void {
    if (this.categorieForm.invalid) return;

    this.isLoading = true;

    const updatedCategorie = {...this.categorie, ...this.categorieForm.value};

    this.categorieService.update(updatedCategorie).subscribe({
      next: () => {
        this.isLoading = false;
        this.dialogRef.close('updated');
      },
      error: err => {
        this.isLoading = false;
        console.error('Erreur modification catégorie', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
