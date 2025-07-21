import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgbDropdownModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { SimplebarAngularModule } from "simplebar-angular";
import { TranslateModule } from "@ngx-translate/core";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";

// Component pages
import { LayoutComponent } from "./layout.component";
import { TopbarComponent } from "./topbar/topbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { RightsidebarComponent } from "./rightsidebar/rightsidebar.component";
import { HorizontalComponent } from "./horizontal/horizontal.component";
import { HorizontalTopbarComponent } from "./horizontal-topbar/horizontal-topbar.component";
import { TwoColumnComponent } from "./two-column/two-column.component";
import { TwoColumnSidebarComponent } from "./two-column-sidebar/two-column-sidebar.component";
import { LanguageService } from "src/app/core/services/language.service";
import { VerticalComponent } from "./vertical/vertical.component";
import { FooterComponent } from "./footer/footer.component";
import { SharedModule } from "src/app/modules/shared/shared.module";
import { BreadcrumbsComponent } from "src/app/modules/shared/components/breadcrumbs/breadcrumbs.component";

@NgModule({
  declarations: [
    LayoutComponent,
    VerticalComponent,
    TopbarComponent,
    SidebarComponent,
    // FooterComponent,
    RightsidebarComponent,
    HorizontalComponent,
    HorizontalTopbarComponent,
    TwoColumnComponent,
    TwoColumnSidebarComponent,
    FooterComponent,
    BreadcrumbsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    TranslateModule,
    NgbCollapseModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],

  providers: [LanguageService],
})
export class LayoutsModule {}
