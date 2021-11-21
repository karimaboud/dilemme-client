import { Action } from "./Action";

export interface Joueur {
  idJoueur?:number,
  nom: string;
  abandon: boolean;
  score: number;
  derniereAction: string;

}