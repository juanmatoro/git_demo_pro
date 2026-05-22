# Practicas de Git con el Recetario

Este recetario es el sandbox real para ejecutar los modulos del [README principal](../README.md). En vez de practicar con archivos abstractos `archivo1.txt`, vas a editar recetas, agregar postres, resolver conflictos de "con cebolla o sin cebolla" y publicar versiones de tu libro de cocina.

> Recordatorio del README: si rompes algo, no borres el repo. Resuelvelo con Git. Ese es el verdadero ejercicio.

## Como esta montado el sandbox

El recetario es una mini-app hecha con **Astro** (sobre Vite) que lee las recetas directamente desde archivos Markdown. Estructura clave:

```
recipes/
├── package.json              # dependencias y scripts
├── astro.config.mjs
├── PRACTICAS.md              # esta guia
└── src/
    ├── content/
    │   ├── config.ts         # schema (frontmatter requerido)
    │   └── recetas/          # ← aqui van tus .md
    ├── pages/                # rutas del sitio (index, recetas, menus, practicas)
    ├── layouts/              # plantillas
    ├── components/           # Nav.astro (menu superior)
    └── styles/
```

### Comandos del proyecto

```bash
cd recipes
npm install                   # solo la primera vez
npm run dev                   # arranca en http://localhost:4321
npm run build                 # genera dist/ estatica
npm run preview               # sirve dist/ para verificar
```

> Tip: deja `npm run dev` corriendo mientras practicas. Cada vez que agregues o edites una receta, el navegador refresca solo. Si rompes el frontmatter de un .md, Astro te lo grita en consola.

### Frontmatter requerido en cada receta

Cada receta debe empezar con este bloque YAML para pasar la validacion del schema en `src/content/config.ts`:

```yaml
---
title: "Nombre de la receta"
descripcion: "Una linea que la describe."
categoria: "principal"     # entrante | principal | postre | bebida | desayuno
tiempo: "30 min"
porciones: 4
dificultad: "facil"        # muy facil | facil | media | dificil
tags: ["tag1", "tag2"]
---
```

Si te falta un campo o usas un valor fuera de los enum, `npm run build` falla. **Eso es bueno**: es feedback inmediato.

---

## Mapa de practicas por modulo

| Modulo del README | Que vas a hacer aqui |
| --- | --- |
| [1) Fundamentos del repositorio](../README.md#1-fundamentos-del-repositorio) | Crear una receta nueva, ver las 3 zonas |
| [2) Historial y exploracion](../README.md#2-historial-y-exploracion) | Modificar `tortilla-de-patatas.md` y leer el historial |
| [3) Ramas y merge](../README.md#3-ramas-y-merge) | Crear `feature/postres` y mergear a `main` |
| [4) Rebase y limpieza de historial](../README.md#4-rebase-y-limpieza-de-historial) | Limpiar commits "wip" al agregar una receta |
| [5) Conflictos](../README.md#5-conflictos-nivel-obligatorio) | El clasico "con cebolla / sin cebolla" |
| [6) Recuperacion y seguridad](../README.md#6-recuperacion-y-seguridad) | Revertir un ingrediente equivocado, recuperar receta perdida |
| [7) Trabajo remoto](../README.md#7-trabajo-remoto-y-colaboracion) | Publicar el recetario en GitHub y simular PR |
| [8) Cherry-pick, tags y releases](../README.md#8-cherry-pick-tags-y-releases) | Portar un fix urgente y etiquetar `v1.0.0` |

---

## Modulo 1 - Crear una receta nueva (las 3 zonas)

**Objetivo:** ver una receta atravesando working tree -> staging -> historial, y verla aparecer en la web automaticamente.

```bash
# Desde la raiz del repo (git3/)

# 1. Asegurate de tener el dev server corriendo
# en otra terminal:  cd recipes && npm run dev

# 2. Crea la receta nueva (zona 1: working tree, untracked)
cat > recipes/src/content/recetas/limonada.md << 'EOF'
---
title: "Limonada casera"
descripcion: "Refrescante, lista en 5 minutos."
categoria: "bebida"
tiempo: "5 min"
porciones: 4
dificultad: "muy facil"
tags: ["bebida", "refrescante", "verano"]
---

## Ingredientes

- 4 limones
- 1 litro de agua
- 4 cucharadas de azucar
- Hielo

## Pasos

1. Exprimir los limones.
2. Mezclar con el agua y el azucar.
3. Servir con hielo.
EOF

git status                                          # untracked
git add recipes/src/content/recetas/limonada.md     # ahora staged
git status
git commit -m "feat(recetas): agrega receta de limonada"
git log --oneline
```

**Verificacion:**

- `git log --oneline` muestra tu commit nuevo.
- En el navegador, http://localhost:4321/recetas debe mostrar la limonada bajo categoria "bebida".

---

## Modulo 2 - Modificar y explorar historial

**Objetivo:** ver `git diff`, `git log` y `git blame` sobre cambios reales.

```bash
# Edita la tortilla: cambia "4 patatas medianas" por "5 patatas medianas"
# Archivo: recipes/src/content/recetas/tortilla-de-patatas.md

git diff                                            # ve el cambio sin stagear
git add recipes/src/content/recetas/tortilla-de-patatas.md
git diff --staged                                   # ve el cambio ya staged
git commit -m "fix(tortilla): ajusta cantidad de patatas a 5"

git log --oneline
git log --stat                                      # cuantas lineas cambiaron
git log --patch -n 1                                # el diff del ultimo commit
git show HEAD                                       # contenido completo
git blame recipes/src/content/recetas/tortilla-de-patatas.md
```

---

## Modulo 3 - Ramas y merge: agregar postres

**Objetivo:** trabajar en una rama aparte y mergear sin pisar `main`.

```bash
git switch -c feature/postres

# Crea receta de flan
cat > recipes/src/content/recetas/flan.md << 'EOF'
---
title: "Flan casero"
descripcion: "Postre clasico con caramelo. Ideal para sobremesa."
categoria: "postre"
tiempo: "1 h"
porciones: 6
dificultad: "media"
tags: ["postre", "huevos", "clasico"]
---

## Ingredientes

- 6 huevos
- 500 ml de leche
- 200 g de azucar
- 1 cucharadita de esencia de vainilla

## Pasos

1. Caramelizar la mitad del azucar en una flanera.
2. Batir los huevos con el resto del azucar, la leche y la vainilla.
3. Verter sobre el caramelo.
4. Hornear al bano maria 50 minutos a 170 grados.
5. Enfriar antes de desmoldar.
EOF
git add . && git commit -m "feat(postres): agrega flan casero"

# Crea receta de brownies
cat > recipes/src/content/recetas/brownies.md << 'EOF'
---
title: "Brownies de chocolate"
descripcion: "Densos, humedos, peligrosos. 25 minutos al horno."
categoria: "postre"
tiempo: "40 min"
porciones: 8
dificultad: "facil"
tags: ["postre", "chocolate", "horno"]
---

## Ingredientes

- 200 g de chocolate negro
- 150 g de mantequilla
- 3 huevos
- 150 g de azucar
- 80 g de harina

## Pasos

1. Fundir el chocolate con la mantequilla a bano maria.
2. Batir los huevos con el azucar.
3. Mezclar las dos preparaciones, incorporar la harina.
4. Verter en molde forrado, hornear 25 min a 180 grados.
EOF
git add . && git commit -m "feat(postres): agrega brownies"

# Vuelve a main y mergea con merge commit
git switch main
git merge --no-ff feature/postres -m "merge: integra seccion de postres"
git lg
```

**Verificacion:** en http://localhost:4321/recetas debe aparecer la nueva categoria "postre" con las 2 recetas.

---

## Modulo 4 - Rebase interactivo para limpiar historia

**Objetivo:** convertir 4 commits "wip" en uno limpio antes de mergear.

```bash
git switch -c feature/smoothie

# Hacemos commits sucios a proposito (cada uno deja el .md en estado invalido o incompleto)
cat > recipes/src/content/recetas/smoothie.md << 'EOF'
---
title: "Smoothie de banana"
descripcion: "WIP"
categoria: "bebida"
tiempo: "5 min"
porciones: 2
dificultad: "muy facil"
tags: ["bebida"]
---

# Smoothie
EOF
git add . && git commit -m "wip 1"

echo "- 1 banana" >> recipes/src/content/recetas/smoothie.md
git add . && git commit -m "wip 2"

echo "- 200 ml de leche" >> recipes/src/content/recetas/smoothie.md
git add . && git commit -m "agrega leche, perdon"

echo "Licuar y servir frio." >> recipes/src/content/recetas/smoothie.md
git add . && git commit -m "wip 3 (ultimo)"

git log --oneline                                   # 4 commits sucios

# Limpia el historial
git rebase -i HEAD~4
# En el editor: deja "pick" el primero, cambia a "squash" (o "s") los otros 3.
# Guarda. Git abre otro editor: deja un solo mensaje claro como:
#   feat(bebidas): agrega smoothie de banana

git log --oneline                                   # ahora hay UN solo commit
```

---

## Modulo 5 - Conflicto: con cebolla o sin cebolla

**Objetivo:** provocar y resolver el conflicto mas famoso de la cocina espanola.

```bash
git switch main

# Rama del bando "con cebolla"
git switch -c feature/cebolla-si
# Edita recipes/src/content/recetas/tortilla-de-patatas.md:
# cambia "- 1 cebolla mediana" por "- 2 cebollas medianas (con cebolla, por supuesto)"
git add . && git commit -m "feat(tortilla): refuerza cebolla"

# Otro contribuyente edita main al reves
git switch main
# Edita la misma linea por "- 0 cebollas (la cebolla arruina la tortilla)"
git add . && git commit -m "fix(tortilla): elimina cebolla, version pura"

# Intenta mergear: CONFLICTO
git merge feature/cebolla-si
# El archivo tendra los marcadores <<<<<<<, =======, >>>>>>>.
# Editalo a mano, decide el resultado, quita los marcadores.
git add recipes/src/content/recetas/tortilla-de-patatas.md
git commit                                          # confirma el merge
```

Repite el escenario con `git rebase feature/cebolla-si` para sentir la diferencia de flujo.

---

## Modulo 6 - Recuperar trabajo

**Objetivo:** deshacer un cambio publicado y rescatar una receta "perdida".

```bash
# 1. Commit "malo": agrega un ingrediente equivocado a la pasta
# Edita pasta-aglio-olio.md y agrega "- 500 g de azucar" en la lista de ingredientes
git add . && git commit -m "feat(pasta): agrega azucar (mal!)"

# Revertir sin reescribir historia
git revert HEAD
# Git crea un commit nuevo que deshace el anterior. La historia queda visible.

# 2. Simula perdida de receta
git switch -c feature/te-frio
cat > recipes/src/content/recetas/te-frio.md << 'EOF'
---
title: "Te frio"
descripcion: "Sencillo, refrescante, sin azucar agregada."
categoria: "bebida"
tiempo: "10 min + reposo"
porciones: 4
dificultad: "muy facil"
tags: ["bebida", "te", "frio"]
---

## Ingredientes
- 3 bolsitas de te negro
- 1 litro de agua
- Hielo
- Limon

## Pasos
1. Hervir el agua, infusionar 5 minutos.
2. Enfriar, agregar hielo y rodajas de limon.
EOF
git add . && git commit -m "feat(bebidas): agrega te frio"

git switch main
git branch -D feature/te-frio                       # "borraste" la rama por error

# Recupera con reflog
git reflog                                          # busca el commit "feat(bebidas): agrega te frio"
git switch -c feature/te-frio <hash-encontrado>
ls recipes/src/content/recetas/te-frio.md           # esta de vuelta
```

---

## Modulo 7 - Trabajo remoto y PRs

**Objetivo:** publicar el recetario y simular el flujo de revision.

```bash
# (Crea un repo vacio en GitHub primero, sin README)
git remote add origin https://github.com/tu-usuario/recetario.git
git push -u origin main

# Crea una rama de feature y subela
git switch -c feature/granola
cat > recipes/src/content/recetas/granola.md << 'EOF'
---
title: "Granola casera"
descripcion: "Crujiente, dulce, dura semanas en frasco hermetico."
categoria: "desayuno"
tiempo: "35 min"
porciones: 10
dificultad: "facil"
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

## Modulo 8 - Cherry-pick y release

**Objetivo:** llevar un fix puntual a `main` y etiquetar la version `v1.0.0`.

```bash
git switch -c feature/varios

# Commit 1: fix urgente que SI queremos llevar a main
# Edita pasta-aglio-olio.md: cambia "60 ml de aceite" por "80 ml de aceite"
git add . && git commit -m "fix(pasta): aumenta aceite a 80 ml"

# Commit 2: experimento que NO queremos en main aun
# Edita ensalada-cesar.md y agrega una seccion "## Variante con tofu"
git add . && git commit -m "wip: experimento con tofu"

# Encuentra el hash del fix
git log --oneline

# Llevalo a main sin traer el experimento
git switch main
git cherry-pick <hash-del-fix>

# Cuando el recetario este listo, taggea v1.0.0
git tag -a v1.0.0 -m "Primer release del recetario"
git push origin v1.0.0
git show v1.0.0
```

---

## Modulo extra - Agregar un menu (combinacion de recetas)

**Objetivo:** practicar Git tocando codigo de la web, no solo Markdown.

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

git add . && git commit -m "feat(menus): agrega menu vegetariano"
# El menu aparece en http://localhost:4321/menus
```

---

## Checklist del recetario

Marca cada uno cuando lo hayas hecho aqui mismo:

- [ ] Agregue una receta nueva con frontmatter valido y la vi en http://localhost:4321/recetas
- [ ] Edite una receta y revise el cambio con `git diff`
- [ ] Cree una rama de postres y la mergee con `--no-ff`
- [ ] Limpie 4 commits "wip" con rebase interactivo
- [ ] Resolvi el conflicto cebolla-si vs cebolla-no
- [ ] Revoque un commit con `git revert`
- [ ] Recupere una receta perdida con `reflog`
- [ ] Publique una rama en remoto y abri un PR
- [ ] Lleve un fix puntual con `cherry-pick`
- [ ] Etiquete una version con `git tag -a`
- [ ] Agregue un menu nuevo modificando `src/pages/menus.astro`

Cuando todo este marcado, ya domas Git con un proyecto real entre manos.
