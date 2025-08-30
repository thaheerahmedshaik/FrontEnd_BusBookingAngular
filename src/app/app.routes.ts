import { Routes } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { BookTicketsComponent } from './pages/book-tickets/book-tickets.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { PaymentDetailsComponent } from './pages/payment-details/payment-details.component';
import { CustomerDataComponent } from './pages/customer-data/customer-data.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    {
        path:"",
        redirectTo:"search",
        pathMatch:"full"
    },
    {
        path:"search",
        component:SearchComponent
    },
    {
        path:"search-results",
        component:SearchResultsComponent
    },
    {
        path:"book-tickets",
        component:BookTicketsComponent
    },
    {
        path:"my-bookings",
        component:MyBookingsComponent
    },
    {
        path:"payment-details",
        component:PaymentDetailsComponent
    },
     {
        path:"customer-data",
        component:CustomerDataComponent
     },
{ path: 'login', component: LoginComponent }, 

];
