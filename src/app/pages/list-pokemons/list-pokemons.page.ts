import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { Pokemon } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
})
export class ListPokemonsPage implements OnInit {

  pokemons: Pokemon[] = [];

  constructor(
    private pokemonService: PokemonService,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.morePokemon();
  }

  async morePokemon(event = null) {
    const promise = this.pokemonService.getPokemons();
    if (promise) {
      let loading = null;
      if (!event) {
        loading = await this.loadingCtrl.create({
          message: 'Cargando...'
        });
        await loading.present();
      }

      promise.then((result: Pokemon[]) => {
        this.pokemons = this.pokemons.concat(result);

        if (event) {
          event.target.complete();
        }

        if (loading) {
          loading.dismiss();
        }
      }).catch((err) => {
        if (event) {
          event.target.complete();
        }
      })
    }
  }

  goToDetail(pokemon: Pokemon) {
    this.navParams.data["pokemon"] = pokemon;
    this.navCtrl.navigateForward('detail-pokemon')
  }
}
