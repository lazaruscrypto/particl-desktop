import { Component, OnInit } from '@angular/core';

import { Log } from 'ng2-logger';


import { ListingService } from 'app/core/market/api/listing/listing.service';

import { FavoritesService } from 'app/core/market/api/favorites/favorites.service';
import { Listing } from 'app/core/market/api/listing/listing.model';
import { Cart } from 'app/core/market/api/cart/cart.model';
import { CountryListService } from 'app/core/market/api/countrylist/countrylist.service';

import { BidService } from 'app/core/market/api/bid/bid.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss']
})
export class BuyComponent implements OnInit {

  private log: any = Log.create('buy.component: ' + Math.floor((Math.random() * 1000) + 1));
  public selectedTab: number = 0;
  public tabLabels: Array<string> = ['cart', 'orders', 'favourites'];

  public order_sortings: Array<any> = [
    { title: 'By creation date', value: 'date-created' },
    { title: 'By update date',   value: 'date-update'  },
    { title: 'By status',        value: 'status'       },
    { title: 'By item name',     value: 'item-name'    },
    { title: 'By category',      value: 'category'     },
    { title: 'By quantity',      value: 'quantity'     },
    { title: 'By price',         value: 'price'        }
  ];

  // TODO: disable radios for 0 amount-statuses
  public order_filtering: Array<any> = [
    { title: 'All orders', value: 'all',     amount: '3' },
    { title: 'Bidding',    value: 'bidding', amount: '1' },
    { title: 'In escrow',  value: 'escrow',  amount: '0' },
    { title: 'Shipped',    value: 'shipped', amount: '1' },
    { title: 'Sold',       value: 'sold',    amount: '1' }
  ];

  // Orders
  public orders: Array<any> = [
    {
      name: 'NFC-enabled contactless payment perfume',
      hash: 'AGR', // TODO: randomized string (maybe first letters of TX ID) for quick order ID
      hash_bg: 'bg6', // TODO: assign random hash_bg (bg1-bg16)
      status: 'bidding',
      status_info: 'Waiting for seller to manually accept your bid',
      action_icon: 'part-date',
      action_button: 'Waiting for seller',
      action_tooltip: '',
      action_disabled: true,
      show_escrow_txdetails: false,
    },
    {
      name: 'Development Buff (2 week subscription)',
      hash: 'FG2', // TODO: randomized string (maybe first letters of TX ID) for quick order ID
      hash_bg: 'bg12', // TODO: assign random hash_bg (bg1-bg16)
      status: 'awaiting',
      status_info: 'Seller accepted your bid – please proceed to making the payment (this will lock the funds to escrow)',
      action_icon: 'part-check',
      action_button: 'Make payment',
      action_tooltip: 'Pay for your order & escrow',
      action_disabled: false,
      show_escrow_txdetails: false,
    },
    {
      name: 'My basic listing template',
      hash: '5EH', // TODO: randomized string (maybe first letters of TX ID) for quick order ID
      hash_bg: 'bg2', // TODO: assign random hash_bg (bg1-bg16)
      status: 'escrow',
      status_info: 'Funds locked in escrow, waiting for Seller to ship the order',
      action_icon: 'part-date',
      action_button: 'Waiting for shipping',
      action_tooltip: '',
      action_disabled: true,
      show_escrow_txdetails: true,
    },
    {
      name: 'Fresh product (2 kg)',
      hash: 'SPP', // TODO: randomized string (maybe first letters of TX ID) for quick order ID
      hash_bg: 'bg11', // TODO: assign random hash_bg (bg1-bg16)
      status: 'shipping',
      status_info: 'Order has been shipped – when you receive it, mark it as delivered and escrow will be released automatically',
      action_icon: 'part-check',
      action_button: 'Mark as delivered',
      action_tooltip: 'Confirm that you\'ve received the order',
      action_disabled: false,
      show_escrow_txdetails: true,
    },
    {
      name: 'Fresh product (2 kg)',
      hash: '1ER', // TODO: randomized string (maybe first letters of TX ID) for quick order ID
      hash_bg: 'bg8', // TODO: assign random hash_bg (bg1-bg16)
      status: 'complete',
      status_info: 'Successfully finalized order',
      action_icon: 'part-check',
      action_button: 'Order complete',
      action_tooltip: '',
      action_disabled: true,
      show_escrow_txdetails: true,
    },
  ];

  public filters: any = {
    search: undefined,
    sort:   undefined,
    status: undefined
  };

  public profile: any = { };

  /* cart */
  public cart: Cart;

  /* favs */
  public favorites: Array<Listing> = [];

  constructor(
    private listingService: ListingService,
    private favoritesService: FavoritesService,
    public countryList: CountryListService,
    private bid: BidService,

  ) { }

  ngOnInit() {
    this.favoritesService.updateListOfFavorites();
    this.getFavorites();
  }

  getFavorites() {
    this.favoritesService.getFavorites().subscribe(favorites => {
      const temp: Array<Listing> = new Array<Listing>();
      favorites.forEach(favorite => {
        this.listingService.get(favorite.listingItemId).take(1).subscribe(listing => {
          temp.push(listing);
          // little cheat here, because async behavior
          // we're setting the pointer to our new temp array every time we receive
          // a listing.
          this.favorites = temp;
        });
      });
    });
  }

  clear(): void {
    this.filters();
  }

  changeTab(index: number): void {
    this.selectedTab = index;
  }

}


