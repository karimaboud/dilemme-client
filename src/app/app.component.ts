import { Component, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Jeu } from './model/Jeu';
import { Joueur } from './model/Joueur';
import { JeuService } from './services/jeu.service';
import { JoueurService } from './services/joueur.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  wait: boolean = true;
  joueurs: Joueur[] = [];
  jeux: Jeu[] = [];
  joueurId: number;
  nbConnecte: number;
  nomJoueur: string;
  rejoindClick: boolean = false;
  creerClick: boolean = false;
  joueur: Joueur;

  constructor(private joueurService: JoueurService,
    private jeuService: JeuService) { }

  ngOnInit() {
    this.getJoueurs().subscribe(
      joueurs => {
        if (joueurs) {
          this.joueurs = joueurs
          this.nbConnecte = this.joueurs.length;
          this.joueurId = this.nbConnecte + 1;
          this.getJeux().subscribe(
            jeux => this.jeux = jeux
          )
        }

      }
    );
  }

  getJoueur(id: number) {
    return this.joueurService.getJoueur(id);
  }

  createJoueur(joueur: Joueur) {
    return this.joueurService.createJoueur(joueur);
  }

  getJoueurs() {
    return this.joueurService.getJoueurs();
  }

  getJeu(id: number) {
    return this.jeuService.getJeu(id);
  }

  updateJeu(jeu: Jeu) {
    return this.jeuService.updateJeu(jeu);
  }

  getJeux() {
    return this.jeuService.getJeux();
  }

  createJeu(jeu: Jeu) {
    return this.jeuService.createJeu(jeu);
  }


  getNomJoueur(id: number) {
    let j: Joueur = this.joueurs.find(joueur => joueur.idJoueur === id);
    if (j) return j.nom;
    else {
      return "";
    }
  }

  rejoindreJeu(pseudo: string) {
    let idJoueur: number
    let joueur: Joueur;
    this.getJoueurs().subscribe(
      joueurs => {
        this.joueurs = joueurs
        idJoueur = joueurs.length + 1
        this.joueurId = idJoueur

        joueur = {
          idJoueur: idJoueur,
          nom: pseudo,
          score: 0,
          abandon: false,
          peutJouer: false,
          derniereAction: null
        }
        let trouve = this.joueurs.find(
          j => {
            return j.idJoueur === joueur.idJoueur
          }
        );
        if (!trouve) {
          this.createJoueur(joueur).subscribe(
            _cree => {
              this.joueurs.push(joueur)
              this.getJeux().subscribe(
                jeux => {
                  this.jeux = jeux
                }
              )
              this.rejoindClick = true;
            }
          )
        }

      }
    )
  }


  choisirJeu(indexJeu: number) {
    // il faut trouver le idCreateur ( != de idJeu !!)
    this.getJeux().subscribe(
      jeux => {
        this.jeux = jeux;
        this.getJoueurs().subscribe(
          joueurs => {
            if (joueurs.length > 0) {
              this.joueurs = joueurs;
              let idJoueur = this.joueurs.length;
              this.jeux[indexJeu]['idJoueur2'] = idJoueur;

              this.updateJeu(this.jeux[indexJeu]).subscribe(
                jeu => {
                  this.jeux.push(jeu)
                  this.wait = false;
                }
              );
            }


          }
        )
      }
    )

    return this.jeux[indexJeu];
  }

  creerJeu(pseudo: string) {
    let idJoueur: number;
    let idAdversaire: number = 0;
    this.getJoueurs().subscribe(
      joueurs => {
        this.joueurs = joueurs
        idJoueur = joueurs.length + 1;
        let joueur: Joueur = {
          nom: pseudo,
          score: 0,
          abandon: false,
          peutJouer: true,
          derniereAction: null
        }
        this.createJoueur(joueur).subscribe(
          j => {
            this.joueurs.push(j)
            this.creerClick = true;
            this.wait = true;
            let jeu: Jeu = {
              id: idJoueur,
              idJoueur1: idJoueur,
              idJoueur2: idAdversaire
            }
            this.createJeu(jeu).subscribe(
              jeuRes => {
                this.getJeu(jeuRes.id).subscribe(
                  res => {
                    if (res.idJoueur2) {
                      this.jeux.push(res)
                      this.getJoueur(res.idJoueur2).subscribe(
                        joueur2 => {
                          alert(joueur2.nom + " a rejoint votre jeu !");
                          this.wait = false;
                        }
                      )
                    }

                  }
                )
              }
            )
          }
        );
      }
    )

  }



  cooperer() {

  }

  getTour() {
    return "C'est votre tour. Vous pouvez jouez ! "
  }




}



