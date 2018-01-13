import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/*
 * Changes the case of the first letter of a given number of words in a string.
*/

@Pipe({ name: 'timeFromNow' })
export class TimeFromNow implements PipeTransform {
  transform(date: string): string {
    const localDate = moment(date).local(); // UTC to Locan Time Zone.
    return moment(localDate).fromNow(); // Convert to time ago format.
  }
}
