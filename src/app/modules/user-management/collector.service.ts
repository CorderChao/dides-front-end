import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CollectorService {
  private readonly baseUrl: string = `${environment.BASE_API}:8090/api/v1/`;
  constructor(private httpClient: HttpClient) { }
   // CRUD for collector  //
  public assignCollectionSite(id: string, action: string, payLoad: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}collection-sites-collector/add-remove-from/collector/${id}/action/${action}`, payLoad);
  }

  public getAgentAvailableCollectionSites(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}contract/collection-site-available/${id}/agent`);
  }

  public getCollectorCollectionSite(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}collection-sites-collector/collector/${id}/collection-site`);
  }

  public getCollectionSites(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}collection-sites`);
  }

  // CRUD for location //
  public getRegion(id:string): Observable<any> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/regions/${id}`);
  }

  public getCouncil(code: string): Observable<any> {
    return this.httpClient.get<any[]>(
      `${this.baseUrl}councils/code/${code}`
    );
  }

}
