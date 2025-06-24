import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Promotion} from "../../models/promotion";
import {filter, Subject, takeUntil} from "rxjs";
import {PromotionService} from "../../services/promotion.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {Produit} from "../../models/produit";

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
    NgSwitch
  ],
  templateUrl: './promotions-admin.component.html',
  styleUrl: './promotions-admin.component.css'
})
export class PromotionsAdminComponent {

  promotions: Promotion[] = [];
  filteredPromotions: Promotion[] = [];
  searchTerm = '';
  dateDebutFilter = '';
  dateFinFilter = '';
  loading = false;

  ngOnInit() {
    this.loading = true;
    setTimeout(() => {
      this.promotions = [
        {
          id: 1,
          titre: "Promotion d'été",
          description: "Réduction exceptionnelle pour les vacances d'été",
          taux: 25,
          dateDebut: "2024-06-01",
          dateFin: "2024-08-31",
          produit: {
            id: 1, nom: "Smartphone Galaxy", prix: 599, categorie: {
              id: 0,
              nom: '',
              description: '',
              image: ''
            },
            description: '',
            image: '',
            quantite: 0
          }
        },
        {
          id: 2,
          titre: "Black Friday",
          description: "Méga promotion pour le Black Friday",
          taux: 40,
          dateDebut: "2024-11-29",
          dateFin: "2024-11-29",
          produit: {
            id: 2, nom: "Laptop Dell", prix: 899, categorie: {
              id: 0,
              nom: '',
              description: '',
              image: ''
            },
            description: '',
            image: '',
            quantite: 0
          }
        },
        {
          id: 3,
          titre: "Soldes d'hiver",
          description: "Profitez des soldes d'hiver sur tous nos produits",
          taux: 30,
          dateDebut: "2024-12-20",
          dateFin: "2025-01-31",
          produit: {
            id: 3, nom: "Casque Audio", prix: 199, categorie: {
              id: 0,
              nom: '',
              description: '',
              image: ''
            },
            description: '',
            image: '',
            quantite: 0
          }
        },
        {
          id: 4,
          titre: "Promotion Printemps",
          description: "Nouvelle collection printemps à prix réduit",
          taux: 15,
          dateDebut: "2025-03-01",
          dateFin: "2025-05-31",
          produit: {
            id: 4, nom: "Montre Connectée", prix: 299, categorie: {
              id: 0,
              nom: '',
              description: '',
              image: ''
            },
            description: '',
            image: '',
            quantite: 0
          }
        }
      ];
      this.loading = false;
      this.filterPromotions();
    }, 500);
  }

  filterPromotions() {
    let filtered = this.promotions;

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
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getPromotionStatus(dateDebut: string, dateFin: string): { status: string, color: string } {
    const now = new Date();
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    if (now < debut) return { status: 'À venir', color: 'bg-blue-100 text-blue-800' };
    if (now > fin) return { status: 'Expirée', color: 'bg-red-100 text-red-800' };
    return { status: 'Active', color: 'bg-green-100 text-green-800' };
  }

  clearFilters() {
    this.searchTerm = '';
    this.dateDebutFilter = '';
    this.dateFinFilter = '';
    this.filterPromotions();
  }

  getPromotionsActives(): number {
    const now = new Date();
    return this.promotions.filter(p => {
      return now >= new Date(p.dateDebut) && now <= new Date(p.dateFin);
    }).length;
  }

  getPromotionsAVenir(): number {
    return this.promotions.filter(p => new Date() < new Date(p.dateDebut)).length;
  }

  getPromotionsExpirees(): number {
    return this.promotions.filter(p => new Date() > new Date(p.dateFin)).length;
  }

}
