import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rencontre } from '../model/Rencontre';

@Injectable({
  providedIn: 'root'
})
export class RencontreService {

  local_server: string = "http://localhost:8080";
  server: string = "https://dilemme-server.herokuapp.com";

  constructor(private http: HttpClient) { }

  createRencontre(rencontre: Rencontre) {
    return this.http.post<Rencontre>(this.local_server + "/createRencontre", rencontre);
  }

  getRencontre(id:number){
    return this.http.get<Rencontre>(this.local_server + "/rencontre/"+id)
  }

  updateRencontre(rencontre: Rencontre) {
    return this.http.put<Rencontre>(this.local_server + "/updateRencontre", rencontre);
  }

  getRencontres() {
    return this.http.get<Rencontre[]>(this.local_server + "/rencontres");
  }


}
