import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs";
import { Spinkit } from "ng-http-loader";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {

  public spinkit = Spinkit;
  public opacity: string = '0.5';


  title = "DIDES";
  constructor(
    private titleService: Title,

    private _router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.setPageTitlesFromRouters();
  }
  
  setPageTitlesFromRouters() {
    const appTitle = this.titleService.getTitle();
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child?.firstChild) {
            child = child.firstChild;
          }
          if (child?.snapshot.data["childNode"]) {
            return child.snapshot.data["childNode"];
          }

          return appTitle;
        })
      )
      .subscribe((ttl: string) => {
        const title = ttl ? `DIDES | ${ttl}` : "DIDES";

        this.titleService.setTitle(title);
      });
  }
}
