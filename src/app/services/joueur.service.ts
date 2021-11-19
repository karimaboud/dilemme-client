import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Joueur } from '../model/Joueur';

@Injectable({
  providedIn: 'root'
})
export class JoueurService {

  local_server: string = "http://localhost:8080";
  server: string = "https://dilemme-server.herokuapp.com";

  constructor(private http: HttpClient) { }

  createJoueur(joueur: Joueur) {
    return this.http.post<Joueur>(this.local_server + "/addJoueur", joueur);
  }



  deleteJoueur(joueurId: number) {
    return this.http.delete<Joueur>(this.local_server + "/deleteJoueur/" + joueurId);
  }

  getJoueurs() {
    return this.http.get<Joueur[]>(this.local_server + "/joueurs");
  }

  getJoueur(id: number) {
    return this.http.get<Joueur>(this.local_server + "/joueur/" + id);
  }

}
