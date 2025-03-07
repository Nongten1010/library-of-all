import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ Standalone Component
  imports: [RouterModule], // ✅ ใช้ RouterModule เพื่อให้รองรับ `<router-outlet>`
  template: `
    <!-- <nav>
      <a routerLink="/">หน้าแรก</a> |
      <a routerLink="/admin">Admin</a>
    </nav> -->

    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'library-of-all';
}


// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { NavbarComponent } from './core/components/navbar/navbar.component'; 
// import { HeroComponent } from './core/components/hero/hero.component';
// import { ServiceComponent } from './user/pages/service/service.component';
// import { FooterComponent } from './core/components/footer/footer.component';
// import { ReactiveFormsModule } from '@angular/forms';
// import { HttpClient, HttpClientModule } from '@angular/common/http';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [NavbarComponent,HeroComponent,ServiceComponent,FooterComponent,ReactiveFormsModule,HttpClientModule],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent {
//   title = 'library-for-all';
// }
