import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

@Injectable({ providedIn: 'root' })
export class StateStorageService {
  private previousUrlKey = 'previousUrl';
  private supplierKey = 'supplierKey';

  constructor(private $sessionStorage: SessionStorageService) { }

  storeUrl(url: string): void {
    this.$sessionStorage.store(this.previousUrlKey, url);
  }

  getUrl(): string | null | undefined {
    return this.$sessionStorage.retrieve(this.previousUrlKey);
  }

  storeSupplier(id: number): void {
    this.$sessionStorage.store(this.supplierKey, id);
  }

  getSupplier(): number | null | undefined {
    return this.$sessionStorage.retrieve(this.supplierKey);
  }

  clearUrl(): void {
    this.$sessionStorage.clear(this.previousUrlKey);
  }

  clearSupplierKey() {
    this.$sessionStorage.clear(this.supplierKey);
  }
}
