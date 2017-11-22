import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MdButtonModule, MdCardModule, MdCheckboxModule, MdExpansionModule, MdGridListModule, MdIconModule, MdListModule,
  MdMenuModule,
  MdProgressBarModule,
  MdSidenavModule,
  MdSnackBarModule, MdTabsModule, MdToolbarModule, MdRadioModule, MdInputModule,
  MdTooltipModule,
  MdSelectModule
} from '@angular/material';


import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* A unified module that will simply manage all our Material imports (and export them again) */

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule, /* Flex layout here too */
    FormsModule, /* forms */
    ReactiveFormsModule, /* forms */
    MdButtonModule,
    MdCheckboxModule,
    MdListModule,
    MdExpansionModule,
    MdTooltipModule,
    MdTabsModule,
    MdSnackBarModule,
    MdMenuModule,
    MdProgressBarModule,
    MdIconModule,
    MdSidenavModule,
    MdGridListModule,
    MdCardModule,
    MdToolbarModule,
    MdRadioModule,
    MdSelectModule,
    MdInputModule,
  ],
  exports: [
    FlexLayoutModule, /* Flex layout here too */
    FormsModule, /* forms */
    ReactiveFormsModule, /* forms */
    MdButtonModule,
    MdCheckboxModule,
    MdListModule,
    MdExpansionModule,
    MdTooltipModule,
    MdTabsModule,
    MdSnackBarModule,
    MdMenuModule,
    MdProgressBarModule,
    MdIconModule,
    MdSidenavModule,
    MdGridListModule,
    MdCardModule,
    MdToolbarModule,
    MdRadioModule,
    MdSelectModule,
    MdInputModule,
  ],
  declarations: []
})
export class MaterialModule { }