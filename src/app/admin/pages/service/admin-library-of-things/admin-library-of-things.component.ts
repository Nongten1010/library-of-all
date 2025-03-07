import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApproveModalComponent } from './modals/approve-modal/approve-modal.component';
import { ReturnedModalComponent } from './modals/returned-modal/returned-modal.component';
import { CancelModalComponent } from './modals/cancel-modal/cancel-modal.component';
import { MaintenanceModalComponent } from './modals/maintenance-modal/maintenance-modal.component';
import { InfoModalComponent } from './modals/info-modal/info-modal.component';
import { PrintService } from './modals/services/print.service';

declare var bootstrap: any;
@Component({
  selector: 'app-admin-library-of-things',
  standalone: true,
  imports: [CommonModule, FormsModule, ApproveModalComponent,ReturnedModalComponent,CancelModalComponent,MaintenanceModalComponent,InfoModalComponent],
  templateUrl: './admin-library-of-things.component.html',
  styleUrl: './admin-library-of-things.component.css'
})
export class AdminLibraryOfThingsComponent {
  activeTab = 'pending';

  categories = [
    { id: 'all', name: 'ทั้งหมด', icon: 'bi bi-book' },
    { id: 'laptop', name: 'โน๊ตบุ๊ค', icon: 'bi bi-book' },
    { id: 'electronics', name: 'อุปกรณ์อิเล็กทรอนิกส์', icon: 'bi bi-tv' },
    { id: 'camera', name: 'กล้องและอุปกรณ์', icon: 'bi bi-camera' },
    { id: 'audio', name: 'อุปกรณ์เสียง', icon: 'bi bi-music-note' },
    { id: 'tools', name: 'เครื่องมือช่าง', icon: 'bi bi-tools' },
  ];

  status = [
    { id: 'all', name: 'สถานะ', icon: 'bi bi-book' },
    { id: '1', name: 'ว่าง', icon: 'bi bi-tv' },
    { id: '2', name: 'ถูกยืม', icon: 'bi bi-camera' },
    { id: '3', name: 'กำลังตรวจสอบ', icon: 'bi bi-music-note' },
    { id: '4', name: 'ซ่อม', icon: 'bi bi-tools' },
  ];

  borrowStatusOptions = [
    { id: 'all', name: 'ทั้งหมด' },
    { id: 'returned', name: 'คืนแล้ว' },
    { id: 'borrowing', name: 'กำลังยืม' },
    { id: 'overdue', name: 'เกินกำหนด' }
  ];

  // ปรับค่าเริ่มต้น
  selectedCategory = 'all'; // แทนที่จะเป็น ''
  selectedStatus = 'all';   // แทนที่จะเป็น ''
  searchText = '';

  onSearch() {
    console.log('Searching:', {
      text: this.searchText,
      category: this.selectedCategory,
      status: this.selectedStatus
    });
    // ไม่มีการกรองข้อมูลจริง
  }

  equipments = [
    {
      id: 'NB001',
      barcode: '4891234567890',
      serialNumber: 'XPS-9510-SN123456',
      name: 'Dell XPS 15 9510',
      category: 'notebook',
      status: 'ว่าง',
      specifications: {
        processor: 'Intel Core i7-11800H',
        ram: '32GB DDR4',
        storage: '1TB SSD',
        display: '15.6 inch 4K OLED',
        gpu: 'NVIDIA RTX 3050 Ti'
      },
      images: [
        'nb001_front.jpg',
        'nb001_side.jpg'
      ],
      price: 65000,
      purchaseDate: '2024-01-15',
      location: {
        building: 'อาคารไอที',
        floor: 3,
        room: 'IT-304',
        shelf: 'A-12'
      },
      createdBy: {
        id: 'EMP123',
        name: 'สมชาย ใจดี',
        department: 'IT'
      },
      loanDuration: 14,
      isLoanable: true,
      maintenanceHistory: [
        {
          date: '2024-02-10',
          type: 'ตรวจเช็คประจำเดือน',
          notes: 'เปลี่ยนแบตเตอรี่ใหม่'
        }
      ],
      warranty: {
        duration: '3 years',
        expiryDate: '2027-01-15',
        provider: 'Dell Thailand'
      },
      fineRate: { // เพิ่มข้อมูลค่าปรับ
        dailyRate: 50, // อัตราค่าปรับต่อวัน (บาท)
        maxFine: 2000, // ค่าปรับสูงสุด (บาท) (ถ้ามี)
        gracePeriod: 0  // ระยะเวลาผ่อนผัน (วัน) ก่อนเริ่มคิดค่าปรับ
      }
    },
    {
      id: 'PRJ002',
      barcode: '4891234567891',
      serialNumber: 'EPS-123-456789',
      name: 'Epson EB-2250U',
      category: 'projector',
      status: 'ถูกยืม',
      specifications: {
        brightness: '5000 lumens',
        resolution: '1920x1200 WUXGA',
        contrast: '15000:1'
      },
      images: [
        'prj002_front.jpg'
      ],
      price: 45000,
      purchaseDate: '2023-11-20',
      location: {
        building: 'อาคารไอที',
        floor: 2,
        room: 'IT-201',
        shelf: 'B-03'
      },
      createdBy: {
        id: 'EMP124',
        name: 'สมหญิง รักงาน',
        department: 'IT Support'
      },
      loanDuration: 7,
      isLoanable: true,
      maintenanceHistory: [],
      warranty: {
        duration: '2 years',
        expiryDate: '2025-11-20',
        provider: 'Epson Service Center'
      },
      fineRate: { // เพิ่มข้อมูลค่าปรับ
        dailyRate: 500, // อัตราค่าปรับต่อวัน (บาท)
        maxFine: 2000, // ค่าปรับสูงสุด (บาท) (ถ้ามี)
        gracePeriod: 0  // ระยะเวลาผ่อนผัน (วัน) ก่อนเริ่มคิดค่าปรับ
      }
    },
    {
      id: 'CAM003',
      barcode: '4891234567892',
      serialNumber: 'SNY-A7M4-987654',
      name: 'Sony A7 IV',
      category: 'camera',
      status: 'ซ่อม/บำรุง',
      specifications: {
        sensor: '33MP Full-frame',
        lens: '24-70mm f/2.8',
        videoCapability: '4K 60fps'
      },
      images: [
        'cam003_front.jpg',
        'cam003_back.jpg'
      ],
      price: 89000,
      purchaseDate: '2023-08-15',
      location: {
        building: 'อาคารสื่อสาร',
        floor: 1,
        room: 'COMM-105',
        shelf: 'C-01'
      },
      createdBy: {
        id: 'EMP125',
        name: 'วิชัย ช่างภาพ',
        department: 'สื่อสารองค์กร'
      },
      loanDuration: 3,
      isLoanable: true,
      maintenanceHistory: [
        {
          date: '2024-02-20',
          type: 'ซ่อมเลนส์',
          notes: 'ส่งศูนย์ซ่อมเลนส์มีปัญหา AF'
        }
      ],
      warranty: {
        duration: '1 year',
        expiryDate: '2024-08-15',
        provider: 'Sony Thailand'
      },   
       fineRate: { // เพิ่มข้อมูลค่าปรับ
        dailyRate: 50, // อัตราค่าปรับต่อวัน (บาท)
        maxFine: 2000, // ค่าปรับสูงสุด (บาท) (ถ้ามี)
        gracePeriod: 0  // ระยะเวลาผ่อนผัน (วัน) ก่อนเริ่มคิดค่าปรับ
      }
    }
  ];
  // admin-library-of-things.component.ts

  borrowers = [
    {
      id: 'BRW001',
      name: 'สมชาย ใจดี',
      studentId: '64xxxxxx21',
      equipment: {
        id: 'NB001',
        name: 'Dell XPS 15 9510',
        category: 'electronics'
      },
      borrowDate: '2025-02-20',
      dueDate: '2025-03-05',
      returnDate: null,
      status: 'borrowing',
      department: 'คณะวิศวกรรมศาสตร์',
      contact: '081-xxx-xxxx',
      fine: {
        dailyRate: 50, // อัตราค่าปรับต่อวัน (บาท)
        days: 0,       // จำนวนวันที่เกินกำหนด (อัพเดตเมื่อมีการคืน)
        amount: 0,     // จำนวนเงินค่าปรับทั้งหมด (บาท)
        paymentMethod: '', // วิธีการชำระเงิน (cash, transfer, waived)
        paymentComplete: false, // สถานะการชำระ
        notes: ''      // หมายเหตุเกี่ยวกับค่าปรับ
      }
      
    },
    {
      id: 'BRW002',
      name: 'สมหญิง รักเรียน',
      studentId: '64xxxxxx22',
      equipment: {
        id: 'PRJ002',
        name: 'Epson EB-2250U',
        category: 'electronics'
      },
      borrowDate: '2024-02-01',
      dueDate: '2024-02-15',
      returnDate: null,
      status: 'overdue',
      department: 'คณะวิทยาศาสตร์',
      contact: '082-xxx-xxxx',
      fine: {
        dailyRate: 150, // อัตราค่าปรับต่อวัน (บาท)
        days: 0,       // จำนวนวันที่เกินกำหนด (อัพเดตเมื่อมีการคืน)
        amount: 0,     // จำนวนเงินค่าปรับทั้งหมด (บาท)
        paymentMethod: '', // วิธีการชำระเงิน (cash, transfer, waived)
        paymentComplete: false, // สถานะการชำระ
        notes: ''      // หมายเหตุเกี่ยวกับค่าปรับ
      }
    },
    {
      id: 'BRW003',
      name: 'วิชัย ขยัน',
      studentId: '64xxxxxx23',
      equipment: {
        id: 'CAM003',
        name: 'Sony A7 IV',
        category: 'camera'
      },
      borrowDate: '2024-02-24',
      dueDate: '2024-02-27',
      returnDate: null,
      status: 'pending',  // สถานะขอยืม รอการอนุมัติ
      department: 'คณะนิเทศศาสตร์',
      contact: '083-xxx-xxxx',
      fine: {
        dailyRate: 50, // อัตราค่าปรับต่อวัน (บาท)
        days: 0,       // จำนวนวันที่เกินกำหนด (อัพเดตเมื่อมีการคืน)
        amount: 0,     // จำนวนเงินค่าปรับทั้งหมด (บาท)
        paymentMethod: '', // วิธีการชำระเงิน (cash, transfer, waived)
        paymentComplete: false, // สถานะการชำระ
        notes: ''      // หมายเหตุเกี่ยวกับค่าปรับ
      }
    },
    {
      id: 'BRW004',
      name: 'วิชัย ขยัน',
      studentId: '64xxxxxx23',
      equipment: {
        id: 'CAM003',
        name: 'Sony A7 IV',
        category: 'camera'
      },
      borrowDate: '2024-02-24',
      dueDate: '2024-02-27',
      returnDate: null,
      status: 'maintenance',  // สถานะขอยืม รอการอนุมัติ
      department: 'คณะนิเทศศาสตร์',
      contact: '083-xxx-xxxx',
      fine: {
        dailyRate: 50, // อัตราค่าปรับต่อวัน (บาท)
        days: 0,       // จำนวนวันที่เกินกำหนด (อัพเดตเมื่อมีการคืน)
        amount: 0,     // จำนวนเงินค่าปรับทั้งหมด (บาท)
        paymentMethod: '', // วิธีการชำระเงิน (cash, transfer, waived)
        paymentComplete: false, // สถานะการชำระ
        notes: ''      // หมายเหตุเกี่ยวกับค่าปรับ
      }
    },
    {
      id: 'BRW004',
      name: 'อานนท์ เทคนิคดี',
      studentId: '64xxxxxx24',
      equipment: {
        id: 'CAM003',
        name: 'Sony A7 IV',
        category: 'camera'
      },
      borrowDate: '2024-02-10',
      dueDate: '2024-02-20',
      returnDate: '2024-02-18',
      status: 'maintenance',
      department: 'คณะวิศวกรรมศาสตร์',
      contact: '084-xxx-xxxx',
      fine: {
        dailyRate: 50, // อัตราค่าปรับต่อวัน (บาท)
        days: 0,       // จำนวนวันที่เกินกำหนด (อัพเดตเมื่อมีการคืน)
        amount: 0,     // จำนวนเงินค่าปรับทั้งหมด (บาท)
        paymentMethod: '', // วิธีการชำระเงิน (cash, transfer, waived)
        paymentComplete: false, // สถานะการชำระ
        notes: ''      // หมายเหตุเกี่ยวกับค่าปรับ
      }
    }, {
      id: 'BRW006',
      name: 'สมเกียรติ นักศึกษา',
      studentId: '64xxxxxx26',
      equipment: {
        id: 'NB001',
        name: 'Dell XPS 15 9510',
        category: 'notebook'
      },
      borrowDate: '2024-02-25',
      dueDate: '2024-03-10',
      returnDate: null,
      status: 'pending',
      department: 'คณะวิทยาศาสตร์',
      contact: '086-xxx-xxxx',
      fine: {
        dailyRate: 50, // อัตราค่าปรับต่อวัน (บาท)
        days: 0,       // จำนวนวันที่เกินกำหนด (อัพเดตเมื่อมีการคืน)
        amount: 0,     // จำนวนเงินค่าปรับทั้งหมด (บาท)
        paymentMethod: '', // วิธีการชำระเงิน (cash, transfer, waived)
        paymentComplete: false, // สถานะการชำระ
        notes: ''      // หมายเหตุเกี่ยวกับค่าปรับ
      }
    }
  ];
  summary = {
    pendingRequests: 0,
    activeBorrows: 0,
    overdue: 0,
    underMaintenance: 0
  };


  changeTab(tab: string) {
    this.activeTab = tab;
  }

  // กรองข้อมูลตาม tab ที่เลือก
  getFilteredBorrowers() {
    // กรองตาม tab ก่อน
    let results = [];

    switch (this.activeTab) {
      case 'pending':
        results = this.borrowers.filter(item => item.status === 'pending');
        break;
      case 'not-returned':
        results = this.borrowers.filter(item => item.status === 'borrowing');
        break;
      case 'returned':
        results = this.borrowers.filter(item => item.status === 'returned');
        break;
      case 'overdue':
        results = this.borrowers.filter(item => item.status === 'overdue');
        break;
      case 'maintenance':
        results = this.borrowers.filter(item => item.status === 'maintenance');
        break;
      case 'all':
      default:
        results = [...this.borrowers];
        break;
    }

    // กรองตามเงื่อนไขการค้นหา
    if (this.searchText?.trim()) {
      const searchLower = this.searchText.toLowerCase().trim();
      results = results.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.equipment.id.toLowerCase().includes(searchLower) ||
        item.equipment.name.toLowerCase().includes(searchLower) ||
        item.studentId?.toLowerCase().includes(searchLower)
      );
    }

    // กรองตามหมวดหมู่
    if (this.selectedCategory && this.selectedCategory !== 'all') {
      results = results.filter(item => item.equipment.category === this.selectedCategory);
    }

    // กรองตามสถานะ
    if (this.selectedStatus && this.selectedStatus !== 'all') {
      results = results.filter(item => item.status === this.selectedStatus);
    }

    return results;
  }

  // ฟังก์ชันสำหรับคืนอุปกรณ์


  // ฟังก์ชันสำหรับดูรายละเอียด
  // viewDetails(equipmentId: string) {
  //   console.log('View details:', equipmentId);
  // }

  getEquipmentSerialNumber(equipmentId: string): string {
    const equipment = this.equipments.find(eq => eq.id === equipmentId);
    return equipment?.serialNumber || 'ไม่ระบุ';
  }
  // หาข้อมูลหมวดหมู่ของอุปกรณ์
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
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

  returnModal: any = null;

  ngOnInit() {
    this.calculateSummary();

    // ตรวจสอบว่า DOM โหลดเสร็จแล้ว แล้วจึงเริ่มต้น Modal
    document.addEventListener('DOMContentLoaded', () => {

      const returnModalElement = document.getElementById('returnModal');
      if (returnModalElement) {
        this.returnModal = new bootstrap.Modal(returnModalElement);
      }
    });
  }


  calculateSummary() {
    // นับจำนวนรายการที่ขอยืม
    this.summary.pendingRequests = this.borrowers.filter(b => b.status === 'pending').length;

    // นับจำนวนรายการที่ยังไม่คืน
    this.summary.activeBorrows = this.borrowers.filter(b => b.status === 'borrowing').length;

    // นับจำนวนรายการที่เกินกำหนด
    this.summary.overdue = this.borrowers.filter(b => b.status === 'overdue').length;

    // นับจำนวนอุปกรณ์ที่อยู่ระหว่างซ่อม
    this.summary.underMaintenance = this.borrowers.filter(b => b.status === 'maintenance').length;
  }



  // ตัวแปรสำหรับ modal อนุมัติ

  selectedBorrowRequest: any = null;
  selectedBorrow: any = null;  // ใช้ทั้ง modal อนุมัติและคืน
  @ViewChild(ApproveModalComponent) approveModalComponent!: ApproveModalComponent;
  
  constructor(private printService: PrintService) { }

  // เปิด modal อนุมัติ
  openApproveModal(borrowId: string) {
    this.selectedBorrowRequest = this.borrowers.find(b => b.id === borrowId);

    setTimeout(() => {
      if (this.approveModalComponent) {
        this.approveModalComponent.show();
      }
    });
  }


  // จัดการเมื่อมีการอนุมัติจาก Modal
  handleApproved(approvalData: any) {
    const borrow = this.borrowers.find(b => b.id === approvalData.borrowId);
    if (borrow) {
      borrow.status = 'borrowing';
      
      // ใช้ type assertion ด้วย 'as any'
      (borrow as any).equipmentCondition = approvalData.condition;
      (borrow as any).approveNote = approvalData.note;
      
      if (approvalData.printDocument) {
        const equipment = this.equipments.find(e => e.id === borrow.equipment.id);
        const categoryName = this.getCategoryName(borrow.equipment.category);
        
        this.printService.printBorrowDocument(
          borrow,
          equipment,
          categoryName,
          approvalData.condition,
          approvalData.note
        );
      }
      
      this.calculateSummary();
    }
  }


  @ViewChild(ReturnedModalComponent) returnedModalComponent!: ReturnedModalComponent;
  selectedReturnBorrow: any = null;
  openReturnModal(borrowId: string) {
    console.log('เปิดหน้าต่างคืนอุปกรณ์สำหรับ ID:', borrowId);
    
    // ค้นหาข้อมูลการยืมจาก ID
    this.selectedReturnBorrow = this.borrowers.find(b => b.id === borrowId);
    
    if (!this.selectedReturnBorrow) {
      console.error('ไม่พบข้อมูลการยืมที่มี ID:', borrowId);
      return;
    }
    
    // รอให้ component พร้อมก่อนเรียกใช้ show()
    setTimeout(() => {
      if (this.returnedModalComponent) {
        this.returnedModalComponent.show();
      } else {
        console.error('ไม่พบ ReturnedModalComponent');
      }
    });
  }
  
  returnItem(borrowId: string) {
    console.log('Return item:', borrowId);
    this.selectedReturnBorrow = this.borrowers.find(b => b.id === borrowId);
    
    setTimeout(() => {
      if (this.returnedModalComponent) {
        this.returnedModalComponent.show();
      }
    });
  }
  handleReturned(returnData: any) {
    console.log('ข้อมูลการคืนอุปกรณ์:', returnData);
    
    const borrow = this.borrowers.find(b => b.id === returnData.borrowId);
    if (borrow) {
      console.log('พบข้อมูลการยืม:', borrow);
      
      // อัพเดทสถานะเป็นคืนแล้ว
      borrow.status = 'returned';
      
      // บันทึกวันที่คืน
      borrow.returnDate = new Date().toISOString().split('T')[0];
      
      // บันทึกรายละเอียดการคืน
      (borrow as any).returnCondition = returnData.condition;
      (borrow as any).returnNote = returnData.note;
      
      // ถ้าสภาพอุปกรณ์เสียหาย ให้เปลี่ยนสถานะอุปกรณ์เป็นซ่อมบำรุง
      if (returnData.condition === 'damaged') {
        const equipment = this.equipments.find(e => e.id === borrow.equipment.id);
        if (equipment) {
          equipment.status = 'ซ่อม/บำรุง';
        }
      }
      
      // ถ้ามีค่าปรับ บันทึกข้อมูลค่าปรับและเพิ่มข้อมูลเพิ่มเติม
      if (returnData.fine) {
        // เพิ่มข้อมูลวันที่บันทึกค่าปรับ
        returnData.fine.recordDate = new Date().toISOString().split('T')[0];
        
        // เพิ่มข้อมูลผู้บันทึกค่าปรับ (ถ้ามีระบบล็อกอินของผู้ใช้)
        // returnData.fine.recordedBy = this.currentUser.id; 
        
        // บันทึกข้อมูลค่าปรับลงในข้อมูลการยืม
        (borrow as any).fine = returnData.fine;
        
        // อาจจะมีการส่งข้อมูลไปบันทึกในระบบหลังบ้านหรือระบบการเงินเพิ่มเติม
        // this.financeService.recordFine(borrow.id, returnData.fine);
        
        console.log('บันทึกข้อมูลค่าปรับ:', returnData.fine);
      }
      
      // ตรวจสอบค่า printDocument ที่ได้รับ และดำเนินการพิมพ์เอกสาร
      if (returnData.printDocument) {
        console.log('กำลังพิมพ์เอกสารการคืน...');
        try {
          const equipment = this.equipments.find(e => e.id === borrow.equipment.id);
          const categoryName = this.getCategoryName(borrow.equipment.category);
          
          // เรียกใช้ service สำหรับพิมพ์เอกสาร
          this.printService.printReturnDocument(
            borrow,
            equipment,
            categoryName,
            returnData
          );
        } catch (error) {
          console.error('เกิดข้อผิดพลาดในการพิมพ์เอกสาร:', error);
          alert('เกิดข้อผิดพลาดในการพิมพ์เอกสาร: ' + error);
        }
      }
      
      // อัพเดทข้อมูลสรุป
      this.calculateSummary();
      
      // แสดงข้อความแจ้งเตือนการคืนสำเร็จ
      alert('คืนอุปกรณ์เรียบร้อยแล้ว' + 
        (returnData.fine && returnData.fine.amount > 0 ? 
          `\nมีค่าปรับ ${returnData.fine.amount} บาท` : ''));
      
    } else {
      console.error('ไม่พบข้อมูลการยืมที่มี ID:', returnData.borrowId);
      alert('เกิดข้อผิดพลาด: ไม่พบข้อมูลการยืม');
    }
  }
// cencal modal
@ViewChild(CancelModalComponent) cancelModalComponent: CancelModalComponent | undefined

selectedCancelBorrow: any = null;

openCancelModal(borrowId: string) {
  this.selectedCancelBorrow = this.borrowers.find(b => b.id === borrowId);
  setTimeout(() => {
    if (this.cancelModalComponent) {
      this.cancelModalComponent.show();
    }
  });
}

handleCancelled(cancelData: any) {
  console.log('ข้อมูลการยกเลิก:', cancelData);
  // ทำการยกเลิกรายการตามข้อมูลที่ได้รับ
  // เช่น เรียก API เพื่อยกเลิกรายการ แล้วอัพเดทข้อมูลในตาราง
  
  // ตัวอย่างการอัพเดทข้อมูลในตารางหลังจากยกเลิก
  const index = this.borrowers.findIndex(b => b.id === cancelData.id);
  if (index !== -1) {
    this.borrowers[index].status = 'cancelled';
    // อัพเดท UI อื่นๆ ตามต้องการ
  }
}
//  Maintenance modal
@ViewChild(MaintenanceModalComponent) maintenanceModalComponent: MaintenanceModalComponent | undefined;
selectedMaintenanceBorrow: any = null;

openMaintenanceModal(borrowId: string) {
  this.selectedMaintenanceBorrow = this.borrowers.find(b => b.id === borrowId);
  setTimeout(() => {
    if (this.maintenanceModalComponent) {
      this.maintenanceModalComponent.show();
    }
  });
}

handleMaintenanceStart(maintenanceData: any) {
  console.log('ข้อมูลการซ่อมบำรุง:', maintenanceData);
  
  // ทำการบันทึกข้อมูลการซ่อมบำรุง
  const index = this.borrowers.findIndex(b => b.id === maintenanceData.borrowId);
  if (index !== -1) {
    this.borrowers[index].status = 'maintenance';
    // อัพเดทข้อมูลอื่นๆ ตามต้องการ
  }
  
  // อัพเดทสถานะอุปกรณ์
  const equipment = this.equipments.find(e => e.id === maintenanceData.equipmentId);
  if (equipment) {
    equipment.status = 'ซ่อม/บำรุง';
  }
  
  this.calculateSummary(); // อัพเดทข้อมูลสรุป
}
@ViewChild(InfoModalComponent) infoModalComponent: InfoModalComponent | undefined;
selectedInfoBorrow: any = null;
viewDetails(borrowId: string) {
  console.log('View details:', borrowId);
  this.selectedInfoBorrow = this.borrowers.find(b => b.id === borrowId);
  
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

// เพิ่มเมธอดสำหรับจัดการกับ events จาก InfoModal
handleStatusChanged(statusData: any) {
  console.log('มีการเปลี่ยนสถานะ:', statusData);
  
  const borrow = this.borrowers.find(b => b.id === statusData.borrowId);
  if (borrow) {
    // เก็บสถานะเดิมไว้สำหรับการเปรียบเทียบ
    const oldStatus = borrow.status;
    
    // เปลี่ยนสถานะใหม่
    borrow.status = statusData.newStatus;
    
    // เพิ่มบันทึกการเปลี่ยนสถานะ (ใช้ type assertion เพื่อหลีกเลี่ยงข้อผิดพลาด TypeScript)
    if (!(borrow as any).statusHistory) {
      (borrow as any).statusHistory = [];
    }
    
    (borrow as any).statusHistory.push({
      timestamp: statusData.timestamp,
      oldStatus: oldStatus,
      newStatus: statusData.newStatus,
      note: statusData.note,
      changedBy: 'เจ้าหน้าที่' // ใช้ตัวแปร this.currentUser ในกรณีมี login
    });
    
    // อัพเดทวันที่ล่าสุด
    (borrow as any).lastUpdated = statusData.timestamp;
    
    // ทำการประมวลผลเพิ่มเติมตามสถานะ
    if (statusData.newStatus === 'returned') {
      // ถ้าเป็นการคืน ให้เพิ่มวันที่คืน
      borrow.returnDate = new Date().toISOString().split('T')[0];
    } else if (statusData.newStatus === 'maintenance') {
      // ถ้าเป็นการส่งซ่อม อาจต้องเพิ่มข้อมูลการซ่อม
      if (!(borrow as any).maintenance) {
        (borrow as any).maintenance = [];
      }
      
      // เพิ่มข้อมูลเริ่มต้นการซ่อม
      (borrow as any).maintenance.push({
        startDate: statusData.timestamp.split('T')[0],
        reason: statusData.note || 'ไม่ระบุ',
        status: 'in-progress',
        createdAt: statusData.timestamp
      });
    }
    
    // อัพเดทข้อมูลสรุป
    this.calculateSummary();
    
    // แสดงข้อความแจ้งเตือน
    alert('เปลี่ยนสถานะเรียบร้อยแล้ว: ' + this.getStatusText(statusData.newStatus));
  }
}

handlePrintRequested(printData: any) {
  console.log('มีการขอพิมพ์เอกสาร:', printData);
  
  // บันทึกประวัติการพิมพ์ (ถ้าต้องการ) - ใช้ type assertion เพื่อหลีกเลี่ยงข้อผิดพลาด TypeScript
  const borrow = this.borrowers.find(b => b.id === printData.borrowId);
  if (borrow) {
    // บันทึกเฉพาะข้อมูลใน log เท่านั้น ไม่สร้าง property ใหม่เพื่อหลีกเลี่ยงข้อผิดพลาด TypeScript
    console.log('พิมพ์เอกสาร:', {
      timestamp: printData.timestamp,
      documentType: printData.type,
      borrowId: printData.borrowId
    });
  }
}

handleApproveRequested(borrowId: string) {
  // เรียกเมธอด openApproveModal ที่มีอยู่แล้ว
  this.openApproveModal(borrowId);
}

handleReturnRequested(borrowId: string) {
  // เรียกเมธอด returnItem ที่มีอยู่แล้ว
  this.returnItem(borrowId);
}

handleMaintenanceRequested(borrowId: string) {
  // เรียกเมธอด openMaintenanceModal ที่มีอยู่แล้ว
  this.openMaintenanceModal(borrowId);
}

handleCancelRequested(borrowId: string) {
  // เรียกเมธอด openCancelModal ที่มีอยู่แล้ว
  this.openCancelModal(borrowId);
}

  handleModalClosed() {
    this.selectedBorrowRequest = null;
    this.selectedReturnBorrow = null;
    this.selectedCancelBorrow = null;
    this.selectedMaintenanceBorrow = null;
    this.selectedInfoBorrow = null;
  }




  
}






