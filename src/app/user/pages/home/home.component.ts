import { Component } from '@angular/core';
import { FooterComponent } from '../../../core/components/footer/footer.component'; // ✅ Import FooterComponent
import { NavbarComponent } from '../../../core/components/navbar/navbar.component'; // ✅ Import NavbarComponent
import { HeroComponent } from '../../../core/components/hero/hero.component'; // ✅ Import HeroComponent
import { ServiceComponent } from '../../service/service.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, HeroComponent, FooterComponent,ServiceComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}


