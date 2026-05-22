# Practicas de Git con el Recetario

Este recetario es el sandbox real para ejecutar los modulos del [README principal](../README.MD). En vez de practicar con archivos abstractos `archivo1.txt`, vas a editar recetas, agregar postres, resolver conflictos de "con cebolla o sin cebolla" y publicar versiones de tu libro de cocina.

> Recordatorio del README: si rompes algo, no borres el repo. Resuelvelo con Git. Ese es el verdadero ejercicio.

## Mapa de practicas por modulo

| Modulo del README | Que vas a hacer aqui |
| --- | --- |
| [1) Fundamentos del repositorio](../README.MD#1-fundamentos-del-repositorio) | Crear una receta nueva, ver las 3 zonas |
| [2) Historial y exploracion](../README.MD#2-historial-y-exploracion) | Modificar `tortilla-de-patatas.md` y leer el historial |
| [3) Ramas y merge](../README.MD#3-ramas-y-merge) | Crear `feature/postres` y mergear a `main` |
| [4) Rebase y limpieza de historial](../README.MD#4-rebase-y-limpieza-de-historial) | Limpiar commits "wip" al agregar una receta |
| [5) Conflictos](../README.MD#5-conflictos-nivel-obligatorio) | El clasico "con cebolla / sin cebolla" |
| [6) Recuperacion y seguridad](../README.MD#6-recuperacion-y-seguridad) | Revertir un ingrediente equivocado, recuperar receta perdida |
| [7) Trabajo remoto](../README.MD#7-trabajo-remoto-y-colaboracion) | Publicar el recetario en GitHub y simular PR |
| [8) Cherry-pick, tags y releases](../README.MD#8-cherry-pick-tags-y-releases) | Portar un fix urgente y etiquetar `v1.0.0` |

---

## Modulo 1 - Crear una receta nueva (las 3 zonas)

**Objetivo:** ver una receta atravesando working tree -> staging -> historial.

```bash
# Desde la raiz del repo
cd recipes/recetas

# Crea una receta nueva (zona 1: working tree, untracked)
cat > limonada.md << 'EOF'
# Limonada casera

- 4 limones
- 1 litro de agua
- 4 cucharadas de azucar

Exprimir, mezclar, enfriar.
EOF

git status                        # untracked
git add recipes/recetas/limonada.md
git status                        # staged
git commit -m "feat(recetas): agrega receta de limonada"
git log --oneline
```

**Verificacion:** `git log --oneline` debe mostrar tu commit nuevo arriba de todo.

---

## Modulo 2 - Modificar y explorar historial

**Objetivo:** ver `git diff`, `git log` y `git blame` sobre cambios reales.

```bash
# Edita la tortilla: cambia la cantidad de patatas
# Abri recipes/recetas/tortilla-de-patatas.md y cambia "4 patatas medianas" por "5 patatas medianas"

git diff                          # ve el cambio sin stagear
git add recipes/recetas/tortilla-de-patatas.md
git diff --staged                 # ve el cambio ya staged
git commit -m "fix(tortilla): ajusta cantidad de patatas a 5"

git log --oneline
git log --stat                    # cuantas lineas cambiaron
git log --patch -n 1              # el diff del ultimo commit
git show HEAD                     # contenido completo del ultimo commit
git blame recipes/recetas/tortilla-de-patatas.md
```

---

## Modulo 3 - Ramas y merge: agregar postres

**Objetivo:** trabajar en una rama aparte y mergear sin pisar `main`.

```bash
git switch -c feature/postres

# Crea dos recetas de postre
cat > recipes/recetas/flan.md << 'EOF'
# Flan casero
- 6 huevos
- 500 ml de leche
- 200 g de azucar
- 1 cucharadita de esencia de vainilla

Caramelizar, mezclar, hornear al bano maria 50 min.
EOF
git add recipes/recetas/flan.md
git commit -m "feat(postres): agrega flan casero"

cat > recipes/recetas/brownies.md << 'EOF'
# Brownies de chocolate
- 200 g de chocolate negro
- 150 g de mantequilla
- 3 huevos
- 150 g de azucar
- 80 g de harina

Fundir chocolate y mantequilla, mezclar, hornear 25 min a 180 C.
EOF
git add recipes/recetas/brownies.md
git commit -m "feat(postres): agrega brownies de chocolate"

# Vuelve a main y mergea con merge commit
git switch main
git merge --no-ff feature/postres -m "merge: integra seccion de postres"
git lg
```

**Bonus:** edita `recipes/index.html` y agrega los enlaces a las nuevas recetas. Hazlo en otro commit sobre `main`.

---

## Modulo 4 - Rebase interactivo para limpiar historia

**Objetivo:** convertir 4 commits "wip" en uno limpio antes de mergear.

```bash
git switch -c feature/smoothie

# Hacemos commits sucios a proposito
echo "# Smoothie" > recipes/recetas/smoothie.md
git add . && git commit -m "wip 1"

echo "- 1 banana" >> recipes/recetas/smoothie.md
git add . && git commit -m "wip 2"

echo "- 200 ml de leche" >> recipes/recetas/smoothie.md
git add . && git commit -m "agrega leche, perdon"

echo "Licuar y servir frio." >> recipes/recetas/smoothie.md
git add . && git commit -m "wip 3 (ultimo)"

git log --oneline                 # veras los 4 commits sucios

# Limpia el historial
git rebase -i HEAD~4
# En el editor: deja "pick" el primero, cambia a "squash" (o "s") los otros 3.
# Guarda. Git abre otro editor: deja un solo mensaje claro como:
#   feat(bebidas): agrega smoothie de banana

git log --oneline                 # ahora hay UN solo commit
```

---

## Modulo 5 - Conflicto: con cebolla o sin cebolla

**Objetivo:** provocar y resolver el conflicto mas famoso de la cocina espa&ntilde;ola.

```bash
# Partimos de main
git switch main

# Rama del bando "con cebolla"
git switch -c feature/cebolla-si
# Edita recipes/recetas/tortilla-de-patatas.md:
# en la linea "- 1 cebolla mediana", cambia por "- 2 cebollas medianas (con cebolla, por supuesto)"
git add . && git commit -m "feat(tortilla): refuerza cebolla en la receta"

# Mientras tanto, otro contribuyente edita main al reves
git switch main
# Edita la misma linea por "- 0 cebollas (la cebolla arruina la tortilla)"
git add . && git commit -m "fix(tortilla): elimina cebolla, version pura"

# Intenta mergear: CONFLICTO
git merge feature/cebolla-si
# El archivo tendra los marcadores <<<<<<<, =======, >>>>>>>
# Editalo a mano, decide el resultado, quita los marcadores
git add recipes/recetas/tortilla-de-patatas.md
git commit                        # confirma el merge
```

Repite el escenario con `git rebase` para sentir la diferencia de flujo.

---

## Modulo 6 - Recuperar trabajo

**Objetivo:** deshacer un cambio publicado y rescatar una receta "perdida".

```bash
# 1. Commit "malo": agrega un ingrediente equivocado
# Edita pasta-aglio-olio.md y agrega "- 500 g de azucar" al final de ingredientes
git add . && git commit -m "feat(pasta): agrega azucar"

# Revertir sin reescribir historia
git revert HEAD
# Git crea un commit nuevo que deshace el anterior. La historia queda visible.

# 2. Simula perdida de receta
git switch -c feature/te-frio
echo "# Te frio\n- te negro\n- limon\n- hielo" > recipes/recetas/te-frio.md
git add . && git commit -m "feat(bebidas): agrega te frio"

git switch main
git branch -D feature/te-frio     # "borraste" la rama por error

# Recupera con reflog
git reflog                        # busca el commit "feat(bebidas): agrega te frio"
git switch -c feature/te-frio <hash-encontrado>
ls recipes/recetas/te-frio.md     # esta de vuelta
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
cat > recipes/recetas/granola.md << 'EOF'
# Granola casera
- 300 g de avena
- 100 g de frutos secos
- 80 g de miel
- 50 ml de aceite
- Frutas secas al gusto
Mezclar, hornear 25 min a 160 C removiendo cada 8 min.
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
sed -i 's/200 ml/250 ml/' recipes/recetas/pasta-aglio-olio.md    # mas aceite
git add . && git commit -m "fix(pasta): aumenta aceite a 250 ml"

# Commit 2: experimento que NO queremos en main aun
echo "## Variante con tofu" >> recipes/recetas/ensalada-cesar.md
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

## Checklist del recetario

Marca cada uno cuando lo hayas hecho aqui mismo:

- [ ] Agregue una receta nueva con commit limpio
- [ ] Edite una receta y revise el cambio con `git diff`
- [ ] Cree una rama de postres y la mergee con `--no-ff`
- [ ] Limpie 4 commits "wip" con rebase interactivo
- [ ] Resolvi el conflicto cebolla-si vs cebolla-no
- [ ] Revoque un commit con `git revert`
- [ ] Recupere una receta perdida con `reflog`
- [ ] Publique una rama en remoto y abri un PR
- [ ] Lleve un fix puntual con `cherry-pick`
- [ ] Etiquete una version con `git tag -a`

Cuando todo este marcado, ya domas Git con un proyecto real entre manos.
