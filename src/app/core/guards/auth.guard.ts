import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
    constructor(
        private router: Router,
    ) { }

    canActivate(): boolean {
        const token = JSON.parse(localStorage.getItem("currentClient"));
        if (token) {
          return true;
        } else {
        //  this.router.navigate(['/home']); // Navigate to login page if not authenticated
          return true;
        }
      }

      }

