
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../../shared/services/storage.service';
import { environment } from 'src/environments/environment.prod';
import { ToastService } from '../../shared/services/toast.service';
import { StorageKey } from './storage.model';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private readonly baseUr: string = `${environment.BASE_API}:8083/api/v1/`;
  private readonly baseUrl: string =  `${environment.BASE_API}:8089`;

  token: string;
  errorCode: any;
  currentUser: null;
  expire: null;
  refreshToken: string;


  constructor(
    private storageSvc: StorageService,
    private toastSvc: ToastService,
    private httpClientSvc: HttpClient,
    private router: Router  ) { }

  /**
   * signin services
   * @param username 
   * @param password 
  */
  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(environment.CLIENTID +':' + environment.CLIENTSECRET),
    });

    const body = new HttpParams()
    .set('grant_type', 'password')
    .set('username', username)
    .set('password', password);

    return this.httpClientSvc.post<any>(`${this.baseUrl}/api/v1/oauth2/token`, body, {headers});

  }

  public changePassword(id: any, body: any): Observable<any>{
    return this.httpClientSvc.put<any[]>(`${this.baseUrl}/api/v1/user/users/${id}/profile`, body);
  }
  
  /**
   * logout
  */
  public logout() {

    this.token = null;
    this.currentUser = null;
    this.expire = null;
    this.refreshToken = '';
    this.storageSvc.remove(StorageKey.AUTH_TOKEN);
    this.storageSvc.remove(StorageKey.CURRENT_USER);
    this.storageSvc.remove(StorageKey.REFRESH_TOKEN);
    this.storageSvc.remove(StorageKey.EXPIRE);
    localStorage.removeItem('currentClient');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expireTime');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('newAccount');
    window.sessionStorage.clear();
    this.router.navigate(['login']);

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
    }else if (this.errorCode === 404) {
      const message = 'Service Temporarily Unavailable';
      this.toastSvc.info(message, err.causedBy, 6000);
    }else if (this.errorCode === 500) {
      const message =
        'Service Temporarily Unavailable please contact System Administrator';
      const title = 'Connection Failure';
      this.toastSvc.info(title, message, 6000);
    }else if (this.errorCode === 504) {
      const title = 'Connection Failure';
      const message = 'Service Temporarily Unavailable';
      this.toastSvc.info(title, message, 6000);
    }
  }

  public userInfo(): any {
    return this.httpClientSvc.get<any[]>(`${this.baseUrl}/api/v1/user/user-info`)
  }

  public orgInfo(id: any): any {
    return this.httpClientSvc.get<any[]>(`${this.baseUr}organizations/${id}`)
  }

  public fetchAllUsers(): Observable<any>{
    return this.httpClientSvc.get<any[]>(`${this.baseUrl}/api/v1/user/users`);
  }

  public fetchAllRolesPermissions(): Observable<any>{
    return this.httpClientSvc.get<any[]>(`${this.baseUrl}/api/v1/roles`);
  }

  public getAllIdTypes(): Observable<any> {
    let type = "IDENTITY_TYPE";
    return this.httpClientSvc.get<any[]>(`${this.baseUr}common-config/${type}`);
  }

  public getAllAdminlevel(): Observable<any> {
    let type = "ADMINISTRATION_LEVEL";
    return this.httpClientSvc.get<any[]>(`${this.baseUr}common-config/${type}`);
  }

  public fetchAllPermissions(): Observable<any>{
    return this.httpClientSvc.get<any[]>(`${this.baseUrl}/api/v1/permissions`);
  }

  public saveRole(body: any): Observable<any>{
    return this.httpClientSvc.post<any[]>(`${this.baseUrl}/api/v1/role`, body);
  }

  public saveUser(body: any): Observable<any>{
    return this.httpClientSvc.post<any[]>(`${this.baseUrl}/api/v1/user/save/users`, body);
  }

  public saveUserRole(body: any): Observable<any>{
    return this.httpClientSvc.post<any[]>(`${this.baseUrl}/api/v1/user/userRole`, body);
  }

  public addPermissionsRole(body: any): Observable<any>{
    return this.httpClientSvc.post<any[]>(`${this.baseUrl}/api/v1/saveRolePermission`, body);
  }

  public deletePermissionsRole(body: any): Observable<any>{
    return this.httpClientSvc.put<any[]>(`${this.baseUrl}/api/v1/deletePermission`, body);
  }

  public deleteUserRole(userId: any, roleId: any): Observable<any>{
    return this.httpClientSvc.delete<any[]>(`${this.baseUrl}/api/v1/user/userRole/user/${userId}/${roleId}`);
  }

  public editRolePermission(id: any, body: any): Observable<any>{
    return this.httpClientSvc.put<any[]>(`${this.baseUrl}/api/v1/role/${id}`, body);
  }

  public editUser(id: any, body: any): Observable<any>{
    return this.httpClientSvc.put<any[]>(`${this.baseUrl}/api/v1/user/users/${id}`, body);
  }

  public deleteRolePermission(id: any, body: any): Observable<any>{
    return this.httpClientSvc.delete<any[]>(`${this.baseUrl}/api/v1/role/${id}`, body);
  }

}
