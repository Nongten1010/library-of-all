import { Component, ElementRef, EventEmitter, Input, OnInit, AfterViewInit, Output, ViewChild } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-maintenance-modal',
  standalone: true,
  imports: [],
  templateUrl: './maintenance-modal.component.html',
  styleUrl: './maintenance-modal.component.css'
})
export class MaintenanceModalComponent {
  @Input() borrowRequest: any;
  @Input() equipments: any[] = [];
  @Input() categories: any[] = [];
  
  @Output() maintenanceStart = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();
  
  @ViewChild('maintenanceModal') modalElement!: ElementRef;
  private modalInstance: any;

  // Form fields
  startDate: string = '';
  reason: string = '';
  reasonNote: string = '';
  damageDetails: string = '';
  maintenanceType: string = '';
  technicianName: string = '';
  vendorName: string = '';
  repairCost: number = 0;
  expectedCompletionDate: string = '';
  maintenanceNotes: string = '';
  isConfirmed: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // ตั้งค่าเริ่มต้นเป็นวันที่ปัจจุบัน
    this.startDate = this.formatDate(new Date());
    this.expectedCompletionDate = this.formatDate(this.addDays(new Date(), 7)); // เพิ่มไป 7 วัน
  }
  
  ngOnChanges(): void {
    if (this.borrowRequest) {
      console.log('ได้รับข้อมูลสำหรับการซ่อมบำรุง:', this.borrowRequest);
    }
  }
  
  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }
  
  // เมธอดสำหรับเปิด modal
  show(): void {
    this.modalInstance.show();
  }
  
  // Event handlers
  onStartDateChange(event: Event): void {
    this.startDate = (event.target as HTMLInputElement).value;
  }
  
  onReasonChange(event: Event): void {
    this.reason = (event.target as HTMLSelectElement).value;
  }
  
  onReasonNoteChange(event: Event): void {
    this.reasonNote = (event.target as HTMLTextAreaElement).value;
  }
  
  onDamageDetailsChange(event: Event): void {
    this.damageDetails = (event.target as HTMLTextAreaElement).value;
  }
  
  onMaintenanceTypeChange(event: Event): void {
    this.maintenanceType = (event.target as HTMLInputElement).value;
  }
  
  onTechnicianNameChange(event: Event): void {
    this.technicianName = (event.target as HTMLInputElement).value;
  }
  
  onVendorNameChange(event: Event): void {
    this.vendorName = (event.target as HTMLInputElement).value;
  }
  
  onRepairCostChange(event: Event): void {
    this.repairCost = +(event.target as HTMLInputElement).value;
  }
  
  onExpectedCompletionDateChange(event: Event): void {
    this.expectedCompletionDate = (event.target as HTMLInputElement).value;
  }
  
  onMaintenanceNotesChange(event: Event): void {
    this.maintenanceNotes = (event.target as HTMLTextAreaElement).value;
  }
  
  onConfirmMaintenanceChange(event: Event): void {
    this.isConfirmed = (event.target as HTMLInputElement).checked;
  }
  
  // Helper methods
  isFormValid(): boolean {
    if (!this.reason || !this.damageDetails || !this.maintenanceType || !this.isConfirmed) {
      return false;
    }
    
    if (this.reason === 'other' && !this.reasonNote) {
      return false;
    }
    
    if (this.maintenanceType === 'internal' && !this.technicianName) {
      return false;
    }
    
    if (this.maintenanceType === 'external' && !this.vendorName) {
      return false;
    }
    
    return true;
  }
  
  confirmMaintenance(): void {
    if (!this.isFormValid()) return;
    
    const maintenanceData = {
      borrowId: this.borrowRequest.id,
      equipmentId: this.borrowRequest.equipment.id,
      startDate: this.startDate,
      reason: this.reason,
      reasonNote: this.reason === 'other' ? this.reasonNote : '',
      damageDetails: this.damageDetails,
      maintenanceType: this.maintenanceType,
      technicianName: this.maintenanceType === 'internal' ? this.technicianName : '',
      vendorName: this.maintenanceType === 'external' ? this.vendorName : '',
      repairCost: this.maintenanceType === 'external' ? this.repairCost : 0,
      expectedCompletionDate: this.expectedCompletionDate,
      maintenanceNotes: this.maintenanceNotes,
      timestamp: new Date().toISOString()
    };
    
    this.maintenanceStart.emit(maintenanceData);
    this.close();
  }
  
  close(): void {
    this.modalInstance.hide();
    this.resetForm();
  }
  
  resetForm(): void {
    this.reason = '';
    this.reasonNote = '';
    this.damageDetails = '';
    this.maintenanceType = '';
    this.technicianName = '';
    this.vendorName = '';
    this.repairCost = 0;
    this.maintenanceNotes = '';
    this.isConfirmed = false;
    this.startDate = this.formatDate(new Date());
    this.expectedCompletionDate = this.formatDate(this.addDays(new Date(), 7));
    
    this.closed.emit();
  }
  
  // Utility functions
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
      default: return status;
    }
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
