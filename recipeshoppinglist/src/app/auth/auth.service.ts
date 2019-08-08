import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new Subject<User>();
  constructor(private http: HttpClient) {}

  url =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDeNfR1AFr82C1h1eetd8-y26PPVzg7xpE';
  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.url, {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleerror),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }
  login(email: string, password: string) {
    const signInUrl =
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDeNfR1AFr82C1h1eetd8-y26PPVzg7xpE';
    return this.http
      .post<AuthResponseData>(signInUrl, {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleerror),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
  }

  private handleerror(errorres: httperrorresponse) {
    let errormessage = 'an unknown error occurred!';
    if (!errorres.error || !errorres.error.error) {
      return throwError(errormessage);
    }
    switch (errorres.error.error.message) {
      case 'email_exists':
        errormessage = 'this email exists already.';
        break;
      case 'email_not_found':
        errormessage = 'this email does not exist.';
        break;
      case 'invalid_password':
        errormessage = 'this password is not correct.';
        break;
    }
    return throwError(errormessage);
  }
}
