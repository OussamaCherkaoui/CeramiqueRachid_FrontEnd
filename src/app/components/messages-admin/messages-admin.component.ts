import { Component } from '@angular/core';
import {Admin} from "../../models/admin";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {Message} from "../../models/message";
import {MatIcon} from "@angular/material/icon";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";
import {DatePipe} from "@angular/common";
import {MatChip} from "@angular/material/chips";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-messages-admin',
  standalone: true,
  imports: [
    MatIcon,
    MatCellDef,
    MatColumnDef,
    MatCardContent,
    MatCardTitle,
    MatCard,
    MatLabel,
    MatFormField,
    FormsModule,
    MatInput,
    MatCheckbox,
    MatTable,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    DatePipe,
    MatChip,
    MatIconButton,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef,
    MatRow
  ],
  templateUrl: './messages-admin.component.html',
  styleUrl: './messages-admin.component.css'
})
export class MessagesAdminComponent {
  messages: Message[] = [];
  dataSource = new MatTableDataSource<Message>();
  displayedColumns: string[] = ['id', 'nomEtPrenom', 'email', 'message', 'dateEnvoi', 'repondu', 'actions'];

  // Filtres
  dateMin = '';
  dateMax = '';
  showOnlyUnanswered = false;

  ngOnInit(): void {
    const admin: Admin = { id: 1, username: 'admin1', password: '', email: 'admin1@mail.com' };

    this.messages = [
      {
        id: 1,
        nomEtPrenom: 'Ali Benbrahim',
        telephone: 612345678,
        email: 'ali@gmail.com',
        message: 'Bonjour, je souhaite avoir des informations.',
        dateEnvoi: new Date('2025-06-10'),
        dateReponse: new Date('2025-06-10'),
        estRepondue: false,
        admin
      },
      {
        id: 2,
        nomEtPrenom: 'Sana Elhajoui',
        telephone: 654321098,
        email: 'sana@mail.com',
        message: 'Quand la commande sera livrée ?',
        dateEnvoi: new Date('2025-06-08'),
        dateReponse: new Date('2025-06-09'),
        estRepondue: true,
        admin
      }
    ];

    this.dataSource.data = [...this.messages];
  }

  filtrerMessages() {
    this.dataSource.data = this.messages.filter(m => {
      const date = new Date(m.dateEnvoi);
      const afterMin = this.dateMin ? date >= new Date(this.dateMin) : true;
      const beforeMax = this.dateMax ? date <= new Date(this.dateMax) : true;
      const onlyUnanswered = this.showOnlyUnanswered ? !m.estRepondue : true;
      return afterMin && beforeMax && onlyUnanswered;
    });
  }

  supprimer(id: number) {
    this.messages = this.messages.filter(m => m.id !== id);
    this.filtrerMessages();
  }

  marquerRepondu(id: number) {
    const message = this.messages.find(m => m.id === id);
    if (message && !message.estRepondue) {
      message.estRepondue = true;
      message.dateReponse = new Date();
      this.filtrerMessages();
    }
  }
}
