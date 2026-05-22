import { useState } from 'preact/hooks';

const base = import.meta.env.BASE_URL;
const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function aleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generarDia(entrantes, principales, postres) {
  return {
    entrante: aleatorio(entrantes),
    principal: aleatorio(principales),
    postre: aleatorio(postres),
  };
}

function generarSemana(entrantes, principales, postres) {
  return DIAS.map((dia) => ({ dia, ...generarDia(entrantes, principales, postres) }));
}

export default function GeneradorMenu({ recetas }) {
  const entrantes = recetas.filter((r) => r.categoria === 'entrante');
  const principales = recetas.filter((r) => r.categoria === 'principal');
  const postres = recetas.filter((r) => r.categoria === 'postre');

  const [menu, setMenu] = useState(null);
  const [semana, setSemana] = useState(null);

  return (
    <div class="generador-menu">
      <div class="acciones">
        <button onClick={() => { setMenu(generarDia(entrantes, principales, postres)); setSemana(null); }}>
          Menú del día
        </button>
        <button onClick={() => { setSemana(generarSemana(entrantes, principales, postres)); setMenu(null); }}>
          Semana completa
        </button>
      </div>

      {menu && (
        <div class="menu-dia">
          <h2>Menú del día</h2>
          <div class="menu-grid">
            <RecetaCard receta={menu.entrante} label="Primero" />
            <RecetaCard receta={menu.principal} label="Segundo" />
            <RecetaCard receta={menu.postre} label="Postre" />
          </div>
        </div>
      )}

      {semana && (
        <div class="menu-semana">
          <h2>Semana completa</h2>
          {semana.map((d) => (
            <details class="dia" open>
              <summary>{d.dia}</summary>
              <div class="menu-grid">
                <RecetaCard receta={d.entrante} label="Primero" />
                <RecetaCard receta={d.principal} label="Segundo" />
                <RecetaCard receta={d.postre} label="Postre" />
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

function RecetaCard({ receta, label }) {
  return (
    <a href={`${base}/recetas/${receta.slug}`} class="card receta-card">
      <span class="receta-label">{label}</span>
      <h3 class="card-title">{receta.title}</h3>
      <p class="card-desc">{receta.descripcion}</p>
      <span class="card-cat">{receta.tiempo} &middot; {receta.dificultad}</span>
    </a>
  );
}
