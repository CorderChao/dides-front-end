import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})

export class PublicService {
  private readonly baseUrl2: string = `${environment.BASE_API}:8084/api/v1`;
  private baseUrl: string = `${environment.BASE_API}:8089/api/v1`;
   private baseUrlSetting: string = `${environment.BASE_API}:8083/api/v1`
  private readonly baseUrlBilling: string = `${environment.BASE_API}:8082/api/v1`;
    constructor(private http: HttpClient) { }
    

    public getCouncilByRegionCode(uid: string): Observable<any> {
      return this.http.get<any[]>(`${this.baseUrlSetting}/councils/region/code/${uid}`);
    }

    public getAllPaymentPlans(): Observable<any> {
      return this.http.get<any[]>(`${this.baseUrl2}/parking-configurations/parking-payment-plan`);
    }

    searchBills(payLoad: any): Observable<any> {
      return this.http.post<any>(`${this.baseUrlBilling}/bill/search-bills?pageNum=1&pageSize=10&orderBy=id`, payLoad);
    }

    pushPayment(payLoad: any): Observable<any> {
      return this.http.post<any>(`${this.baseUrlBilling}/payment/push-payment`, payLoad);
    }

  public fetchAllRoadUtility(): Observable<any>{
    return this.http.get<any[]>(`${this.baseUrl}/road-utility`);
  }



}