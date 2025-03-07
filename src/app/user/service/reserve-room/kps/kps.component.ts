import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // ใช้ CommonModule แทน BrowserModule
import { FormsModule } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-kps',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './kps.component.html',
  styleUrls: ['./kps.component.css']
})
export class KpsComponent {  

  
  siteGRooms = [
    { id: 1, name: 'ห้อง G101', details: 'ขนาด 4-8 คน', selected: false, date: '', time: '' },
    { id: 2, name: 'ห้อง G102', details: 'ขนาด 4-8 คน', selected: false, date: '', time: '' },
    { id: 3, name: 'ห้อง G103', details: 'ขนาด 4-8 คน', selected: false, date: '', time: '' },
  ];

  siteSRooms = [
    { id: 1, name: 'ห้อง S101', details: 'ขนาด 1-2 คน', selected: false, date: '', time: '' },
    { id: 2, name: 'ห้อง S102', details: 'ขนาด 1-2 คน', selected: false, date: '', time: '' },
  ];

  timeSlots = ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00'];

  toggleRoom(room: any, event: any) {
    room.selected = !room.selected;
  }

  trackByOsId(index: number, item: any) {
    return item.id;  // ควรมี id ในแต่ละ room object เพื่อให้ trackBy ใช้งานได้
  }
}
