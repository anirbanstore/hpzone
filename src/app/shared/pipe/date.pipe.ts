import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'hpzdatetransform'
})
export class HPDatePipe implements PipeTransform {
  transform(value: number) {
    if (value !== undefined) {
      return new Date(value);
    }
    return value;
  }
}
