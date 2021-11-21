import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Jeu } from '../model/Jeu';

@Injectable({
  providedIn: 'root'
})
export class JeuService {


  local_server: string = "http://localhost:8080";
  server: string = "https://dilemme-server.herokuapp.com";

  constructor(private http: HttpClient) { }

  getJeu(id: number) {
    return this.http.get<Jeu>(this.local_server + "/jeu/" + id);
  }

  getJeux() {
    return this.http.get<Jeu[]>(this.local_server + "/jeux");
  }

  createJeu(jeu: Jeu) {
    return this.http.post<Jeu>(this.local_server + "/addJeu", jeu);
  }

  updateJeu(jeu: Jeu) {
    return this.http.put<Jeu>(this.local_server + "/updateJeu", jeu);
  }
}
