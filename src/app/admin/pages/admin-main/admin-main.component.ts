import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { trigger, transition, style, animate } from '@angular/animations';
import { FooterComponent } from '../../../core/components/footer/footer.component';
import { AdminNavbarComponent } from '../../../core/components/admin-navbar/admin-navbar.component';
import { AdminHeroComponent } from '../../../core/components/admin-hero/admin-hero.component'; // ✅ Import HeroComponent
import { AdminLibraryOfThingsComponent } from '../service/admin-library-of-things/admin-library-of-things.component';

@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [CommonModule,FooterComponent,AdminNavbarComponent,AdminHeroComponent,AdminLibraryOfThingsComponent],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.css',
  // animations: [
  //   trigger('fadeAnimation', [
  //     transition(':enter', [
  //       style({ opacity: 0 }),
  //       animate('30000ms', style({ opacity: 1 }))
  //     ]),
  //     transition(':leave', [
  //       animate('30000ms', style({ opacity: 0 }))
  //     ])
  //   ])
  // ]
})
export class AdminMainComponent {
  showLibraryOfThings = false;
  onBackClick() {
    this.resetViews();
  }
  onLibraryOfThingeClick() {
    this.resetViews();
    this.showLibraryOfThings = true;
  }

  private resetViews() {
    this.showLibraryOfThings = false;

  }

}
