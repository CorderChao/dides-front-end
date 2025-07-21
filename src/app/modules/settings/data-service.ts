import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Injectable()
export class DataService {
    
    private subject = new Subject<any>();
    public formChoise = '';

    sendMessage(message: any) {
        this.subject.next({ text: message });
    }

    clearMessages(message: any) {
        this.subject.next({ text: message });
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

}