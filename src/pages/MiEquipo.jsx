import { useEffect, useState } from "react";
import { obtenerEquipo, eliminarJugador } from "../services/equipoApi";
import { FORMACIONES, NOMBRES_POSICION } from "../data/formaciones";

function MiEquipo({ actualizarEquipo }) {
    const [equipo, setEquipo] = useState([]);
    const [error, setError] = useState("");
    const [formacionActual, setFormacionActual] = useState("4-3-3");

    const cargarEquipo = async () => {
        try {
            const datos = await obtenerEquipo();
            setEquipo(datos);
        } catch (error) {
            setError(error.message);
        }
    };

    const quitarJugador = async (id) => {
        await eliminarJugador(id);
        cargarEquipo();
    };

    useEffect(() => {
        cargarEquipo();
    }, [actualizarEquipo]);

    const formacion = FORMACIONES[formacionActual];

    const buscarJugadorPorPosicion = (clavePosicion) => {
        return equipo.find((jugador) => jugador.posicion === clavePosicion);
    };

    return (
        <section>
            <h2>Mi Equipo Ideal ⚽</h2>

            {error && <p>{error}</p>}

            <div className="selector-formacion">
                <label>Formación: </label>
                <select
                    value={formacionActual}
                    onChange={(evento) => setFormacionActual(evento.target.value)}
                >
                    {Object.keys(FORMACIONES).map((clave) => (
                        <option key={clave} value={clave}>
                            {FORMACIONES[clave].nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="cancha">
                <div className="area-arco abajo"></div>

                {Object.entries(formacion.posiciones).map(([clave, coords]) => {
                    const jugador = buscarJugadorPorPosicion(clave);

                    return (
                        <div
                            key={clave}
                            className="slot"
                            style={{
                                top: `${coords.top}%`,
                                left: `${coords.left}%`
                            }}
                        >
                            {jugador ? (
                                <>
                                    <img src={jugador.imagen} alt={jugador.nombre} />
                                    <div className="nombre-jugador">
                                        {jugador.nombre}
                                        {jugador.esLeyenda && (
                                            <span className="leyenda"> 🏆</span>
                                        )}
                                    </div>
                                    <div className="etiqueta">
                                        {NOMBRES_POSICION[clave]}
                                    </div>
                                    <button onClick={() => quitarJugador(jugador.id)}>
                                        Quitar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="vacio">+</div>
                                    <div className="etiqueta">
                                        {NOMBRES_POSICION[clave]}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default MiEquipo;