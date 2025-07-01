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
import {ProduitService} from "../../services/produit.service";
import {CategorieService} from "../../services/categorie.service";

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

  categories: string[] = [];

  itemsPerPage: number = 6;
  currentPage: number = 0;
  totalProducts: number = 0;

  constructor(protected productService: ProduitService, protected categorieService: CategorieService) {
  }

  ngOnInit() {
    this.getAllCategories();
    this.filterProducts();
  }

  getAllProducts():void{
    this.productService.getAllProduits().subscribe(products => {
      this.filteredProducts = products;
    });
  }

  getAllCategories(): void {
    this.categorieService.getAll().subscribe(data => {
      this.categories = data.map((cat: any) => cat.nom);
    });
  }

  filterProducts(): void {
    this.productService.getAllProduits().subscribe(products => {
      this.filteredProducts = products;

      // Appliquer le filtre une fois que les produits sont chargés
      if (this.selectedCategory) {
        this.filteredProducts = this.filteredProducts.filter(
          product => product.categorie.nom.toLowerCase().includes(this.selectedCategory.toLowerCase())
        );
      }

      this.totalProducts = this.filteredProducts.length;
      this.currentPage = 0;
      this.updatePaginatedProducts();
    });

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


  getImageUrl(image: string) {
    return `http://localhost:8080${image}`;
  }
}
