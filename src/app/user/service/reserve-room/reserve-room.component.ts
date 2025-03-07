import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
// import { KpsComponent } from './kps/kps.component';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-reserve-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reserve-room.component.html',
  styleUrls: ['./reserve-room.component.css']
})
export class ReserveRoomComponent {
  selectedType: string = ''; // ประเภทที่เลือก
  roomTypes: string[] = []; // เก็บประเภทห้องจากข้อมูล

  room = [
    {
      number: '1101',
      type: 'G',
      location: 'kps',
      building: '1',
      floor: '1',
      capacity: '8',
      equipment: ['โปรเจคเตอร์', 'ไวท์บอร์ด'],
    },

    {
      number: '1102',
      type: 'G',
      location: 'kps',
      building: '1',
      floor: '1',
      capacity: '8',
      equipment: ['โปรเจคเตอร์'],
    },
    {
      number: '1102',
      type: 'G',
      location: 'kps',
      building: '2',
      floor: '1',
      capacity: '8',
      equipment: ['โปรเจคเตอร์'],
    },
    {
      number: '1102',
      type: 'G',
      location: 'kps',
      building: '2',
      floor: '2',
      capacity: '8',
      equipment: ['โปรเจคเตอร์'],
    },
    
    {
      number: 'S2101',
      type: 'S',
      location: 'kps',
      building: '2',
      floor: '1',
      capacity: '2',
      equipment: ['โต๊ะ', 'เก้าอี้'],
    },
    {
      number: 'SK1101',
      type: 'G',
      location: 'skn',
      building: '1',
      floor: '1',
      capacity: '8',
      equipment: ['โปรเจคเตอร์', 'ไวท์บอร์ด'],
    },
    {
      number: 'SRC1101',
      type: 'G',
      location: 'src',
      building: '1',
      floor: '1',
      capacity: '8',
      equipment: ['โปรเจคเตอร์'],
    },
    {
      number: 'M3101',
      type: 'meeting',
      location: 'bkk',
      building: '3',
      floor: '1',
      capacity: '12',
      equipment: ['จอประชุม', 'ไมโครโฟน'],
    },
  ];

  ngOnInit() {
    // ดึงประเภทห้องจาก room และเก็บใน roomTypes (ไม่ซ้ำ)
    this.roomTypes = [...new Set(this.room.map((r) => r.type))];
    this.selectedType = this.roomTypes[0]; // ตั้งค่าประเภทเริ่มต้นเป็นประเภทแรก
  }

  // ฟังก์ชันสำหรับเลือกประเภท
  selectType(type: string) {
    this.selectedType = type;
  }

  // ฟังก์ชันสำหรับจัดกลุ่มข้อมูลตามอาคารและชั้น
  getBuildingsByType(type: string) {
    const filteredRooms = this.room.filter((r) => r.type === type);

    const buildings: { building: string; floors: { floor: string; rooms: any[] }[] }[] = [];

    filteredRooms.forEach((room) => {
      let building = buildings.find((b) => b.building === room.building);

      if (!building) {
        building = { building: room.building, floors: [] };
        buildings.push(building);
      }

      let floor = building.floors.find((f) => f.floor === room.floor);

      if (!floor) {
        floor = { floor: room.floor, rooms: [] };
        building.floors.push(floor);
      }

      floor.rooms.push(room);
    });

    return buildings;
  }

  // ฟังก์ชันสำหรับแปลงชื่อประเภทให้เข้าใจง่าย
  getTypeName(type: string): string {
    const typeNames: { [key: string]: string } = {
      G: 'ห้อง ไซซ์ G (4-8 คน)',
      S: 'ห้อง ไซซ์ S (1-2 คน)',
      meeting: 'ห้องประชุม',
    };
    return typeNames[type] || type; // หากไม่พบชื่อ ใช้ type เดิม
  }
}





