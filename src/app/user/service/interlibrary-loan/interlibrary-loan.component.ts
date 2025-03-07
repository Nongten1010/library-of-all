import { Component ,ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common'; 
// import { NgForm } from '@angular/forms'; // เพิ่ม NgForm
import { FormControl, FormsModule } from '@angular/forms'; // นำเข้า FormsModule
import { HttpClient, HttpClientModule } from '@angular/common/http'; // นำเข้า HttpClientModule
import { environment } from '@environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Reactive Forms
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // นำเข้า ReactiveFormsModule

@Component({
  selector: 'app-interlibrary-loan',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule,ReactiveFormsModule,],
  templateUrl: './interlibrary-loan.component.html',
  styleUrl: './interlibrary-loan.component.css'
})
export class InterlibraryLoanComponent {
  interlibraryForm!: FormGroup;

  // URL จาก environment
  private readonly apiUrl = environment.apiEndpoints.addIllRequest;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // สร้างฟอร์มและกำหนด Validators
    this.interlibraryForm = this.fb.group({
      userId: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      callNo: [''],
      title: ['', Validators.required],
      author: ['', Validators.required],
      note: [''],
      documentType: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.interlibraryForm.valid) {
      this.http.post(this.apiUrl, this.interlibraryForm.value).subscribe({
        next: (response) => {
          console.log('Response:', response);
          alert('ส่งข้อมูลสำเร็จ!');
          this.interlibraryForm.reset();
        },
        error: (error) => {
          console.error('Error:', error);
          alert('เกิดข้อผิดพลาดในการส่งข้อมูล!');
        },
      });
    } else {
      this.interlibraryForm.markAllAsTouched();
      alert('กรุณากรอกข้อมูลให้ครบถ้วน!');
    }
  }
  
}