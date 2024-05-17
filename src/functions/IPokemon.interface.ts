//Modelo de interface que va a tener los pokemones de la consulta
export interface IResult {
    name: string;
    url: string;
}

//Modelo de interface que va a tener la consulta general a la API de Pokemon
export interface IPokemon {
    count: number;
    next: string;
    previous: string;
    results: IResult[];
}