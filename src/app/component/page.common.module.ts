import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PlayBarComponent } from './play-bar/play-bar.component';

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
  ]
})
export class PageCommonModule { }
