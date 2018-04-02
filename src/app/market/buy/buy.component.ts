import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Log } from 'ng2-logger';

import { ProfileService } from 'app/core/market/api/profile/profile.service';
import { ListingService } from 'app/core/market/api/listing/listing.service';
import { CartService } from 'app/core/market/api/cart/cart.service';
import { FavoritesService } from 'app/core/market/api/favorites/favorites.service';
import { Listing } from 'app/core/market/api/listing/listing.model';
import { Cart } from 'app/core/market/api/cart/cart.model';
import { CountryListService } from 'app/core/market/api/countrylist/countrylist.service';
import { MarketService } from '../../core/market/market.service';

import { SnackbarService } from '../../core/snackbar/snackbar.service';
import { BidService } from 'app/core/market/api/bid/bid.service';
import { RpcStateService } from 'app/core/rpc/rpc-state/rpc-state.service';
import { ModalsService } from 'app/modals/modals.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss']
})
export class BuyComponent implements OnInit {

  private log: any = Log.create('buy.component: ' + Math.floor((Math.random() * 1000) + 1));
  public selectedTab: number = 0;
  public tabLabels: Array<string> = ['cart', 'orders', 'favourites'];

  /* https://material.angular.io/components/stepper/overview */
  public cartFormGroup: FormGroup;
  public shippingFormGroup: FormGroup;

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
    // 3rd party
    private formBuilder: FormBuilder,
    private router: Router,
    // core
    private snackbarService: SnackbarService,
    private rpcState: RpcStateService,
    private modals: ModalsService,
    // market
    private market: MarketService,
    private profileService: ProfileService,
    private listingService: ListingService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    public countryList: CountryListService,
    private bid: BidService,

  ) { }

  ngOnInit() {
    this.formBuild();

    this.getProfile();

    this.getCart();

    this.favoritesService.updateListOfFavorites();
    this.getFavorites();
  }

  formBuild() {
    this.cartFormGroup = this.formBuilder.group({
      firstCtrl: ['']
    });

    this.shippingFormGroup = this.formBuilder.group({
      firstName:    ['', Validators.required],
      lastName:     ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city:         ['', Validators.required],
      state:        [''],
      country:      ['', Validators.required],
      zipCode:      ['', Validators.required]
    });
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

  /* cart */

  goToListings(): void {
    this.router.navigate(['/market/overview']);
  }

  removeFromCart(shoppingCartId: number): void {
    this.cartService.removeItem(shoppingCartId).take(1)
      .subscribe(res => this.getCart());
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(res => this.getCart());
  }

  getCart(): void {
    this.cartService.getCart().take(1).subscribe(cart => {
      this.cart = cart;
    });
  }

  /* shipping */

  updateShippingAddress(): void {
    if (!this.profile) {
      this.snackbarService.open('Profile was not fetched!');
      return;
    }

    let upsert: Function = this.profileService.updateShippingAddress.bind(this);

    if (this.profile.ShippingAddresses.length === 0) {
      upsert = this.profileService.addShippingAddress.bind(this);
    }
    console.log(this.shippingFormGroup.value);
    upsert(this.shippingFormGroup.value).take(1).subscribe(address => {
      this.getProfile();
    });

  }

  getProfile(): void{
    this.profileService.get(1).take(1).subscribe(
      profile => {
        this.profile = profile;
        console.log('--- profile address ----');
        console.log(profile);
        const addresses = profile.ShippingAddresses;
        if (addresses.length > 0) {
          this.shippingFormGroup.patchValue(addresses[0]);
        }
      });
  }

  valueOf(field: string) {
    if(this.shippingFormGroup) {
      return this.shippingFormGroup.get(field).value;
    }
    return '';
  }

  placeOrder() {
    if (this.rpcState.get('locked')) {
      // unlock wallet and send transaction
      this.modals.open('unlock', {forceOpen: true, timeout: 30, callback: this.bidOrder.bind(this)});
    } else {
      // wallet already unlocked
      this.bidOrder();
    }
  }

  bidOrder() {
    this.bid.order(this.cart, this.profile).subscribe((res) => {
      this.snackbarService.open('Order has been successfully placed');
      this.changeTab(1);
    }, (error) => {
      this.log.d(`Error while placing an order`);
    });
  }

}


