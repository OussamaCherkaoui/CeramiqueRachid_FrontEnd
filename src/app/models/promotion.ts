import {Produit} from "./produit";

export interface Promotion {
  id: number;
  titre: string;
  description: string;
  taux: number;
  dateDebut: string;
  dateFin: string;
  produit: Produit;
}
