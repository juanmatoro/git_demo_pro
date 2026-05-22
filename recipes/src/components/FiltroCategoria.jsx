export default function FiltroCategoria({ categorias, seleccionada }) {
  const onChange = (e) => {
    const value = e.currentTarget.value;
    window.dispatchEvent(
      new CustomEvent('filtro:categoria', { detail: { categoria: value } })
    );
  };

  return (
    <div class="filtro-categoria">
      <label htmlFor="cat-select">Filtrar por categoría:</label>
      <select id="cat-select" value={seleccionada || ''} onChange={onChange}>
        <option value="">Todas</option>
        {categorias.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
}
