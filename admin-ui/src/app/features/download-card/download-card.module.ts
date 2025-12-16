import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadCardComponent } from './download-card/download-card.component';
import { DownloadCardRoutingModule } from './download-card-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    DownloadCardRoutingModule,
    SharedModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [DownloadCardComponent]
})
export class DownloadCardModule { }
