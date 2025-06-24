import { Component } from '@angular/core';
import {Admin} from "../../models/admin";
import {FormsModule} from "@angular/forms";
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-ajouter-admin',
  standalone: true,
  imports: [
    MatLabel,
    FormsModule,
    MatHeaderRow,
    MatHeaderRowDef,
    MatCardTitle,
    MatCard,
    MatCardContent,
    MatFormField,
    MatIcon,
    MatInput,
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatTable,
    MatButton,
    MatRowDef,
    MatRow,
    MatIconButton
  ],
  templateUrl: './ajouter-admin.component.html',
  styleUrl: './ajouter-admin.component.css'
})
export class AjouterAdminComponent {
  displayedColumns: string[] = ['id', 'username', 'email', 'actions'];
  dataSource = new MatTableDataSource<Admin>();
  newAdmin: Admin = { id: 0, username: '', password: '', email: '' };
  nextId = 1;

  ngOnInit(): void {
    this.dataSource.data = [
      { id: 1, username: 'admin1', password: 'admin123', email: 'admin1@mail.com' }
    ];
    this.nextId = this.dataSource.data.length + 1;
  }

  ajouterAdmin(): void {
    const adminToAdd = { ...this.newAdmin, id: this.nextId++ };
    this.dataSource.data = [...this.dataSource.data, adminToAdd];
    this.newAdmin = { id: 0, username: '', password: '', email: '' };
  }

  supprimerAdmin(id: number): void {
    this.dataSource.data = this.dataSource.data.filter(admin => admin.id !== id);
  }
}
