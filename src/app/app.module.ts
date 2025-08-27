import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { LayoutsModule } from "./pages/layouts/layouts.module";
// search module
import { NgPipesModule } from "ngx-pipes";
import { NgHttpLoaderModule } from 'ng-http-loader';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
// Auth
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
  HttpClientXsrfModule,
} from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";


// Language
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

// Store
import { rootReducer } from "./pages/store";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { PagesModule } from "./pages/pages.module";
import { environment } from "src/environments/environment.prod";
import { ToastrModule } from "ngx-toastr";
import { DataService } from "./modules/settings/data-service";

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}



@NgModule({
  declarations: [AppComponent],
  imports: [
    ToastrModule.forRoot(
       { positionClass: 'toast-top-full-width'}
    ),
    NgHttpLoaderModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: "en",
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN', 
      headerName: 'X-XSRF-TOKEN',
    }),
    BrowserModule,
    AppRoutingModule,
    LayoutsModule,
    StoreModule.forRoot(rootReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    PagesModule,
    NgPipesModule,
  ],

  providers: [
    DataService,
    //{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
