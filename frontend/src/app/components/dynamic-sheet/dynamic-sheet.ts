import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CharacterData, SheetSchema } from '../../models/sheet-schema';

@Component({
  selector: 'app-dynamic-sheet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-sheet.html',
  styleUrl: './dynamic-sheet.scss'
})
export class DynamicSheet implements OnChanges {
  @Input({ required: true }) schema!: SheetSchema;
  @Input({ required: true }) data!: CharacterData;
  @Output() dataChanged = new EventEmitter<Record<string, any>>();

  sheetForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schema'] || changes['data']) {
      this.buildForm();
    }
  }

  private buildForm() {
    const group: any = {};
    
    // Loop through all sections and fields to build the reactive form structure
    this.schema.sections.forEach(section => {
      section.fields.forEach(field => {
        // Find existing data or fallback to default value
        let initialValue = this.data.fieldsData ? this.data.fieldsData[field.id] : field.defaultValue;
        
        // Ensure multiselect fields have an array as initial value
        if (field.type === 'multiselect' && !Array.isArray(initialValue)) {
          initialValue = [];
        }
        
        group[field.id] = [initialValue !== undefined ? initialValue : ''];
      });
    });

    this.sheetForm = this.fb.group(group);

    // Optional: Subscribe to changes to auto-save or emit events
    this.sheetForm.valueChanges.subscribe(val => {
      this.dataChanged.emit(val);
    });
  }

  // Helper to handle grid classes dynamically based on the section layout
  getLayoutClass(layout: string): string {
    switch (layout) {
      case 'grid': return 'sheet-grid-layout';
      case 'row': return 'sheet-row-layout';
      case 'list': return 'sheet-list-layout';
      default: return 'sheet-list-layout';
    }
  }

  isItemSelected(fieldId: string, value: any): boolean {
    const currentValues = this.sheetForm.get(fieldId)?.value;
    return Array.isArray(currentValues) && currentValues.includes(value);
  }

  toggleItem(fieldId: string, value: any): void {
    const control = this.sheetForm.get(fieldId);
    if (!control) return;

    let currentValues = control.value;
    if (!Array.isArray(currentValues)) {
      currentValues = [];
    }

    if (currentValues.includes(value)) {
      currentValues = currentValues.filter((v: any) => v !== value);
    } else {
      currentValues = [...currentValues, value];
    }

    control.setValue(currentValues);
    control.markAsDirty();
  }
}
