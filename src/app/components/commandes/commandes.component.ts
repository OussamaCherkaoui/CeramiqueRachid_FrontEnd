import { Component } from '@angular/core';
import {Commande} from "../../models/commande";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './commandes.component.html',
  styleUrl: './commandes.component.css'
})
export class CommandesComponent {
  commandes: Commande[] = [];
  filteredCommandes: Commande[] = [];
  searchDate: string = '';
  searchStatut: string = 'tous';

  showAddModal: boolean = false;
  showEditModal: boolean = false;
  selectedCommande: Commande | null = null;

  newCommande: Partial<Commande> = {
    client: '',
    total: 0,
    statut: false
  };

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    // Données d'exemple - À remplacer par votre service API
    this.commandes = [
      {
        id: 1,
        dateCommande: '2025-06-20',
        client: 'Ahmed Benali',
        total: 450.00,
        statut: true,
        admin: {
          id: 1, username: 'Admin Principal', email: 'admin@ceramique.ma',
          password: ''
        }
      },
      {
        id: 2,
        dateCommande: '2025-06-19',
        client: 'Fatima Zahra',
        total: 780.50,
        statut: false,
        admin: {
          id: 1, username: 'Admin Principal', email: 'admin@ceramique.ma',
          password: ''
        }
      },
      {
        id: 3,
        dateCommande: '2025-06-18',
        client: 'Mohamed Alami',
        total: 320.75,
        statut: true,
        admin: {
          id: 1, username: 'Admin Principal', email: 'admin@ceramique.ma',
          password: ''
        }
      },
      {
        id: 4,
        dateCommande: '2025-06-17',
        client: 'Aisha Idrissi',
        total: 890.25,
        statut: false,
        admin: {
          id: 1, username: 'Admin Principal', email: 'admin@ceramique.ma',
          password: ''
        }
      },
      {
        id: 5,
        dateCommande: '2025-06-16',
        client: 'Youssef Tazi',
        total: 567.80,
        statut: true,
        admin: {
          id: 1, username: 'Admin Principal', email: 'admin@ceramique.ma',
          password: ''
        }
      }
    ];

    this.filteredCommandes = [...this.commandes];
  }

  filterCommandes(): void {
    let filtered = [...this.commandes];

    if (this.searchDate) {
      filtered = filtered.filter(commande =>
        commande.dateCommande.includes(this.searchDate)
      );
    }

    if (this.searchStatut !== 'tous') {
      const statutBool = this.searchStatut === 'validee';
      filtered = filtered.filter(commande => commande.statut === statutBool);
    }

    this.filteredCommandes = filtered;
  }

  resetFilters(): void {
    this.searchDate = '';
    this.searchStatut = 'tous';
    this.filterCommandes();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  }

  editCommande(commande: Commande): void {
    this.selectedCommande = { ...commande };
    this.showEditModal = true;
  }

  deleteCommande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.commandes = this.commandes.filter(c => c.id !== id);
      this.filterCommandes();
    }
  }

  addCommande(): void {
    if (this.newCommande.client && this.newCommande.total !== undefined) {
      const newId = Math.max(...this.commandes.map(c => c.id)) + 1;
      const commande: Commande = {
        id: newId,
        dateCommande: new Date().toISOString().split('T')[0],
        client: this.newCommande.client,
        total: this.newCommande.total,
        statut: this.newCommande.statut || false,
        admin: {
          id: 1, username: 'Admin Principal', email: 'admin@ceramique.ma',
          password: ''
        }
      };

      this.commandes.push(commande);
      this.filterCommandes();
      this.closeAddModal();
    }
  }

  updateCommande(): void {
    if (this.selectedCommande) {
      const index = this.commandes.findIndex(c => c.id === this.selectedCommande!.id);
      if (index !== -1) {
        this.commandes[index] = { ...this.selectedCommande };
        this.filterCommandes();
      }
      this.closeEditModal();
    }
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.newCommande = {
      client: '',
      total: 0,
      statut: false
    };
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedCommande = null;
  }
}
