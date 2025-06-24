import { Routes } from '@angular/router';
import {AcceuilComponent} from "./components/acceuil/acceuil.component";
import {ProduitsComponent} from "./components/produits/produits.component";
import {PromotionsComponent} from "./components/promotions/promotions.component";
import {ContactComponent} from "./components/contact/contact.component";
import {AuthentificationComponent} from "./components/authentification/authentification.component";
import {AdministrationComponent} from "./components/administration/administration.component";
import {TableauDeBordComponent} from "./components/tableau-de-bord/tableau-de-bord.component";
import {CommandesComponent} from "./components/commandes/commandes.component";
import {ProduitsAdminComponent} from "./components/produits-admin/produits-admin.component";
import {PromotionService} from "./services/promotion.service";
import {PromotionsAdminComponent} from "./components/promotions-admin/promotions-admin.component";
import {AjouterAdminComponent} from "./components/ajouter-admin/ajouter-admin.component";
import {MessagesAdminComponent} from "./components/messages-admin/messages-admin.component";

export const routes: Routes = [
  { path: '', component: AcceuilComponent},
  { path: 'nosProduits', component: ProduitsComponent},
  { path: 'nosPromotions', component: PromotionsComponent},
  { path: 'contactez-nous', component: ContactComponent},
  { path: 'seConnecter', component: AuthentificationComponent},
  { path: 'administration', component: AdministrationComponent,
    children:[{path: '', component: TableauDeBordComponent},
      {path: 'commandes', component: CommandesComponent},
      {path: 'produits', component: ProduitsAdminComponent},
      {path: 'promotions', component: PromotionsAdminComponent},
      {path: 'messages', component: MessagesAdminComponent},
      {path: 'ajouterAdmin', component: AjouterAdminComponent}]}
];
