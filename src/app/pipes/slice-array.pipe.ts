import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sliceArray',
  pure: true // Ensures better performance by preventing unnecessary re-executions

})
export class SliceArrayPipe implements PipeTransform {

  transform<T>(array: T[], start: number = 0, end?: number): T[] {
    return array ? array.slice(start, end) : [];
  }

}
