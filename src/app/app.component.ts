import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ProductCategoryMenuComponent, SearchComponent, CartStatusComponent, RouterModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-ecommerce';
}
