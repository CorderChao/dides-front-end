
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ToastService } from './toast.service';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private readonly baseUrl: string = `${environment.BASE_API}:8089`;

  token: string;
  errorCode: any;
  tokenExpiryTime: string;
  sessionData: Object;
  currentUser: any;


  constructor(

    private toastSvc: ToastService,
    private httpClientSvc: HttpClient,
    private router: Router,
  ) { }


  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(environment.CLIENTID + ':' + environment.CLIENTSECRET),
    });

    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', password);

    return this.httpClientSvc.post<any>(`${this.baseUrl}/api/v1/oauth2/token`, body, { headers });
  }



  public authenticatedClient() {
    this.token = localStorage.getItem('currentClient');
    this.httpClientSvc.get(`${this.baseUrl}/api/v1/user/user-info`).subscribe({
      next: (response: any) => {
        localStorage.setItem('userInfo', JSON.stringify(response));
        this.currentUser = JSON.parse(localStorage.getItem('userInfo'));
        console.log("THIS CURRENTtTTT USER", this.currentUser);
        this.toastSvc.success('Hello', 'Welcome ' + this.currentUser.firstName + ' ' + this.currentUser.middleName + ' ' + this.currentUser.lastName, 4000);
        this.router.navigate(["/dashboards"]);
      }
    });

  }
  /**
   * logout
  */
  public logout() {

  }

  public isUserloggedIn(): boolean {
    if (this.token !== null) {
      return true;
    } else {
      return false;
    }
  }

  public failedRequest(err: any): void {
    this.errorCode = err.status;
    const title = 'Access Denied';
    if (this.errorCode === 401) {
      this.toastSvc.info(title, 'Sorry, Unauthorized Access', 6000);
      localStorage.removeItem('currentClient');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expireTime');
      localStorage.removeItem('EXPIRE');
      window.sessionStorage.clear();
      this.router.navigateByUrl('/login');
    } else if (this.errorCode === 404) {
      const message = 'Service Temporarily Unavailable';
      this.toastSvc.info(message, err.causedBy, 6000);
    } else if (this.errorCode === 500) {
      const message =
        'Service Temporarily Unavailable please contact System Administrator';
      const title = 'Connection Failure';
      this.toastSvc.info(title, message, 6000);
    } else if (this.errorCode === 504) {
      const title = 'Connection Failure';
      const message = 'Service Temporarily Unavailable';
      this.toastSvc.info(title, message, 6000);
    }
  }

  clearSession() {
    this.token = '';
    this.currentUser = '';
    // this.expire = '';
    // this.refreshToken = '';
    // this.storageSvc.remove(StorageKey.AUTH_TOKEN);
    // this.storageSvc.remove(StorageKey.CURRENT_USER);
    // this.storageSvc.remove(StorageKey.REFRESH_TOKEN);
    // this.storageSvc.remove(StorageKey.EXPIRE);
    localStorage.removeItem('currentClient');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expireTime');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('newAccount');
    window.sessionStorage.clear();
  }

  public userInfo(): Observable<any> {
    const user = '';
    //localStorage.getItem('userInfo');
    return JSON.parse(user);
  }


  public fetchAllUsers(): Observable<any> {
    return this.httpClientSvc.get<any[]>(`${this.baseUrl}/api/v1/user/users`);
  }

  public resetPassword(id: any): Observable<any>{
    let payLoad = [];
    return this.httpClientSvc.post<any[]>(`${this.baseUrl}/api/v1/user/users/${id}/password`, payLoad);
  }

  public fetchUserByEmail(payload): Observable<any> {
    return this.httpClientSvc.post<any[]>(`${this.baseUrl}/api/v1/user/users/email`, payload);
  }

  public createUser(payload: any): Observable<any> {
    return this.httpClientSvc.post<any[]>(`${this.baseUrl}/api/v1/user/save/users`, payload);
  }
  public updateUser(id: any, payload: any): Observable<any> {
    return this.httpClientSvc.put<any[]>(`${this.baseUrl}/api/v1/user/users/${id}`, payload);
  }
  public createCollector(payload: any): Observable<any> {
    return this.httpClientSvc.post<any[]>(`${this.baseUrl}/api/v1/user/users/colllector`, payload);
  }
  //  public updateCollector(id, payload:any): Observable<any>{
  //     return this.httpClientSvc.post<any[]>(`${this.baseUrl}/api/v1/user/users/colllector`, payload);
  //   }
  public saveUserRole(payload: any): Observable<any> {
    return this.httpClientSvc.post<any[]>(`${this.baseUrl}/api/v1/user/userRole`, payload);
  }


  public fetchAllRolesPermissions(): Observable<any> {
    return this.httpClientSvc.get<any[]>(`${this.baseUrl}/api/v1/roles`);
  }

  public fetchAllPermissions(): Observable<any> {
    return this.httpClientSvc.get<any[]>(`${this.baseUrl}/api/v1/permissions`);
  }

  public saveRole(body: any): Observable<any> {
    return this.httpClientSvc.post<any[]>(`${this.baseUrl}/api/v1/role`, body);
  }

  public saveRolePermission(body: any): Observable<any> {
    return this.httpClientSvc.post<any[]>(`${this.baseUrl}/api/v1/rolePermission`, body);
  }

}
