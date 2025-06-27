import {Component, OnInit} from '@angular/core';
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
import {Router} from "@angular/router";
import {MessageService} from "../../services/message.service";
import {DecodejwtService} from "../../services/decodejwt.service";

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
export class MessagesAdminComponent implements OnInit {
  messages: Message[] = [];
  dataSource = new MatTableDataSource<Message>();
  displayedColumns: string[] = ['id', 'nomEtPrenom', 'email', 'message', 'dateEnvoi', 'repondu', 'actions'];
  idAdmin!: number;
  showOnlyUnanswered = false;

  constructor(protected router: Router,protected messageService:MessageService,protected decodeJwt:DecodejwtService) {}

  // Filtres
  dateEnvoi = null;

  ngOnInit(): void {
    const admin: Admin = { id: 1, username: 'admin1', password: '', email: 'admin1@mail.com' };
    this.getAllMessages();
    this.decodeJwt.getIdByUsername().subscribe(id=>{
      this.idAdmin = id;
    })
  }



  supprimer(id: number) {
    this.messageService.deleteMessage(id).subscribe(data=>{
      if (data.message) {
        this.getAllMessages()
      }
    });
  }


  getAllMessages(): void {
      this.messageService.getAllMessages().subscribe(messages=>{
        this.dataSource.data = messages;
      })
  }

  marquerRepondu(id: number) {
      this.messageService.updateMessageReply(id,this.idAdmin).subscribe(data=>{
        if (data.message) {
          this.getAllMessages()
        }
      });
  }

  filtrerMessages(): void {
    if (this.dateEnvoi && this.showOnlyUnanswered) {
      console.log("this.dateEnvoi && this.showOnlyUnanswered");
      this.messageService.getAllMessagesByDate(this.dateEnvoi).subscribe(messages => {
        this.dataSource.data = messages.filter(msg => !msg.estRepondue);
      });
    } else if (this.showOnlyUnanswered) {
      console.log("this.showOnlyUnanswered");
      this.messageService.getAllMessagesNotReply().subscribe(messages => {
        if (messages.length > 0) {
          this.dataSource.data = messages;
        }
        else{
          this.dataSource.data = [];
        }
      });

    } else if (this.dateEnvoi) {
      console.log("this.dateEnvoi");
      this.messageService.getAllMessagesByDate(this.dateEnvoi).subscribe(messages => {
        this.dataSource.data = messages.length > 0 ? messages : [];
      });
    } else {
      this.getAllMessages();
    }
  }
}
