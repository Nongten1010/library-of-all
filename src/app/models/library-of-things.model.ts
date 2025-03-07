// src/app/models/library-of-things.model.ts

// กำหนด interface สำหรับข้อมูลอุปกรณ์
export interface Equipment {
    id: string;
    name: string;
    barcode?: string;
    serialNumber?: string;
    category_id?: string;
    category_name?: string;
    status_id?: string;
    status_name?: string;
    specifications?: any;
    // เพิ่ม properties อื่นๆ ตามต้องการ
  }
  
  // กำหนด interface สำหรับข้อมูลการยืม
  export interface Borrowing {
    id: string;
    equipment_id: string;
    equipment_name?: string;
    equipment_category_id?: string;
    user_id: string;
    user_name?: string;
    user_student_id?: string;
    user_contact?: string;
    user_department?: string;
    contact?: string;
    borrow_date: string;
    due_date: string;
    return_date?: string;
    status_id?: number;
    status_name?: string;
    status?: string;  // เพิ่ม property นี้
    status_display_name?: string;
    fine_days?: number;
    fine_amount?: number;
    payment_method?: string;
    payment_complete?: boolean;
    notes?: string;
    return_condition?: string;
    condition?: string;
  
  }
  
  
  // กำหนด interface สำหรับข้อมูลอื่นๆ
  export interface Category {
    id: string;
    name: string;
    icon?: string;
  }
  
  export interface Status {
    id: string;
    name: string;
    icon?: string;
  }
  
  // กำหนด interface สำหรับพารามิเตอร์ที่ส่งไปยัง API
  export interface ApproveData {
    condition?: string;
    note?: string;
  }
  
  export interface CancelData {
    reason: string;
  }
  
  // คุณสามารถเพิ่ม interface อื่นๆ ตามต้องการ