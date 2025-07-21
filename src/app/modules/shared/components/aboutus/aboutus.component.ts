
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/modules/service/common.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.scss'
})
export class AboutusComponent implements OnInit{

 aboutUs: any


  constructor(
    private router: Router, 
     private apiSvc: CommonService
) {}

ngOnInit(): void {
  this.apiSvc.getAboutUs().subscribe((response) => {
    
    if (response.code === 6000 && response.data.length !== 0) {
      this.aboutUs = response.data[0].aboutUs;
      console.log("this.aboutUs", this.aboutUs);
      
    } else if(response.code === 6000  && response.data.length === 0){
      this.aboutUs = '';
    }
});
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

