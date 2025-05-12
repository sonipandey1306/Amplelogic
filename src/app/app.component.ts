import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './base/header/header.component';
import { FooterComponent } from "./base/footer/footer.component";
import { SidebarComponent } from './base/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SidebarComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'amplelogicTask';
  isSidebarCollapsed = signal<boolean>(true);  
  screenWidth =signal<number>(window.innerWidth);

  @HostListener('window:resize')
  onResize(){
    this.screenWidth.set(window.innerWidth)
    if(this.screenWidth() <768){
      this.isSidebarCollapsed.set(true)
    }
  }

  changeIsSidebarCollapsed(isSidebarCollapsed:boolean):void{
    this.isSidebarCollapsed.set(isSidebarCollapsed)
  }
}
