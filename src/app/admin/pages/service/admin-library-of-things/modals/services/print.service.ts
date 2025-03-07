import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() { }

  // ฟังก์ชันพิมพ์เอกสารการยืม
  printBorrowDocument(borrow: any, equipment: any, categoryName: string, condition: string, note: string) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('ไม่สามารถเปิดหน้าต่างพิมพ์ได้ - อาจถูกบล็อกโดย Pop-up Blocker');
      alert('ไม่สามารถเปิดหน้าต่างพิมพ์ได้ - โปรดตรวจสอบว่า Pop-up Blocker ของเบราว์เซอร์ไม่ได้บล็อกการพิมพ์');
      return;
    }

    printWindow.document.write(`
      <html>
      <head>
        <title>เอกสารการยืมอุปกรณ์</title>
        <style>
          body { font-family: 'Sarabun', 'TH Sarabun New', Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .section { margin-bottom: 15px; }
          .row { display: flex; margin-bottom: 5px; }
          .label { width: 150px; font-weight: bold; }
          .footer { margin-top: 50px; }
          .signature { display: flex; justify-content: space-between; margin-top: 70px; }
          .sign-box { width: 45%; text-align: center; }
          .sign-line { border-top: 1px solid #000; margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; }
          table, th, td { border: 1px solid black; padding: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>เอกสารการยืมอุปกรณ์</h2>
          <p>เลขที่: ${borrow.id}</p>
        </div>
        
        <div class="section">
          <h3>ข้อมูลผู้ยืม</h3>
          <div class="row">
            <div class="label">ชื่อ-นามสกุล:</div>
            <div>${borrow.name}</div>
          </div>
          <div class="row">
            <div class="label">รหัสนักศึกษา:</div>
            <div>${borrow.studentId}</div>
          </div>
          <div class="row">
            <div class="label">คณะ/หน่วยงาน:</div>
            <div>${borrow.department}</div>
          </div>
          <div class="row">
            <div class="label">เบอร์ติดต่อ:</div>
            <div>${borrow.contact}</div>
          </div>
        </div>
        
        <div class="section">
          <h3>รายละเอียดอุปกรณ์</h3>
          <table>
            <tr>
              <th>รหัสอุปกรณ์</th>
              <th>ชื่ออุปกรณ์</th>
              <th>Serial Number</th>
              <th>หมวดหมู่</th>
            </tr>
            <tr>
              <td>${borrow.equipment.id}</td>
              <td>${borrow.equipment.name}</td>
              <td>${equipment ? equipment.serialNumber : 'ไม่ระบุ'}</td>
              <td>${categoryName}</td>
            </tr>
          </table>
        </div>
        
        <div class="section">
          <h3>ระยะเวลาการยืม</h3>
          <div class="row">
            <div class="label">วันที่ยืม:</div>
            <div>${borrow.borrowDate}</div>
          </div>
          <div class="row">
            <div class="label">กำหนดคืน:</div>
            <div>${borrow.dueDate}</div>
          </div>
        </div>
        
        <div class="section">
          <h3>สภาพอุปกรณ์ก่อนยืม</h3>
          <div>${this.getConditionText(condition)}</div>
          ${note ? `<p>หมายเหตุ: ${note}</p>` : ''}
        </div>
        
        <div class="footer">
          <p>ข้าพเจ้าตกลงและยินยอมปฏิบัติตามเงื่อนไขการยืมอุปกรณ์ และจะดูแลรักษาอุปกรณ์เป็นอย่างดี หากมีความเสียหายเกิดขึ้นจากความประมาทหรือใช้งานผิดวัตถุประสงค์ ข้าพเจ้ายินดีรับผิดชอบค่าเสียหายที่เกิดขึ้น</p>
          
          <div class="signature">
            <div class="sign-box">
              <div class="sign-line"></div>
              <p>ลงชื่อผู้ยืม</p>
              <p>${borrow.name}</p>
            </div>
            <div class="sign-box">
              <div class="sign-line"></div>
              <p>ลงชื่อผู้อนุมัติ</p>
              <p>________________________</p>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; font-size: 16px;">พิมพ์เอกสาร</button>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // เพิ่มเวลาให้หน้าต่างโหลดเสร็จก่อนพิมพ์
    setTimeout(() => {
      try {
        printWindow.print();
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการพิมพ์:', error);
        alert('เกิดข้อผิดพลาดในการพิมพ์: ' + error);
      }
    }, 1000); // เพิ่มเวลาเป็น 1 วินาที
  }

  // ฟังก์ชันพิมพ์เอกสารการคืน

  printReturnDocument(borrow: any, equipment: any, categoryName: string, returnData: any) {
    console.log('printReturnDocument ถูกเรียก ด้วยข้อมูล:', { borrow, equipment, categoryName, returnData });

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('ไม่สามารถเปิดหน้าต่างพิมพ์ได้ - อาจถูกบล็อกโดย Pop-up Blocker');
      alert('ไม่สามารถเปิดหน้าต่างพิมพ์ได้ - โปรดตรวจสอบว่า Pop-up Blocker ของเบราว์เซอร์ไม่ได้บล็อกการพิมพ์');
      return;
    }

    const today = new Date();
    const formattedToday = this.formatDate(today);

    printWindow.document.write(`
      <html>
      <head>
        <title>เอกสารการคืนอุปกรณ์</title>
        <style>
          /* สไตล์สำหรับทั้งเอกสาร */
          body { 
            font-family: 'Sarabun', 'TH Sarabun New', Arial, sans-serif; 
            margin: 0; 
            padding: 10px;
            font-size: 12px;
          }
          .header { 
            text-align: center; 
            margin-bottom: 10px; 
          }
          .header h2 {
            margin: 5px 0;
            font-size: 18px;
          }
          .header p {
            margin: 2px 0;
            font-size: 12px;
          }
          .section { 
            margin-bottom: 10px; 
          }
          .section h3 {
            margin: 5px 0;
            font-size: 14px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 3px;
          }
          .row { 
            display: flex; 
            margin-bottom: 3px; 
          }
          .label { 
            width: 120px; 
            font-weight: bold; 
          }
          .footer { 
            margin-top: 15px; 
          }
          .signature { 
            display: flex; 
            justify-content: space-between; 
            margin-top: 30px; 
          }
          .sign-box { 
            width: 45%; 
            text-align: center; 
          }
          .sign-line { 
            border-top: 1px solid #000; 
            margin-bottom: 3px; 
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            font-size: 11px;
          }
          table, th, td { 
            border: 1px solid black; 
            padding: 3px; 
          }
          .highlight { 
            background-color: #f8f9fa; 
            padding: 5px; 
            border: 1px solid #dee2e6; 
            margin: 5px 0; 
            font-size: 10px;
          }
          
          /* สไตล์สำหรับการพิมพ์ */
          @media print {
            button { display: none; }
            body { 
              margin: 0; 
              padding: 0;
              font-size: 12px;
            }
            .page-break { page-break-before: always; }
            .no-print { display: none; }
            
            /* ปรับขนาดให้พอดีกับหน้ากระดาษ */
            @page {
              size: A4;
              margin: 10mm;
            }
              .info-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}
.info-table td {
  padding: 3px 5px;
  border: none;
}
.info-table .label {
  font-weight: bold;
  width: 150px;
}
.info-table .value {
  width: 200px;
}
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>เอกสารการคืนอุปกรณ์</h2>
          <p>เลขที่: RTN-${borrow.id}</p>
          <p>วันที่คืน: ${formattedToday}</p>
        </div>
        
        <div class="container">
          <div class="row" style="display: flex; flex-wrap: wrap;">
            <!-- คอลัมน์ซ้าย -->
<div class="section">
  <h3>ข้อมูลการยืม-คืน</h3>
  
  <table class="info-table">
    <tr>
      <td class="label">ชื่อ-นามสกุล:</td>
      <td class="value">${borrow.name}</td>
      <td class="label">วันที่ยืม:</td>
      <td class="value">${borrow.borrowDate}</td>
    </tr>
    <tr>
      <td class="label">รหัสนักศึกษา:</td>
      <td class="value">${borrow.studentId}</td>
      <td class="label">กำหนดคืน:</td>
      <td class="value">${borrow.dueDate}</td>
    </tr>
    <tr>
      <td class="label">คณะ/หน่วยงาน:</td>
      <td class="value">${borrow.department}</td>
      <td class="label">วันที่คืน:</td>
      <td class="value">${formattedToday}</td>
    </tr>
    <tr>
      <td class="label">เบอร์ติดต่อ:</td>
      <td class="value">${borrow.contact}</td>
      <td class="label">${this.isOverdue(borrow.dueDate) ? 'เกินกำหนด:' : ''}</td>
      <td class="value">${this.isOverdue(borrow.dueDate) ?
        `<span style="color: red;">${this.calculateOverdueDays(borrow.dueDate)} วัน</span>` : ''}
      </td>
    </tr>
  </table>
</div>
            </div>
            
            <!-- คอลัมน์ขวา -->
            <div style="flex: 0 0 100%;">
              <div class="section">
                <h3>รายละเอียดอุปกรณ์</h3>
                <table>
                  <tr>
                    <th>รหัสอุปกรณ์</th>
                    <th>ชื่ออุปกรณ์</th>
                    <th>Serial Number</th>
                    <th>หมวดหมู่</th>
                  </tr>
                  <tr>
                    <td>${borrow.equipment.id}</td>
                    <td>${borrow.equipment.name}</td>
                    <td>${equipment ? equipment.serialNumber : 'ไม่ระบุ'}</td>
                    <td>${categoryName}</td>
                  </tr>
                </table>
              </div>
              
              <div class="section">
                <h3>สภาพอุปกรณ์เมื่อคืน</h3>
                <div><b>สภาพ:</b> ${this.getConditionText(returnData.condition)}</div>
                ${returnData.note ? `<div><b>หมายเหตุ:</b> ${returnData.note}</div>` : ''}
              </div>
            </div>
          </div>
        </div>
        
        ${returnData.fine ? `
        <div class="section">
          <h3>รายละเอียดค่าปรับ</h3>
          <div style="display: flex; flex-wrap: wrap;">
            <div style="flex: 0 0 50%;">
              <div><b>จำนวนวันเกินกำหนด:</b> ${this.calculateOverdueDays(borrow.dueDate)} วัน</div>
              <div><b>ค่าปรับรวม:</b> ${returnData.fine.amount} บาท</div>
            </div>
            <div style="flex: 0 0 50%;">
              <div><b>วิธีการชำระ:</b> ${this.getPaymentMethodText(returnData.fine.paymentMethod)}</div>
              <div><b>สถานะการชำระ:</b> ${returnData.fine.paymentComplete ? 'ชำระแล้ว' : 'ยังไม่ได้ชำระ'}</div>
            </div>
          </div>
          ${returnData.fine.note ? `
          <div><b>หมายเหตุค่าปรับ:</b> ${returnData.fine.note}</div>` : ''}
        </div>` : ''}
        
        <div class="section highlight">
          <h3>เงื่อนไขการคืนอุปกรณ์</h3>
          <p style="margin: 5px 0; font-size: 11px;">ข้าพเจ้ารับทราบว่าหากทางหน่วยงานตรวจพบความเสียหายของอุปกรณ์ภายในระยะเวลา 14 วันหลังจากการคืน อันเกิดจากการใช้งานผิดวัตถุประสงค์หรือความประมาทในระหว่างที่ข้าพเจ้ายืมใช้งาน ข้าพเจ้ายินดีรับผิดชอบค่าเสียหายที่เกิดขึ้นตามที่หน่วยงานเรียกเก็บ</p>
          <p style="margin: 5px 0; font-size: 11px;">ทั้งนี้ ทางหน่วยงานจะแจ้งให้ข้าพเจ้าทราบทางเบอร์โทรศัพท์ที่ให้ไว้ <strong>${borrow.contact}</strong> หากพบความเสียหายดังกล่าว</p>
        </div>
        
        <div class="footer">
          <div class="signature">
            <div class="sign-box">
              <div class="sign-line"></div>
              <p>ลงชื่อผู้คืน</p>
              <p>${borrow.name}</p>
            </div>
            <div class="sign-box">
              <div class="sign-line"></div>
              <p>ลงชื่อผู้รับคืน</p>
              <p>________________________</p>
            </div>
          </div>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; font-size: 16px;">พิมพ์เอกสาร</button>
        </div>
        
        <script>
          // Auto-print after a delay
          window.onload = function() {
            setTimeout(function() {
              console.log('Auto-triggering print...');
              window.print();
            }, 1000);
          };
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
  }

  // ฟังก์ชันช่วย
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isOverdue(dueDateStr: string): boolean {
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    return dueDate < today;
  }

  calculateOverdueDays(dueDateStr: string): number {
    const dueDate = new Date(dueDateStr);
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

  getPaymentMethodText(method: string): string {
    switch (method) {
      case 'cash':
        return 'เงินสด';
      case 'transfer':
        return 'โอนเงิน';
      case 'waived':
        return 'ยกเว้นค่าปรับ';
      default:
        return method;
    }
  }
}