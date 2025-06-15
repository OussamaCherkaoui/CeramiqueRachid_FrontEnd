import { Routes } from '@angular/router';
import {AcceuilComponent} from "./components/acceuil/acceuil.component";
import {ProduitsComponent} from "./components/produits/produits.component";
import {PromotionsComponent} from "./components/promotions/promotions.component";
import {ContactComponent} from "./components/contact/contact.component";
import {AuthentificationComponent} from "./components/authentification/authentification.component";
import {AdministrationComponent} from "./components/administration/administration.component";

export const routes: Routes = [
  { path: '', component: AcceuilComponent},
  { path: 'nosProduits', component: ProduitsComponent},
  { path: 'nosPromotions', component: PromotionsComponent},
  { path: 'contactez-nous', component: ContactComponent},
  { path: 'seConnecter', component: AuthentificationComponent},
  { path: 'administration', component: AdministrationComponent},
];
