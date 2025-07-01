import {Component, HostListener, OnInit} from '@angular/core';

import {Categorie} from "../../models/categorie";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {CategorieService} from "../../services/categorie.service";

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
export class AcceuilComponent implements OnInit {


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
    return this.categories.slice(this.startIndex, this.endIndex);
  }

  // Products data
  categories: Categorie[] = [];

  constructor(protected categorieService:CategorieService) { }

  ngOnInit(): void {
    this.categorieService.getAll().subscribe(categories => this.categories = categories);
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
   * Handle category exploration
   * @param productId - ID of the product category to explore
   */
  exploreCategory(productId: number): void {
    const product = this.categories.find(p => p.id === productId);
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
