import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, AfterViewInit, Output, ViewChild } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { PrintService } from '../services/print.service';
declare var bootstrap: any;
@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe],
  templateUrl: './info-modal.component.html',
  styleUrl: './info-modal.component.css'
})
export class InfoModalComponent {
  @Input() borrowRequest: any;
  @Input() equipments: any[] = [];
  @Input() categories: any[] = [];
  
  @Output() statusChanged = new EventEmitter<any>();
  @Output() printRequested = new EventEmitter<any>();
  @Output() approveRequested = new EventEmitter<any>();
  @Output() returnRequested = new EventEmitter<any>();
  @Output() maintenanceRequested = new EventEmitter<any>();
  @Output() cancelRequested = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();
  
  @ViewChild('infoModal') modalElement!: ElementRef;
  private modalInstance: any;

  // ตัวแปรสำหรับแท็บ
  activeTab: string = 'details';
  
  // ตัวแปรสำหรับข้อมูลเพิ่มเติม
  equipmentDetails: any = null;
  borrowHistory: any[] = [];
  
  // ตัวแปรสำหรับการเปลี่ยนสถานะ
  newStatus: string = '';
  statusNote: string = '';

  constructor(private printService: PrintService) { }

  ngOnInit(): void {
  }
  
  ngOnChanges(): void {
    if (this.borrowRequest) {
      console.log('ได้รับข้อมูลการยืม:', this.borrowRequest);
      this.loadAdditionalData();
    }
  }
  
  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }
  
  // เมธอดสำหรับเปิด modal
  show(): void {
    this.activeTab = 'details'; // เริ่มที่แท็บรายละเอียด
    this.newStatus = '';
    this.statusNote = '';
    this.modalInstance.show();
  }
  
  close(): void {
    this.modalInstance.hide();
    this.resetForm();
  }
  
  // เมธอดสำหรับโหลดข้อมูลเพิ่มเติม
  loadAdditionalData(): void {
    // โหลดข้อมูลอุปกรณ์
    if (this.borrowRequest?.equipment?.id) {
      this.equipmentDetails = this.equipments.find(eq => eq.id === this.borrowRequest.equipment.id);
    }
    
    // สร้างประวัติการดำเนินการจากข้อมูลที่มี
    this.buildBorrowHistory();
  }
  
  // สร้างประวัติการดำเนินการ
  buildBorrowHistory(): void {
    this.borrowHistory = [];
    
    if (!this.borrowRequest) return;
    
    // เพิ่มประวัติการขอยืม
    this.borrowHistory.push({
      timestamp: this.borrowRequest.requestDate || this.borrowRequest.borrowDate,
      action: 'request',
      performedBy: 'ผู้ยืม: ' + this.borrowRequest.name,
      notes: 'ขอยืม ' + this.borrowRequest.equipment.name
    });
    
    // ถ้ามีการอนุมัติ/ยืม
    if (this.borrowRequest.status !== 'pending') {
      this.borrowHistory.push({
        timestamp: this.borrowRequest.borrowDate,
        action: 'approve',
        performedBy: this.borrowRequest.approvedBy || 'เจ้าหน้าที่',
        notes: 'อนุมัติการยืม ' + this.borrowRequest.equipment.name
      });
    }
    
    // ถ้ามีการคืน
    if (this.borrowRequest.returnDate) {
      this.borrowHistory.push({
        timestamp: this.borrowRequest.returnDate,
        action: 'return',
        performedBy: this.borrowRequest.returnedTo || 'เจ้าหน้าที่',
        notes: 'คืน ' + this.borrowRequest.equipment.name + 
              (this.borrowRequest.fine && this.borrowRequest.fine.amount > 0 ? 
               ' (มีค่าปรับ ' + this.borrowRequest.fine.amount + ' บาท)' : '')
      });
    }
    
    // ถ้ามีการส่งซ่อม
    if (this.borrowRequest.maintenance) {
      const maintenanceEntries = Array.isArray(this.borrowRequest.maintenance) ? 
                              this.borrowRequest.maintenance : [this.borrowRequest.maintenance];
      
      maintenanceEntries.forEach((maintenance: any) => {
        this.borrowHistory.push({
          timestamp: maintenance.startDate,
          action: 'maintenance-start',
          performedBy: maintenance.technicianName || maintenance.vendor || 'เจ้าหน้าที่',
          notes: 'ส่งซ่อม ' + this.borrowRequest.equipment.name + ': ' + 
                (maintenance.reason || 'ไม่ระบุเหตุผล')
        });
        
        if (maintenance.completionDate) {
          this.borrowHistory.push({
            timestamp: maintenance.completionDate,
            action: 'maintenance-complete',
            performedBy: maintenance.technicianName || maintenance.vendor || 'เจ้าหน้าที่',
            notes: 'ซ่อมเสร็จสิ้น ' + this.borrowRequest.equipment.name
          });
        }
      });
    }
    
    // ถ้ามีการยกเลิก
    if (this.borrowRequest.status === 'cancelled') {
      this.borrowHistory.push({
        timestamp: this.borrowRequest.cancelDate || this.borrowRequest.lastUpdated || new Date().toISOString(),
        action: 'cancel',
        performedBy: this.borrowRequest.cancelledBy || 'เจ้าหน้าที่',
        notes: 'ยกเลิกการยืม ' + this.borrowRequest.equipment.name + 
               (this.borrowRequest.cancelReason ? ': ' + this.borrowRequest.cancelReason : '')
      });
    }
    
    // เรียงลำดับตามเวลา (ล่าสุดอยู่บนสุด)
    this.borrowHistory.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }
  
  // เมธอดสำหรับการจัดการกับอินเตอร์แอคชั่นจาก UI
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  onStatusChange(event: Event): void {
    this.newStatus = (event.target as HTMLSelectElement).value;
  }
  
  onStatusNoteChange(event: Event): void {
    this.statusNote = (event.target as HTMLTextAreaElement).value;
  }
  
  updateStatus(): void {
    if (!this.newStatus) return;
    
    const statusData = {
      borrowId: this.borrowRequest.id,
      oldStatus: this.borrowRequest.status,
      newStatus: this.newStatus,
      note: this.statusNote,
      timestamp: new Date().toISOString()
    };
    
    this.statusChanged.emit(statusData);
    this.newStatus = '';
    this.statusNote = '';
  }
  
  // เมธอดสำหรับการพิมพ์เอกสาร
  printBorrowDocument(): void {
    const printData = {
      type: 'borrow',
      borrowId: this.borrowRequest.id,
      timestamp: new Date().toISOString()
    };
    
    this.printRequested.emit(printData);
    
    // เรียกใช้ PrintService โดยตรงถ้าต้องการ
    try {
      this.printService.printBorrowDocument(
        this.borrowRequest,
        this.equipmentDetails,
        this.getCategoryName(this.borrowRequest.equipment.category),
        this.borrowRequest.equipmentCondition || 'สมบูรณ์',
        this.borrowRequest.approveNote || ''
      );
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการพิมพ์เอกสาร:', error);
    }
  }
  
  printReturnDocument(): void {
    const printData = {
      type: 'return',
      borrowId: this.borrowRequest.id,
      timestamp: new Date().toISOString()
    };
    
    this.printRequested.emit(printData);
    
    // เรียกใช้ PrintService โดยตรงถ้าต้องการ
    try {
      this.printService.printReturnDocument(
        this.borrowRequest,
        this.equipmentDetails,
        this.getCategoryName(this.borrowRequest.equipment.category),
        {
          condition: this.borrowRequest.returnCondition || 'สมบูรณ์',
          note: this.borrowRequest.returnNote || '',
          fine: this.borrowRequest.fine
        }
      );
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการพิมพ์เอกสาร:', error);
    }
  }
  
  printMaintenanceDocument(): void {
    const printData = {
      type: 'maintenance',
      borrowId: this.borrowRequest.id,
      timestamp: new Date().toISOString()
    };
    
    this.printRequested.emit(printData);
    
    // ในที่นี้ไม่มีการเรียกใช้ PrintService โดยตรง
    // เนื่องจากยังไม่มีเมธอด printMaintenanceDocument ที่ระบุไว้
  }
  
  printFineReceipt(): void {
    const printData = {
      type: 'fine',
      borrowId: this.borrowRequest.id,
      timestamp: new Date().toISOString()
    };
    
    this.printRequested.emit(printData);
    
    // ในที่นี้ไม่มีการเรียกใช้ PrintService โดยตรง
    // เนื่องจากยังไม่มีเมธอด printFineReceipt ที่ระบุไว้
  }
  
  // เมธอดสำหรับการจัดการกับปุ่มดำเนินการหลัก
  approveRequest(): void {
    this.approveRequested.emit(this.borrowRequest.id);
  }
  
  returnRequest(): void {
    this.returnRequested.emit(this.borrowRequest.id);
  }
  
  startMaintenance(): void {
    this.maintenanceRequested.emit(this.borrowRequest.id);
  }
  
  cancelRequest(): void {
    this.cancelRequested.emit(this.borrowRequest.id);
  }
  
  // Helper methods
  isOverdue(borrow: any): boolean {
    if (!borrow || !borrow.dueDate || borrow.status === 'returned') return false;
    
    const today = new Date();
    const dueDate = new Date(borrow.dueDate);
    return today > dueDate;
  }
  
  calculateOverdueDays(borrow: any): number {
    if (!this.isOverdue(borrow)) return 0;
    
    const today = new Date();
    const dueDate = new Date(borrow.dueDate);
    const diffTime = Math.abs(today.getTime() - dueDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  hasMaintenance(borrow: any): boolean {
    return !!borrow.maintenance;
  }
  
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'ไม่ระบุหมวดหมู่';
  }
  
  getEquipmentSerialNumber(equipmentId: string): string {
    const equipment = this.equipments.find(eq => eq.id === equipmentId);
    return equipment?.serialNumber || 'ไม่ระบุ';
  }
  
  getBadgeClass(status: string): string {
    switch (status) {
      case 'overdue': return 'bg-danger';
      case 'borrowing': return 'bg-primary';
      case 'pending': return 'bg-warning';
      case 'maintenance': return 'bg-secondary';
      case 'returned': return 'bg-success';
      case 'cancelled': return 'bg-dark';
      default: return 'bg-secondary';
    }
  }
  
  getStatusText(status: string): string {
    switch (status) {
      case 'overdue': return 'เกินกำหนด';
      case 'borrowing': return 'กำลังยืม';
      case 'pending': return 'รอการอนุมัติ';
      case 'maintenance': return 'ซ่อมบำรุง';
      case 'returned': return 'คืนแล้ว';
      case 'cancelled': return 'ยกเลิก';
      default: return status;
    }
  }
  
  getActionBadgeClass(action: string): string {
    switch (action) {
      case 'request': return 'bg-info';
      case 'approve': return 'bg-success';
      case 'return': return 'bg-primary';
      case 'maintenance-start': return 'bg-warning';
      case 'maintenance-complete': return 'bg-secondary';
      case 'cancel': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
  
  getActionText(action: string): string {
    switch (action) {
      case 'request': return 'ขอยืม';
      case 'approve': return 'อนุมัติ';
      case 'return': return 'คืน';
      case 'maintenance-start': return 'ส่งซ่อม';
      case 'maintenance-complete': return 'ซ่อมเสร็จ';
      case 'cancel': return 'ยกเลิก';
      default: return action;
    }
  }
  
  getLocationText(location: any): string {
    if (!location) return 'ไม่ระบุ';
    return `${location.building || ''} ${location.floor ? 'ชั้น ' + location.floor : ''} 
            ${location.room ? 'ห้อง ' + location.room : ''} ${location.shelf ? 'ชั้นวาง ' + location.shelf : ''}`.trim();
  }
  
  getWarrantyText(warranty: any): string {
    if (!warranty) return 'ไม่ระบุ';
    return `${warranty.duration || ''} ${warranty.expiryDate ? 'หมดอายุ: ' + warranty.expiryDate : ''}`.trim();
  }
  
  getSpecificationKeys(equipment: any): string[] {
    if (!equipment || !equipment.specifications) return [];
    return Object.keys(equipment.specifications);
  }
  
  formatSpecKey(key: string): string {
    // แปลงคีย์จาก camelCase เป็นคำภาษาไทย
    switch (key) {
      case 'processor': return 'หน่วยประมวลผล';
      case 'ram': return 'หน่วยความจำ';
      case 'storage': return 'พื้นที่จัดเก็บ';
      case 'display': return 'หน้าจอ';
      case 'gpu': return 'การ์ดจอ';
      case 'battery': return 'แบตเตอรี่';
      case 'weight': return 'น้ำหนัก';
      case 'dimensions': return 'ขนาด';
      case 'os': return 'ระบบปฏิบัติการ';
      case 'ports': return 'พอร์ตเชื่อมต่อ';
      case 'wireless': return 'การเชื่อมต่อไร้สาย';
      case 'camera': return 'กล้อง';
      case 'audio': return 'ระบบเสียง';
      case 'keyboard': return 'แป้นพิมพ์';
      case 'color': return 'สี';
      case 'brightness': return 'ความสว่าง';
      case 'resolution': return 'ความละเอียด';
      case 'contrast': return 'อัตราความคมชัด';
      case 'sensor': return 'เซ็นเซอร์';
      case 'lens': return 'เลนส์';
      case 'videoCapability': return 'ความสามารถในการถ่ายวิดีโอ';
      default: return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    }
  }
  
  resetForm(): void {
    this.activeTab = 'details';
    this.newStatus = '';
    this.statusNote = '';
    this.closed.emit();
  }
}
