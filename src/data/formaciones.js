export const FORMACIONES = {
    "4-3-3": {
        nombre: "4-3-3 Ofensiva",
        posiciones: {
            POR:  { top: 89, left: 50 },
            DFI:  { top: 71, left: 14 },
            DFC1: { top: 74, left: 38 },
            DFC2: { top: 74, left: 62 },
            DFD:  { top: 71, left: 86 },
            MCD:  { top: 54, left: 50 },
            MI:   { top: 40, left: 24 },
            MD:   { top: 40, left: 76 },
            EI:   { top: 19, left: 18 },
            DEL:  { top: 11, left: 50 },
            ED:   { top: 19, left: 82 }
        }
    },
    "4-2-3-1": {
        nombre: "4-2-3-1 Equilibrada",
        posiciones: {
            POR:   { top: 89, left: 50 },
            DFI:   { top: 71, left: 14 },
            DFC1:  { top: 74, left: 38 },
            DFC2:  { top: 74, left: 62 },
            DFD:   { top: 71, left: 86 },
            MCD1:  { top: 56, left: 36 },
            MCD2:  { top: 56, left: 64 },
            EI:    { top: 34, left: 18 },
            MCO:   { top: 30, left: 50 },
            ED:    { top: 34, left: 82 },
            DEL:   { top: 12, left: 50 }
        }
    },
    "3-4-3": {
        nombre: "3-4-3 Total",
        posiciones: {
            POR:  { top: 89, left: 50 },
            DFI:  { top: 73, left: 22 },
            DFC:  { top: 75, left: 50 },
            DFD:  { top: 73, left: 78 },
            MI:   { top: 48, left: 12 },
            MCD:  { top: 52, left: 37 },
            MCO:  { top: 52, left: 63 },
            MD:   { top: 48, left: 88 },
            EI:   { top: 20, left: 18 },
            DEL:  { top: 11, left: 50 },
            ED:   { top: 20, left: 82 }
        }
    },
    "5-3-2": {
        nombre: "5-3-2 Defensiva",
        etiquetas: {
            DFC1: "Central Izq.",
            DFC2: "Líbero / DFC",
            DFC3: "Central Der."
        },
        posiciones: {
            POR:  { top: 90, left: 50 },
            // Carrileros bien separados y adelantados
            DFI:  { top: 64, left: 9 },
            // Centrales con amplio respiro vertical respecto al arquero
            DFC1: { top: 73, left: 29.5 },
            DFC2: { top: 71, left: 50 },
            DFC3: { top: 73, left: 70.5 },
            DFD:  { top: 64, left: 91 },
            // Medios escalonados
            MI:   { top: 46, left: 22 },
            MCD:  { top: 42, left: 50 },
            MD:   { top: 46, left: 78 },
            // Delantera
            DEL1: { top: 16, left: 35 },
            DEL2: { top: 16, left: 65 }
        }
    }
};

export const NOMBRES_POSICION = {
    POR:  "Portero",
    DFI:  "Defensa Izq.",
    DFD:  "Defensa Der.",
    DFC:  "Defensa Central",
    DFC1: "Central Izq.",
    DFC2: "Central Der.",
    DFC3: "Central",
    MCD:  "Medio Def.",
    MCD1: "Medio Def. Izq.",
    MCD2: "Medio Def. Der.",
    MI:   "Medio Izq.",
    MD:   "Medio Der.",
    MCO:  "Medio Ofensivo",
    EI:   "Extremo Izq.",
    ED:   "Extremo Der.",
    DEL:  "Delantero",
    DEL1: "Delantero Izq.",
    DEL2: "Delantero Der."
};

export const NUM_SUPLENTES = 7;
export const CLAVES_BANCA = Array.from({ length: NUM_SUPLENTES }, (_, i) => `SUP${i + 1}`);

export const etiquetaPosicion = (formacion, clave) =>
    formacion?.etiquetas?.[clave] ?? NOMBRES_POSICION[clave] ?? clave;