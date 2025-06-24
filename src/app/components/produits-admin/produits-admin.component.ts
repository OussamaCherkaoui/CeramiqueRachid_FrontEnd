import { Component } from '@angular/core';
import {Produit} from "../../models/produit";
import {Categorie} from "../../models/categorie";
import {Subscription} from "rxjs";
import {ProduitService} from "../../services/produit.service";
import {CategorieService} from "../../services/categorie.service";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-produits-admin',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './produits-admin.component.html',
  styleUrl: './produits-admin.component.css'
})
export class ProduitsAdminComponent {

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

  constructor(private produitService: ProduitService,private categorieService: CategorieService) { }

  ngOnInit(): void {
    // Charger les données
    this.subscriptions.add(
      this.produitService.getAllProduits().subscribe(produits => {
        this.produits = produits;
        this.filterProduits();
      })
    );



    this.subscriptions.add(
      this.categorieService.getAll().subscribe(categories => {
        this.categories = categories;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Filtrage des produits
  filterProduits(): void {
    let filtered = this.produits;

    // Filtre par terme de recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(produit =>
        produit.nom.toLowerCase().includes(term) ||
        produit.description.toLowerCase().includes(term)
      );
    }

    // Filtre par catégorie
    if (this.selectedCategoryId) {
      filtered = filtered.filter(produit =>
        produit.categorie.id === this.selectedCategoryId
      );
    }

    // Filtre stock faible
    if (this.showLowStock) {
      filtered = filtered.filter(produit => produit.quantite <= 5);
    }

    this.filteredProduits = filtered;
  }

  // Event handlers
  onSearchChange(): void {
    this.filterProduits();
  }

  onCategoryFilterChange(): void {
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
    // Ouvrir modal d'ajout
    console.log('Ajouter nouveau produit');
    // Implémentation avec modal ou navigation
  }

  onModifierProduit(produit: Produit): void {
    console.log('Modifier produit:', produit);
    // Ouvrir modal de modification
  }

  onSupprimerProduit(produit: Produit): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${produit.nom}" ?`)) {
      this.produitService.deleteProduit(produit.id);
    }
  }

  // Actions catégories
  onAjouterCategorie(): void {
    console.log('Ajouter nouvelle catégorie');
    // Ouvrir modal d'ajout
  }

  onModifierCategorie(categorie: Categorie): void {
    console.log('Modifier catégorie:', categorie);
    // Ouvrir modal de modification
  }

  onSupprimerCategorie(categorie: Categorie): void {
    const produitsDeCategorie = this.produits.filter(p => p.categorie.id === categorie.id);
    if (produitsDeCategorie.length > 0) {
      alert(`Impossible de supprimer cette catégorie car elle contient ${produitsDeCategorie.length} produit(s).`);
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categorie.nom}" ?`)) {
      this.categorieService.delete(categorie.id);
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
