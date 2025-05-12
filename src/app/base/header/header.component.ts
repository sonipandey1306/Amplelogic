import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
@Component({
  selector: 'app-header',
  imports: [ButtonModule, InputTextModule, BadgeModule,OverlayBadgeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
editUser() {
throw new Error('Method not implemented.');
}
  
}
