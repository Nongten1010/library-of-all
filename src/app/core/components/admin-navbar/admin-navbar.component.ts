import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent {
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
