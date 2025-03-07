import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { FooterComponent } from '../core/components/footer/footer.component';
import { AdminNavbarComponent } from '../core/components/admin-navbar/admin-navbar.component';
import { AdminHeroComponent } from '../core/components/admin-hero/admin-hero.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FooterComponent,
    AdminNavbarComponent,
    AdminHeroComponent
  ]
})
export class AdminModule { }
