import { useState, useEffect } from "react";
import { buscarJugador } from "../services/sportsApi";
import { agregarAlEquipo, obtenerEquipo } from "../services/equipoApi";
import { NOMBRES_POSICION, CLAVES_BANCA } from "../data/formaciones";

function BuscarJugador({ onJugadorAgregado }) {
    const [busqueda, setBusqueda] = useState("");
    const [jugadores, setJugadores] = useState([]);
    const [posicion, setPosicion] = useState("DEL");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    // Plantilla del usuario para el comparador
    const [miPlantilla, setMiPlantilla] = useState([]);
    const [jugadorACompararId, setJugadorACompararId] = useState("");

    const recargarPlantilla = async () => {
        try {
            const datos = await obtenerEquipo();
            setMiPlantilla(datos);
        } catch {
            setMiPlantilla([]);
        }
    };

    useEffect(() => {
        recargarPlantilla();
    }, []);

    const buscar = async () => {
        if (!busqueda.trim()) return;
        setCargando(true);
        try {
            setError("");
            const datos = await buscarJugador(busqueda);
            setJugadores(datos);
            recargarPlantilla();
        } catch (err) {
            setJugadores([]);
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const agregarJugador = async (jugador) => {
        try {
            const actual = await obtenerEquipo();
            let posicionDestino = posicion;

            if (posicion === "SUP_AUTO") {
                const ocupados = new Set(actual.map((p) => p.posicion));
                const libre = CLAVES_BANCA.find((c) => !ocupados.has(c));
                posicionDestino = libre || CLAVES_BANCA[0];
            }

            const nuevoJugador = {
                id: jugador.idPlayer,
                nombre: jugador.strPlayer,
                imagen: jugador.strThumb,
                equipoReal: jugador.strTeam || "",
                posicion: posicionDestino,
                esLeyenda: jugador.strStatus === "Retired",
                nacionalidad: jugador.strNationality || "",
                nacimiento: jugador.dateBorn || "",
                altura: jugador.strHeight || ""
            };

            await agregarAlEquipo(nuevoJugador);
            onJugadorAgregado();
            recargarPlantilla();
            alert(`${jugador.strPlayer} fue agregado al equipo.`);
        } catch (err) {
            setError(err.message);
        }
    };

    const jugadorPlantilla = miPlantilla.find((j) => j.id === jugadorACompararId);

    return (
        <section className="seccion-buscar-centrada">
            <h2>Ojeador de Jugadores</h2>
            <p className="subtitulo-seccion">Encuentra estrellas, agrégalas a tu equipo y compara estadísticas antes de fichar.</p>

            {/* Barra de búsqueda central */}
            <form
                className="buscador-centrado"
                onSubmit={(e) => {
                    e.preventDefault();
                    buscar();
                }}
            >
                <input
                    type="text"
                    value={busqueda}
                    placeholder="Buscar jugador (Ej: Bellingham, Mbappé, Zidane...)"
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <select
                    value={posicion}
                    onChange={(e) => setPosicion(e.target.value)}
                >
                    <optgroup label="Campo titular">
                        {Object.entries(NOMBRES_POSICION).map(([clave, nombre]) => (
                            <option key={clave} value={clave}>
                                {nombre} ({clave})
                            </option>
                        ))}
                    </optgroup>
                    <optgroup label="Banquillo">
                        <option value="SUP_AUTO">Banquillo (Primer cupo libre)</option>
                    </optgroup>
                </select>

                <button type="submit" disabled={cargando}>
                    {cargando ? "Buscando..." : "Buscar"}
                </button>
            </form>

            {/* Selector de plantilla para el VS */}
            {miPlantilla.length > 0 && (
                <div className="barra-selector-comparacion">
                    <label htmlFor="select-comparar">Comparar con un jugador de tu plantilla:</label>
                    <select
                        id="select-comparar"
                        value={jugadorACompararId}
                        onChange={(e) => setJugadorACompararId(e.target.value)}
                    >
                        <option value="">-- Ninguno (Solo ver resultados) --</option>
                        {miPlantilla.map((j) => (
                            <option key={j.id} value={j.id}>
                                {j.nombre} ({j.posicion}) - {j.nacionalidad || "S/N"}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {error && <p className="mensaje-error">{error}</p>}

            {/* Listado de resultados */}
            <div className="contenedor-resultados">
                {jugadores.map((jugador) => {
                    // Verificación de afinidad para química (ignoramos clubs genéricos de retirados)
                    const esClubValido = jugador.strTeam && !jugador.strTeam.startsWith("_");
                    const mismoClub = esClubValido && jugadorPlantilla?.equipoReal &&
                        jugador.strTeam.toLowerCase() === jugadorPlantilla.equipoReal.toLowerCase();
                    const mismoPais = jugador.strNationality && jugadorPlantilla?.nacionalidad &&
                        jugador.strNationality.toLowerCase() === jugadorPlantilla.nacionalidad.toLowerCase();

                    // ==========================================
                    // CASO 1: SOLO VER RESULTADOS (TARJETA COMPACTA)
                    // ==========================================
                    if (!jugadorPlantilla) {
                        return (
                            <article key={jugador.idPlayer} className="tarjeta-ojeado-compacta">
                                <span className="insignia-estado ojeado">Ojeado</span>
                                <img
                                    src={jugador.strThumb || "https://placehold.co/100x100?text=?"}
                                    alt={jugador.strPlayer}
                                    className="foto-perfil"
                                />
                                <h3>{jugador.strPlayer}</h3>
                                <div className="lista-datos">
                                    <div className="fila-dato"><span>Club:</span> <strong>{jugador.strTeam || "Sin club"}</strong></div>
                                    <div className="fila-dato"><span>País:</span> <strong>{jugador.strNationality || "N/D"}</strong></div>
                                    <div className="fila-dato"><span>Altura:</span> <strong>{jugador.strHeight || "N/D"}</strong></div>
                                    <div className="fila-dato"><span>Posición:</span> <strong>{jugador.strPosition || "N/D"}</strong></div>
                                </div>
                                <button
                                    type="button"
                                    className="btn-fichar"
                                    onClick={() => agregarJugador(jugador)}
                                >
                                    Fichar para el puesto ({posicion})
                                </button>
                            </article>
                        );
                    }

                    // ==========================================
                    // CASO 2: MODO COMPARACIÓN (DOS CUADROS SEPARADOS + VS CENTRADO)
                    // ==========================================
                    return (
                        <article key={jugador.idPlayer} className="contenedor-vs-completo">
                            <div className="arena-comparacion">
                                {/* Cuadro Izquierdo: Jugador Ojeado */}
                                <div className="cuadro-jugador cuadro-ojeado">
                                    <span className="insignia-estado ojeado">Ojeado</span>
                                    <img
                                        src={jugador.strThumb || "https://placehold.co/100x100?text=?"}
                                        alt={jugador.strPlayer}
                                        className="foto-perfil"
                                    />
                                    <h3>{jugador.strPlayer}</h3>
                                    <div className="lista-datos">
                                        <div className="fila-dato"><span>Club:</span> <strong>{jugador.strTeam || "Sin club"}</strong></div>
                                        <div className="fila-dato"><span>País:</span> <strong>{jugador.strNationality || "N/D"}</strong></div>
                                        <div className="fila-dato"><span>Altura:</span> <strong>{jugador.strHeight || "N/D"}</strong></div>
                                        <div className="fila-dato"><span>Posición:</span> <strong>{jugador.strPosition || "N/D"}</strong></div>
                                    </div>
                                </div>

                                {/* Columna Central: VS y Química */}
                                <div className="divisor-vs">
                                    <div className="badge-vs-central">VS</div>
                                    <div className="contenedor-quimica-vs">
                                        {mismoClub ? (
                                            <span className="pill-quimica match-club">🔥 Mismo Club<br /><small>+Química</small></span>
                                        ) : mismoPais ? (
                                            <span className="pill-quimica match-pais">🤝 Mismo País<br /><small>+Química</small></span>
                                        ) : (
                                            <span className="pill-quimica neutro">Sin enlace directo</span>
                                        )}
                                    </div>
                                </div>

                                {/* Cuadro Derecho: Jugador de tu Plantilla */}
                                <div className="cuadro-jugador cuadro-plantilla">
                                    <span className="insignia-estado plantilla">Tu Jugador</span>
                                    <img
                                        src={jugadorPlantilla.imagen || "https://placehold.co/100x100?text=?"}
                                        alt={jugadorPlantilla.nombre}
                                        className="foto-perfil"
                                    />
                                    <h3>{jugadorPlantilla.nombre}</h3>
                                    <div className="lista-datos">
                                        <div className="fila-dato"><span>Club:</span> <strong>{jugadorPlantilla.equipoReal || "Sin club"}</strong></div>
                                        <div className="fila-dato"><span>País:</span> <strong>{jugadorPlantilla.nacionalidad || "N/D"}</strong></div>
                                        <div className="fila-dato"><span>Altura:</span> <strong>{jugadorPlantilla.altura || "N/D"}</strong></div>
                                        <div className="fila-dato"><span>Puesto:</span> <strong>{jugadorPlantilla.posicion}</strong></div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn-fichar"
                                onClick={() => agregarJugador(jugador)}
                            >
                                Fichar para el puesto ({posicion})
                            </button>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

export default BuscarJugador;