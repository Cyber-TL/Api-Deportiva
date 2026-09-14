import { useState } from "react";
import { buscarJugador } from "../services/sportsApi";
import { agregarAlEquipo } from "../services/equipoApi";
import { NOMBRES_POSICION } from "../data/formaciones";

function BuscarJugador({ onJugadorAgregado }) {
    const [busqueda, setBusqueda] = useState("");
    const [jugadores, setJugadores] = useState([]);
    const [posicion, setPosicion] = useState("DEL");
    const [error, setError] = useState("");

    const buscar = async () => {
        try {
            setError("");
            const datos = await buscarJugador(busqueda);
            setJugadores(datos);
        } catch (error) {
            setJugadores([]);
            setError(error.message);
        }
    };

    const agregarJugador = async (jugador) => {
        const nuevoJugador = {
            id: jugador.idPlayer,
            nombre: jugador.strPlayer,
            imagen: jugador.strThumb,
            equipoReal: jugador.strTeam,
            posicion: posicion,
            esLeyenda: jugador.strStatus === "Retired"
        };

        try {
            await agregarAlEquipo(nuevoJugador);
            onJugadorAgregado();
            alert(`${jugador.strPlayer} fue agregado como ${NOMBRES_POSICION[posicion]}`);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <section>
            <h2>Buscar Jugador</h2>

            <div className="buscador">
                <input
                    type="text"
                    value={busqueda}
                    placeholder="Ejemplo: Lionel_Messi"
                    onChange={(evento) => setBusqueda(evento.target.value)}
                />

                <button onClick={buscar}>Buscar</button>

                <select
                    value={posicion}
                    onChange={(evento) => setPosicion(evento.target.value)}
                >
                    {Object.entries(NOMBRES_POSICION).map(([clave, nombre]) => (
                        <option key={clave} value={clave}>
                            {nombre}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p>{error}</p>}

            <div className="resultados">
                {jugadores.map((jugador) => (
                    <article key={jugador.idPlayer} className="tarjeta-jugador">
                        <img
                            src={jugador.strThumb || "https://placehold.co/100x100?text=?"}
                            alt={jugador.strPlayer}
                        />
                        <h3>{jugador.strPlayer}</h3>
                        <p>Equipo: {jugador.strTeam}</p>
                        <p>Posición real: {jugador.strPosition}</p>

                        <button onClick={() => agregarJugador(jugador)}>
                            Agregar como {NOMBRES_POSICION[posicion]}
                        </button>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default BuscarJugador;