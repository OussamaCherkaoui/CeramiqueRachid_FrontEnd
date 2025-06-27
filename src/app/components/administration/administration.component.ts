import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatAnchor} from "@angular/material/button";
import {AdminService} from "../../services/admin.service";
import {DecodejwtService} from "../../services/decodejwt.service";

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatAnchor
  ],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css'
})
export class AdministrationComponent implements OnInit {
  username!:string;


  constructor(protected router: Router,protected authService:AdminService,protected decodeJwt:DecodejwtService) {}

  ngOnInit(): void {
    this.username = this.decodeJwt.getUsernameFromToken();
    }

  isActive(url: string): boolean {
    return this.router.url === url;
  }


  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/seConnecter');
  }

}
