import { Component } from '@angular/core';
import { parse } from 'path';
import { Jeu } from './model/Jeu';
import { Joueur } from './model/Joueur';
import { Rencontre } from './model/Rencontre';
import { Tour } from './model/Tour';
import { JeuService } from './services/jeu.service';
import { JoueurService } from './services/joueur.service';
import { RencontreService } from './services/rencontre.service';
import { TourService } from './services/tour.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  wait: boolean = true;
  nbConnecte: number;
  ok: boolean = false;

  joueur1: Joueur;
  joueur2: Joueur;

  isHost: boolean;
  adversaireAChoisi: boolean = false;

  joueurs: Joueur[];

  nbTours: string='';
  count = 0;

  rencontre: Rencontre = {
    tours: [],
    gagnant: null,
    joueurs:[],
    nbTours: parseInt(this.nbTours),
    scoreJoueur1:0,
    scoreJoueur2:0,
  };
  idRencontre: number;
  rencontres: Rencontre[];


  rejoindClick: boolean = false;
  creerClick: boolean = false;

  choixCreerRencontre: boolean = false;
  choixRejoindre: boolean = false;
  choixAction: string;

  messageAttente: string

  constructor(private joueurService: JoueurService,
    private jeuService: JeuService,
    private tourService: TourService,
    private rencontreService: RencontreService) { }

  ngOnInit() {
    this.getJoueurs(
    ).subscribe(
      joueurs => {
        this.joueurs = joueurs
      }
    );
    this.getRencontres(
    ).subscribe(
      rencontres => {
        this.rencontres = rencontres
      }
    )

  }

  parseInt(val: string) {
    return parseInt(val);
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

  createRencontre(rencontre: Rencontre) {
    return this.rencontreService.createRencontre(rencontre);
  }

  getRencontres() {
    return this.rencontreService.getRencontres();
  }

  getTour() {
    let nom: string;
    if (this.adversaireAChoisi) {
      return "Vous pouvez jouer !";
    } else {
      if (this.isHost) {
        nom = this.joueur2.nom
      } else {
        nom = this.joueur1.nom
      }
      return "En attente que " + nom + " joue son tour..";
    }

  }

  creerRencontre(pseudo: string, nbTours: string) {
    this.creerClick = true;
    this.isHost = true;
    this.joueur1 = {
      nom: pseudo,
      abandon: false,
      derniereAction: null,
      score: 0
    }
    let rencontre: Rencontre = {
      nbTours: parseInt(nbTours),
      joueurs: [this.joueur1, this.joueur2],
      scoreJoueur1: 0,
      scoreJoueur2: 0,
      tours: [],
      gagnant: null
    }

    this.rencontres.push(rencontre);

    this.createRencontre(
      rencontre
    ).subscribe(
      (renc) => {
        this.rencontreService.getRencontre(
          renc.id
        ).subscribe(
          renc => {
            this.idRencontre = renc.id
            this.joueur2 = renc.joueurs[1] // ICI JAI LE JOUEUR 2 DANS LE CLIENT 1
            alert(this.joueur2.nom + " a rejoint votre jeu !")
            this.wait = false;
          }
        )
      }
    )
  }

  rejoindreRencontre(pseudo: string, id: number) {
    this.idRencontre = id;
    this.joueur2 = {
      nom: pseudo,
      abandon: false,
      derniereAction: null,
      score: 0
    }
    this.createJoueur(this.joueur2).subscribe(
      joueur => {
        this.joueur2 = joueur
        this.rencontreService.getRencontre(id).subscribe(
          renc => {
            renc.joueurs[1] = this.joueur2
            this.rencontreService.updateRencontre(renc).subscribe(
              rencon => {
                this.joueur1 = rencon.joueurs[0] // ICI JAI LE JOUEUR 1 DANS LE CLIENT 2
                this.wait = false;

              }
            )
          }
        )
      }
    );

  }


  action(action: string) {
    this.rencontreService.getRencontre(this.idRencontre).subscribe(
      renc => {
        let tour: Tour = {
          "id": renc.id * 100 + renc.tours.length + 1,

        }
        this.joueur1 = renc.joueurs[0]
        this.joueur2 = renc.joueurs[1]

        this.rencontre = renc;
        this.count++;


        this.tourService.getTour(tour.id).subscribe(
          tr => {
            if (tr) {
              tour = tr
              console.log(tr)
            }

            if (this.isHost) {

              tour.actionJoueur1 = action;
              this.joueur1.derniereAction = tour.actionJoueur1;
              this.joueurService.updateJoueur(this.joueur1).subscribe()

              // isHost a jouer en premiere
              if (tour.actionJoueur1 == null || tour.actionJoueur2 == null) {
                this.tourService.createTour(tour).subscribe(
                  tourCree => {
                    //joueur 2 a jouer en deuxieme
                    this.adversaireAChoisi = true;
                    this.rencontreService.getRencontre(this.idRencontre).subscribe(
                      re => {
                        this.rencontre = re
                        console.log("joueur2 joue en deuxieme " + JSON.stringify(this.rencontre))
                        this.joueur2 = this.rencontre.joueurs[1];
                      }
                    )
                  }
                )
              } else {
                // isHost a jouer en 2eme 
                console.log("joueur 1 a joue")
                this.adversaireAChoisi = !this.adversaireAChoisi;
                this.tourService.updateTour(tour).subscribe(
                  tr => {
                    console.log("tour=" + JSON.stringify(tr))
                    renc.tours.push(tr);
                    this.rencontre = renc
                    console.log("rencontre = " + JSON.stringify(this.rencontre))
                    this.rencontreService.updateRencontre(renc).subscribe(
                      re => {
                        this.rencontre = re
                      }
                    )

                  }
                )

              }

            }
            else {

              tour.actionJoueur2 = action;
              this.joueur2.derniereAction = tour.actionJoueur2;
              this.joueurService.updateJoueur(this.joueur2).subscribe()

              //joueur2 a jouer en premier
              if (tour.actionJoueur1 == null || tour.actionJoueur2 == null) {
                this.tourService.createTour(tour).subscribe(
                  tourCree => {
                    // joueur1 a jouer en 2eme
                    this.adversaireAChoisi = true;
                    this.rencontreService.getRencontre(this.idRencontre).subscribe(
                      re => {
                        this.rencontre = re
                        console.log('joueur 2 a joue ' + JSON.stringify(this.rencontre))
                        this.joueur1 = this.rencontre.joueurs[0];
                      }
                    )
                  }
                )
              } else {
                // joueur 2 a jouer en 2eme
                this.adversaireAChoisi = !this.adversaireAChoisi;
                this.tourService.updateTour(tour).subscribe(
                  ut => {
                    renc.tours.push(ut);
                    this.rencontre = renc;
                    console.log("joueur 2 a joue " + JSON.stringify(this.rencontre))
                    this.rencontreService.updateRencontre(renc).subscribe(
                      re => {
                        this.rencontre = re
                      }
                    );
                  }
                );


              }
            }

          }
        );
      }
    )

  }

  gagnant() {
    let scoreJ1 = 0;
    let scoreJ2 = 0;
    for (let i = 0; i < this.rencontre.tours.length; i++) {
      scoreJ1 = scoreJ1 + this.rencontre.tours[i].pointsJoueur1;
      scoreJ2 = scoreJ2 + this.rencontre.tours[i].pointsJoueur2;
    }

    if (scoreJ1 > scoreJ2) {
      return this.rencontre.joueurs[0].nom + " a gagné"
    } else if (scoreJ2 > scoreJ1) {
      return this.rencontre.joueurs[1].nom + " a gagné"
    } else {
      return "égalité !"
    }

  }

  fini() {
    let b = false;
    if (this.rencontre && this.rencontre.tours.length === this.parseInt(this.nbTours)) {
      for (let i = 0; i < this.rencontre.tours.length; i++) {
        b = this.rencontre.tours[i].actionJoueur1 !== null && this.rencontre.tours[i].actionJoueur2 !== null;
        console.log(b)
      }
      if (b) this.gagnant()
    }
    return b;
  }

}



