import { useState, useEffect } from 'preact/hooks';

const base = import.meta.env.BASE_URL;

export default function BuscadorRecetas({ recetas }) {
  const [query, setQuery] = useState('');
  const [categoria, setCategoria] = useState('');

  useEffect(() => {
    const handler = (e) => setCategoria(e.detail.categoria);
    window.addEventListener('filtro:categoria', handler);
    return () => window.removeEventListener('filtro:categoria', handler);
  }, []);

  const q = query.trim().toLowerCase();
  const filtradas = recetas.filter((r) => {
    if (q && !r.title.toLowerCase().includes(q) && !r.tags.some((t) => t.toLowerCase().includes(q))) {
      return false;
    }
    if (categoria && r.categoria !== categoria) {
      return false;
    }
    return true;
  });

  return (
    <div class="buscador">
      <input
        type="search"
        placeholder="Buscar por nombre o tag..."
        value={query}
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
      <p class="contador">{filtradas.length} recetas</p>
      {filtradas.length === 0 ? (
        <p class="sin-resultados">No se encontraron recetas.</p>
      ) : (
        <div class="grid">
          {filtradas.map((r) => (
            <a href={`${base}/recetas/${r.slug}`} class="card" key={r.slug}>
              <img
                class="card-img"
                src={r.imagen || `https://picsum.photos/seed/${r.slug}/400/300`}
                alt={r.title}
                loading="lazy"
              />
              <div class="card-body">
                <h3 class="card-title">{r.title}</h3>
                <span class="card-cat">{r.categoria}</span>
                <p class="card-desc">{r.descripcion}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
