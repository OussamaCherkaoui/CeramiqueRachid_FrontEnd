import {Component, OnInit} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCard, MatCardContent, MatCardImage} from "@angular/material/card";
import {MatChip, MatChipListbox} from "@angular/material/chips";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {Produit} from "../../models/produit";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    MatSelect,
    MatOption,
    MatCard,
    MatCardContent,
    MatChip,
    NgClass,
    MatPaginator,
    NgForOf,
    FormsModule,
    MatCardImage,
    MatChipListbox,
    MatIcon,
    MatInput,
    MatIconButton,
    NgIf
  ],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.css'
})
export class ProduitsComponent implements OnInit {

  selectedCategory: string = '';
  filteredProducts: Produit[] = [];
  paginatedProducts: Produit[] = [];

  products: Produit[] = [
    {
      id: 1,
      nom: 'Zelij carré noir',
      description: 'Zelij noir de qualité supérieure pour vos murs',
      prix: 50,
      quantite: 15,
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
      categorie: {
        id: 4,
        nom: 'Carrelage mural',
        description: 'Habillez vos murs avec style...',
        image: ''
      }
    },
    {
      id: 2,
      nom: 'Zelij carré bleu',
      description: 'Zelij bleu traditionnel marocain authentique',
      prix: 45,
      quantite: 8,
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=300&fit=crop',
      categorie: {
        id: 4,
        nom: 'Carrelage mural',
        description: 'Habillez vos murs avec style...',
        image: ''
      }
    },
    {
      id: 3,
      nom: 'Zelij carré blanc',
      description: 'Zelij blanc élégant pour une décoration moderne',
      prix: 55,
      quantite: 12,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      categorie: {
        id: 4,
        nom: 'Carrelage mural',
        description: 'Habillez vos murs avec style...',
        image: ''
      }
    },
    {
      id: 4,
      nom: 'Carrelage sol antidérapant',
      description: 'Carrelage sécurisé pour salles de bain et cuisines',
      prix: 35,
      quantite: 25,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      categorie: {
        id: 1,
        nom: 'Carrelage sol',
        description: 'Revêtements de sol durables...',
        image: ''
      }
    },
    {
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
    {
      id: 6,
      nom: 'Faïence cuisine moderne',
      description: 'Faïence résistante aux éclaboussures',
      prix: 28,
      quantite: 30,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      categorie: {
        id: 3,
        nom: 'Faïence',
        description: 'Revêtements muraux pour cuisines...',
        image: ''
      }
    },
    {
      id: 7,
      nom: 'Carrelage imitation bois',
      description: 'Aspect bois naturel avec la durabilité du carrelage',
      prix: 42,
      quantite: 18,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      categorie: {
        id: 1,
        nom: 'Carrelage sol',
        description: 'Revêtements de sol durables...',
        image: ''
      }
    },
    {
      id: 8,
      nom: 'Mosaïque piscine bleue',
      description: 'Mosaïque spécialement conçue pour les piscines',
      prix: 65,
      quantite: 0,
      image: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop',
      categorie: {
        id: 2,
        nom: 'Mosaïque',
        description: 'Créations artistiques en petits carreaux...',
        image: ''
      }
    },
    {
      id: 9,
      nom: 'Zelij hexagonal vert',
      description: 'Design hexagonal unique en vert émeraude',
      prix: 58,
      quantite: 10,
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
      categorie: {
        id: 4,
        nom: 'Carrelage mural',
        description: 'Habillez vos murs avec style...',
        image: ''
      }
    },
    {
      id: 10,
      nom: 'Faïence métro parisien',
      description: 'Style classique métro avec finition brillante',
      prix: 32,
      quantite: 22,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      categorie: {
        id: 3,
        nom: 'Faïence',
        description: 'Revêtements muraux pour cuisines...',
        image: ''
      }
    }
  ];

  itemsPerPage: number = 6;
  currentPage: number = 0;
  totalProducts: number = 0;

  ngOnInit() {
    this.filterProducts();
  }

  filterProducts(): void {
    if (!this.selectedCategory) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(
        product => product.categorie.nom.toLowerCase().includes(this.selectedCategory.toLowerCase())
      );
    }
    this.totalProducts = this.filteredProducts.length;
    this.currentPage = 0;
    this.updatePaginatedProducts();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts(): void {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(start, end);
  }


}
