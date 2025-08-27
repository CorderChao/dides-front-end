import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LayoutComponent } from "./pages/layouts/layout.component";

// Auth
import { AuthGuard } from "./core/guards/auth.guard";
import { AboutusComponent } from "./modules/shared/components/aboutus/aboutus.component";
import { HomepageComponent } from "./modules/shared/components/homepage/homepage.component";
import { FaqsComponent } from "./modules/shared/components/faqs/faqs.component";
import { PageNotFoundComponent } from "./modules/shared/components/page-not-found/page-not-found.component";
import { ApplicantLandingComponent } from "./modules/shared/components/applicant-landing/applicant-landing.component";
import { OnlineApplicationComponent } from "./modules/shared/components/online-application/online-application.component";
import { LoginComponent } from "./modules/user-management/view/login/login.component";

const routes: Routes = [
    {path: "", component: HomepageComponent}, 
    {path: "home", component: HomepageComponent}, 
    { path: "faqs", component: FaqsComponent },
    { path: "aboutus", component: AboutusComponent },
   { path: "login", component: LoginComponent },
    { path: "online-application", component: OnlineApplicationComponent },
    { path: "inbox", 
      component: ApplicantLandingComponent,
      canActivate: [AuthGuard],
    },
    {
      path: "dashboards",
      data: {
        parentNode: "Dashboard",
        childNode: "Dashboards",
        title: "Dashboards",
        active: true,
      },
      component: LayoutComponent,
      loadChildren: () =>
        import("../app/modules/dashboards/dashboards.module").then((m) => m.DashboardsModule),
        canActivate: [AuthGuard],
    },


  {
    path: "reports",
    component: LayoutComponent,
    data: { 
      parentNode: "Reports",
      childNode: "Reports List",
      title: "Reports",
      active: true,
    },
    loadChildren: () =>
      import("./modules/reports/reports.module").then((m) => m.ReportsModule),
    canActivate: [AuthGuard],
  },

  { path: '**', component: PageNotFoundComponent },  // Wildcard 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
