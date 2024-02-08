import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { SplitCardComponent } from './components/split-card/split-card.component';
import { AdventureComponent } from './components/adventure/adventure.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    SplitCardComponent,
    AdventureComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
