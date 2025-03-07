import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component'; // ✅ นำเข้า Standalone Component
import { FooterComponent } from './components/footer/footer.component'; // ✅ นำเข้า Standalone Component
import { HeroComponent } from './components/hero/hero.component'; // ✅ นำเข้า Standalone Component

@NgModule({
  imports: [
    CommonModule,
    NavbarComponent,  // ✅ นำเข้า Standalone Component
    FooterComponent,  // ✅ นำเข้า Standalone Component
    HeroComponent     // ✅ นำเข้า Standalone Component
  ],
  exports: [
    NavbarComponent, 
    FooterComponent, 
    HeroComponent
  ]
})
export class CoreModule {}
