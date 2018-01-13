import { DataTableModule, DropdownModule, PaginatorModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BusyModule } from 'angular2-busy';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { TimeFromNow } from './timeFromNow.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TimeFromNow
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    BusyModule,
    DataTableModule,
    DropdownModule,
    PaginatorModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
