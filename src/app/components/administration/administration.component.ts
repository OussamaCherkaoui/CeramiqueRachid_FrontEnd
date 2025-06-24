import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatAnchor} from "@angular/material/button";

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
export class AdministrationComponent {


  constructor(protected router: Router) {}

  isActive(url: string): boolean {
    return this.router.url === url;
  }

}
