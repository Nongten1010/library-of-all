import { Component, ElementRef, EventEmitter, Input, OnInit, AfterViewInit, Output, ViewChild } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-cancel-modal',
  standalone: true,
  imports: [],
  templateUrl: './cancel-modal.component.html',
  styleUrl: './cancel-modal.component.css'
})
export class CancelModalComponent {
 @Input() borrowRequest: any;
  @Output() cancelled = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();
  @ViewChild('cancelModal') modalElement!: ElementRef;

  private modalInstance: any;
  
  cancelReason: string = '';
  cancelNote: string = '';
  notifyUser: boolean = true;

  constructor() { }

  ngOnInit(): void {
    // ค่าเริ่มต้น
    this.notifyUser = true;
  }
  
  onCancelReasonChange(event: Event): void {
    this.cancelReason = (event.target as HTMLSelectElement).value;
  }
  
  onCancelNoteChange(event: Event): void {
    this.cancelNote = (event.target as HTMLTextAreaElement).value;
  }
  
  onNotifyUserChange(event: Event): void {
    this.notifyUser = (event.target as HTMLInputElement).checked;
  }
  
  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }
  
  show(): void {
    this.modalInstance.show();
  }
  
  close(): void {
    this.modalInstance.hide();
    this.resetForm();
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-secondary';
      case 'approved': return 'bg-primary';
      case 'rejected': return 'bg-danger';
      case 'borrowed': return 'bg-success';
      case 'returned': return 'bg-info';
      case 'overdue': return 'bg-danger';
      case 'maintenance': return 'bg-warning';
      default: return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'รออนุมัติ';
      case 'approved': return 'อนุมัติแล้ว';
      case 'rejected': return 'ปฏิเสธ';
      case 'borrowed': return 'กำลังยืม';
      case 'returned': return 'คืนแล้ว';
      case 'overdue': return 'เกินกำหนด';
      case 'maintenance': return 'ซ่อมบำรุง';
      default: return 'ไม่ระบุ';
    }
  }

  isFormValid(): boolean {
    if (!this.cancelReason) {
      return false;
    }
    
    if (this.cancelReason === 'other' && !this.cancelNote.trim()) {
      return false;
    }
    
    return true;
  }

  confirmCancel(): void {
    if (!this.isFormValid()) return;
    
    const cancelData = {
      id: this.borrowRequest.id,
      reason: this.cancelReason,
      note: this.cancelReason === 'other' ? this.cancelNote : '',
      notifyUser: this.notifyUser,
      timestamp: new Date().toISOString()
    };
    
    this.cancelled.emit(cancelData);
    this.close();
  }

  resetForm(): void {
    this.cancelReason = '';
    this.cancelNote = '';
    this.notifyUser = true;
    this.closed.emit();
  }
}
