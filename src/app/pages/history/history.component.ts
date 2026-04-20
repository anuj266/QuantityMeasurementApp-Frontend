import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuantityService, QuantityResult } from '../../core/services/quantity.service';

@Component({
  selector: 'app-history',
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent implements OnInit {

  selectedOperation = 'CONVERT';
  operations = ['CONVERT', 'ADD', 'SUBTRACT', 'DIVIDE', 'COMPARE'];

  history: QuantityResult[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private quantityService: QuantityService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.quantityService.getHistory(this.selectedOperation).subscribe({
      next: (res) => {
        this.history = res;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load history';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  selectOperation(op: string) {
    this.selectedOperation = op;
    this.cdr.markForCheck();
    this.loadHistory();
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  formatUnit(unit: string | null): string {
    if (!unit) return '';
    return unit.charAt(0).toUpperCase() + unit.slice(1).toLowerCase().replace('_', ' ');
  }
}
