import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchasing-resources',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './purchasing-resources.component.html',
  styleUrls: ['./purchasing-resources.component.css']
})
export class PurchasingResourcesComponent {
  purchaseForm: FormGroup;
  categories = ['หนังสือภาษาไทย', 'หนังสือภาษาต่างประเทศ', 'E-book', 'Board Game', 'วารสาร', 'บทความ','อื่น ๆ'];

  constructor(private fb: FormBuilder) {
    this.purchaseForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      bookType: ['', Validators.required],
      bookCategory: ['', Validators.required],
      bookCategoryOther: [''],
      objective: ['', Validators.required],
      courseInfo: this.fb.group({  
        courseName: ['', Validators.required],
        subjectName: ['', Validators.required]
      }),
      otherObjective: [''],
      title: ['', Validators.required],
      author: [{ value: '', disabled: false }, Validators.required],
      year: [{ value: '', disabled: false }, [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      ISBN: [{ value: '', disabled: false }],
      Publisher: [{ value: '', disabled: false }],
      Price: ['', [Validators.pattern('^[0-9]*$')]],
      etc: ['']
    });

    // ตรวจสอบการเปลี่ยนแปลงของ bookCategory และ objective
    this.purchaseForm.get('bookCategory')?.valueChanges.subscribe(value => {
      if (value === 'Board Game') {
        this.disableFields();
      } else {
        this.enableFields();
      }
      this.updateValidators();
    });

    this.purchaseForm.get('objective')?.valueChanges.subscribe(() => {
      this.updateValidators();
    });
  }

  disableFields() {
    this.purchaseForm.get('author')?.reset();
    this.purchaseForm.get('year')?.reset();
    this.purchaseForm.get('ISBN')?.reset();
    this.purchaseForm.get('Publisher')?.reset();

    this.purchaseForm.get('author')?.disable();
    this.purchaseForm.get('year')?.disable();
    this.purchaseForm.get('ISBN')?.disable();
    this.purchaseForm.get('Publisher')?.disable();
  }

  enableFields() {
    this.purchaseForm.get('author')?.enable();
    this.purchaseForm.get('year')?.enable();
    this.purchaseForm.get('ISBN')?.enable();
    this.purchaseForm.get('Publisher')?.enable();
  }

  updateValidators() {
    const bookCategory = this.purchaseForm.get('bookCategory')?.value;
    const objective = this.purchaseForm.get('objective')?.value;

    // ถ้าเลือก "อื่น ๆ" ให้บังคับกรอก
    if (bookCategory === 'อื่น ๆ') {
      this.purchaseForm.get('bookCategoryOther')?.setValidators([Validators.required]);
    } else {
      this.purchaseForm.get('bookCategoryOther')?.clearValidators();
    }
    this.purchaseForm.get('bookCategoryOther')?.updateValueAndValidity();

    // ถ้าเลือก "อื่น ๆ" ให้บังคับกรอก
    if (objective === 'อื่น ๆ') {
      this.purchaseForm.get('otherObjective')?.setValidators([Validators.required]);
    } else {
      this.purchaseForm.get('otherObjective')?.clearValidators();
    }
    this.purchaseForm.get('otherObjective')?.updateValueAndValidity();

    // ถ้าเลือก "ประกอบการเรียนการสอน" ให้บังคับกรอก courseName และ subjectName
    if (objective === 'ประกอบการเรียนการสอน') {
      this.purchaseForm.get('courseInfo.courseName')?.setValidators([Validators.required]);
      this.purchaseForm.get('courseInfo.subjectName')?.setValidators([Validators.required]);
    } else {
      this.purchaseForm.get('courseInfo.courseName')?.clearValidators();
      this.purchaseForm.get('courseInfo.subjectName')?.clearValidators();
    }
    this.purchaseForm.get('courseInfo.courseName')?.updateValueAndValidity();
    this.purchaseForm.get('courseInfo.subjectName')?.updateValueAndValidity();

    // ถ้าเลือก "E-book" ให้บังคับกรอก Price
    if (bookCategory === 'E-book') {
      this.purchaseForm.get('Price')?.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
    } else {
      this.purchaseForm.get('Price')?.clearValidators();
    }
    this.purchaseForm.get('Price')?.updateValueAndValidity();
    console.log('courseName Validators:', this.purchaseForm.get('courseInfo.courseName')?.validator);
    console.log('subjectName Validators:', this.purchaseForm.get('courseInfo.subjectName')?.validator);

  }

  onSubmit() {
    if (this.purchaseForm.valid) {
      console.log('Form Submitted:', this.purchaseForm.value);
      alert('Form submitted successfully!');
    } else {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }
}
