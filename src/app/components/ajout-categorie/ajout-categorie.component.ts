import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatIcon} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Categorie} from "../../models/categorie";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {NgIf} from "@angular/common";
import {CategorieService} from "../../services/categorie.service";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-ajout-categorie',
  standalone: true,
  imports: [
    MatCardTitle,
    MatCardSubtitle,
    MatProgressSpinner,
    MatLabel,
    MatHint,
    MatError,
    MatIcon,
    MatToolbar,
    MatIconButton,
    MatCard,
    MatCardHeader,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    MatCardActions,
    MatButton,
    NgIf,
    MatTooltip
  ],
  templateUrl: './ajout-categorie.component.html',
  styleUrl: './ajout-categorie.component.css'
})
export class AjoutCategorieComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  categorieForm: FormGroup;
  isLoading = false;
  selectedFile: File | null = null;
  selectedImageUrl: string | null = null;
  isDragOver = false;

  // Paramètres pour l'image
  readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  readonly allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  constructor(
    private formBuilder: FormBuilder,
    protected categorieService: CategorieService,
    protected dialog: MatDialog,
    protected router: Router,
    private snackBar: MatSnackBar
  ) {
    this.categorieForm = this.createForm();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      nom: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-ZÀ-ÿ\s\-&]+$/)
        ]
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(255)
        ]
      ]
    });
  }

  private initializeForm(): void {
    this.categorieForm.get('nom')?.valueChanges.subscribe(value => {
      if (value) {
        const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
        if (capitalizedValue !== value) {
          this.categorieForm.get('nom')?.setValue(capitalizedValue, { emitEvent: false });
        }
      }
    });
  }

  // Méthodes pour la gestion des images
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  private handleFile(file: File): void {
    // Validation du type de fichier
    if (!this.allowedTypes.includes(file.type)) {
      this.snackBar.open('Format de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP.', 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Validation de la taille
    if (file.size > this.maxFileSize) {
      this.snackBar.open('La taille du fichier dépasse 5MB.', 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.selectedFile = file;

    // Créer l'URL de prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImageUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.snackBar.open('Image sélectionnée avec succès !', 'Fermer', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }

  removeImage(): void {
    this.selectedFile = null;
    this.selectedImageUrl = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }

    this.snackBar.open('Image supprimée', 'Fermer', {
      duration: 2000,
      panelClass: ['info-snackbar']
    });
  }

  changeImage(): void {
    this.triggerFileInput();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onSubmit(): void {
    if (this.categorieForm.valid) {
      this.isLoading = true;

      const nouvelleCategorie: Categorie = {
        id: 0,
        nom: this.categorieForm.get('nom')?.value.trim(),
        description: this.categorieForm.get('description')?.value.trim(),
        image: ""
      };

      this.sauvegarderCategorie(nouvelleCategorie);
    }
  }

  private sauvegarderCategorie(categorie: Categorie): void {
    // Simuler un upload avec FormData pour l'image
    const formData = new FormData();
    formData.append('nom', categorie.nom);
    formData.append('description', categorie.description);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.categorieService.save(formData).subscribe(data=>{
      if(data){
        this.isLoading = false;
        this.afficherSucces();
        this.retourner();
      }
    })

  }

  private marquerChampsCommeTouches(): void {
    Object.keys(this.categorieForm.controls).forEach(key => {
      this.categorieForm.get(key)?.markAsTouched();
    });
  }

  private afficherErreurValidation(): void {
    let message = 'Veuillez corriger les erreurs dans le formulaire';

    if (this.categorieForm.get('nom')?.hasError('required')) {
      message = 'Le nom de la catégorie est obligatoire';
    } else if (this.categorieForm.get('nom')?.hasError('minlength')) {
      message = 'Le nom doit contenir au moins 2 caractères';
    } else if (this.categorieForm.get('nom')?.hasError('pattern')) {
      message = 'Le nom ne peut contenir que des lettres, espaces et tirets';
    } else if (this.categorieForm.get('description')?.hasError('required')) {
      message = 'La description est obligatoire';
    } else if (this.categorieForm.get('description')?.hasError('minlength')) {
      message = 'La description doit contenir au moins 10 caractères';
    }

    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private afficherSucces(): void {
    this.snackBar.open('Catégorie ajoutée avec succès !', 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  resetForm(): void {
    this.categorieForm.reset();
    this.categorieForm.markAsUntouched();
    this.categorieForm.markAsPristine();
    this.removeImage();

    this.snackBar.open('Formulaire réinitialisé', 'Fermer', {
      duration: 2000,
      panelClass: ['info-snackbar']
    });
  }

  retourner(): void {
    if (this.categorieForm.dirty || this.selectedFile) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          title: 'Quitter sans enregistrer ?',
          message: 'Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter ?',
          confirmText: 'Quitter',
          cancelText: 'Rester'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['administration/produits/ajouterCategorie']);
        }
      });
    } else {
      this.router.navigate(['administration/produits']);
    }
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get nom() { return this.categorieForm.get('nom'); }
  get description() { return this.categorieForm.get('description'); }

}
