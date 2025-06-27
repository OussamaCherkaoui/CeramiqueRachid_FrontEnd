import {Component, HostListener, OnInit} from '@angular/core';

import {Categorie} from "../../models/categorie";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-acceuil',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink
  ],
  templateUrl: './acceuil.component.html',
  styleUrl: './acceuil.component.css'
})
export class AcceuilComponent {


  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalItems: number = 10;

  // Computed properties
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
  }

  get currentCategories(): Categorie[] {
    return this.products.slice(this.startIndex, this.endIndex);
  }

  // Products data
  products: Categorie[] = [
    {
      id: 1,
      nom: "Salle de bain",
      description: "Transformez votre salle de bain en un espace de confort et d'élégance. Retrouvez des lavabos, vasques, baignoires, receveur de douche, colonnes de douche et meubles adaptés à tous les styles et budgets.",
      image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      nom: "Sanitaires",
      description: "Découvrez notre gamme de produits sanitaires alliant hygiène, durabilité et design : WC suspendus ou à poser, bidets, urinoirs et accessoires sanitaires.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      nom: "Zellige traditionnel",
      description: "Plongez dans l'art marocain avec notre sélection de zellige fait main. Apportez une touche d'élégance artisanale et authentique à vos murs ou sols.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      nom: "Carrelage mural",
      description: "Habillez vos murs avec style grâce à nos carreaux muraux modernes ou classiques, disponibles en plusieurs formats, textures et finitions.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop"
    },
    {
      id: 5,
      nom: "Carrelage de sol",
      description: "Résistance et esthétisme pour vos sols intérieurs et extérieurs : carrelage effet bois, marbre, pierre naturelle, formats variés.",
      image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=300&h=200&fit=crop"
    },
    {
      id: 6,
      nom: "Robinetterie",
      description: "Alliez design et performance avec nos gammes de robinetterie pour lavabos, douches, baignoires et cuisines. Options modernes ou classiques.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=200&fit=crop"
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Component initialization logic here
    console.log('Product Catalog Component initialized');
  }

  /**
   * Navigate to next page
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  /**
   * Navigate to previous page
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /**
   * Go to specific page
   * @param page - Page number to navigate to
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  /**
   * Handle category exploration
   * @param productId - ID of the product category to explore
   */
  exploreCategory(productId: number): void {
    const product = this.products.find(p => p.id === productId);
    console.log('Exploring category:', product?.nom);

    // Add your navigation logic here
    // Example: this.router.navigate(['/category', productId]);

    // For now, just show an alert
    if (product) {
      alert(`Explorer la catégorie: ${product.nom}`);
    }
  }

  /**
   * Update items per page
   * @param itemsPerPage - New number of items per page
   */
  updateItemsPerPage(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1; // Reset to first page
  }

  /**
   * Get page numbers for pagination display
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
