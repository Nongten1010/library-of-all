// src/app/services/library-of-things.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibraryOfThingsService {
  private apiUrl = 'http://localhost:8888/library-api/api/v1/admin/library-of-things';

  constructor(private http: HttpClient) { }

  getEquipments(search: string = '', category: string = 'all', status: string = 'all', page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', ((page - 1) * limit).toString());
    
    if (search) params = params.set('search', search);
    if (category !== 'all') params = params.set('category', category);
    if (status !== 'all') params = params.set('status', status);
    
    return this.http.get<any>(this.apiUrl, { params });
  }

  getEquipmentById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?id=${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories`);
  }

  getStatuses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statuses`);
  }

  getBorrowStatuses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/borrow-statuses`);
  }

  getBorrowings(search: string = '', status: string = 'all', page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('borrowings', 'true')
      .set('limit', limit.toString())
      .set('offset', ((page - 1) * limit).toString());
    
    if (search) params = params.set('search', search);
    if (status !== 'all') params = params.set('status', status);
    
    return this.http.get<any>(this.apiUrl, { params });
  }

  getBorrowingById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?borrowing_id=${id}`);
  }

  approveBorrowing(id: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/approve?id=${id}`, data);
  }

  cancelBorrowing(id: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cancel?id=${id}`, data);
  }

  returnBorrowing(id: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/return?id=${id}`, data);
  }

  maintenanceBorrowing(id: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/maintenance?id=${id}`, data);
  }

  getBorrowingSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary`);
  }

  updateBorrowingStatus(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/status?id=${id}`, data);
  }
}