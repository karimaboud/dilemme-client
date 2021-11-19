import { Action } from "./Action";
import { Joueur } from "./Joueur";

export class JoueurImpl implements Joueur {
   nom: string;
   peutJouer: boolean;
   abandon: boolean;
   score: number;
   derniereAction: Action;

  constructor(nom: string, peutJouer: boolean,
    abandon: boolean, score: number, derniereAction: Action) {
    this.nom = nom;
    this.peutJouer = peutJouer;
    this.score = score;
    this.derniereAction = derniereAction;
    this.abandon = abandon;
  }
  
  public getNom(): string {
    return this.nom;
  }


  public setNom(nom: string): void {
    this.nom = nom;
  }

  public isPeutJouer(): boolean {
    return this.peutJouer;
  }

  public setPeutJouer(peutJouer: boolean): void {
    this.peutJouer = peutJouer;
  }

  public isAbandon(): boolean {
    return this.abandon;
  }

  public setAbandon(abandon: boolean): void {
    this.abandon = abandon;
  }

  public getScore(): number {
    return this.score;
  }

  public setScore(score: number): void {
    this.score = score;
  }

  public getDerniereAction(): Action {
    return this.derniereAction;
  }

  public setDerniereAction(derniereAction: Action): void {
    this.derniereAction = derniereAction;
  }


}