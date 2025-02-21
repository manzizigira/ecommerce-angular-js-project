import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  carItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  
  //storage: Storage = sessionStorage;
  storage: Storage = localStorage;

  constructor() {

    // read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data != null) {
      this.carItems = data;

      // compute totals based on the data that is read from storage
      this.computeCartTotals();
    }
   }

  addToCart(theCartItem: CartItem){

    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if(this.carItems.length>0){
      // find the item in the cart based on item id

      existingCartItem = this.carItems.find(tempCartItem  => tempCartItem.id === theCartItem.id);

      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart && existingCartItem) {
      // increment the quantity
      existingCartItem.quantity++;
    } else {
      // just add the item to the array
      this.carItems.push(theCartItem);
    }
  
    // compute cart total price and total quantity
    this.computeCartTotals();
  }
  computeCartTotals(){
    let totalPriceValue: number = 0;
    let totalQuantityValue: number =0;

    for(let currentCartItem of this.carItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);

    // persist cart data
    this.persistCartItems();
    
  }


  persistCartItems()  {
    this.storage.setItem('cartItems', JSON.stringify(this.carItems));
  }
  
  
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for (let tempCartItem of this.carItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity === 0 ) {
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    
    // get index of item in the array
    const itemIndex = this.carItems.findIndex(
      tempCartItem => tempCartItem.id == theCartItem.id);
    
    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
    this.carItems.splice(itemIndex, 1);

    this.computeCartTotals();
    }
  }
}