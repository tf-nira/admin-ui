import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DownloadCardComponent } from './download-card/download-card.component';
import { RolesGuard } from 'src/app/core/services/roles.guard';


const routes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: DownloadCardComponent, canActivate: [RolesGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadCardRoutingModule { }
