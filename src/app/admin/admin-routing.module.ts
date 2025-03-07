import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from './pages/admin-main/admin-main.component';

const routes: Routes = [
  { path: '', component: AdminMainComponent } // ✅ เส้นทาง `/admin`
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
