import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Pokemon } from '../models/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private nextUrl: string;
  constructor() { 
    this.nextUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0';
  }

  getPokemons() {
    const url = this.nextUrl;
    if (url) {

      const options = {
        url,
        headers: {},
        params: {}
      }

      return CapacitorHttp.get(options).then(async response => {
        let pokemons: Pokemon[] = [];

        if (response.data) {
          const results = response.data.results;
          this.nextUrl = response.data.next;

          const promises: Promise<HttpResponse>[] = [];

          for (let index = 0; index < results.length; index++) {
            const pokemon = results[index];
            const urlPokemon = pokemon.url;
            const options = {
              url: urlPokemon,
              headers: {},
              params: {}
            }
            promises.push(CapacitorHttp.get(options));
          }

          await Promise.all(promises).then((responses) => {
            for (const response of responses) {
              const pokemonData = response.data;

              const pokemonObj = new Pokemon();
              pokemonObj.id = pokemonData.order;
              pokemonObj.name = pokemonData.name;
              pokemonObj.type1 = pokemonData.types[0].type.name;
              if (pokemonData.types[1]) {
                pokemonObj.type2 = pokemonData.types[1].type.name;
              }

              pokemonObj.sprite = pokemonData.sprites.other['official-artwork'].front_default;
              /* pokemonObj.sprite = pokemonData.sprites.front_default; */
              pokemonObj.weight = pokemonData.weight/10;
              pokemonObj.height = pokemonData.height/10;
              pokemonObj.stats = pokemonData.stats;
              pokemonObj.abilities = pokemonData.abilities.filter(ab => ab.is_hidden === false).map(ab => ab.ability.name);
              const hidden = pokemonData.abilities.find(ab => ab.is_hidden === true);
              if (hidden) {
                pokemonObj.hiddenAbility = hidden.ability.name
                
              }
              pokemons.push(pokemonObj);
            }

            console.log(pokemons);
          })
        }

        return pokemons;
      })
    }

    return null;
  }
}
