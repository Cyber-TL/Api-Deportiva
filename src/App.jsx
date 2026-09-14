import { useState } from "react";
import BuscarJugador from "./pages/BuscarJugador";
import MiEquipo from "./pages/MiEquipo";
import "./styles.css";

function App() {
    const [actualizarEquipo, setActualizarEquipo] = useState(0);

    return (
        <main>
            <h1>Fútbol 11 ⚽</h1>

            <BuscarJugador
                onJugadorAgregado={() =>
                    setActualizarEquipo((valor) => valor + 1)
                }
            />

            <hr />

            <MiEquipo actualizarEquipo={actualizarEquipo} />
        </main>
    );
}

export default App;