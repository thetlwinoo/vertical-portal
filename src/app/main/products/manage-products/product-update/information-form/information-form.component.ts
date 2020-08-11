import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IWarrantyTypes, IProductDocuments } from '@vertical/models';
import { WarrantyTypesService } from '@vertical/services';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-information-form',
  templateUrl: './information-form.component.html',
  styleUrls: ['./information-form.component.scss']
})
export class InformationFormComponent implements OnInit, OnChanges {
  @Input() editForm: FormGroup;

  warrantytypes: IWarrantyTypes[] = [];

  get productInformationForm(): FormGroup {
    if (this.editForm) {
      return this.editForm.get('productDocument') as FormGroup;
    }
  }

  constructor(
    protected warrantyTypesService: WarrantyTypesService,
  ) { }

  ngOnInit(): void {
    this.warrantyTypesService.query().subscribe((res: HttpResponse<IWarrantyTypes[]>) => (this.warrantytypes = res.body || []));
  }

  ngOnChanges(): void {
    // if (this.editForm) {
    //   console.log('info form', this.editForm.getRawValue());
    // }
  }

  updateSingleChecked(event): void {
    console.log(event);
  }

  trackById(index: number, item: IWarrantyTypes): any {
    return item.id;
  }
}
