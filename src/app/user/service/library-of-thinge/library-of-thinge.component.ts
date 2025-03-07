import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ ต้อง import CommonModule
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-library-of-thinge',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './library-of-thinge.component.html',
  styleUrl: './library-of-thinge.component.css'
})


export class LibraryOfThingeComponent {
  // Tab state
  activeTab = 'items';

  // Filters
  selectedCategory = 'all';
  selectedStatus = 'all';
  selectedBorrowStatus = 'all';
  selectedBorrowDate = '';

  // Modal properties
  showBorrowModal = false;
  selectedItemForBorrow: any = null;
  borrowForm = {
    borrowerId: '',
    borrowerName: '',
    pickupDate: '',
    returnDate: ''
  };

  categories = [
    { id: 'all', name: 'ทั้งหมด', icon: 'bi bi-book' },
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

  // Items data
  allItems = [
    {
      id: 'cam1',
      name: 'กล้อง DSLR Canon 80D',
      category: 'camera',
      description: 'กล้อง DSLR สำหรับถ่ายภาพมืออาชีพ',
      condition: 'ใช้งานได้ดี',
      status: 'ว่าง',
      totalQuantity: 3,
      availableQuantity: 2,
      maxBorrowDays: 5
    },
    {
      id: 'mic1',
      name: 'ไมโครโฟน Blue Yeti',
      category: 'audio',
      description: 'ไมโครโฟนสำหรับการบันทึกเสียงคุณภาพสูง',
      condition: 'ต้องการตรวจสอบ',
      location: 'kps',
      status: 'ถูกยืม',
      totalQuantity: 4,
      availableQuantity: 0,
      maxBorrowDays: 7
    },
    {
      id: 'tool1',
      name: 'สว่านไฟฟ้า Bosch',
      category: 'tools',
      description: 'สว่านไฟฟ้าแรงสูงสำหรับงานซ่อมแซม',
      condition: 'ใช้งานได้ดี',
      status: 'ว่าง',
      totalQuantity: 5,
      availableQuantity: 3,
      maxBorrowDays: 3
    }
  ];

  items = [...this.allItems];

  // Borrowing history
  allBorrowingHistory = [
    {
      itemId: 'cam1',
      itemName: '📷 กล้อง DSLR Canon 80D',
      borrower: 'สมชาย ใจดี',
      borrowerId: '6402100123',
      borrowDate: '2025-01-28',
      returnDate: '2025-01-31',
      status: 'คืนแล้ว',
      isOverdue: false
    },
    {
      itemId: 'mic1',
      itemName: '🎤 ไมโครโฟน Blue Yeti',
      borrower: 'วินัย จิตดี',
      borrowerId: '6302100456',
      borrowDate: '2025-02-01',
      returnDate: null,
      status: 'ยังไม่คืน',
      isOverdue: false
    },
    {
      itemId: 'tool1',
      itemName: '🔨 สว่านไฟฟ้า Bosch',
      borrower: 'ประสิทธิ์ มีทรัพย์',
      borrowerId: '6301100789',
      borrowDate: '2025-01-15',
      returnDate: null,
      status: 'ยังไม่คืน',
      isOverdue: true
    }
  ];

  borrowingHistory = [...this.allBorrowingHistory];

  constructor() {
    this.filterItems();
    this.filterBorrowingHistory();
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // เพิ่มเมธอดนี้ในคลาส LibraryOfThingeComponent
  getDateConstraints() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
      min: today.toISOString().split('T')[0],
      max: tomorrow.toISOString().split('T')[0]
    };
  }

  
  getNextDay(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  calculateReturnDate(pickupDate: string, maxDays: number): string {
    const date = new Date(pickupDate);
    date.setDate(date.getDate() + maxDays);
    return date.toISOString().split('T')[0];
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  getStatusName(statusId: string): string {
    const statusObj = this.status.find(stat => stat.id === statusId);
    return statusObj ? statusObj.name : '';
  }

  filterItems(): void {
    this.items = this.allItems.filter(item => {
      const matchesCategory = this.selectedCategory === 'all' || item.category === this.selectedCategory;

      const selectedStatusName = this.selectedStatus === 'all'
        ? 'all'
        : this.getStatusName(this.selectedStatus);

      const matchesStatus = this.selectedStatus === 'all' || item.status === selectedStatusName;

      return matchesCategory && matchesStatus;
    });
  }

  onCategoryChange(event: any): void {
    this.selectedCategory = event.target.value;
    this.filterItems();
  }

  onStatusChange(event: any): void {
    this.selectedStatus = event.target.value;
    this.filterItems();
  }

  onBorrowStatusChange(event: any): void {
    this.selectedBorrowStatus = event.target.value;
    this.filterBorrowingHistory();
  }

  onBorrowDateChange(event: any): void {
    this.selectedBorrowDate = event.target.value;
    this.filterBorrowingHistory();
  }

  filterBorrowingHistory(): void {
    this.borrowingHistory = this.allBorrowingHistory.filter(record => {
      let statusMatch = true;
      if (this.selectedBorrowStatus !== 'all') {
        switch (this.selectedBorrowStatus) {
          case 'returned':
            statusMatch = record.status === 'คืนแล้ว';
            break;
          case 'borrowing':
            statusMatch = record.status === 'ยังไม่คืน' && !record.isOverdue;
            break;
          case 'overdue':
            statusMatch = record.isOverdue;
            break;
        }
      }

      let dateMatch = true;
      if (this.selectedBorrowDate) {
        dateMatch = record.borrowDate === this.selectedBorrowDate;
      }

      return statusMatch && dateMatch;
    });
  }

  openBorrowModal(item: any): void {
    if (item.status === 'ว่าง' && item.availableQuantity > 0) {
      this.selectedItemForBorrow = item;
      this.showBorrowModal = true;
      
      const tomorrow = this.getNextDay(this.getCurrentDate());
      
      this.borrowForm = {
        borrowerId: '',
        borrowerName: '',
        pickupDate: tomorrow,
        returnDate: this.calculateReturnDate(tomorrow, item.maxBorrowDays)
      };
    }
  }

  onPickupDateChange(event: any): void {
    const pickupDate = event.target.value;
    if (this.selectedItemForBorrow && pickupDate) {
      this.borrowForm.returnDate = this.calculateReturnDate(
        pickupDate,
        this.selectedItemForBorrow.maxBorrowDays
      );
    }
  }

  closeBorrowModal(): void {
    this.showBorrowModal = false;
    this.selectedItemForBorrow = null;
  }

  submitBorrowForm(): void {
    if (!this.borrowForm.borrowerId || !this.borrowForm.borrowerName) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    
    // ตรวจสอบว่าวันที่เลือกอยู่ในช่วงที่อนุญาต
    const constraints = this.getDateConstraints();
    if (this.borrowForm.pickupDate < constraints.min || this.borrowForm.pickupDate > constraints.max) {
      alert('วันที่รับต้องเป็นวันนี้หรือพรุ่งนี้เท่านั้น');
      return;
    }
    
    if (!this.selectedItemForBorrow) {
      return;
    }

    const itemIndex = this.allItems.findIndex(item => item.id === this.selectedItemForBorrow.id);
    if (itemIndex !== -1) {
      this.allItems[itemIndex].availableQuantity--;

      if (this.allItems[itemIndex].availableQuantity === 0) {
        this.allItems[itemIndex].status = 'ถูกยืม';
      }
    }

    const newBorrowRecord = {
      itemId: this.selectedItemForBorrow.id,
      itemName: this.getItemEmoji(this.selectedItemForBorrow.category) + ' ' + this.selectedItemForBorrow.name,
      borrower: this.borrowForm.borrowerName,
      borrowerId: this.borrowForm.borrowerId,
      borrowDate: this.borrowForm.pickupDate,
      returnDate: null,
      status: 'จองแล้ว',
      isOverdue: false
    };

    this.allBorrowingHistory.push(newBorrowRecord);

    this.filterItems();
    this.filterBorrowingHistory();

    this.closeBorrowModal();

    alert('บันทึกการจองเรียบร้อยแล้ว จะสามารถรับอุปกรณ์ได้ในวันที่ ' + this.borrowForm.pickupDate);
  }

  getItemEmoji(category: string): string {
    switch (category) {
      case 'camera': return '📷';
      case 'audio': return '🎤';
      case 'electronics': return '🔌';
      case 'tools': return '🔨';
      default: return '📦';
    }
  }
}