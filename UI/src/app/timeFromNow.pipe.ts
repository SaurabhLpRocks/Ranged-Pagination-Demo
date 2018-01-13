import * as moment from 'moment';

import { Pipe, PipeTransform } from '@angular/core';

/*
 * Changes the case of the first letter of a given number of words in a string.
*/

@Pipe({ name: 'timeFromNow' })
export class TimeFromNow implements PipeTransform {
  transform(date: string): string {
    const localDate = moment(date).local(); // UTC to Local Time Zone.
    return moment(localDate).fromNow(); // Convert to time ago format.
  }
}
