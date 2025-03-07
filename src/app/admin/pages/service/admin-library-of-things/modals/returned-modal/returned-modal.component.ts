import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrintService } from '../services/print.service';
declare var bootstrap: any;
@Component({
  selector: 'app-returned-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './returned-modal.component.html',
  styleUrl: './returned-modal.component.css'
})
export class ReturnedModalComponent {
  @Input() borrowRequest: any;
  @Input() equipments: any[] = [];
  @Input() categories: any[] = [];
  
  @Output() returned = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();
  
  // ตัวแปรสำหรับ modal
  returnCondition: string = 'perfect';
  returnNote: string = '';
  acceptTerms: boolean = true;
  modal: any = null;
  
  // ตัวแปรสำหรับค่าปรับ (ถ้ามี)
  fineAmount: number = 0;
  finePaymentMethod: string = 'transfer';
  finePaymentComplete: boolean = false;
  fineNote: string = '';
  fineRate: number = 50; //
  
  constructor(private printService: PrintService) {}
  
  ngOnInit() {
    this.initModal();
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.initModal();
    }, 0);
  }
  
  private initModal() {
    const modalElement = document.getElementById('returnedModal');
    if (modalElement && typeof bootstrap !== 'undefined') {
      this.modal = new bootstrap.Modal(modalElement);
      
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.closed.emit();
      });
    }
  }
  
  show() {
    if (!this.borrowRequest) return;
    
    // ตั้งค่าเริ่มต้น
    this.returnCondition = 'perfect';
    this.returnNote = '';
    this.acceptTerms = true;
    
    // คำนวณค่าปรับ (ถ้าเกินกำหนด)
    this.calculateFine();
    
    // แสดง modal
    if (this.modal) {
      this.modal.show();
    } else {
      this.initModal();
      setTimeout(() => {
        if (this.modal) this.modal.show();
      }, 0);
    }
  }
  
  hide() {
    if (this.modal) {
      this.modal.hide();
    }
  }
  
  confirmReturn() {
    if (!this.borrowRequest) {
      console.error('ไม่พบข้อมูลการยืม');
      return;
    }
    
    if (!this.acceptTerms) {
      console.warn('ผู้ใช้ยังไม่ได้ยอมรับเงื่อนไข ไม่สามารถดำเนินการต่อได้');
      return;
    }
    
    console.log('กำลังยืนยันการคืนอุปกรณ์...');
    
    // สร้าง object สำหรับส่งข้อมูลกลับ
    const returnData: any = {
      borrowId: this.borrowRequest.id,
      condition: this.returnCondition,
      note: this.returnNote,
      printDocument: true // ตั้งค่าให้พิมพ์เอกสารทุกครั้ง เมื่อกดปุ่มยืนยัน
    };
    
    // ถ้ามีค่าปรับ เพิ่มข้อมูลค่าปรับ
    if (this.fineAmount > 0) {
      returnData.fine = {
        amount: this.fineAmount,
        paymentMethod: this.finePaymentMethod,
        paymentComplete: this.finePaymentComplete,
        note: this.fineNote
      };
    }
    
    console.log('ส่งข้อมูลการคืน:', returnData);
    
    // ส่งข้อมูลกลับไปยัง parent component
    this.returned.emit(returnData);
    
    // ปิด modal
    this.hide();
  }
  
  // คำนวณค่าปรับ
  calculateFine() {
    if (!this.borrowRequest || !this.borrowRequest.dueDate) {
      this.fineAmount = 0;
      return;
    }
    
    const dueDate = new Date(this.borrowRequest.dueDate);
    const today = new Date();
    
    if (dueDate >= today) {
      this.fineAmount = 0;
      return;
    }
    
    const diffTime = Math.abs(today.getTime() - dueDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // ค้นหาข้อมูลอุปกรณ์จาก equipments array โดยใช้ id
    const equipment = this.equipments.find(eq => eq.id === this.borrowRequest.equipment.id);
    
    if (!equipment) {
      console.error('ไม่พบข้อมูลอุปกรณ์:', this.borrowRequest.equipment.id);
      this.fineAmount = diffDays * 50; // ใช้ค่าเริ่มต้นถ้าไม่พบข้อมูลอุปกรณ์
      this.fineRate = 50;
      return;
    }
    
    // ตรวจสอบว่ามีการกำหนดค่าปรับสำหรับอุปกรณ์นี้หรือไม่
    if (equipment.fineRate && equipment.fineRate.dailyRate) {
      const dailyRate = equipment.fineRate.dailyRate;
      console.log(`ใช้ค่าปรับวันละ ${dailyRate} บาท สำหรับอุปกรณ์ ${equipment.name}`);
      
      // คำนวณค่าปรับตามจำนวนวัน
      let calculatedFine = diffDays * dailyRate;
      
      // ตรวจสอบค่าปรับสูงสุด (ถ้ามี)
      if (equipment.fineRate.maxFine && equipment.fineRate.maxFine > 0) {
        calculatedFine = Math.min(calculatedFine, equipment.fineRate.maxFine);
        console.log(`ค่าปรับสูงสุด ${equipment.fineRate.maxFine} บาท`);
      }
      
      // อัปเดตค่าปรับและอัตราค่าปรับต่อวัน
      this.fineAmount = calculatedFine;
      this.fineRate = dailyRate;
      
    } else {
      // ใช้ค่าเริ่มต้นถ้าไม่มีการกำหนดค่าปรับเฉพาะ
      console.log(`ไม่พบข้อมูลค่าปรับสำหรับอุปกรณ์ ${equipment.name} ใช้ค่าเริ่มต้น 50 บาท/วัน`);
      this.fineAmount = diffDays * 50;
      this.fineRate = 50;
    }
    
    console.log(`จำนวนวันที่เกินกำหนด: ${diffDays} วัน, ค่าปรับรวม: ${this.fineAmount} บาท`);
  }
  
  // ตรวจสอบว่าเกินกำหนดหรือไม่
  isOverdue(): boolean {
    if (!this.borrowRequest || !this.borrowRequest.dueDate) return false;
    
    const dueDate = new Date(this.borrowRequest.dueDate);
    const today = new Date();
    
    return dueDate < today;
  }
  
  // คำนวณจำนวนวันที่เกินกำหนด
  calculateOverdueDays(): number {
    if (!this.borrowRequest || !this.borrowRequest.dueDate) return 0;
    
    const dueDate = new Date(this.borrowRequest.dueDate);
    const today = new Date();
    
    if (dueDate >= today) return 0;
    
    const diffTime = Math.abs(today.getTime() - dueDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
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
  
  getEquipmentSerialNumber(equipmentId: string): string {
    const equipment = this.equipments.find(eq => eq.id === equipmentId);
    return equipment?.serialNumber || 'ไม่ระบุ';
  }
  
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  }
}