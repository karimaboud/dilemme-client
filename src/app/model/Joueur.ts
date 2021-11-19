import { Action } from "./Action";

export interface Joueur {
  idJoueur?:number,
  nom: string;
  peutJouer: boolean;
  abandon: boolean;
  score: number;
  derniereAction: Action;

}