import {Admin} from "./admin";

export interface Message {
  id: number;
  nomEtPrenom: string;
  telephone: number;
  email: string;
  message: string;
  dateEnvoi: Date;
  dateReponse: Date;
  estRepondue: boolean;
  admin: Admin;
}
