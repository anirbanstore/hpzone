import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SwUpdate } from '@angular/service-worker';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { AppState, getProvider, isLoading } from './state/app.reducer';

@Component({
  selector: 'hpz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  showLoading$: Observable<boolean>;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private update: SwUpdate,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.showLoading$ = this.store.select(isLoading);
    this.showLoading$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (loading: boolean) => {}
    });
    this.update.available.pipe(takeUntil(this.destroy$)).subscribe({
      next: () =>
        this.update.activateUpdate().then(() => document.location.reload())
    });
    this.store
      .select(getProvider)
      .pipe(
        takeUntil(this.destroy$),
        map((provider: string) =>
          this.titleService.setTitle(`${!!provider ? provider : 'Gas'} Zone`)
        )
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
