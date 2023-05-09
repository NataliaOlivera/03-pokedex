import { Injectable } from '@nestjs/common';
import { PokeReponse } from './interface/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany()

    const data = await this.http.get<PokeReponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
    
    /*const insertPromisesArray = [];

    data.results.forEach(async({name, url})=>{

      const segments = url.split('/');
      const number= +segments[segments.length - 2]; // search number of pokemon 
      
      //const pokemon = await this.pokemonModel.create({name, number});

      insertPromisesArray.push(
        this.pokemonModel.create({name, number})
      );

    });

    await Promise.all ( insertPromisesArray );*/ // first attempt of code

    const pokemonToInsert: { name:string, number:number }[]= [];

    data.results.forEach(async({name, url})=>{

      const segments = url.split('/');
      const number= +segments[segments.length - 2]; // search number of pokemon 
      
      pokemonToInsert.push({name, number})

    });

    await this.pokemonModel.insertMany(pokemonToInsert) // more fast
    
    return 'Seed execute';
  }

}
