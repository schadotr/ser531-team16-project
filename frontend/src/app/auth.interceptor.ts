import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from './services/common.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private http: HttpClient, public router: Router, private commonService: CommonService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.commonService.getToken();
    request = request.clone({
      setHeaders: {
        Authorization: "Bearer " + authToken
      }
    });
    return next.handle(request);
  }
}
