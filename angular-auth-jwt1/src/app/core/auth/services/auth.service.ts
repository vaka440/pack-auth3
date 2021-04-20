import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ICurrentUser } from '../models/i-current-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

export interface AuthenticationPayload {
  status: string,
  data: {
    user: {
      email: string
      role: Array<string>
    }
    payload: {
      type: string
      token: string
      refresh_token?: string
    }
  }
}

export interface Data {         // à la connexion et à l'enregistrement, l'api retourne ces 2 champs :
  username: string;
  access_token: string;
  roles: Array<string>;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<ICurrentUser>({} as ICurrentUser);
  private currentUser$: Observable<ICurrentUser>;

  constructor(private http: HttpClient) {
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): ICurrentUser {                 // récupère directement la valeur contenu dans le sujet
    return this.currentUserSubject.getValue();
  }

  getCurrentUserSubject(): BehaviorSubject<ICurrentUser> {      // currentUserSubject est private donc il faut une fonction pour le retourner à qui le demande
    return this.currentUserSubject;
  }

  getCurrentUserObs(): Observable<ICurrentUser> {               // la partie Observable de currentUserSubject
    return this.currentUser$;
  }

  login(email: string, password: string): Observable<ICurrentUser> {
    return this.http
      .post<AuthenticationPayload>(
        `${environment.urlApi}/${environment.pathAuth}/login`,  // environnement est soit celui en PROD ou en DEV, voir : /src/environnements
        { email, password },
        httpOptions
      )
      .pipe(                            // pipe : pour indiquer que l'on va utiliser une série de traitement
        map((payload: AuthenticationPayload) => {
          return {
            email: payload.data.user.email,
            roles: payload.data.user.role,
            token: payload.data.payload.token,
            refresh_token: payload.data.payload.refresh_token,
            isLogged: true,
          } as ICurrentUser;
        }),
        catchError(this.handleError)    // intercepte une éventuelle erreur et la renvoit dans la méthode :  handleError afin qu'elle y soit géré
                                        // (pour déporter et factoriser la gestion d'erreur)
      );
  }

  register(email: string, password: string): Observable<ICurrentUser> {
    return this.http
      .post<AuthenticationPayload>(
        `${environment.urlApi}/${environment.pathAuth}/register`,
        { 'email': email, 'password': password },
        httpOptions
      ).pipe(map((payload: AuthenticationPayload) => {
        return {
          email: payload.data.user.email,
          roles: payload.data.user.role,
          token: payload.data.payload.token,
          refresh_token: payload.data.payload.refresh_token,
          isLogged: true,
        } as ICurrentUser;
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    const user = {} as ICurrentUser;        // un currentUser vide
    this.updateAndEmitCurrentUser(user);             // on enregistre et informe qu'une déconnexion à eu lieu
  }

  isLogged(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user: ICurrentUser) => user.isLogged),   // la valeur qui doit être retourné est : isLogged, les autres ne nous intéresse pas
      take(1)
    );
  }

  updateCurrentUser(user: ICurrentUser) {
    this.updateAndEmitCurrentUser(user);
  }

  updateAndEmitCurrentUser(user: ICurrentUser) {
    localStorage.setItem("currentUser", JSON.stringify(user));      // on enregistre dans une petite base de donnée du navigateur.
                                                                    // on ne l'utilise pas mais je le laisse pour l'exemple au cas ou
    this.currentUserSubject.next(user);     // on informe tous les souscripteurs d'un nouvel état de : ICurrentUser
  }

  // Error
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // client-side error
      console.log('client-side error')
      return throwError(error.error.message);
    }
    // server-side error
    console.log('server-side error')
    return throwError(error);
  }

  getAuthToken(): string {
    return this.currentUserSubject.getValue().token;
  }

  refreshToken(): Observable<ICurrentUser> {

    const refreshToken = this.currentUserValue.refresh_token;

    return this.http
      .post<AuthenticationPayload>(
        `${environment.urlApi}/${environment.pathAuth}/refresh`,
        { refresh_token: refreshToken },
        httpOptions
      )
      .pipe(
        map((payload: AuthenticationPayload) => {
          console.log("payload", payload)

          return {
            roles: payload.data.user.role,
            token: payload.data.payload.token
          }
        },
        catchError(this.handleError)
      ))
  }
}
