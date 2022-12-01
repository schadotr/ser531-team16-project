import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, switchMap, take, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient, public router: Router) { }

  public routeName = "";
  public token = "";

  getToken() {
    return localStorage.getItem('access_token');
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['login']);
    }
  }

  loginSubscription(userData): Observable<any> {
    let url = "http://api-gateway:3000/api/user/login";
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/json'
    });
    let options = { headers: headers };
    return this.http.post(url, userData, options).pipe(switchMap((res: any) => {
      // val = '';
      if (res.message === 'valid') {
        localStorage.setItem('access_topken', res['x-auth-token'])
        this.token = res['x-auth-token'];
        return of(res);
      }
      else {
        alert('wrong credentials');
        return throwError(() => new Error('wrong credentials'));
      }
    }));
  }

  movieRecommenderCall(userData): Observable<any> {
    debugger;
    let url = "http://api-gateway:3000/api/movie/movie-by-title";
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/json',
      "Access-Control-Allow-Credentials": "true",
      "x-auth-token": this.token
    });
    let options = { headers: headers, params: { movieTitle: userData } };
    return this.http.get(url, options).pipe(switchMap((res: any) => {
      // val = '';
      console.log('res', res)
      return of('')
      // if (res.message === 'valid') {
      //   this.token = res['x-auth-token'];
      //   return of(res);
      // }
      // else {
      //   alert('wrong credentials');
      //   return throwError(() => new Error('wrong credentials'));
      // }
    }));
  }


  // ###123123aA
  // ibatj
}
