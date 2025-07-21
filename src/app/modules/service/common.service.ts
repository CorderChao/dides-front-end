import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private readonly baseUrl: string = `${environment.BASE_API}:8083/api/v1`;
  private readonly baseUrl1: string = `${environment.BASE_API}:8088/api/v1`;
  private readonly baseUrl2: string = `${environment.BASE_API}:8089/api/v1`;
  private readonly baseUrl5: string = `${environment.BASE_API}:8086/api/v1`;
//  private readonly baseUrl4: string = `${environment.BASE_API}:8088/api/v1`;
  private readonly baseUrl3: string = `${environment.BASE_API}:8082/api/v1`;

  constructor(private http: HttpClient) {}

//

public getFAQs(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/faqs/list-faqs`);
}

public getAboutUs(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/about-us/list-about-us`);
}

// CRUD for regions //
public getAllRegions(): Observable<any> {
  return this.http.get<any[]>(`${this.baseUrl}/regions`);
}

// CRUD for councils //
public getCouncilByRegionCode(uid: string): Observable<any> {
  return this.http.get<any[]>(`${this.baseUrl}/councils/region/code/${uid}`);
}



public getComConfigTpyes(type:any): Observable<any> {
  return this.http.get<any[]>(`${this.baseUrl}/common-config/${type}`);
}

public getAllAgents(id:any): Observable<any> {
  return this.http.get<any[]>(`${this.baseUrl}/organizations/type/${id}`);
}

public getAllIdTypes(): Observable<any> {
  let type = "IDENTITY_TYPE";
  return this.http.get<any[]>(`${this.baseUrl}/common-config/${type}`);
}

public getAllAdminlevel(): Observable<any> {
  let type = "ADMINISTRATION_LEVEL";
  return this.http.get<any[]>(`${this.baseUrl}/common-config/${type}`);
}

public getAllApplicantTypes(): Observable<any> {
  let type = "APPLICANT_TYPE";
  return this.http.get<any[]>(`${this.baseUrl}/common-config/${type}`);
}
public getAgentCollectors(userType:any, OrgId:any): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl2}/user/users/${userType}/${OrgId}`);
  }

public getUserById(userId:any): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl2}/user/users/${userId}`);
  }
public getAllAgentCollectors(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl2}/user/users/colllector`);
  }

public getAllAgentsEmployee(id:any): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl2}/user/agent-employees/${id}`);
  }
  public saveApplicant(payload:any): Observable<any>{
    return this.http.post<any[]>(`${this.baseUrl2}/user/save/applicant`, payload);
  }
public getWardByCouncilCode(id:any): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/wards/council/uuid/${id}`);
  }
public getStreetByWardCode(id:any): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/streets/ward/${id}`);
  }
public fetchAllOrganizations(id:any): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/organizations/type/${id}`);
  }
  public getSources(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/source`);
  }
  public getSourcesByOrganization(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/source/organization/${id}`);
  }

  public getSubSourcesOrganization(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}sub-source/organization/${id}`);
  }
  public getSubSourcesBySource(id:any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/sub-source/source/${id}`);
  }

  public getSubSourcesByUuid(id:any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/sub-source/${id}`);
  }

 public saveApplication(payload:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl1}/application`, payload);
  }

 public renewApplication(applicationId:any, payload:any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl1}/renewal/application/{applicationUuid}?uuid=${applicationId}`, payload);
  }

 public rollbackApplication(applicationId:any, payload:any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl1}/rollback/application/{applicationUuid}?uuid=${applicationId}`, payload);
  }
  public getItemBySubSource(id:any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/item/sub-source/${id}`);
  }
 public getApplicationsByApplicantId(id:any):Observable<any>{
return this.http.get<any>(`${this.baseUrl1}/application/applicant/${id}`)
}
public getPaymentPlans(): Observable<any> {
  let type = "PAYMENT_PLAN";
  return this.http.get<any[]>(`${this.baseUrl}/common-config/${type}`);
}

  public searchBillById(id: any): Observable<any> {
  return this.http.get<any>(`${this.baseUrl3}/bill/uuid/${id}`);
 }
  public getPaymentPlanBySubSourceOrganization(subSourceId:any, organizationId:any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/item-price/sub-source/${subSourceId}/organization/${organizationId}`);
  }

public getAllRoads(): Observable<any> {
  return this.http.get<any[]>(`${this.baseUrl1}/road`);
}

public getPermitReport(id: any): Observable<Blob> {
  let url = `${this.baseUrl5}/application-report/permit/${id}`
   const options = { responseType: 'blob' as 'json' };
   return this.http.get<Blob>(url, options).pipe(map(res => new Blob([res], { type: 'application/pdf' })));
 }


 public getPaymentByReceipt(payload:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl3}/payment/search-payments?pageNum=1&pageSize=10&orderBy=id&direction=ASC`, payload);
  }
}