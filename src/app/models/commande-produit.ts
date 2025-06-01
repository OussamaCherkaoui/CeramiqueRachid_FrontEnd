import {Commande} from "./commande";
import {Produit} from "./produit";

export interface CommandeProduit {
  id: number;
  commande: Commande;
  produit: Produit;
  quantite: number;
}
