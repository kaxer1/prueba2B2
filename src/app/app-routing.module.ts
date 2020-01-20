import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePage} from './home/home.page';
import { MakeAppointmentPage } from './Appointment/make-appointment/make-appointment.page';
import { EditAppointmentPage } from './Appointment/edit-appointment/edit-appointment.page';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage},
  { path: 'make-appointment', component: MakeAppointmentPage },
  { path: 'edit-appointment/:id', component: EditAppointmentPage},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
