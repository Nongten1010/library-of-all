// src/app/admin/pages/service/admin-library-of-things/admin-library-of-things.component.ts
import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApproveModalComponent } from './modals/approve-modal/approve-modal.component';
import { ReturnedModalComponent } from './modals/returned-modal/returned-modal.component';
import { CancelModalComponent } from './modals/cancel-modal/cancel-modal.component';
import { MaintenanceModalComponent } from './modals/maintenance-modal/maintenance-modal.component';
import { InfoModalComponent } from './modals/info-modal/info-modal.component';
import { PrintService } from './modals/services/print.service';
import { LibraryOfThingsService } from '../../../../services/library-of-things.service';
import { 
  Equipment, 
  Borrowing, 
  BorrowingSummary,
  Category,
  Status 
} from '../../../../models/library-of-things.model';

declare var bootstrap: any;
@Component({
  selector: 'app-admin-library-of-things',
  standalone: true,
  imports: [CommonModule, FormsModule, ApproveModalComponent, ReturnedModalComponent, CancelModalComponent, MaintenanceModalComponent, InfoModalComponent],
  templateUrl: './admin-library-of-things.component.html',
  styleUrl: './admin-library-of-things.component.css'
})
export class AdminLibraryOfThingsComponent implements OnInit {
  activeTab = 'pending';

  // ตัวแปรเก็บข้อมูลที่ได้จาก API
  categories: Category[] = [];
  status: Status[] = [];
  borrowStatusOptions: any[] = [];
  equipments: Equipment[] = [];
  borrowers: Borrowing[] = [];

  // ตัวแปรสำหรับการกรองข้อมูล
  selectedCategory = 'all';
  selectedStatus = 'all';
  searchText = '';

  // ตัวแปรสำหรับการแสดงสถานะการโหลด
  loading = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  summary: BorrowingSummary = {
    pendingRequests: 0,
    activeBorrows: 0,
    overdue: 0,
    underMaintenance: 0
  };

  // ตัวแปรสำหรับ Modal
  selectedBorrowRequest: Borrowing | null = null;
  selectedBorrow: Borrowing | null = null;
  selectedReturnBorrow: Borrowing | null = null;
  selectedCancelBorrow: Borrowing | null = null;
  selectedMaintenanceBorrow: Borrowing | null = null;
  selectedInfoBorrow: Borrowing | null = null;

  @ViewChild(ApproveModalComponent) approveModalComponent!: ApproveModalComponent;
  @ViewChild(ReturnedModalComponent) returnedModalComponent!: ReturnedModalComponent;
  @ViewChild(CancelModalComponent) cancelModalComponent!: CancelModalComponent;
  @ViewChild(MaintenanceModalComponent) maintenanceModalComponent!: MaintenanceModalComponent;
  @ViewChild(InfoModalComponent) infoModalComponent!: InfoModalComponent;

  returnModal: any = null;

  constructor(
    private printService: PrintService,
    private libraryService: LibraryOfThingsService
  ) { }

  ngOnInit() {
    // โหลดข้อมูลเริ่มต้น
    this.loadCategories();
    this.loadStatuses();
    this.loadBorrowStatuses();
    this.loadBorrowings();
    this.calculateSummary();

    // ตรวจสอบว่า DOM โหลดเสร็จแล้ว แล้วจึงเริ่มต้น Modal
    document.addEventListener('DOMContentLoaded', () => {
      const returnModalElement = document.getElementById('returnModal');
      if (returnModalElement) {
        this.returnModal = new bootstrap.Modal(returnModalElement);
      }
    });
  }

  // เปลี่ยน tab การแสดงผล
  changeTab(tab: string) {
    this.activeTab = tab;
    this.loadBorrowings(); // โหลดข้อมูลใหม่ตาม tab ที่เลือก
  }

  // โหลดข้อมูลประเภทอุปกรณ์
  loadCategories() {
    this.loading = true;
    this.libraryService.getCategories().subscribe(
      (response) => {
        if (response.status && response.data) {
          // เพิ่มตัวเลือก "ทั้งหมด"
          this.categories = [{ id: 'all', name: 'ทั้งหมด', icon: 'bi bi-book' }, ...response.data];
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading categories', error);
        this.loading = false;
      }
    );
  }

  // โหลดข้อมูลสถานะอุปกรณ์
  loadStatuses() {
    this.loading = true;
    this.libraryService.getStatuses().subscribe(
      (response) => {
        if (response.status && response.data) {
          // เพิ่มตัวเลือก "ทั้งหมด"
          this.status = [{ id: 'all', name: 'สถานะ', icon: 'bi bi-book' }, ...response.data];
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading statuses', error);
        this.loading = false;
      }
    );
  }

  // โหลดข้อมูลสถานะการยืม
  loadBorrowStatuses() {
    this.loading = true;
    this.libraryService.getBorrowStatuses().subscribe(
      (response) => {
        if (response.status && response.data) {
          // เพิ่มตัวเลือก "ทั้งหมด"
          this.borrowStatusOptions = [
            { id: 'all', name: 'ทั้งหมด' },
            ...response.data.map((item: any) => ({
              id: item.name,
              name: item.display_name || item.name
            }))
          ];
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading borrow statuses', error);
        this.loading = false;
      }
    );
  }

  // โหลดข้อมูลอุปกรณ์
  loadEquipments() {
    this.loading = true;
    this.libraryService.getEquipments(
      this.searchText,
      this.selectedCategory,
      this.selectedStatus,
      this.currentPage,
      this.itemsPerPage
    ).subscribe(
      (response) => {
        if (response.status && response.data) {
          this.equipments = response.data.items;
          this.totalItems = response.data.total;
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading equipments', error);
        this.loading = false;
      }
    );
  }

  // โหลดข้อมูลการยืม
  loadBorrowings() {
    this.loading = true;
    
    // กำหนดสถานะตาม tab ที่เลือก
    let status = 'all';
    switch (this.activeTab) {
      case 'pending':
        status = 'pending';
        break;
      case 'not-returned':
        status = 'borrowing';
        break;
      case 'returned':
        status = 'returned';
        break;
      case 'overdue':
        status = 'overdue';
        break;
      case 'maintenance':
        status = 'maintenance';
        break;
    }
    
    this.libraryService.getBorrowings(
      this.searchText,
      status,
      this.currentPage,
      this.itemsPerPage
    ).subscribe(
      (response) => {
        if (response.status && response.data) {
          this.borrowers = response.data.borrowings;
          this.totalItems = response.data.total;
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading borrowings', error);
        this.loading = false;
      }
    );
  }
  getFilteredBorrowers() {
    let results = [...this.borrowers];
    
    // กรองตามสถานะหากจำเป็น (ถ้าคุณต้องการกรองเพิ่มเติมจากที่ได้จาก API)
    if (this.activeTab === 'pending') {
      results = results.filter(item => item.status_name === 'pending');
    } else if (this.activeTab === 'not-returned') {
      results = results.filter(item => item.status_name === 'borrowing');
    } else if (this.activeTab === 'returned') {
      results = results.filter(item => item.status_name === 'returned');
    } else if (this.activeTab === 'overdue') {
      results = results.filter(item => item.status_name === 'overdue');
    } else if (this.activeTab === 'maintenance') {
      results = results.filter(item => item.status_name === 'maintenance');
    }
    
    // กรองตามคำค้นหาเพิ่มเติม (ถ้ามี)
    if (this.searchText?.trim()) {
      const searchLower = this.searchText.toLowerCase().trim();
      results = results.filter(item =>
        (item.user_name || '').toLowerCase().includes(searchLower) ||
        (item.equipment_id || '').toLowerCase().includes(searchLower) ||
        (item.equipment_name || '').toLowerCase().includes(searchLower) ||
        (item.user_student_id || '').toLowerCase().includes(searchLower)
      );
    }
    
    return results;
  }
  // ค้นหาข้อมูล
  onSearch() {
    this.currentPage = 1; // รีเซ็ตหน้าเป็นหน้าแรก
    this.loadBorrowings();
  }

  // คำนวณข้อมูลสรุป
  calculateSummary() {
    this.libraryService.getBorrowingSummary().subscribe(
      (response) => {
        if (response.status && response.data) {
          this.summary = response.data;
        }
      },
      (error) => {
        console.error('Error loading summary', error);
      }
    );
  }

  // ฟังก์ชันเปิด Modal อนุมัติการยืม
  openApproveModal(borrowId: string) {
    this.loading = true;
    
    this.libraryService.getBorrowingById(borrowId).subscribe(
      (response) => {
        if (response.status && response.data) {
          this.selectedBorrowRequest = response.data;
          
          setTimeout(() => {
            if (this.approveModalComponent) {
              this.approveModalComponent.show();
            }
          });
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading borrowing details', error);
        this.loading = false;
        alert('ไม่สามารถโหลดข้อมูลการยืมได้');
      }
    );
  }

  // จัดการเมื่อมีการอนุมัติจาก Modal
  handleApproved(approvalData: any) {
    this.loading = true;
    
    this.libraryService.approveBorrowing(approvalData.borrowId, {
      condition: approvalData.condition,
      note: approvalData.note
    }).subscribe(
      (response) => {
        if (response.status) {
          alert('อนุมัติการยืมสำเร็จ');
          
          // ถ้ามีการพิมพ์เอกสาร
          if (approvalData.printDocument && this.selectedBorrowRequest) {
            this.libraryService.getEquipmentById(this.selectedBorrowRequest.equipment_id).subscribe(
              (equipmentResponse) => {
                if (equipmentResponse.status && equipmentResponse.data) {
                  const equipment = equipmentResponse.data;
                  const categoryName = equipment.category_display_name || equipment.category_name || '';
                  
                  this.printService.printBorrowDocument(
                    this.selectedBorrowRequest,
                    equipment,
                    categoryName,
                    approvalData.condition,
                    approvalData.note
                  );
                }
              }
            );
          }
          
          this.loadBorrowings();
          this.calculateSummary();
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error approving borrowing', error);
        alert('เกิดข้อผิดพลาดในการอนุมัติการยืม');
        this.loading = false;
      }
    );
  }

  // ฟังก์ชันเปิด Modal คืนอุปกรณ์
  openReturnModal(borrowId: string) {
    this.loading = true;
    
    this.libraryService.getBorrowingById(borrowId).subscribe(
      (response) => {
        if (response.status && response.data) {
          this.selectedReturnBorrow = response.data;
          
          setTimeout(() => {
            if (this.returnedModalComponent) {
              this.returnedModalComponent.show();
            } else {
              console.error('ไม่พบ ReturnedModalComponent');
            }
          });
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading borrowing details', error);
        this.loading = false;
        alert('ไม่สามารถโหลดข้อมูลการยืมได้');
      }
    );
  }

  // อีกชื่อหนึ่งของ openReturnModal เพื่อความเข้าใจง่าย
  returnItem(borrowId: string) {
    console.log('Return item:', borrowId);
    this.selectedReturnBorrow = this.borrowers.find(b => b.id === borrowId) || null;
    
    setTimeout(() => {
      if (this.returnedModalComponent) {
        this.returnedModalComponent.show();
      }
    });
  }

  // จัดการเมื่อมีการคืนอุปกรณ์จาก Modal
  handleReturned(returnData: any) {
    console.log('ข้อมูลการคืนอุปกรณ์:', returnData);
    this.loading = true;
    
    this.libraryService.returnBorrowing(returnData.borrowId, {
      condition: returnData.condition,
      note: returnData.note,
      fine: returnData.fine ? {
        days: returnData.fine.days,
        amount: returnData.fine.amount,
        payment_method: returnData.fine.paymentMethod,
        payment_complete: returnData.fine.paymentComplete ? 1 : 0,
        notes: returnData.fine.notes
      } : undefined
    }).subscribe(
      (response) => {
        if (response.status) {
          alert('คืนอุปกรณ์เรียบร้อยแล้ว' + 
            (returnData.fine && returnData.fine.amount > 0 ? 
              `\nมีค่าปรับ ${returnData.fine.amount} บาท` : ''));
          
          // ถ้ามีการพิมพ์เอกสาร
          if (returnData.printDocument && this.selectedReturnBorrow) {
            this.libraryService.getEquipmentById(this.selectedReturnBorrow.equipment_id).subscribe(
              (equipmentResponse) => {
                if (equipmentResponse.status && equipmentResponse.data) {
                  const equipment = equipmentResponse.data;
                  const categoryName = equipment.category_display_name || equipment.category_name || '';
                  
                  this.printService.printReturnDocument(
                    this.selectedReturnBorrow,
                    equipment,
                    categoryName,
                    returnData
                  );
                }
              }
            );
          }
          
          this.loadBorrowings();
          this.calculateSummary();
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error returning item', error);
        alert('เกิดข้อผิดพลาดในการคืนอุปกรณ์');
        this.loading = false;
      }
    );
  }

  // ฟังก์ชันเปิด Modal ยกเลิกการยืม
  openCancelModal(borrowId: string) {
    this.loading = true;
    
    this.libraryService.getBorrowingById(borrowId).subscribe(
      (response) => {
        if (response.status && response.data) {
          this.selectedCancelBorrow = response.data;
          
          setTimeout(() => {
            if (this.cancelModalComponent) {
              this.cancelModalComponent.show();
            }
          });
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading borrowing details', error);
        this.loading = false;
        alert('ไม่สามารถโหลดข้อมูลการยืมได้');
      }
    );
  }

  // จัดการเมื่อมีการยกเลิกการยืมจาก Modal
  handleCancelled(cancelData: any) {
    console.log('ข้อมูลการยกเลิก:', cancelData);
    this.loading = true;
    
    this.libraryService.cancelBorrowing(cancelData.borrowId, {
      reason: cancelData.reason
    }).subscribe(
      (response) => {
        if (response.status) {
          alert('ยกเลิกการยืมเรียบร้อยแล้ว');
          this.loadBorrowings();
          this.calculateSummary();
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error cancelling borrowing', error);
        alert('เกิดข้อผิดพลาดในการยกเลิกการยืม');
        this.loading = false;
      }
    );
  }

  // ฟังก์ชันเปิด Modal ส่งซ่อมบำรุง
  openMaintenanceModal(borrowId: string) {
    this.loading = true;
    
    this.libraryService.getBorrowingById(borrowId).subscribe(
      (response) => {
        if (response.status && response.data) {
          this.selectedMaintenanceBorrow = response.data;
          
          setTimeout(() => {
            if (this.maintenanceModalComponent) {
              this.maintenanceModalComponent.show();
            }
          });
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading borrowing details', error);
        this.loading = false;
        alert('ไม่สามารถโหลดข้อมูลการยืมได้');
      }
    );
  }

  // จัดการเมื่อมีการส่งซ่อมบำรุงจาก Modal
  handleMaintenanceStart(maintenanceData: any) {
    console.log('ข้อมูลการซ่อมบำรุง:', maintenanceData);
    this.loading = true;
    
    this.libraryService.maintenanceBorrowing(maintenanceData.borrowId, {
      reason: maintenanceData.reason,
      notes: maintenanceData.notes
    }).subscribe(
      (response) => {
        if (response.status) {
          alert('ส่งอุปกรณ์เข้าซ่อมบำรุงเรียบร้อยแล้ว');
          this.loadBorrowings();
          this.calculateSummary();
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error marking for maintenance', error);
        alert('เกิดข้อผิดพลาดในการส่งอุปกรณ์เข้าซ่อมบำรุง');
        this.loading = false;
      }
    );
  }

  // ฟังก์ชันเปิด Modal ดูรายละเอียดการยืม
  viewDetails(borrowId: string) {
    console.log('View details:', borrowId);
    this.loading = true;
    
    this.libraryService.getBorrowingById(borrowId).subscribe(
      (response) => {
        if (response.status && response.data) {
          this.selectedInfoBorrow = response.data;
          
          setTimeout(() => {
            if (this.infoModalComponent) {
              this.infoModalComponent.show();
            } else {
              // ถ้าไม่พบ component ใช้ bootstrap native API แทน
              const modalElement = document.getElementById('infoModal');
              if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
              }
            }
          });
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error loading borrowing details', error);
        this.loading = false;
        alert('ไม่สามารถโหลดข้อมูลการยืมได้');
      }
    );
  }

  // จัดการเมื่อมีการเปลี่ยนสถานะจาก InfoModal
  handleStatusChanged(statusData: any) {
    console.log('มีการเปลี่ยนสถานะ:', statusData);
    this.loading = true;
    
    this.libraryService.updateBorrowingStatus(statusData.borrowId, {
      status: statusData.newStatus,
      note: statusData.note
    }).subscribe(
      (response) => {
        if (response.status) {
          alert('เปลี่ยนสถานะเรียบร้อยแล้ว: ' + this.getStatusText(statusData.newStatus));
          this.loadBorrowings();
          this.calculateSummary();
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error updating status', error);
        alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
        this.loading = false;
      }
    );
  }

  // จัดการเมื่อมีการขอพิมพ์เอกสารจาก InfoModal
  handlePrintRequested(printData: any) {
    console.log('มีการขอพิมพ์เอกสาร:', printData);
  
    // ทำการพิมพ์ตามประเภทเอกสารที่ร้องขอ
    if (printData.type === 'borrow' && this.selectedInfoBorrow) {
      this.libraryService.getEquipmentById(this.selectedInfoBorrow.equipment_id).subscribe(
        (response) => {
          if (response.status && response.data) {
            const equipment = response.data;
            const categoryName = equipment.category_display_name || equipment.category_name || '';
            
            this.printService.printBorrowDocument(
              this.selectedInfoBorrow!,
              equipment,
              categoryName,
              this.selectedInfoBorrow?.condition || '',
              this.selectedInfoBorrow?.notes || ''
            );
          }
        }
      );
    } else if (printData.type === 'return' && this.selectedInfoBorrow) {
      this.libraryService.getEquipmentById(this.selectedInfoBorrow.equipment_id).subscribe(
        (response) => {
          if (response.status && response.data) {
            const equipment = response.data;
            const categoryName = equipment.category_display_name || equipment.category_name || '';
            
            this.printService.printReturnDocument(
              this.selectedInfoBorrow!,
              equipment,
              categoryName,
              {
                condition: this.selectedInfoBorrow?.return_condition || '',
                note: this.selectedInfoBorrow?.notes || '',
                fine: {
                  days: this.selectedInfoBorrow?.fine_days || 0,
                  amount: this.selectedInfoBorrow?.fine_amount || 0,
                  paymentMethod: this.selectedInfoBorrow?.payment_method || '',
                  paymentComplete: this.selectedInfoBorrow?.payment_complete || false
                }
              }
            );
          }
        }
      );
    }
  }

  // จัดการเมื่อมีการร้องขอดำเนินการต่างๆ จาก InfoModal
  handleApproveRequested(borrowId: string) {
    this.openApproveModal(borrowId);
  }

  handleReturnRequested(borrowId: string) {
    this.returnItem(borrowId);
  }

  handleMaintenanceRequested(borrowId: string) {
    this.openMaintenanceModal(borrowId);
  }

  handleCancelRequested(borrowId: string) {
    this.openCancelModal(borrowId);
  }

  // จัดการเมื่อ Modal ถูกปิด
  handleModalClosed() {
    this.selectedBorrowRequest = null;
    this.selectedReturnBorrow = null;
    this.selectedCancelBorrow = null;
    this.selectedMaintenanceBorrow = null;
    this.selectedInfoBorrow = null;
  }

  // ฟังก์ชันสำหรับแสดงสถานะ
  getBadgeClass(status: string): string {
    switch (status) {
      case 'overdue':
        return 'bg-danger';
      case 'borrowing':
        return 'bg-primary';
      case 'pending':
        return 'bg-warning';
      case 'maintenance':
        return 'bg-secondary';
      case 'returned':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'overdue':
        return 'เกินกำหนด';
      case 'borrowing':
        return 'กำลังยืม';
      case 'pending':
        return 'รอการอนุมัติ';
      case 'maintenance':
        return 'ซ่อมบำรุง';
      case 'returned':
        return 'คืนแล้ว';
      default:
        return status;
    }
  }

  // หาข้อมูลหมวดหมู่ของอุปกรณ์
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  }

  // ดึงข้อมูล Serial Number ของอุปกรณ์
  getEquipmentSerialNumber(equipmentId: string): string {
    const equipment = this.equipments.find(eq => eq.id === equipmentId);
    return equipment?.serialNumber || 'ไม่ระบุ';
  }
}