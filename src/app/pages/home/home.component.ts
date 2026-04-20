import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { QuantityService, QuantityResult } from '../../core/services/quantity.service';

type MeasurementType = 'LENGTH' | 'TEMPERATURE' | 'VOLUME' | 'WEIGHT';
type Operation = 'CONVERT' | 'ADD' | 'SUBTRACT' | 'DIVIDE' | 'COMPARE';

const UNITS: Record<MeasurementType, string[]> = {
  LENGTH: ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
  TEMPERATURE: ['CELSIUS', 'FAHRENHEIT'],
  VOLUME: ['LITRE', 'MILLILITRE', 'GALLON'],
  WEIGHT: ['KILOGRAM', 'GRAM', 'POUND']
};

const ARITHMETIC_OPS: Operation[] = ['ADD', 'SUBTRACT', 'DIVIDE'];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedType: MeasurementType = 'LENGTH';
  selectedOperation: Operation = 'CONVERT';

  fromValue = 1;
  toValue = 1;
  fromUnit = 'FEET';
  toUnit = 'INCHES';

  result: QuantityResult | null = null;
  errorMessage = '';
  loading = false;
  isLoggedIn = false;

  operations: Operation[] = ['CONVERT', 'ADD', 'SUBTRACT', 'DIVIDE', 'COMPARE'];

  constructor(
    private authService: AuthService,
    private quantityService: QuantityService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.cdr.markForCheck();
  }

  get units(): string[] {
    return UNITS[this.selectedType];
  }

  isOperationDisabled(op: Operation): boolean {
    return this.selectedType === 'TEMPERATURE' && ARITHMETIC_OPS.includes(op);
  }

  selectType(type: MeasurementType): void {
    this.selectedType = type;
    this.fromUnit = UNITS[type][0];
    this.toUnit = UNITS[type][1] || UNITS[type][0];
    this.result = null;
    this.errorMessage = '';
    this.toValue = 1;

    if (type === 'TEMPERATURE' && ARITHMETIC_OPS.includes(this.selectedOperation)) {
      this.selectedOperation = 'CONVERT';
    }

    this.cdr.markForCheck();
  }

  selectOperation(op: Operation): void {
    if (this.isOperationDisabled(op)) return;
    this.selectedOperation = op;
    this.result = null;
    this.errorMessage = '';
    this.cdr.markForCheck();
  }

  private getBackendMeasurementType(type: MeasurementType): string {
    switch (type) {
      case 'LENGTH':
        return 'LengthUnit';
      case 'WEIGHT':
        return 'WeightUnit';
      case 'VOLUME':
        return 'VolumeUnit';
      case 'TEMPERATURE':
        return 'TemperatureUnit';
      default:
        return type;
    }
  }

  calculate(): void {
    this.loading = true;
    this.errorMessage = '';
    this.result = null;
    this.cdr.markForCheck();

    const backendMeasurementType = this.getBackendMeasurementType(this.selectedType);

    const input = {
      thisQuantityDTO: {
        value: this.fromValue,
        unit: this.fromUnit,
        measurementType: backendMeasurementType
      },
      thatQuantityDTO: {
        value: this.selectedOperation === 'CONVERT' ? this.fromValue : this.toValue,
        unit: this.toUnit,
        measurementType: backendMeasurementType
      }
    };

    const ops: Record<Operation, () => any> = {
      CONVERT: () => this.quantityService.convert(input),
      ADD: () => this.quantityService.add(input),
      SUBTRACT: () => this.quantityService.subtract(input),
      DIVIDE: () => this.quantityService.divide(input),
      COMPARE: () => this.quantityService.compare(input)
    };

    ops[this.selectedOperation]().subscribe({
      next: (res: QuantityResult) => {
        this.result = res;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.errorMessage =
          err?.error?.errorMessage ||
          err?.error?.message ||
          'Something went wrong';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  goToHistory(): void {
    this.router.navigate(['/history']);
  }

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.isLoggedIn = false;
    this.cdr.markForCheck();
    this.router.navigate(['/home']);
  }

  formatUnit(unit: string | null): string {
    if (!unit) return '';
    return unit.charAt(0).toUpperCase() + unit.slice(1).toLowerCase().replace('_', ' ');
  }
}
