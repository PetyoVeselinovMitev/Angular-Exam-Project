import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';
import { CatalogComponent } from './catalog/catalog.component';
import { DetailsComponent } from './details/details.component';
import { AddBookComponent } from './add-book/add-book.component';
import { EditBookComponent } from './edit-book/edit-book.component';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'register', component: RegisterComponent},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    {path: 'about', component: AboutComponent},
    {path: 'catalog', component: CatalogComponent},
    {path: 'book-details/:id', component: DetailsComponent},
    {path: 'catalog/add-book', component: AddBookComponent, canActivate: [AdminGuard]},
    {path: 'catalog/edit-book/:id', component: EditBookComponent, canActivate: [AdminGuard]},
    {path: '**', redirectTo: 'home'}
];
