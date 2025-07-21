import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
interface BreadCrumbItem {
  active?: boolean;
  label?: string;
  url: string;
}
@Component({
  selector: "app-breadcrumbs",
  templateUrl: "./breadcrumbs.component.html",
  styleUrls: ["./breadcrumbs.component.scss"],
})

/**
 * Bread Crumbs Component
 */
export class BreadcrumbsComponent implements OnInit {
  @Input() title: string | undefined;
  @Input()
  breadcrumbItems!: any[];

  Item!: Array<{
    label?: string;
  }>;
  static readonly ROUTE_DATA_BREADCRUMB = "breadcrumb";

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    // Subscribe to router events to update breadcrumbs on navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });

    // Initially create breadcrumbs
    this.updateBreadcrumbs();
  }

  private updateBreadcrumbs(): void {
    const root = this.activatedRoute.root;
    const breadcrumbs = this.createBreadcrumbs(root);
    this.breadcrumbItems = breadcrumbs;
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    breadcrumbs: any[] = []
  ): any[] {
    // Get route data
    const data = route.snapshot.data;

    // Get parent and child node names and title from data
    const parentNode = data?.["parentNode"];
    const childNode = data?.["childNode"];
    const title = data?.["title"];
    this.title = data?.["title"];
    // If parent node is available and not already in breadcrumbs, add it
    if (parentNode && !breadcrumbs.some((item) => item.label === parentNode)) {
      breadcrumbs.push({ label: parentNode });
    }
    // If child node is available, add it to breadcrumbs
    if (childNode && !breadcrumbs.some((item) => item.label === childNode)) {
      breadcrumbs.push({ label: childNode, active: true }); // Mark last item as active
    }

    // If route has children, recursively process them
    const children = route.children;

    if (children.length > 0) {
      for (const child of children) {
        this.createBreadcrumbs(child, breadcrumbs);
      }
    }

    return breadcrumbs;
  }
}
