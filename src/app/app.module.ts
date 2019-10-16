import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { PageCommonModule } from './component/page.common.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SongListComponent } from './song-list/song-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SongListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PageCommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
