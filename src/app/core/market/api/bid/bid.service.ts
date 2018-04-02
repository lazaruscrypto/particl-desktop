import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Log } from 'ng2-logger';

import { MarketService } from 'app/core/market/market.service';

import { Cart } from 'app/core/market/api/cart/cart.model';
import { Listing } from 'app/core/market/api/listing/listing.model';


@Injectable()
export class BidService {

  private log: any = Log.create('cart.service id:' + Math.floor((Math.random() * 1000) + 1));

  constructor(private market: MarketService) {
  }

  order(cart: Cart, profile: any): Observable<boolean> {
    let nBidsPlaced = 0;
    const addressIdOfProfile: number = profile.ShippingAddresses[0].id;

    return new Observable((observer) => {
      cart.listings.forEach((listing: Listing) => {
        if (listing.hash) {
          // bid for item
          this.market.call('bid', ['send', listing.hash, addressIdOfProfile])
            .subscribe(
              (res) => {
                this.log.d(`Bid placed for hash=${listing.hash} shipping to addressId=${addressIdOfProfile}`);
                if (++nBidsPlaced === cart.listings.length) {
                  observer.next(true);
                  observer.complete();
                }
              },
              (failed) => {
                observer.error(false);
              });
        }
      });
    });
  }
}
