import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private readonly baseUrl: string = `${environment.BASE_API}:8090/api/v1/`;

  constructor(private httpClient: HttpClient) { }
   // CRUD for devices  //
  public getDevices(agentUUID: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}devices/agent/${agentUUID}`);
  }

  updateDevice(id: string, payLoad: any) {
    return this.httpClient.put<any>(`${this.baseUrl}devices/${id}`, payLoad);
  }

}
