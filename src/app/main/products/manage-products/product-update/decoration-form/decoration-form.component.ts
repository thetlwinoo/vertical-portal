import { Component, OnInit, Input, OnChanges, AfterContentInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ISpecialFeatures, SpecialFeatures } from '@vertical/models';

@Component({
  selector: 'app-decoration-form',
  templateUrl: './decoration-form.component.html',
  styleUrls: ['./decoration-form.component.scss']
})
export class DecorationFormComponent implements OnInit, OnChanges {
  @Input() editForm: FormGroup;
  @Input() specialFeatures: ISpecialFeatures[];

  get decorationForm(): FormGroup {
    if (this.editForm) {
      return this.editForm.get('productDocument') as FormGroup;
    }
  }

  editCache: { [key: string]: { edit: boolean; data: ISpecialFeatures } } = {};
  listData: ISpecialFeatures[] = [];

  constructor() { }

  ngOnInit(): void {
    this.updateEditCache();
  }

  ngOnChanges(): void {
    if (this.specialFeatures.length > 0) {
      this.listData = this.specialFeatures;
      this.updateEditCache();
    }
  }

  onClearLongDescription(event): void {
    this.decorationForm.patchValue({
      longDescription: null,
    });
  }

  onClearHighlights(event): void {
    this.decorationForm.patchValue({
      highlights: null,
    });
  }

  onClearWhatInTheBox(event): void {
    this.decorationForm.patchValue({
      whatInTheBox: null,
    });
  }

  onClearSpecialFeatures(event): void {
    this.decorationForm.patchValue({
      specialFeatures: null,
    });
  }

  addNewSpecialFeatures(): void {
    const newFeature = new SpecialFeatures();
    this.listData = [
      ...this.listData,
      newFeature
    ];
    this.updateEditCache(newFeature.id);
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.listData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listData[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.listData.findIndex(item => item.id === id);
    Object.assign(this.listData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
    this.decorationForm.patchValue({ specialFeatures: JSON.stringify(this.listData) });
  }

  updateEditCache(id?: string): void {
    this.listData.forEach(item => {
      this.editCache[item.id] = {
        edit: item.id === id ? true : false,
        data: { ...item }
      };
    });
  }
}
