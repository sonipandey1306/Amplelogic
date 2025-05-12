import { Routes } from '@angular/router';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UsersComponent } from './pages/users/users.component';

export const routes: Routes = [
    {path:'', component:UserManagementComponent},
    {path:'dashboard', component:DashboardComponent},
    {path:'user', component:UsersComponent},
    {path:'settings', component:SettingsComponent},
];
