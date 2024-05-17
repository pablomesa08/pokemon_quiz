import axios, { AxiosError } from "axios";
import { IPokemon } from "./IPokemon.interface";

//Funcion para obtener la Data de la API de Pokemon
export async function getData(): Promise<IPokemon | AxiosError<unknown, any>> {
    try {
        const response = await axios.get<IPokemon>('https://pokeapi.co/api/v2/pokemon?limit=649');
        return response.data;
    }
    catch (error) {
        return error as AxiosError<unknown, any>;
    } 
}