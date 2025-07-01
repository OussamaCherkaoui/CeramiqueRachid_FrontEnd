import {Component, OnInit} from '@angular/core';
import {Produit} from "../../models/produit";
import {Categorie} from "../../models/categorie";
import {Subscription} from "rxjs";
import {ProduitService} from "../../services/produit.service";
import {CategorieService} from "../../services/categorie.service";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {ModifieProduitComponent} from "../modifie-produit/modifie-produit.component";
import {MatDialog} from "@angular/material/dialog";
import {ModifieCategorieComponent} from "../modifie-categorie/modifie-categorie.component";

@Component({
  selector: 'app-produits-admin',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
  ],
  templateUrl: './produits-admin.component.html',
  styleUrl: './produits-admin.component.css'
})
export class ProduitsAdminComponent implements OnInit {

  produits: Produit[] = [];
  categories: Categorie[] = [];
  filteredProduits: Produit[] = [];

  // États
  activeTab: 'produits' | 'categories' = 'produits';
  searchTerm: string = '';
  selectedCategoryId: number | null = null;
  showLowStock: boolean = false;

  // Subscriptions
  private subscriptions: Subscription = new Subscription();


  constructor(private dialog: MatDialog,private produitService: ProduitService,private categorieService: CategorieService,private router: Router) { }

  ngOnInit(): void {
      this.filterProduits();
      this.getAllCategorie();
  }

  getAllProducts(): void {
    this.produitService.getAllProduits().subscribe(produits => {
      this.produits = produits;
    });
  }

  getAllCategorie(): void {
    this.categorieService.getAll().subscribe(categories => {
      this.categories = categories;
    })
  }


  filterProduits(): void {
    this.produitService.getAllProduits().subscribe(produits => {
      this.produits = produits;

      let filtered = [...this.produits]; // copie locale

      if (!this.selectedCategoryId) {
        filtered = [...this.produits];
      }

      if (this.searchTerm.trim()) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(p =>
          p.nom.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
        );
      }

      // Filtre par catégorie
      if (this.selectedCategoryId !== null && this.selectedCategoryId !== undefined) {
        console.log(this.selectedCategoryId);
        filtered = filtered.filter(p => p.categorie.id == this.selectedCategoryId);
      }



      // Stock faible
      if (this.showLowStock) {
        filtered = filtered.filter(p => p.quantite <= 10);
      }

      this.filteredProduits = filtered;
    });

  }

  // Event handlers
  onSearchChange(): void {
    this.filterProduits();
  }

  onCategoryFilterChange(value: number | null): void {
    this.selectedCategoryId = value;
    this.filterProduits();
  }

  onToggleLowStock(): void {
    this.showLowStock = !this.showLowStock;
    this.filterProduits();
  }

  onTabChange(tab: 'produits' | 'categories'): void {
    this.activeTab = tab;
  }

  // Actions produits
  onAjouterProduit(): void {
    this.router.navigate(['/administration/produits/ajouterProduit']);
  }

  onModifierProduit(produit: Produit): void {
    console.log('Modifier produit:', produit);
    const dialogRef = this.dialog.open(ModifieProduitComponent, {
      width: '800px',
      data: { produit },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.getAllProducts();
      }
    });
  }

  onSupprimerProduit(produit: Produit): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${produit.nom}" ?`)) {
      this.produitService.deleteProduit(produit.id).subscribe(data=>{
        if (data){
          alert("Le prouit est supprimé avec succes");
          this.getAllProducts();
        }
      });

    }
  }

  // Actions catégories
  onAjouterCategorie(): void {
    this.router.navigate(['/administration/produits/ajouterCategorie']);
  }

  onModifierCategorie(categorie: Categorie): void {
    const dialogRef = this.dialog.open(ModifieCategorieComponent, {
      width: '600px',
      data: categorie
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.getAllCategorie(); // recharge la liste des catégories
      }
    });
  }

  onSupprimerCategorie(categorie: Categorie): void {

    if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categorie.nom}" ?`)) {
      this.categorieService.delete(categorie.id).subscribe(data=>{
        if (data){
          alert("La catégorie est supprimé avec succes");
          this.getAllCategorie();
        }
      });
    }
  }

  // Utilitaires
  getStockClass(quantite: number): string {
    if (quantite === 0) return 'text-red-600';
    if (quantite <= 5) return 'text-orange-600';
    return 'text-green-600';
  }

  getStockBadge(quantite: number): string | null {
    if (quantite === 0) return 'Rupture';
    if (quantite <= 5) return 'Stock faible';
    return null;
  }

  getStockBadgeClass(quantite: number): string {
    if (quantite === 0) return 'bg-red-500';
    if (quantite <= 5) return 'bg-orange-500';
    return '';
  }


  getProduitsCountByCategory(categoryId: number): number {
    return this.produits.filter(p => p.categorie.id === categoryId).length;
  }


}
