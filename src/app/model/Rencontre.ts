import { Joueur } from "./Joueur";
import { Tour } from "./Tour";

export interface Rencontre {
  id?: number,
  nbTours: number,
  joueurs: Joueur[],
  tours: Tour[],
  scoreJoueur1: number,
  scoreJoueur2: number,
  gagnant: any
}