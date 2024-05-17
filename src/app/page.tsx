'use client';

//Imports
import { IResult } from "@/functions/IPokemon.interface";
import { getData } from "@/functions/requests";
import { Axios, AxiosError } from "axios";
import { useState } from "react";
import Image from 'next/image';

export default function Home() {
  const [list, setList] = useState<IResult[]>([]);
  const [load, setLoad] = useState<boolean>(false);
  const [pokemon, setPokemon] = useState<IResult>();
  const [options, setOptions] = useState<IResult[]>([]);
  const [image, setImage] = useState<string>('');
  const [message, setMessage] = useState<{text: string, isCorrect: boolean}>();
  const [next, setNext] = useState<boolean>(false);
  const [isChosen, setisChosen] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0); // Nuevo estado para respuestas correctas
  const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0); // Nuevo estado para respuestas incorrectas

  //Funcion para cargar la data de los pokemones
  async function fetchData() {
    const data = await getData();
    if(data instanceof AxiosError){
      console.log(data.message);
    } else {
      setList(data.results);
      await randomPokemon(data.results);
      setLoad(true);
    }
  }
  
  //Funcion que elige un pokemon random de la lista de resultados para preguntar
  function randomPokemon(list: IResult[]) {
    //Generacion de un index aleatorio
    const randomIndex = Math.floor(Math.random() * list.length);
    //Asignacion del pokemon elegido aleatoriamente
    const randomPokemon = list[randomIndex];
    //seteamos el pokemon elegido
    setPokemon(randomPokemon);
    //seteamos las opciones a presentar
    setOptions(generateOptions(list, randomPokemon));
    //extraemos el index para la imagen
    const utilIndex = randomPokemon.url.split('/')[6];
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${utilIndex}.svg`;
    //seteamos la imagen a presentar
    setImage(image);
  }

  //Funcion para crear la lista de 4 opciones
  function generateOptions(list: IResult[], answer: IResult) {
    //Se agrega la respuesta a las opciones
    const options = [answer];
    while (options.length < 4) {
      //Agrega otras opciones a la lista
      const randomIndex = Math.floor(Math.random() * list.length);
      const randomPokemon = list[randomIndex];
      if (!options.includes(randomPokemon)) {
        options.push(randomPokemon);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  }
  
  //Funcion que verifica el resultado
  function checkResult(option: IResult) {
    //Si el usuario no ha elegido no haga nada
    if(isChosen){
      return;
    }
    
    //Si la opcion se eligio, verifique que es correcta y actualice marcadores
    if(option === pokemon){
      setMessage({text: `Correcto! es ${pokemon?.name}`, isCorrect: true});
      setCorrectAnswers(correctAnswers + 1); // Incrementar respuestas correctas
    } else {
      setMessage({text: `Incorrecto! se trataba de ${pokemon?.name}`, isCorrect: false});
      setIncorrectAnswers(incorrectAnswers + 1); // Incrementar respuestas incorrectas
    }
    //Seteamos para pasar a la siguiente pregunta
    setNext(true);
    setisChosen(true);
  }

  //Funcion para la siguiente pregunta 
  function nextPokemon() {
    randomPokemon(list);
    setMessage(undefined);
    setNext(false);
    setisChosen(false);
  }

  //Si la data no ha cargado, lo hace
  if (!load) {
    (async () => {  
      await fetchData();
    })();
  }

  return (
    <main className="flex m-h-screen flex-col items-center justify-between p-6">
      <div className="flex flex-row items-center justify-between">
        <h1 className="font-sans text-5xl font-bold text-center text-white mt-3">Who&apos;s that Pokemon?</h1>
        <div className="p-3"> 
          <Image 
            src={"/pika.gif"}
            width={90}
            height={90} 
            alt={"Pikachu"}
            className="rounded-lg"      
          />
        </div>
      </div>
      {/*Creacion del titulo de la pagina*/}
      
        {/*Mostrar cantidad de respuestas correctas e incorrectas*/}
          <div className="flex flex-row text-lg">
            <p className="font-mono font-bold text-white mt-2">Respuestas correctas: {correctAnswers}</p>
            <p className="font-mono font-bold text-white mt-2 px-4">Respuestas incorrectas: {incorrectAnswers}</p>
          </div>
      {/*Recuadro para la imagen del Pokémon*/}
      <div className="flex flex-row items-center mt-3">
        {pokemon && image && (
          <div className="mt-2 mb-4 flex px-5">
          {/*Aquí puedes poner la imagen del Pokémon*/}
            <Image 
              src={image}
              width={150}
              height={150}
              className={`${!isChosen ? 'brightness-0' : ''}`} alt={"Pokemon"} />
          </div>
        )}

        {/*Creacion de los botones*/}
        <div className="flex space-x-5">
          {options.map((option, index) => (
            <button key={index} onClick={() => checkResult(option)} className="bg-emerald-700 hover:bg-emerald-400 font-mono text-white font-bold py-2 px-4 rounded h-10">
              {option.name}
            </button>
          ))}
        </div>
      </div>
      
      {/*Mensaje de respuesta*/}
      {message?.text && (
        <div className={`font-mono text-lg mt-4 text-${message.isCorrect ? 'white' : 'white'}`}>
          {message.text}
        </div>
      )}

      {/*Boton para continuar*/}
      {next && (
        <button onClick={nextPokemon} className="bg-red-700 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mt-2">
          Siguiente!
        </button>
      )}

    </main>
  );
}