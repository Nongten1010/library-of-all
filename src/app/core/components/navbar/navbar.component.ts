import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    if (sidebar) {
      if (sidebar.classList.contains("show")) {
        sidebar.classList.remove("show");
      } else {
        sidebar.classList.add("show");
      }
    }
  }
}
