import { Component } from '@angular/core';
import {Promotion} from "../../models/promotion";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {NgForOf} from "@angular/common";
import {MatChip} from "@angular/material/chips";
import {MatPaginator} from "@angular/material/paginator";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    MatSelect,
    MatOption,
    MatCard,
    MatCardTitle,
    NgForOf,
    MatCardHeader,
    MatCardContent,
    MatChip,
    MatPaginator,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.css'
})
export class PromotionsComponent {
  selectedCategory = 'Carrelage mural';

  categories = [
    'Carrelage mural',
    'Carrelage sol',
    'Sanitaire',
    'Robinetterie'
  ];

  promotions: Promotion[] = [
    {
      id: 1,
      titre: 'Salle de bain blanc',
      produit:{
        id: 5,
        nom: 'Mosaïque dorée',
        description: 'Mosaïque luxueuse avec finition dorée',
        prix: 85,
        quantite: 5,
        image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=300&fit=crop',
        categorie: {
          id: 2,
          nom: 'Mosaïque',
          description: 'Créations artistiques en petits carreaux...',
          image: ''
        }
      },
      description: 'Profitez de -20% sur notre collection exclusive de meubles de salle de bain jusqu\'à la fin du mois !',
      taux: 20,
      dateDebut: '01/05/2025',
      dateFin: '31/05/2025'
    },
    {
      id: 2,
      titre: 'Salle de bain blanc',
      produit:{
        id: 5,
        nom: 'Mosaïque dorée',
        description: 'Mosaïque luxueuse avec finition dorée',
        prix: 85,
        quantite: 5,
        image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=300&fit=crop',
        categorie: {
          id: 2,
          nom: 'Mosaïque',
          description: 'Créations artistiques en petits carreaux...',
          image: ''
        }
      },
      description: 'Profitez de -20% sur notre collection exclusive de meubles de salle de bain jusqu\'à la fin du mois !',
      taux: 20,
      dateDebut: '01/05/2025',
      dateFin: '31/05/2025'
    }
  ];

  currentPage = 1;
  totalPages = 15;
  itemsPerPage = 4;

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    // Logique pour filtrer les promotions par catégorie
  }

  onPageChange(page: number) {
    this.currentPage = page;
    // Logique pour la pagination
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
