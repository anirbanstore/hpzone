import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'hpz-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
  @Input() loadingText = 'Loading';
}
