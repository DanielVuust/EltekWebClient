import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { environment } from '../../config/appsettings';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(public http: HttpClient, public auth: Auth) 
  { 
  } 

  public async get(url: string, options?: any): Promise<any> { 
    if(options == undefined){
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await this.currentUserJwt()
      });
      options = { headers: headers };
    }
    console.log(environment.backendUrl + url);
    return await this.http.get(environment.backendUrl + url, options);
  } 

  public async post(url: string, data: any, headers?: HttpHeaders): Promise<any> { 
    if(headers == undefined){
      headers = new HttpHeaders();
    }
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + await this.currentUserJwt()
    });
    let options = { headers: headers }
    return await this.http.post(environment.backendUrl + url, data, options); 
  }
  public async put(url: string, data: any, headers?: HttpHeaders) { 
    if(headers == undefined){
      headers = new HttpHeaders();
    }
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + await this.currentUserJwt()
    });
    let options = { headers: headers }
    return await this.http.put(environment.backendUrl + url, data, options);
  }
  public async patch(url: string, data: any, headers?: HttpHeaders) { 
    if(headers == undefined){
      headers = new HttpHeaders();
    }
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + await this.currentUserJwt()
    });
    let options = { headers: headers }
    return await this.http.patch(environment.backendUrl + url, data, options);
  }
  public async delete(url: string, options?: any) { 
    if(options == undefined){
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await this.currentUserJwt()
      });
      options = { headers: headers };
    }
    return await this.http.delete(environment.backendUrl + url, options);
  }

  public async currentUserJwt(): Promise<string | null> {
    const user = this.auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      console.log(token);
      console.log(user);
      return token;
    }

    const newUser = await new Promise<any>((resolve) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
      });
    });

    if (newUser) {
      const token = await newUser.getIdToken();
      console.log(token);
      console.log(newUser);
      return token;
    }

    return null;
  }

  

  
}
