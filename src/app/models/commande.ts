import {Admin} from "./admin";

export interface Commande {
  id: number;
  dateCommande: string; // LocalDate -> string (format ISO 8601)
  client: string;
  total: number;
  statut: boolean;
  admin: Admin;
}
