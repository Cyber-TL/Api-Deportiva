import { useEffect, useState, useMemo } from "react";
import { obtenerEquipo, eliminarJugador, actualizarJugador } from "../services/equipoApi";
import {
    FORMACIONES,
    CLAVES_BANCA,
    etiquetaPosicion
} from "../data/formaciones";

function MiEquipo({ actualizarEquipo }) {
    const [equipo, setEquipo] = useState([]);
    const [error, setError] = useState("");
    const [formacionActual, setFormacionActual] = useState("5-3-2");
    const [seleccionado, setSeleccionado] = useState(null);
    const [dragOverKey, setDragOverKey] = useState(null);
    const [jugadorDetalle, setJugadorDetalle] = useState(null);

    const cargarEquipo = async () => {
        try {
            const datos = await obtenerEquipo();
            setEquipo(datos);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        cargarEquipo();
    }, [actualizarEquipo]);

    const formacion = FORMACIONES[formacionActual];
    const clavesTitulares = Object.keys(formacion.posiciones);

    const buscarJugadorEnSlot = (clave) =>
        equipo.find((j) => j.posicion === clave);

    const titulares = useMemo(() => {
        return clavesTitulares
            .map((clave) => buscarJugadorEnSlot(clave))
            .filter(Boolean);
    }, [equipo, formacionActual]);

    const quimica = useMemo(() => {
        if (titulares.length === 0) return 0;
        let puntos = 45;
        const paises = {};
        const clubes = {};
        titulares.forEach((j) => {
            if (j.nacionalidad) paises[j.nacionalidad] = (paises[j.nacionalidad] || 0) + 1;
            if (j.equipoReal && j.equipoReal !== "_Retired Soccer") {
                clubes[j.equipoReal] = (clubes[j.equipoReal] || 0) + 1;
            }
        });
        Object.values(paises).forEach((c) => { if (c > 1) puntos += c * 5; });
        Object.values(clubes).forEach((c) => { if (c > 1) puntos += c * 7; });
        return Math.min(100, puntos);
    }, [titulares]);

    const mediaOVR = useMemo(() => {
        if (titulares.length === 0) return 0;
        const total = titulares.reduce((acc, j) => acc + (j.esLeyenda ? 92 : 87), 0);
        return Math.round(total / titulares.length);
    }, [titulares]);

    const jugadoresSinUbicar = equipo.filter(
        (j) => !clavesTitulares.includes(j.posicion) && !CLAVES_BANCA.includes(j.posicion)
    );

    const handleQuitar = async (evento, id) => {
        evento.stopPropagation();
        try {
            await eliminarJugador(id);
            if (seleccionado?.jugador?.id === id) setSeleccionado(null);
            if (jugadorDetalle?.id === id) setJugadorDetalle(null);
            cargarEquipo();
        } catch (err) {
            setError(err.message);
        }
    };

    const ejecutarIntercambio = async (origenDestino, claveDestino, jOrigen, jDestino, claveOrigen) => {
        try {
            if (jOrigen && jDestino) {
                await actualizarJugador(jOrigen.id, { posicion: claveDestino });
                await actualizarJugador(jDestino.id, { posicion: claveOrigen });
            } else if (jOrigen && !jDestino) {
                await actualizarJugador(jOrigen.id, { posicion: claveDestino });
            }
            setSeleccionado(null);
            setDragOverKey(null);
            cargarEquipo();
        } catch (err) {
            setError("Error al rotar: " + err.message);
        }
    };

    const handleSlotClick = (origen, clave, jugadorEnDestino) => {
        if (!seleccionado) {
            if (jugadorEnDestino) setSeleccionado({ origen, clave, jugador: jugadorEnDestino });
            return;
        }
        if (seleccionado.clave === clave && seleccionado.origen === origen) {
            setSeleccionado(null);
            return;
        }
        ejecutarIntercambio(origen, clave, seleccionado.jugador, jugadorEnDestino, seleccionado.clave);
    };

    const handleDragStart = (e, origen, clave, jugador) => {
        if (!jugador) return;
        e.dataTransfer.setData("application/json", JSON.stringify({ origen, clave, jugadorId: jugador.id }));
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDrop = (e, origenDestino, claveDestino, jugadorEnDestino) => {
        e.preventDefault();
        setDragOverKey(null);
        try {
            const raw = e.dataTransfer.getData("application/json");
            if (!raw) return;
            const data = JSON.parse(raw);
            if (data.clave === claveDestino && data.origen === origenDestino) return;
            const jOrigen = equipo.find((p) => p.id === data.jugadorId);
            if (jOrigen) ejecutarIntercambio(origenDestino, claveDestino, jOrigen, jugadorEnDestino, data.clave);
        } catch (err) {
            setError(err.message);
        }
    };

    const renderCardJugador = (jugador, etiqueta) => (
        <div className={`tarjeta-cancha ${jugador.esLeyenda ? "leyenda-borde" : ""}`}>
            <button
                type="button"
                className="btn-eliminar-slot"
                onClick={(e) => handleQuitar(e, jugador.id)}
                title="Eliminar del equipo"
            >
                ✕
            </button>

            <button
                type="button"
                className="btn-info-slot"
                onClick={(e) => {
                    e.stopPropagation();
                    setJugadorDetalle(jugador);
                }}
                title="Ver estadísticas completas"
            >
                ℹ️
            </button>

            <span className="pos-badge">{etiqueta}</span>

            <div className="avatar-contenedor">
                <img
                    src={jugador.imagen || "https://placehold.co/100x100?text=?"}
                    alt={jugador.nombre}
                    draggable={false}
                />
                {jugador.esLeyenda && <span className="icono-trofeo">🏆</span>}
            </div>

            <div className="nombre-jugador" title={jugador.nombre}>
                {jugador.nombre}
            </div>

            <div className="stats-barra">
                <span>{jugador.altura ? jugador.altura.replace(" ", "") : "--"}</span>
                <span>•</span>
                <span>{jugador.nacionalidad ? jugador.nacionalidad.slice(0, 3).toUpperCase() : "N/D"}</span>
            </div>
        </div>
    );

    return (
        <section className="mi-equipo-seccion">
            <div className="panel-metricas">
                <div className="caja-metrica">
                    <div className="valor">{mediaOVR || "--"}</div>
                    <div className="titulo">Media OVR</div>
                </div>
                <div className="caja-metrica">
                    <div className="valor">{quimica}%</div>
                    <div className="titulo">Química</div>
                </div>
                <div className="caja-metrica">
                    <div className="valor">{titulares.length}/11</div>
                    <div className="titulo">Titulares</div>
                </div>
            </div>

            <div className="barra-superior">
                <h2>Alineación Titular ⚽</h2>
                <div className="selector-formacion">
                    <label htmlFor="select-formacion">Esquema:</label>
                    <select
                        id="select-formacion"
                        value={formacionActual}
                        onChange={(e) => {
                            setFormacionActual(e.target.value);
                            setSeleccionado(null);
                        }}
                    >
                        {Object.keys(FORMACIONES).map((clave) => (
                            <option key={clave} value={clave}>
                                {FORMACIONES[clave].nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {seleccionado && (
                <div className="banner-rotacion">
                    <span>
                        Moviendo a <strong>{seleccionado.jugador.nombre}</strong>. Haz clic o arrastra sobre otro puesto para rotar.
                    </span>
                    <button type="button" onClick={() => setSeleccionado(null)}>Cancelar</button>
                </div>
            )}

            {error && <p className="mensaje-error">{error}</p>}

            {/* Cancha Verde Oscuro con proporciones amplias */}
            <div className="cancha">
                <div className="linea-medio"></div>
                <div className="circulo-central"></div>
                <div className="area-grande arriba"></div>
                <div className="area-chica arriba"></div>
                <div className="area-grande abajo"></div>
                <div className="area-chica abajo"></div>
                <div className="arco abajo"></div>

                {Object.entries(formacion.posiciones).map(([clave, coords]) => {
                    const jugador = buscarJugadorEnSlot(clave);
                    const estaSeleccionado = seleccionado?.origen === "cancha" && seleccionado?.clave === clave;
                    const isOver = dragOverKey === clave;
                    const etiqueta = etiquetaPosicion(formacion, clave);

                    return (
                        <div
                            key={clave}
                            draggable={Boolean(jugador)}
                            onDragStart={(e) => handleDragStart(e, "cancha", clave, jugador)}
                            onDragOver={(e) => { e.preventDefault(); setDragOverKey(clave); }}
                            onDragLeave={() => setDragOverKey(null)}
                            onDrop={(e) => handleDrop(e, "cancha", clave, jugador)}
                            className={`slot slot-cancha ${estaSeleccionado ? "seleccionado" : ""} ${isOver ? "drag-over" : ""}`}
                            style={{ top: `${coords.top}%`, left: `${coords.left}%` }}
                            onClick={() => handleSlotClick("cancha", clave, jugador)}
                        >
                            {jugador ? (
                                renderCardJugador(jugador, etiqueta)
                            ) : (
                                <div className="slot-vacio-cancha">
                                    <div className="mas-vacio">+</div>
                                    <div className="etiqueta-vacia">{etiqueta}</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Banco de Suplentes */}
            <div className="banca-seccion">
                <h3>Banquillo de Suplentes ({CLAVES_BANCA.filter(c => buscarJugadorEnSlot(c)).length}/{CLAVES_BANCA.length})</h3>
                <div className="banca-grid">
                    {CLAVES_BANCA.map((clave, index) => {
                        const jugador = buscarJugadorEnSlot(clave);
                        const estaSeleccionado = seleccionado?.origen === "banca" && seleccionado?.clave === clave;
                        const isOver = dragOverKey === clave;

                        return (
                            <div
                                key={clave}
                                draggable={Boolean(jugador)}
                                onDragStart={(e) => handleDragStart(e, "banca", clave, jugador)}
                                onDragOver={(e) => { e.preventDefault(); setDragOverKey(clave); }}
                                onDragLeave={() => setDragOverKey(null)}
                                onDrop={(e) => handleDrop(e, "banca", clave, jugador)}
                                className={`slot ${estaSeleccionado ? "seleccionado" : ""} ${isOver ? "drag-over" : ""}`}
                                onClick={() => handleSlotClick("banca", clave, jugador)}
                            >
                                {jugador ? (
                                    renderCardJugador(jugador, `SUP ${index + 1}`)
                                ) : (
                                    <div className="slot-vacio-cancha">
                                        <div className="mas-vacio">+</div>
                                        <div className="etiqueta-vacia">SUP {index + 1}</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Jugadores huérfanos */}
            {jugadoresSinUbicar.length > 0 && (
                <div className="banca-seccion" style={{ marginTop: 14, borderColor: "rgba(239, 68, 68, 0.4)" }}>
                    <h3 style={{ color: "#f87171" }}>Jugadores por reubicar ({jugadoresSinUbicar.length})</h3>
                    <div className="banca-grid">
                        {jugadoresSinUbicar.map((jugador) => (
                            <div
                                key={jugador.id}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, "reserva", jugador.posicion, jugador)}
                                className="slot"
                                onClick={() => handleSlotClick("reserva", jugador.posicion, jugador)}
                            >
                                {renderCardJugador(jugador, "RES")}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal de Detalle y Estadísticas completas */}
            {jugadorDetalle && (
                <div className="modal-overlay" onClick={() => setJugadorDetalle(null)}>
                    <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-cerrar" onClick={() => setJugadorDetalle(null)}>✕</button>
                        <div className="modal-header">
                            <img src={jugadorDetalle.imagen} alt={jugadorDetalle.nombre} />
                            <div>
                                <h3>{jugadorDetalle.nombre} {jugadorDetalle.esLeyenda && "🏆"}</h3>
                                <p className="subtitulo-club">{jugadorDetalle.equipoReal || "Sin Club"}</p>
                            </div>
                        </div>
                        <div className="modal-stats-grid">
                            <div className="stat-ficha">
                                <span className="stat-label">Posición Asignada</span>
                                <span className="stat-val">{jugadorDetalle.posicion}</span>
                            </div>
                            <div className="stat-ficha">
                                <span className="stat-label">Estatura</span>
                                <span className="stat-val">{jugadorDetalle.altura || "No declarada"}</span>
                            </div>
                            <div className="stat-ficha">
                                <span className="stat-label">Nacionalidad</span>
                                <span className="stat-val">{jugadorDetalle.nacionalidad || "N/D"}</span>
                            </div>
                            <div className="stat-ficha">
                                <span className="stat-label">Fecha Nacimiento</span>
                                <span className="stat-val">{jugadorDetalle.nacimiento || "N/D"}</span>
                            </div>
                            <div className="stat-ficha">
                                <span className="stat-label">Estado</span>
                                <span className="stat-val">{jugadorDetalle.esLeyenda ? "Leyenda Retirada" : "En Activo"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default MiEquipo;