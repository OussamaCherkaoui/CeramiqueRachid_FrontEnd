import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {MatAnchor} from "@angular/material/button";
import {MatRipple} from "@angular/material/core";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgOptimizedImage,
    MatToolbar,
    MatAnchor,
    RouterLinkActive,
    MatRipple
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

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
    '/administration/produits/ajouterCategorie',
    '/administration/promotions/ajouter'
  ];

  constructor(protected router: Router) {}

  isActive(url: string): boolean {
    return this.router.url === url;
  }

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
