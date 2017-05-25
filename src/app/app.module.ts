import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { BsDropdownModule, CollapseModule, PaginationModule } from 'ngx-bootstrap';

import { SidebarModule } from './core/sidebar/sidebar.module';
import { AccordionModule } from './core/accordion/accordion.module';

import { AppComponent } from './app.component';

import { WindowService } from './core/window.service';

import { HeaderComponent } from './core/header/header.component';
import { StatusComponent } from './core/status/status.component';
import { OverviewComponent } from './overview/overview.component';

import { WalletModule } from './wallet/wallet.module';

const routes: Routes = [
  { path: 'overview', component: OverviewComponent, data: { title: 'Overview' } },
  { path: '**', redirectTo: 'overview', pathMatch: 'full' } // Catch all route
];

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    HeaderComponent,
    StatusComponent
  ],
  imports: [
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    SidebarModule.forRoot(),
    AccordionModule,
    WalletModule.forRoot()
  ],
  providers: [
    WindowService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
