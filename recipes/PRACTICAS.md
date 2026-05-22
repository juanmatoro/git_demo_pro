# Prácticas de Git con el Recetario

Este recetario es el sandbox real para ejecutar los módulos del [README principal](../README.md). En vez de practicar con archivos abstractos `archivo1.txt`, vas a editar recetas, agregar postres, resolver conflictos de "con cebolla o sin cebolla" y publicar versiones de tu libro de cocina.

> Recordatorio del README: si rompes algo, no borres el repo. Resuélvelo con Git. Ese es el verdadero ejercicio.

## Cómo está montado el sandbox

El recetario es una mini-app hecha con **Astro** (sobre Vite) que lee las recetas directamente desde archivos Markdown. Estructura clave:

```
recipes/
├── package.json              # dependencias y scripts
├── astro.config.mjs
├── PRACTICAS.md              # esta guía
└── src/
    ├── content/
    │   ├── config.ts         # schema (frontmatter requerido)
    │   └── recetas/          # ← aquí van tus .md
    ├── pages/                # rutas del sitio (index, recetas, menus, practicas)
    ├── layouts/              # plantillas
    ├── components/           # Nav.astro (menú superior)
    └── styles/
```

### Comandos del proyecto

```bash
cd recipes
npm install                   # solo la primera vez
npm run dev                   # arranca en http://localhost:4321
npm run build                 # genera dist/ estática
npm run preview               # sirve dist/ para verificar
```

> Tip: deja `npm run dev` corriendo mientras practicas. Cada vez que agregues o edites una receta, el navegador refresca solo. Si rompes el frontmatter de un .md, Astro te lo grita en consola.

### Frontmatter requerido en cada receta

Cada receta debe empezar con este bloque YAML para pasar la validación del schema en `src/content/config.ts`:

```yaml
---
title: "Nombre de la receta"
descripcion: "Una línea que la describe."
categoria: "principal"     # entrante | principal | postre | bebida | desayuno
tiempo: "30 min"
porciones: 4
dificultad: "fácil"        # muy fácil | fácil | media | difícil
tags: ["tag1", "tag2"]
---
```

Si te falta un campo o usas un valor fuera de los enum, `npm run build` falla. **Eso es bueno**: es feedback inmediato.

---

## Mapa de prácticas por módulo

| Módulo del README | Qué vas a hacer aquí |
| --- | --- |
| [1) Fundamentos del repositorio](../README.md#1-fundamentos-del-repositorio) | Crear una receta nueva, ver las 3 zonas |
| [2) Historial y exploración](../README.md#2-historial-y-exploración) | Modificar `tortilla-de-patatas.md` y leer el historial |
| [3) Ramas y merge](../README.md#3-ramas-y-merge) | Crear `feature/postres` y mergear a `main` |
| [4) Rebase y limpieza de historial](../README.md#4-rebase-y-limpieza-de-historial) | Limpiar commits "wip" al agregar una receta |
| [5) Conflictos](../README.md#5-conflictos-nivel-obligatorio) | El clásico "con cebolla / sin cebolla" |
| [6) Recuperación y seguridad](../README.md#6-recuperación-y-seguridad) | Revertir un ingrediente equivocado, recuperar receta perdida |
| [7) Trabajo remoto](../README.md#7-trabajo-remoto-y-colaboración) | Publicar el recetario en GitHub y simular PR |
| [8) Cherry-pick, tags y releases](../README.md#8-cherry-pick-tags-y-releases) | Portar un fix urgente y etiquetar `v1.0.0` |

---

## Módulo 1 - Crear una receta nueva (las 3 zonas)

**Objetivo:** ver una receta atravesando working tree -> staging -> historial, y verla aparecer en la web automáticamente.

```bash
# Desde la raíz del repo (git3/)

# 1. Asegúrate de tener el dev server corriendo
# en otra terminal:  cd recipes && npm run dev

# 2. Crea la receta nueva (zona 1: working tree, untracked)
cat > recipes/src/content/recetas/limonada.md << 'EOF'
---
title: "Limonada casera"
descripcion: "Refrescante, lista en 5 minutos."
categoria: "bebida"
tiempo: "5 min"
porciones: 4
dificultad: "muy fácil"
tags: ["bebida", "refrescante", "verano"]
---

## Ingredientes

- 4 limones
- 1 litro de agua
- 4 cucharadas de azúcar
- Hielo

## Pasos

1. Exprimir los limones.
2. Mezclar con el agua y el azúcar.
3. Servir con hielo.
EOF

git status                                          # untracked
git add recipes/src/content/recetas/limonada.md     # ahora staged
git status
git commit -m "feat(recetas): agrega receta de limonada"
git log --oneline
```

**Verificación:**

- `git log --oneline` muestra tu commit nuevo.
- En el navegador, http://localhost:4321/recetas debe mostrar la limonada bajo categoría "bebida".

---

## Módulo 2 - Modificar y explorar historial

**Objetivo:** ver `git diff`, `git log` y `git blame` sobre cambios reales.

```bash
# Edita la tortilla: cambia "4 patatas medianas" por "5 patatas medianas"
# Archivo: recipes/src/content/recetas/tortilla-de-patatas.md

git diff                                            # ve el cambio sin stagear
git add recipes/src/content/recetas/tortilla-de-patatas.md
git diff --staged                                   # ve el cambio ya staged
git commit -m "fix(tortilla): ajusta cantidad de patatas a 5"

git log --oneline
git log --stat                                      # cuántas líneas cambiaron
git log --patch -n 1                                # el diff del último commit
git show HEAD                                       # contenido completo
git blame recipes/src/content/recetas/tortilla-de-patatas.md
```

---

## Módulo 3 - Ramas y merge: agregar postres

**Objetivo:** trabajar en una rama aparte y mergear sin pisar `main`.

```bash
git switch -c feature/postres

# Crea receta de flan
cat > recipes/src/content/recetas/flan.md << 'EOF'
---
title: "Flan casero"
descripcion: "Postre clásico con caramelo. Ideal para sobremesa."
categoria: "postre"
tiempo: "1 h"
porciones: 6
dificultad: "media"
tags: ["postre", "huevos", "clásico"]
---

## Ingredientes

- 6 huevos
- 500 ml de leche
- 200 g de azúcar
- 1 cucharadita de esencia de vainilla

## Pasos

1. Caramelizar la mitad del azúcar en una flanera.
2. Batir los huevos con el resto del azúcar, la leche y la vainilla.
3. Verter sobre el caramelo.
4. Hornear al baño maría 50 minutos a 170 grados.
5. Enfriar antes de desmoldar.
EOF
git add . && git commit -m "feat(postres): agrega flan casero"

# Crea receta de brownies
cat > recipes/src/content/recetas/brownies.md << 'EOF'
---
title: "Brownies de chocolate"
descripcion: "Densos, húmedos, peligrosos. 25 minutos al horno."
categoria: "postre"
tiempo: "40 min"
porciones: 8
dificultad: "fácil"
tags: ["postre", "chocolate", "horno"]
---

## Ingredientes

- 200 g de chocolate negro
- 150 g de mantequilla
- 3 huevos
- 150 g de azúcar
- 80 g de harina

## Pasos

1. Fundir el chocolate con la mantequilla a baño maría.
2. Batir los huevos con el azúcar.
3. Mezclar las dos preparaciones, incorporar la harina.
4. Verter en molde forrado, hornear 25 min a 180 grados.
EOF
git add . && git commit -m "feat(postres): agrega brownies"

# Vuelve a main y mergea con merge commit
git switch main
git merge --no-ff feature/postres -m "merge: integra sección de postres"
git lg
```

**Verificación:** en http://localhost:4321/recetas debe aparecer la nueva categoría "postre" con las 2 recetas.

---

## Módulo 4 - Rebase interactivo para limpiar historia

**Objetivo:** convertir 4 commits "wip" en uno limpio antes de mergear.

```bash
git switch -c feature/smoothie

# Hacemos commits sucios a propósito (cada uno deja el .md en estado inválido o incompleto)
cat > recipes/src/content/recetas/smoothie.md << 'EOF'
---
title: "Smoothie de banana"
descripcion: "WIP"
categoria: "bebida"
tiempo: "5 min"
porciones: 2
dificultad: "muy fácil"
tags: ["bebida"]
---

# Smoothie
EOF
git add . && git commit -m "wip 1"

echo "- 1 banana" >> recipes/src/content/recetas/smoothie.md
git add . && git commit -m "wip 2"

echo "- 200 ml de leche" >> recipes/src/content/recetas/smoothie.md
git add . && git commit -m "agrega leche, perdón"

echo "Licuar y servir frío." >> recipes/src/content/recetas/smoothie.md
git add . && git commit -m "wip 3 (último)"

git log --oneline                                   # 4 commits sucios

# Limpia el historial
git rebase -i HEAD~4
# En el editor: deja "pick" el primero, cambia a "squash" (o "s") los otros 3.
# Guarda. Git abre otro editor: deja un solo mensaje claro como:
#   feat(bebidas): agrega smoothie de banana

git log --oneline                                   # ahora hay UN solo commit
```

---

## Módulo 5 - Conflicto: con cebolla o sin cebolla

**Objetivo:** provocar y resolver el conflicto más famoso de la cocina española.

```bash
git switch main

# Rama del bando "con cebolla"
git switch -c feature/cebolla-si
# Edita recipes/src/content/recetas/tortilla-de-patatas.md:
# cambia "- 1 cebolla mediana" por "- 2 cebollas medianas (con cebolla, por supuesto)"
git add . && git commit -m "feat(tortilla): refuerza cebolla"

# Otro contribuyente edita main al revés
git switch main
# Edita la misma línea por "- 0 cebollas (la cebolla arruina la tortilla)"
git add . && git commit -m "fix(tortilla): elimina cebolla, versión pura"

# Intenta mergear: CONFLICTO
git merge feature/cebolla-si
# El archivo tendrá los marcadores <<<<<<<, =======, >>>>>>>.
# Edítalo a mano, decide el resultado, quita los marcadores.
git add recipes/src/content/recetas/tortilla-de-patatas.md
git commit                                          # confirma el merge
```

Repite el escenario con `git rebase feature/cebolla-si` para sentir la diferencia de flujo.

---

## Módulo 6 - Recuperar trabajo

**Objetivo:** deshacer un cambio publicado y rescatar una receta "perdida".

```bash
# 1. Commit "malo": agrega un ingrediente equivocado a la pasta
# Edita pasta-aglio-olio.md y agrega "- 500 g de azúcar" en la lista de ingredientes
git add . && git commit -m "feat(pasta): agrega azúcar (¡mal!)"

# Revertir sin reescribir historia
git revert HEAD
# Git crea un commit nuevo que deshace el anterior. La historia queda visible.

# 2. Simula pérdida de receta
git switch -c feature/te-frio
cat > recipes/src/content/recetas/te-frio.md << 'EOF'
---
title: "Té frío"
descripcion: "Sencillo, refrescante, sin azúcar agregada."
categoria: "bebida"
tiempo: "10 min + reposo"
porciones: 4
dificultad: "muy fácil"
tags: ["bebida", "té", "frío"]
---

## Ingredientes
- 3 bolsitas de té negro
- 1 litro de agua
- Hielo
- Limón

## Pasos
1. Hervir el agua, infusionar 5 minutos.
2. Enfriar, agregar hielo y rodajas de limón.
EOF
git add . && git commit -m "feat(bebidas): agrega té frío"

git switch main
git branch -D feature/te-frio                       # "borraste" la rama por error

# Recupera con reflog
git reflog                                          # busca el commit "feat(bebidas): agrega té frío"
git switch -c feature/te-frio <hash-encontrado>
ls recipes/src/content/recetas/te-frio.md           # está de vuelta
```

---

## Módulo 7 - Trabajo remoto y PRs

**Objetivo:** publicar el recetario y simular el flujo de revisión.

```bash
# (Crea un repo vacío en GitHub primero, sin README)
git remote add origin https://github.com/tu-usuario/recetario.git
git push -u origin main

# Crea una rama de feature y súbela
git switch -c feature/granola
cat > recipes/src/content/recetas/granola.md << 'EOF'
---
title: "Granola casera"
descripcion: "Crujiente, dulce, dura semanas en frasco hermético."
categoria: "desayuno"
tiempo: "35 min"
porciones: 10
dificultad: "fácil"
tags: ["desayuno", "horno", "avena"]
---

## Ingredientes
- 300 g de avena
- 100 g de frutos secos
- 80 g de miel
- 50 ml de aceite
- Frutas secas al gusto

## Pasos
1. Mezclar todo en un bol.
2. Extender en bandeja de horno.
3. Hornear 25 min a 160 grados, removiendo cada 8 minutos.
4. Enfriar antes de guardar.
EOF
git add . && git commit -m "feat(desayunos): agrega granola"
git push -u origin feature/granola

# En GitHub, abre un PR de feature/granola contra main.
# Auto-revisa el diff antes de mergear.
```

---

## Módulo 8 - Cherry-pick y release

**Objetivo:** llevar un fix puntual a `main` y etiquetar la versión `v1.0.0`.

```bash
git switch -c feature/varios

# Commit 1: fix urgente que SÍ queremos llevar a main
# Edita pasta-aglio-olio.md: cambia "60 ml de aceite" por "80 ml de aceite"
git add . && git commit -m "fix(pasta): aumenta aceite a 80 ml"

# Commit 2: experimento que NO queremos en main aún
# Edita ensalada-cesar.md y agrega una sección "## Variante con tofu"
git add . && git commit -m "wip: experimento con tofu"

# Encuentra el hash del fix
git log --oneline

# Llévalo a main sin traer el experimento
git switch main
git cherry-pick <hash-del-fix>

# Cuando el recetario esté listo, taggea v1.0.0
git tag -a v1.0.0 -m "Primer release del recetario"
git push origin v1.0.0
git show v1.0.0
```

---

## Módulo extra - Agregar un menú (combinación de recetas)

**Objetivo:** practicar Git tocando código de la web, no solo Markdown.

```bash
git switch -c feature/menu-cena-vegetariana

# Edita recipes/src/pages/menus.astro
# En el array "menus", agrega un objeto nuevo:
#
#   {
#     nombre: 'Cena vegetariana ligera',
#     descripcion: 'Sin carne, llena pero no pesada.',
#     recetas: ['ensalada-cesar', 'pasta-aglio-olio'],
#   },

git add . && git commit -m "feat(menus): agrega menú vegetariano"
# El menú aparece en http://localhost:4321/menus
```

---

## Checklist del recetario

Marca cada uno cuando lo hayas hecho aquí mismo:

- [ ] Agregué una receta nueva con frontmatter válido y la vi en http://localhost:4321/recetas
- [ ] Edité una receta y revisé el cambio con `git diff`
- [ ] Creé una rama de postres y la mergeé con `--no-ff`
- [ ] Limpié 4 commits "wip" con rebase interactivo
- [ ] Resolví el conflicto cebolla-sí vs cebolla-no
- [ ] Revoqué un commit con `git revert`
- [ ] Recuperé una receta perdida con `reflog`
- [ ] Publiqué una rama en remoto y abrí un PR
- [ ] Llevé un fix puntual con `cherry-pick`
- [ ] Etiqueté una versión con `git tag -a`
- [ ] Agregué un menú nuevo modificando `src/pages/menus.astro`

Cuando todo esté marcado, ya domas Git con un proyecto real entre manos.
