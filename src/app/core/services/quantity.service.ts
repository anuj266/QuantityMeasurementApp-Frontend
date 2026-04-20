import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface QuantityDTO {
  value: number;
  unit: string;
  measurementType: string;
}

export interface QuantityInputDTO {
  thisQuantityDTO: QuantityDTO;
  thatQuantityDTO: QuantityDTO;
}

export interface QuantityResult {
  thisValue: number;
  thisUnit: string;
  thisMeasurementType: string;
  thatValue: number;
  thatUnit: string;
  thatMeasurementType: string;
  operation: string;
  resultString: string | null;
  resultValue: number | null;
  resultUnit: string | null;
  resultMeasurementType: string | null;
  errorMessage?: string | null;
  error?: boolean;
}

@Injectable({ providedIn: 'root' })
export class QuantityService {
  private baseUrl = `${environment.apiUrl}/api/v1/quantities`;

  constructor(private http: HttpClient) {}

  convert(input: QuantityInputDTO): Observable<QuantityResult> {
    return this.http.post<QuantityResult>(`${this.baseUrl}/convert`, input);
  }

  compare(input: QuantityInputDTO): Observable<QuantityResult> {
    return this.http.post<QuantityResult>(`${this.baseUrl}/compare`, input);
  }

  add(input: QuantityInputDTO): Observable<QuantityResult> {
    return this.http.post<QuantityResult>(`${this.baseUrl}/add`, input);
  }

  subtract(input: QuantityInputDTO): Observable<QuantityResult> {
    return this.http.post<QuantityResult>(`${this.baseUrl}/subtract`, input);
  }

  divide(input: QuantityInputDTO): Observable<QuantityResult> {
    return this.http.post<QuantityResult>(`${this.baseUrl}/divide`, input);
  }

  getHistory(operation: string): Observable<QuantityResult[]> {
    return this.http.get<QuantityResult[]>(`${this.baseUrl}/history/operation/${operation}`);
  }
}
