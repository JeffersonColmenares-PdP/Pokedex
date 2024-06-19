import { useEffect, useState} from 'react';
import './App.css';

function App() {
  const [listPokemons, setListPokemons] = useState([]);
  const [buscador, setBuscador] = useState("");
  const [modal, setModal] = useState(false);
  const [index, setIndex] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonsPerPage = 5;

  const fetchMostrarPokemones = async () => {
    try {
      let pokemonDetalles = [];
      if (buscador === ""){
        const infPokeapi = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0`);
        if (infPokeapi.ok) {
          let infPokeapiJs = await infPokeapi.json();
          for(let Pokemones of infPokeapiJs.results){
            const infoLinkPok = await fetch(`${Pokemones?.url}`);
            if (infoLinkPok.ok){
              let infoLinkPokJs = await infoLinkPok.json();
              pokemonDetalles.push({
                id: infoLinkPokJs?.id,
                name: infoLinkPokJs?.forms[0]?.name,
                imagen: infoLinkPokJs?.sprites?.front_default, //imagen del pokemon
                habilidad0: infoLinkPokJs?.abilities[0]?.ability?.name,
                habilidad1: infoLinkPokJs?.abilities[1]?.ability?.name
              });
            }
          }
          setListPokemons(pokemonDetalles);

        }  
      } else {
        const infPokeapi = await fetch(`https://pokeapi.co/api/v2/pokemon/${buscador}`);
        if (infPokeapi.ok) {
          let infPokeapiJs = await infPokeapi.json();
          pokemonDetalles.push({
            id: infPokeapiJs?.id,
            name: infPokeapiJs?.forms[0]?.name,
            imagen: infPokeapiJs?.sprites?.front_default, //imagen del pokemon
            habilidad0: infPokeapiJs?.abilities[0]?.ability?.name,
            habilidad1: infPokeapiJs?.abilities[1]?.ability?.name
          });
          setListPokemons(pokemonDetalles);

        } 
      }
      
    } catch (error) {
      console.log("El error es: ", error);
    }
  };

  useEffect(() => { fetchMostrarPokemones() }, []);

  const indexOfLastPokemon = currentPage * pokemonsPerPage;//ultimo pokemon en pagina
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;//primer pokemon en pagina
  const currentPokemons = listPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);//nuevo arreglo con pok x pag

  const nextPage = () => {
    if (currentPage < Math.ceil(listPokemons.length / pokemonsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const leerInput = (e) => {
    setBuscador(e.target.value);
  };

  return (
    <div className="container">
      <input type="text" placeholder=' Nombre o ID del Pokemón ' onChange={leerInput}/>
      <button onClick={fetchMostrarPokemones}><img width="33%" height="auto" src="https://img.icons8.com/ios/50/search--v1.png" alt="search--v1"/></button>
      <div className="table-container">
        <table className='table-bordered'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Imagen</th>
            </tr>
          </thead>
          <tbody>
            {currentPokemons.map((item, id) => (
              <>
                <tr key={id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td><img src={item.imagen} alt="" onClick={()=>{setModal(true); setIndex(id)}}/></td>
                </tr>
                {modal && id === index ? (
                  <div className='habilidades'>
                    <h2>{item.id}. {item.name}</h2>
                    <img className='imgModal'  src={item.imagen} alt="" />
                    <h4>Habilidad 1</h4>
                    <h3>{item.habilidad0}</h3>
                    <h4>Habilidad 2</h4>
                    <h3>{item.habilidad1}</h3>
                    <button onClick={()=>{setModal(false); setIndex("")}}>Cerrar</button>
                  </div>
                ) : <> </>}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
        <button onClick={nextPage} disabled={currentPage === Math.ceil(listPokemons.length / pokemonsPerPage)}>Siguiente</button>
      </div>
    </div>
  );
}

export default App;