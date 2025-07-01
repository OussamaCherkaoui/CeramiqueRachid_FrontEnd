import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Promotion} from "../../models/promotion";
import {filter, Subject, takeUntil} from "rxjs";
import {PromotionService} from "../../services/promotion.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {Produit} from "../../models/produit";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-promotions-admin',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    NgSwitchCase,
    NgSwitch,
    RouterLink
  ],
  templateUrl: './promotions-admin.component.html',
  styleUrl: './promotions-admin.component.css'
})
export class PromotionsAdminComponent implements  OnInit {

  promotions: Promotion[] = [];
  filteredPromotions: Promotion[] = [];
  searchTerm = '';
  dateDebutFilter = '';
  dateFinFilter = '';
  loading = false;

  constructor(protected promotionService: PromotionService) {

  }

  ngOnInit() {
    this.loading = false;
    this.filterPromotions();
  }

  filterPromotions() {
    this.loading = true;
    this.promotionService.getAllPromotions().subscribe(data => {
      let filtered = data;

      if (this.searchTerm) {
        filtered = filtered.filter(p =>
          p.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          p.produit.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      if (this.dateDebutFilter) {
        filtered = filtered.filter(p =>
          new Date(p.dateDebut) >= new Date(this.dateDebutFilter)
        );
      }

      if (this.dateFinFilter) {
        filtered = filtered.filter(p =>
          new Date(p.dateFin) <= new Date(this.dateFinFilter)
        );
      }

      this.filteredPromotions = filtered;
      this.promotions = data;
      this.loading = false;
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }


  clearFilters() {
    this.searchTerm = '';
    this.dateDebutFilter = '';
    this.dateFinFilter = '';
    this.filterPromotions();
  }

  getAllPromotions()  {
    this.promotionService.getAllPromotions().subscribe(data => {
      this.filteredPromotions = data;
    })
  }


  getPromotionStatusClass(dateDebut: string, dateFin: string) {
    const status = this.getPromotionStatusText(dateDebut, dateFin);

    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'À venir':
        return 'bg-blue-100 text-blue-800';
      case 'Expirée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPromotionStatusText(dateDebut: string, dateFin: string) {
    const today = new Date();
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    // Normaliser les dates pour comparer uniquement les jours
    today.setHours(0, 0, 0, 0);
    debut.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);

    if (today < debut) {
      return 'À venir';
    } else if (today >= debut && today <= fin) {
      return 'Active';
    } else {
      return 'Expirée';
    }
  }

  deletePromotion(id: number, titre: string): void {

    const confirmMessage = `Êtes-vous sûr de vouloir supprimer la promotion "${titre}" ?\nCette action est irréversible.`;

    if (confirm(confirmMessage)) {
      this.loading = true;


       this.promotionService.deletePromotion(id).subscribe({
         next: () => {
           this.promotions = this.promotions.filter(p => p.id !== id);
           this.getAllPromotions();
           this.loading = false;
         }
         });
       }

      setTimeout(() => {
        this.promotions = this.promotions.filter(p => p.id !== id);
        this.filterPromotions();
        this.loading = false;
        console.log(`Promotion "${titre}" supprimée avec succès`);
      }, 1000);
    }
}
