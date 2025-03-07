import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-approve-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approve-modal.component.html',
  styleUrls: ['./approve-modal.component.scss']
})
export class ApproveModalComponent implements OnInit {
  // รับข้อมูลจาก parent component
  @Input() borrowRequest: any;
  @Input() equipments: any[] = [];
  @Input() categories: any[] = [];

  // ส่งข้อมูลกลับไปยัง parent component
  @Output() approved = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();

  // ตัวแปรภายใน component
  equipmentCondition: string = 'perfect';
  approveNote: string = '';
  printDocument: boolean = true;
  modal: any = null;

  ngOnInit() {
    // ตรวจสอบว่า DOM โหลดเสร็จแล้ว แล้วจึงเริ่มต้น Modal
    document.addEventListener('DOMContentLoaded', () => {
      this.initModal();
    });
  }

  ngAfterViewInit() {
    // เริ่มต้น Modal หลังจาก View ถูกสร้าง
    setTimeout(() => {
      this.initModal();
    }, 0);
  }

  private initModal() {
    const modalElement = document.getElementById('approveModal');
    if (modalElement && typeof bootstrap !== 'undefined') {
      this.modal = new bootstrap.Modal(modalElement);
      // เพิ่ม event listener เมื่อ modal ถูกซ่อน
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.closed.emit();
      });
    }
  }

  // แสดง modal
  show() {
    if (this.modal) {
      this.modal.show();
    } else {
      this.initModal();
      setTimeout(() => {
        if (this.modal) this.modal.show();
      }, 0);
    }
  }

  // ซ่อน modal
  hide() {
    if (this.modal) {
      this.modal.hide();
    }
  }

  // ยืนยันการอนุมัติ
  confirmApprove() {
    if (!this.borrowRequest) return;
    
    // สร้าง object สำหรับส่งข้อมูลกลับ
    const approvalData = {
      borrowId: this.borrowRequest.id,
      condition: this.equipmentCondition,
      note: this.approveNote,
      printDocument: this.printDocument
    };

    // ส่งข้อมูลกลับไปยัง parent component
    this.approved.emit(approvalData);
    
    // ปิด modal
    this.hide();
  }

  // ฟังก์ชันช่วยเหลือ
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  }

  getEquipmentSerialNumber(equipmentId: string): string {
    const equipment = this.equipments.find(eq => eq.id === equipmentId);
    return equipment?.serialNumber || 'ไม่ระบุ';
  }

  getConditionText(condition: string): string {
    switch (condition) {
      case 'perfect':
        return 'สมบูรณ์ - ไม่มีความเสียหาย';
      case 'good':
        return 'ดี - มีร่องรอยการใช้งานเล็กน้อย';
      case 'fair':
        return 'พอใช้ - มีร่องรอยการใช้งานปานกลาง';
      case 'damaged':
        return 'เสียหาย - ต้องส่งซ่อม';
      case 'lost':
        return 'สูญหาย - อุปกรณ์ไม่ครบ';
      default:
        return condition;
    }
  }
}