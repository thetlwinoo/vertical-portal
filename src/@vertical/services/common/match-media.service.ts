import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RootMatchMediaService {
  activeMediaQuery: string;
  onMediaChange: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private mediaObserver: MediaObserver) {
    this.activeMediaQuery = '';

    this._init();
  }

  private _init(): void {
    // tslint:disable-next-line: deprecation
    this.mediaObserver.media$.pipe(debounceTime(500), distinctUntilChanged()).subscribe((change: MediaChange) => {
      if (this.activeMediaQuery !== change.mqAlias) {
        this.activeMediaQuery = change.mqAlias;
        this.onMediaChange.next(change.mqAlias);
      }
    });
  }
}
