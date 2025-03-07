import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReserveRoomComponent } from './reserve-room/reserve-room.component';
import { InterlibraryLoanComponent } from './interlibrary-loan/interlibrary-loan.component';
import { EventsComponent } from './events/events.component';
import { PurchasingResourcesComponent } from './purchasing-resources/purchasing-resources.component';
import { LibraryOfThingeComponent } from './library-of-thinge/library-of-thinge.component';



@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule,ReserveRoomComponent,InterlibraryLoanComponent,EventsComponent,PurchasingResourcesComponent,LibraryOfThingeComponent], 
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent {
  showReserveRoom = false;
  showInterlibraryLoan = false;
  showPurchasingResources = false;
  showEvents = false;
  showLibraryOfThinge = false;

  onReserveRoomClick() {
    this.resetViews();
    this.showReserveRoom = true;
  }

  onInterlibraryLoanClick() {
    this.resetViews();
    this.showInterlibraryLoan = true;
  }

  onPurchasingResourcesClick() {
    this.resetViews();
    this.showPurchasingResources = true;
  }

  onEventsClick() {
    this.resetViews();
    this.showEvents = true;
  }

  onLibraryOfThingeClick() {
    this.resetViews();
    this.showLibraryOfThinge = true;
  }
  onBackClick() {
    this.resetViews();
  }

  private resetViews() {
    this.showReserveRoom = false;
    this.showInterlibraryLoan = false;
    this.showPurchasingResources = false;
    this.showLibraryOfThinge = false;
    this.showEvents = false;
  }
}