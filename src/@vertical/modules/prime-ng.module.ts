import { NgModule } from '@angular/core';
import { EditorModule } from 'primeng/editor';
import { TableModule } from 'primeng/table';

@NgModule({
    exports: [
        EditorModule,
        TableModule
    ],
    providers: []
})
export class PrimeNgModule { }
