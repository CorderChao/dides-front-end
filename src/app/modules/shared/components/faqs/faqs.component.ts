import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbAccordionModule, NgbTooltipModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbCarouselModule, NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { Router, RouterModule } from "@angular/router";
import { CommonService } from 'src/app/modules/service/common.service';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbToastModule,
    ScrollToModule,
    NgbCarouselModule,
    RouterModule,
    NgbAccordionModule,
  ],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss'
})
export class FaqsComponent  implements OnInit {
  faqs: any[] = [];
  questionOne: any;

  constructor(
    private router: Router, 
    private _commonSvc: CommonService,
) {}

  ngOnInit(): void {
    this.getAllFAQs();
  }

  getAllFAQs() {
    this._commonSvc.getFAQs().subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.questionOne = response.data[0]
          let i = response.data.indexOf(this.questionOne);
          response.data.splice(i, 1);
          response.data = [...response.data];
          this.faqs = response.data;
        } 
    }});
  }
  
  toggleMenu() {
    document.getElementById("navbarSupportedContent")?.classList.toggle("show");
  }

  windowScroll() {
    const navbar = document.getElementById("navbar");
    if (
      document.body.scrollTop > 40 ||
      document.documentElement.scrollTop > 40
    ) {
      navbar?.classList.add("is-sticky");
    } else {
      navbar?.classList.remove("is-sticky");
    }

    // Top Btn Set
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      (document.getElementById("back-to-top") as HTMLElement).style.display =
        "block";
    } else {
      (document.getElementById("back-to-top") as HTMLElement).style.display =
        "none";
    }
  }

  goTo(data: any){
     this.router.navigateByUrl(data);
  }

}

