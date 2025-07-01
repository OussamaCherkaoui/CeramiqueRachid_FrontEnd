import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  excludedRoutes: string[] = [
    '/seConnecter',
    '/administration',
    '/administration/commandes',
    '/administration/produits',
    '/administration/promotions',
    '/administration/messages',
    '/administration/spaces/ourSpaces',
    '/administration/ajouterAdmin',
    '/administration/produits/ajouterProduit',
    '/administration/promotions/ajouter',
    '/administration/produits/ajouterCategorie',
  ];

  constructor(protected router: Router) {}

  verifyUrl(url: string): boolean {
    if (this.excludedRoutes.includes(url)) {
      return true;
    }

    // Vérification pour la route dynamique 'updateSpace' avec un ID
    const updateSpaceRegex = /^\/admin\/spaces\/ourSpaces\/updateSpace\/\d+$/;
    const updateEventRegex = /^\/admin\/events\/updateEvent\/\d+$/;
    const registrationEventRegex = /^\/admin\/events\/reservations\/\d+$/;
    return updateSpaceRegex.test(url) || updateEventRegex.test(url)||registrationEventRegex.test(url);
  }
}
