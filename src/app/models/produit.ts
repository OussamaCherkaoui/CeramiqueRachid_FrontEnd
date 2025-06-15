import {Categorie} from "./categorie";

export interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  image: string;
  quantite: number;
  categorie: Categorie;
}
