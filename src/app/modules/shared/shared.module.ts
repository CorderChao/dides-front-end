import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { NgxSliderModule } from "ngx-slider-v2";
import { IConfig, NgxMaskDirective, NgxMaskPipe } from "ngx-mask";
import { ColorPickerModule } from "ngx-color-picker";
import { UiSwitchModule } from "ngx-ui-switch";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NgbNavModule,
  NgbAccordionModule,
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbToastModule,
  NgbPaginationModule,
  NgbTypeaheadModule,
  NgbTooltipModule,
  NgbAlertModule,
  NgbCarouselModule,
  NgbModalModule,
  NgbPopoverModule,
  NgbCollapseModule,
} from "@ng-bootstrap/ng-bootstrap";
import {QRCodeModule} from "angularx-qrcode";

// Swiper Slider
import { SlickCarouselModule } from "ngx-slick-carousel";

// Counter
import { CountUpModule } from "ngx-countup";

import { ClientLogoComponent } from "./components/landing/index/client-logo/client-logo.component";
import { ServicesComponent } from "./components/landing/index/services/services.component";
import { CollectionComponent } from "./components/landing/index/collection/collection.component";
import { CtaComponent } from "./components/landing/index/cta/cta.component";
import { DesignedComponent } from "./components/landing/index/designed/designed.component";
import { PlanComponent } from "./components/landing/index/plan/plan.component";
import { FaqsComponent } from "./components/landing/index/faqs/faqs.component";
import { ReviewComponent } from "./components/landing/index/review/review.component";
import { CounterComponent } from "./components/landing/index/counter/counter.component";
import { WorkProcessComponent } from "./components/landing/index/work-process/work-process.component";
import { TeamComponent } from "./components/landing/index/team/team.component";
import { ContactComponent } from "./components/landing/index/contact/contact.component";
// import { FooterComponent } from "./components/landing/index/footer/footer.component";
import { ScrollspyDirective } from "./scrollspy.directive";
import { LandingScrollspyDirective } from "./landingscrollspy.directive";

// NFT Landing
import { MarketPlaceComponent } from "./components/landing/nft/market-place/market-place.component";
import { WalletComponent } from "./components/landing/nft/wallet/wallet.component";
import { FeaturesComponent } from "./components/landing/nft/features/features.component";
import { CategoriesComponent } from "./components/landing/nft/categories/categories.component";
import { DiscoverComponent } from "./components/landing/nft/discover/discover.component";
import { TopCreatorComponent } from "./components/landing/nft/top-creator/top-creator.component";

// Job Landing
import { ProcessComponent } from "./components/landing/job/process/process.component";
import { FindjobsComponent } from "./components/landing/job/findjobs/findjobs.component";
import { CandidatesComponent } from "./components/landing/job/candidates/candidates.component";
import { BlogComponent } from "./components/landing/job/blog/blog.component";
import { JobcategoriesComponent } from "./components/landing/job/jobcategories/jobcategories.component";
import { JobFooterComponent } from "./components/landing/job/job-footer/job-footer.component";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { DataTableComponent } from "./components/data-table/data-table.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { FlatpickrModule } from "angularx-flatpickr";
import { NgApexchartsModule } from "ng-apexcharts";
import { LightboxModule } from "ngx-lightbox";
import { SimplebarAngularModule } from "simplebar-angular";
import { WidgetModule } from "./components/widget/widget.module";
import { NgPipesModule } from "ngx-pipes";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { NgStepperModule } from "angular-ng-stepper";
import { TabsComponent } from './components/tabs/tabs.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from "@angular/material/card";
import { MatStepperModule} from '@angular/material/stepper';
import {MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule} from '@angular/material/select';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatListModule} from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import { MatMenuModule} from '@angular/material/menu';
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { RouterModule } from "@angular/router";
import { ApplicationsFormsComponent } from './components/applications-forms/applications-forms.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { TermsComponent } from './components/terms/terms.component';
import { AboutusComponent } from "./components/aboutus/aboutus.component";
import { SafePipe } from "src/assets/safe.pipe";
import { OnlineApplicationComponent } from './components/online-application/online-application.component';


const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    SafePipe,
    AboutusComponent,
    ClientLogoComponent,
    ServicesComponent,
    CollectionComponent,
    CtaComponent,
    DesignedComponent,
    PlanComponent,
    FaqsComponent,
    ReviewComponent,
    CounterComponent,
    WorkProcessComponent,
    TeamComponent,
    ContactComponent,
    MarketPlaceComponent,
    WalletComponent,
    FeaturesComponent,
    CategoriesComponent,
    DiscoverComponent,
    TopCreatorComponent,
    ProcessComponent,
    FindjobsComponent,
    CandidatesComponent,
    BlogComponent,
    JobcategoriesComponent,
    JobFooterComponent,
    ScrollspyDirective,
    LandingScrollspyDirective,
    DataTableComponent,
    TabsComponent,
    PageNotFoundComponent,
    ApplicationsFormsComponent,
    TermsComponent,
    OnlineApplicationComponent
  ],
  imports: [
    MatStepperModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatMenuModule,
    MatRadioModule,
    MatInputModule,
   MatCheckboxModule,

    RouterModule,
    CommonModule,
    NgbNavModule,
    MatFormFieldModule,
    NgbAccordionModule,
    NgbDropdownModule,
    SlickCarouselModule,
    CountUpModule,
    FormsModule,
    NgbToastModule,
    NgbProgressbarModule,
    FlatpickrModule.forRoot(),
    NgApexchartsModule,
    LeafletModule,
    // SimplebarAngularModule,
    WidgetModule,
    LightboxModule,
    NgPipesModule,
    NgbPaginationModule,
    ScrollToModule.forRoot(),
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    CommonModule,
    UiSwitchModule,
    FlatpickrModule,
    ColorPickerModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxSliderModule,
    CdkStepperModule,
    NgStepperModule,
    CKEditorModule,
    AutocompleteLibModule,
    DropzoneModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    NgbAlertModule,
    NgbCarouselModule,
    // NgbDropdownModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbPaginationModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbToastModule,
    NgStepperModule,
    QRCodeModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatStepperModule,
    MatDialogModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatListModule,
    MatInputModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatMenuModule,
    MatRadioModule,

    RouterModule,
    NgbTooltipModule,
    NgSelectModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    ClientLogoComponent,
    ServicesComponent,
    CollectionComponent,
    CtaComponent,
    DesignedComponent,
    PlanComponent,
    FaqsComponent,
    ReviewComponent,
    CounterComponent,
    WorkProcessComponent,
    TeamComponent,
    ContactComponent,
    WalletComponent,
    MarketPlaceComponent,
    FeaturesComponent,
    CategoriesComponent,
    DiscoverComponent,
    TopCreatorComponent,
    ScrollspyDirective,
    LandingScrollspyDirective,
    ProcessComponent,
    FindjobsComponent,
    CandidatesComponent,
    BlogComponent,
    JobcategoriesComponent,
    JobFooterComponent,
    DataTableComponent,

    NgbAlertModule,
    NgbCarouselModule,
    // NgbDropdownModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbPaginationModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbToastModule,
    SimplebarAngularModule,
    QRCodeModule
  ],
})
export class SharedModule {}
