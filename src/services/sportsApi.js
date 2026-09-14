const API_URL = "https://www.thesportsdb.com/api/v1/json/123";

export const buscarJugador = async (nombre) => {
    const respuesta = await fetch(
        `${API_URL}/searchplayers.php?p=${nombre}`
    );

    if (!respuesta.ok) {
        throw new Error("Error al buscar el jugador");
    }

    const datos = await respuesta.json();

    if (!datos.player) {
        throw new Error("Jugador no encontrado");
    }

    return datos.player;
};