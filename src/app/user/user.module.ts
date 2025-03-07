import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from '../core/components/navbar/navbar.component';
import { HeroComponent } from '../core/components/hero/hero.component';
import { FooterComponent } from '../core/components/footer/footer.component';
import { ServiceComponent } from './service/service.component';

@NgModule({
  // declarations: [HomeComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NavbarComponent, 
    HeroComponent,
    ServiceComponent,    
    FooterComponent  
  ]
})
export class UserModule {}
