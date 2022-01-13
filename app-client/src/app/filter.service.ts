import { Injectable } from '@angular/core';
import { CSC_Program, CSC_School } from './models';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  public isFilterApplied: boolean = false;
  private currentResults: CSC_School[];
  private filteredResults: CSC_School[];

  constructor() {
    this.currentResults = [];
    this.filteredResults = [];
  }

  public setCurrentResults(d): void {
    this.currentResults = d;
  }

  public getCurretResults(): CSC_School[] {
    return this.currentResults;
  }

  public async filterFromResults({ city, state, major }): Promise<CSC_School[]> {
    console.log(this.currentResults);
    return new Promise((resolve, reject) => {
      this._filterState(state)
        .then(state_filtered => {
          // console.log("LOG::State Filtered ", state_filtered);
          this._filterCity(city, state_filtered)
            .then(city_filtered => {
              // console.log("LOG::City Filtered ", city_filtered);
              this._filterMajor(major, city_filtered)
                .then((filtered_results: CSC_School[]) => {
                  // console.log("LOG::Filtered ", filtered_results);
                  this.isFilterApplied = true;
                  resolve(filtered_results);
                });
            });
        });
    });
  }

  private async _filterState(state) {
    return new Promise((resolve, reject) => {
      let state_filtered: CSC_School[] = [];
      // console.log("LOG::State ", state);
      if (state && state !== 'State') {
        for (let i = 0; i < this.currentResults.length; i++) {
          this.currentResults[i].school.state.toLowerCase() === state.toLowerCase() ?
            state_filtered.push(this.currentResults[i]) : null;
        }
        // console.log("LOG::State Filtered - Inside Promise", state_filtered);
        resolve(state_filtered);
      } else {
        // console.log("LOG::Returning curr result only", this.currentResults);
        resolve(this.currentResults);
      }
    });
  }

  private async _filterCity(city, intermittent_data) {
    return new Promise((resolve, reject) => {
      let city_filtered: CSC_School[] = [];
      // console.log("LOG::City, Intermittent Data ", city, intermittent_data);
      if (city) {
        for (let i = 0; i < intermittent_data.length; i++) {
          intermittent_data[i].school.city.toLowerCase() === city.toLowerCase() ?
            city_filtered.push(intermittent_data[i]) : null;
        }
        // console.log("LOG::City Filtered - Inside Promise", city_filtered);
        resolve(city_filtered);
      } else {
        // console.log("LOG::City - Returning intermittent result only", intermittent_data);
        resolve(intermittent_data);
      }
    });
  }

  private async _filterMajor(major, intermittent_data) {
    return new Promise((resolve, reject) => {
      // console.log("LOG::Major, Intermittent Data ", major, intermittent_data);
      let major_filtered: CSC_School[] = [];
      if (major) {
        for (let i = 0; i < intermittent_data.length; i++) {
          let isProgramAvailable: boolean = false;
          if (!intermittent_data[i].programs)
            continue;
          for (let j = 0; j < intermittent_data[i].programs.length; j++) {
            intermittent_data[i].programs[j].title.toLowerCase().includes(major.toLowerCase()) ?
              isProgramAvailable = true : null;
          }
          if (isProgramAvailable) {
            major_filtered.push(this.currentResults[i])
          }
        }
        // console.log("LOG::Major Filtered - Inside Promise", major_filtered);
        resolve(major_filtered);
      } else {
        // console.log("LOG::Major - Returning intermittent result only", intermittent_data);
        resolve(intermittent_data);
      }
    });
  }
}
