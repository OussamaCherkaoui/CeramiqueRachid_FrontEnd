import {Component, OnInit} from '@angular/core';
import {Admin} from "../../models/admin";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
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
import {AdminService} from "../../services/admin.service";

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
    MatIconButton,
    ReactiveFormsModule
  ],
  templateUrl: './ajouter-admin.component.html',
  styleUrl: './ajouter-admin.component.css'
})
export class AjouterAdminComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'actions'];
  dataSource = new MatTableDataSource<Admin>();
  newAdmin: Admin = { id: 0, username: '', password: '', email: '' };
  nextId = 1;
  adminForm: FormGroup;

  constructor(private fb: FormBuilder,private adminService:AdminService) {
    this.adminForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.getAllAdmins();
    this.nextId = this.dataSource.data.length + 1;
  }

  getAllAdmins(){
    this.adminService.getAllAdmins().subscribe(data=>{
      this.dataSource.data =data;
    });
  }
  ajouterAdmin(): void {

    this.newAdmin.username = this.adminForm.get('username')?.value;
    this.newAdmin.email = this.adminForm.get('email')?.value;
    this.newAdmin.password = this.adminForm.get('password')?.value;

    console.log(this.newAdmin);

    if (this.newAdmin.username && this.newAdmin.email && this.newAdmin.password) {
      if (this.adminForm.valid) {
        this.adminService.registerAdmin(this.newAdmin).subscribe(data=>{
          if (data)
          {
            this.adminForm.get('username')?.setValue(null);
            this.adminForm.get('email')?.setValue(null);
            this.adminForm.get('password')?.setValue(null);
            this.getAllAdmins();
            alert('Compte created with succées');
          }
          else{
            alert('verify your Information !!');
          }
        });
      } else {
        alert("Remplit toutes les champs !!");
      }
    }
  }

  supprimerAdmin(id: number): void {
    this.adminService.deleteAdmin(id).subscribe(data=>{
      if (data){
        this.getAllAdmins();
      }
    });
    this.dataSource.data = this.dataSource.data.filter(admin => admin.id !== id);
  }
}
