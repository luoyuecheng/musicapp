import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PlayBarComponent } from './play-bar/play-bar.component';

import { SongService } from './play-bar/song.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    PlayBarComponent
  ],
  exports: [
    CommonModule,
    PlayBarComponent
  ],
  providers: [
    SongService
  ]
})
export class PageCommonModule { }
