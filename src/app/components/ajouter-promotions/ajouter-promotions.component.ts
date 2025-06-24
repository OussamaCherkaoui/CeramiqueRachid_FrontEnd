import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Promotion} from "../../models/promotion";
import {Produit} from "../../models/produit";
import {Subject, takeUntil} from "rxjs";
import {PromotionService} from "../../services/promotion.service";

@Component({
  selector: 'app-ajouter-promotions',
  standalone: true,
    imports: [
        FormsModule,
        NgForOf,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './ajouter-promotions.component.html',
  styleUrl: './ajouter-promotions.component.css'
})
export class AjouterPromotionsComponent {
  @Input() promotion: Promotion | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  promotionForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  // Mock data for products - you can replace with actual service call
  availableProducts: Produit[] = [
    {
      id: 1, nom: "Smartphone Galaxy", prix: 699,
      description: '',
      image: '',
      quantite: 0,
      categorie: {
        id: 0,
        nom: '',
        description: '',
        image: ''
      }
    },
    {
      id: 2, nom: "Laptop Dell", prix: 1299,
      description: '',
      image: '',
      quantite: 0,
      categorie: {
        id: 0,
        nom: '',
        description: '',
        image: ''
      }
    },
    {
      id: 3, nom: "Tablette iPad", prix: 449,
      description: '',
      image: '',
      quantite: 0,
      categorie: {
        id: 0,
        nom: '',
        description: '',
        image: ''
      }
    },
    {
      id: 4, nom: "Casque Audio", prix: 199,
      description: '',
      image: '',
      quantite: 0,
      categorie: {
        id: 0,
        nom: '',
        description: '',
        image: ''
      }
    },
    {
      id: 5, nom: "Montre connectée", prix: 299,
      description: '',
      image: '',
      quantite: 0,
      categorie: {
        id: 0,
        nom: '',
        description: '',
        image: ''
      }
    }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private promotionService: PromotionService
  ) {
    this.promotionForm = this.createForm();
  }

  ngOnInit(): void {
    this.isEditMode = !!this.promotion;
    if (this.promotion) {
      this.populateForm();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      taux: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      produitId: ['', Validators.required]
    });
  }

  private populateForm(): void {
    if (this.promotion) {
      this.promotionForm.patchValue({
        titre: this.promotion.titre,
        description: this.promotion.description,
        taux: this.promotion.taux,
        dateDebut: this.promotion.dateDebut,
        dateFin: this.promotion.dateFin,
        produitId: this.promotion.produit.id
      });
    }
  }

  closeForm(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.promotionForm.valid) {
      this.isSubmitting = true;
      const formValue = this.promotionForm.value;

      const selectedProduct = this.availableProducts.find(p => p.id === +formValue.produitId);
      if (!selectedProduct) {
        this.isSubmitting = false;
        return;
      }

      const promotionData : Promotion = {
        titre: formValue.titre,
        description: formValue.description,
        taux: +formValue.taux,
        dateDebut: formValue.dateDebut,
        dateFin: formValue.dateFin,
        produit: selectedProduct,
        id: 0
      };

      if (this.isEditMode && this.promotion) {
        const updatedPromotion = { ...promotionData, id: this.promotion.id };
        this.promotionService.updatePromotion(updatedPromotion)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.isSubmitting = false;
            this.saved.emit();
          });
      } else {
        this.promotionService.savePromotion(promotionData)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.isSubmitting = false;
            this.saved.emit();
          });
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.promotionForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.promotionForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return `${fieldName} est requis`;
      if (field.errors['minlength']) return `${fieldName} trop court`;
      if (field.errors['min']) return `Valeur minimale: ${field.errors['min'].min}`;
      if (field.errors['max']) return `Valeur maximale: ${field.errors['max'].max}`;
    }
    return '';
  }
}
