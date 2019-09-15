import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

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
  user = new BehaviorSubject<User>(null);

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

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

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration)
    }
  }
  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
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
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleerror(errors: HttpErrorResponse) {
    let errormessage = 'an unknown error occurred!';
    if (!errors.error || !errors.error.error) {
      return throwError(errormessage);
    }
    switch (errors.error.error.message) {
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
