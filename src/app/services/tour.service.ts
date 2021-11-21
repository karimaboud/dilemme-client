import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tour } from '../model/Tour';

@Injectable({
  providedIn: 'root'
})
export class TourService {

  local_server: string = "http://localhost:8080";
  server: string = "https://dilemme-server.herokuapp.com";

  constructor(private http: HttpClient) { }

  createTour(tour: Tour) {
    return this.http.post<Tour>(this.local_server + "/createTour", tour);
  }

  updateTour(tour:Tour){
    return this.http.put<Tour>(this.local_server + "/updateTour", tour);
  }

  getTour(id:number){
    return this.http.get<Tour>(this.local_server + "/tour/"+id);
  }

}
