import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Categorie} from "../../models/categorie";
import {ProduitService} from "../../services/produit.service";
import {CategorieService} from "../../services/categorie.service";
import {Router} from "@angular/router";
import {Produit} from "../../models/produit";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {MatIcon} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatChipListbox, MatChipOption} from "@angular/material/chips";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-ajout-produit',
  standalone: true,
  imports: [
    MatCardTitle,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    MatStepper,
    MatIcon,
    MatToolbar,
    MatStep,
    MatCardContent,
    MatCard,
    MatError,
    MatFormField,
    MatSelect,
    MatOption,
    MatButton,
    MatStepperNext,
    MatInput,
    MatChipListbox,
    MatChipOption,
    NgClass,
    MatStepperPrevious,
    MatStepLabel,
    MatFabButton,
    MatCardHeader,
    MatProgressSpinner,
    MatLabel
  ],
  templateUrl: './ajout-produit.component.html',
  styleUrl: './ajout-produit.component.css'
})
export class AjoutProduitComponent implements OnInit {
  // Formulaires pour le stepper
  basicInfoForm!: FormGroup;
  priceStockForm!: FormGroup;
  imageForm!: FormGroup;

  categories: Categorie[] = [];
  isLoading = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  produitForm: FormGroup = this.fb.group({
  });
   produit!:Produit;

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private initializeForms(): void {
    this.basicInfoForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categorieId: ['', Validators.required]
    });

    this.priceStockForm = this.fb.group({
      prix: ['', [Validators.required, Validators.min(0.01)]],
      quantite: ['', [Validators.required, Validators.min(0)]]
    });

    this.imageForm = this.fb.group({
      image: ['']
    });
  }

  loadCategories(): void {
    this.categorieService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.showSnackBar('Erreur lors du chargement des catégories', 'error');
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        this.showSnackBar('Le fichier est trop volumineux (10MB max)', 'error');
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        this.showSnackBar('Veuillez sélectionner un fichier image', 'error');
        return;
      }

      this.selectedFile = file;

      // Créer aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    // Reset file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {

  if (this.produitForm.valid) {
  this.isLoading = true;

  this.produit.nom = this.produitForm.get('nom')?.value;
  this.produit.description = this.produitForm.get('description')?.value;
  this.produit.prix = this.produitForm.get('prix')?.value;
  this.produit.quantite = this.produitForm.get('quantite')?.value;
  this.produit.categorie.id = this.produitForm.get('categorieId')?.value;



  this.produitService.saveProduit(this.produit).subscribe(
    response => {
  console.log('Produit ajouté avec succès:', response);
  this.router.navigate(['/admin/produits']);
},
error => {
  console.error('Erreur lors de l\'ajout du produit:', error);
  this.isLoading = false;
}
);
}

  }

  onCancel(): void {
    this.router.navigate(['/admin/produits']);
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  // Getters pour les erreurs
  get nom() { return this.basicInfoForm.get('nom'); }
  get description() { return this.basicInfoForm.get('description'); }
  get categorieId() { return this.basicInfoForm.get('categorieId'); }
  get prix() { return this.priceStockForm.get('prix'); }
  get quantite() { return this.priceStockForm.get('quantite'); }

  // Méthodes pour les messages d'erreur
  getErrorMessage(field: string): string {
    const control = this.basicInfoForm.get(field) || this.priceStockForm.get(field);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `Minimum ${requiredLength} caractères requis`;
    }
    if (control?.hasError('min')) {
      return 'La valeur doit être positive';
    }
    return '';
  }

  protected readonly document = document;
}
