import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Promotion} from "../../models/promotion";
import {Produit} from "../../models/produit";
import {Subject, takeUntil} from "rxjs";
import {PromotionService} from "../../services/promotion.service";
import {RouterLink} from "@angular/router";
import {ProduitService} from "../../services/produit.service";

@Component({
  selector: 'app-ajouter-promotions',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './ajouter-promotions.component.html',
  styleUrl: './ajouter-promotions.component.css'
})
export class AjouterPromotionsComponent implements OnInit {


  promotionForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  // Mock data for products - you can replace with actual service call
  availableProducts: Produit[] = [];

  private destroy$ = new Subject<void>();
   promotion!: Promotion;

  constructor(
    private fb: FormBuilder,
    protected promotionService: PromotionService,
    protected productService:ProduitService
  ) {
    this.promotionForm = this.createForm();
  }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAllProduits().subscribe(products => {
      this.availableProducts = products;
    })
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



  onSubmit(): void {
    if (this.promotionForm.valid) {
      this.isSubmitting = true;
      const formValue = this.promotionForm.value;
      const selectedProduct:Produit | undefined = this.availableProducts.find(p => p.id === +formValue.produitId);

      if (selectedProduct) {
        const promotionData : Promotion = {
          titre: formValue.titre,
          description: formValue.description,
          taux: +formValue.taux,
          dateDebut: formValue.dateDebut,
          dateFin: formValue.dateFin,
          produit: selectedProduct,
          id: 0
        };

        this.promotionService.savePromotion(promotionData).subscribe(data=>{
          if(data){
            alert("promotion ajouté avec succes!" );
          }
        });
      }
      else {
        this.isSubmitting = false;
        return;
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
