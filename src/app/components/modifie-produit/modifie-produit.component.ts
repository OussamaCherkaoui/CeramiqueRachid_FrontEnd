import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Produit} from "../../models/produit";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
import {MatStep, MatStepLabel, MatStepper, MatStepperPrevious} from "@angular/material/stepper";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatChipListbox, MatChipOption} from "@angular/material/chips";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatToolbar} from "@angular/material/toolbar";
import {MatTooltip} from "@angular/material/tooltip";
import {Categorie} from "../../models/categorie";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {ProduitService} from "../../services/produit.service";

@Component({
  selector: 'app-modifie-produit',
  standalone: true,
  imports: [
    MatError,
    MatLabel,
    MatIcon,
    MatProgressSpinner,
    NgIf,
    MatButton,
    MatStepperPrevious,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatFabButton,
    MatStep,
    MatChipOption,
    MatChipListbox,
    NgClass,
    MatFormField,
    MatInput,
    MatStepLabel,
    MatSelect,
    MatOption,
    NgForOf,
    MatStepper,
    MatToolbar,
    MatIconButton,
    MatTooltip,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    MatDialogTitle
  ],
  templateUrl: './modifie-produit.component.html',
  styleUrl: './modifie-produit.component.css'
})
export class ModifieProduitComponent implements OnInit {
  produitForm!: FormGroup;
  isLoading = false;
  imagePreview: string | ArrayBuffer | null = null;
  categories: Categorie[]=[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModifieProduitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { produit: Produit },
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    this.produitForm = this.fb.group({
      nom: [this.data.produit.nom, [Validators.required, Validators.minLength(3)]],
      description: [this.data.produit.description, [Validators.required, Validators.minLength(10)]],
      categorieId: [this.data.produit.categorie?.id || null, Validators.required],
      prix: [this.data.produit.prix, [Validators.required, Validators.min(0)]],
      quantite: [this.data.produit.quantite, [Validators.required, Validators.min(0)]],
      image: [null]  // pour l'upload
    });

    if (this.data.produit.image) {
      this.imagePreview = 'http://localhost:8080' + this.data.produit.image; // adapte l'url
    }
  }

  get f() {
    return this.produitForm.controls;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.produitForm.patchValue({ image: file });
      this.produitForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.produitForm.invalid) return;

    this.isLoading = true;

    const updatedProduit = {
      ...this.data.produit,
      nom: this.f['nom'].value,
      description: this.f['description'].value,
      categorieId: this.f['categorieId'].value,
      prix: this.f['prix'].value,
      quantite: this.f['quantite'].value,
      // l'image sera traitée à part
    };

    const formData = new FormData();
    formData.append('nom', updatedProduit.nom);
    formData.append('description', updatedProduit.description);
    formData.append('categorieId', updatedProduit.categorieId);
    formData.append('prix', updatedProduit.prix.toString());
    formData.append('quantite', updatedProduit.quantite.toString());

    if (this.f['image'].value) {
      formData.append('image', this.f['image'].value);
    }

    this.produitService.updateProduit(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.dialogRef.close('updated');
      },
      error: (err) => {
        this.isLoading = false;
        // gérer l'erreur, afficher un message...
        console.error('Erreur mise à jour produit', err);
      }
    });
  }
}
