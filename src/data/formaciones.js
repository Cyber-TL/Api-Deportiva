export const FORMACIONES = {
    "4-3-3": {
        nombre: "4-3-3 Ofensiva",
        posiciones: {
            POR: { top: 90, left: 50 },
            DFI: { top: 72, left: 18 },
            DFD: { top: 72, left: 82 },
            MCD: { top: 54, left: 50 },
            MI:  { top: 42, left: 25 },
            MD:  { top: 42, left: 75 },
            MCO: { top: 30, left: 50 },
            EI:  { top: 14, left: 18 },
            ED:  { top: 14, left: 82 },
            DEL: { top: 6,  left: 50 }
        }
    },
    "4-2-3-1": {
    name: "4-2-3-1 Equilibrada",
    positions: [
      // 1. Portero
      { id: "por", name: "Portero", role: "Portero", top: 88, left: 50 },

      // 2. Línea de 4 Defensas (bien repartidos a lo ancho: 16%, 38%, 62%, 84%)
      { id: "dfi", name: "Defensa Izq.", role: "Lateral Izquierdo", top: 74, left: 16 },
      { id: "dfc1", name: "Defensa Central Izq.", role: "Central Izquierdo", top: 75, left: 38 },
      { id: "dfc2", name: "Defensa Central Der.", role: "Central Derecho", top: 75, left: 62 },
      { id: "dfd", name: "Defensa Der.", role: "Lateral Derecho", top: 74, left: 84 },

      // 3. Doble Pivote (Mediocentros defensivos)
      { id: "mcd1", name: "Medio Def. Izq.", role: "Pivote Defensivo", top: 58, left: 36 },
      { id: "mcd2", name: "Medio Def. Der.", role: "Pivote Defensivo", top: 58, left: 64 },

      // 4. Línea de 3 Medios Ofensivos / Extremos
      { id: "exi", name: "Extremo Izq.", role: "Extremo Izquierdo", top: 35, left: 20 },
      { id: "mco", name: "Medio Ofensivo", role: "Enganche", top: 38, left: 50 },
      { id: "exd", name: "Extremo Der.", role: "Extremo Derecho", top: 35, left: 80 },

      // 5. Delantero Centro (con margen arriba para que no corte la cabeza)
      { id: "dc", name: "Delantero", role: "Delantero Centro", top: 14, left: 50 }
    ]
  },
    "3-4-3": {
        nombre: "3-4-3 Total",
        posiciones: {
            POR: { top: 90, left: 50 },
            DFI: { top: 68, left: 12 },
            DFD: { top: 68, left: 88 },
            MCD: { top: 52, left: 50 },
            MI:  { top: 40, left: 20 },
            MD:  { top: 40, left: 80 },
            MCO: { top: 26, left: 50 },
            EI:  { top: 12, left: 15 },
            ED:  { top: 12, left: 85 },
            DEL: { top: 5,  left: 50 }
        }
    },
    "5-3-2": {
        nombre: "5-3-2 Defensiva",
        posiciones: {
            POR: { top: 93, left: 50 },
            DFI: { top: 80, left: 20 },
            DFD: { top: 80, left: 80 },
            MCD: { top: 66, left: 50 },
            MI:  { top: 54, left: 32 },
            MD:  { top: 54, left: 68 },
            MCO: { top: 42, left: 50 },
            EI:  { top: 26, left: 25 },
            ED:  { top: 26, left: 75 },
            DEL: { top: 12, left: 50 }
        }
    }
};

export const NOMBRES_POSICION = {
    POR: "Portero",
    DFI: "Defensa Izq.",
    DFD: "Defensa Der.",
    MCD: "Mediocampo Def.",
    MI: "Medio Izq.",
    MD: "Medio Der.",
    MCO: "Mediocampo Of.",
    EI: "Extremo Izq.",
    ED: "Extremo Der.",
    DEL: "Delantero"
};