# Git a Profundidad - Laboratorio de Aprendizaje

Este repositorio esta pensado como un espacio de practica para dominar Git de forma progresiva, desde fundamentos hasta flujos avanzados de colaboracion.

## Indice

- [Objetivo](#objetivo)
- [Antes de empezar: ¿que es el control de versiones?](#antes-de-empezar-que-es-el-control-de-versiones)
  - [Definicion](#definicion)
  - [El problema que resuelve (ejemplo del mundo sin VCS)](#el-problema-que-resuelve-ejemplo-del-mundo-sin-vcs)
  - [Tipos de sistemas de control de versiones](#tipos-de-sistemas-de-control-de-versiones)
  - [Conceptos puros del control de versiones](#conceptos-puros-del-control-de-versiones)
  - [Ejemplo conceptual: como se ve el historial](#ejemplo-conceptual-como-se-ve-el-historial)
  - [Operaciones fundamentales (en cualquier VCS)](#operaciones-fundamentales-en-cualquier-vcs)
  - [Tabla: operacion pura -> comando en Git (y SVN para contraste)](#tabla-operacion-pura---comando-en-git-y-svn-para-contraste)
  - [Lo que un VCS NO hace por ti](#lo-que-un-vcs-no-hace-por-ti)
  - [Mini ejercicio mental antes de seguir](#mini-ejercicio-mental-antes-de-seguir)
- [Como usar este repositorio](#como-usar-este-repositorio)
- [Requisitos](#requisitos)
- [Configuracion inicial recomendada](#configuracion-inicial-recomendada)
- [Ruta de aprendizaje (de 0 a avanzado)](#ruta-de-aprendizaje-de-0-a-avanzado)
  - [1) Fundamentos del repositorio](#1-fundamentos-del-repositorio)
  - [2) Historial y exploracion](#2-historial-y-exploracion)
  - [Modelo interno de Git: commit, tree, blob, branch y HEAD](#modelo-interno-de-git-commit-tree-blob-branch-y-head)
  - [3) Ramas y merge](#3-ramas-y-merge)
  - [4) Rebase y limpieza de historial](#4-rebase-y-limpieza-de-historial)
  - [5) Conflictos (nivel obligatorio)](#5-conflictos-nivel-obligatorio)
  - [6) Recuperacion y seguridad](#6-recuperacion-y-seguridad)
  - [7) Trabajo remoto y colaboracion](#7-trabajo-remoto-y-colaboracion)
  - [8) Cherry-pick, tags y releases](#8-cherry-pick-tags-y-releases)
- [Tabla de comandos esenciales del dia a dia](#tabla-de-comandos-esenciales-del-dia-a-dia)
  - [Configuracion e inicio](#configuracion-e-inicio)
  - [Estado y revision](#estado-y-revision)
  - [Cambios y commits](#cambios-y-commits)
  - [Ramas](#ramas)
  - [Integracion](#integracion)
  - [Trabajo remoto](#trabajo-remoto)
  - [Recuperacion y rescate](#recuperacion-y-rescate)
  - [Tags y releases](#tags-y-releases)
- [Mini cheatsheet diario](#mini-cheatsheet-diario)
- [Reglas de oro](#reglas-de-oro)
- [Convencion sugerida para mensajes de commit](#convencion-sugerida-para-mensajes-de-commit)
- [Errores comunes y como salir de ellos](#errores-comunes-y-como-salir-de-ellos)
- [Checklist de dominio real de Git](#checklist-de-dominio-real-de-git)
- [Siguiente paso recomendado](#siguiente-paso-recomendado)

---

## Objetivo

Aprender Git de manera profunda, entendiendo no solo que comando usar, sino por que usarlo y como afecta al historial del repositorio.

---

## Antes de empezar: ¿que es el control de versiones?

Antes de tocar Git conviene entender el problema que cualquier sistema de control de versiones (VCS, por sus siglas en ingles) intenta resolver. Git es una *implementacion* concreta; el control de versiones es la *idea*.

### Definicion

Un **sistema de control de versiones** es un mecanismo que registra los cambios sobre uno o varios archivos a lo largo del tiempo, de forma que puedas:

- Recuperar cualquier version anterior.
- Saber quien hizo cada cambio, cuando y por que.
- Trabajar en paralelo con otras personas sin pisarse los cambios.
- Probar ideas sin miedo: si no funcionan, vuelves al estado previo.
- Mantener un historial auditable de la evolucion del proyecto.

En resumen: **es la memoria del proyecto**.

### El problema que resuelve (ejemplo del mundo sin VCS)

Imagina que estas escribiendo un informe sin control de versiones. Tu carpeta probablemente termina asi:

```
informe.docx
informe_v2.docx
informe_v2_final.docx
informe_v2_final_REAL.docx
informe_v2_final_REAL_revisado_jefe.docx
informe_v2_final_REAL_revisado_jefe_OK.docx
```

Problemas tipicos:

1. **No sabes que cambio entre versiones**: para verlo, abres dos archivos y comparas a ojo.
2. **No sabes por que se hizo un cambio**: nadie escribio el "por que".
3. **No puedes trabajar en paralelo**: si dos personas editan, una pisa a la otra.
4. **Si borras una version, se perdio**: no hay manera de recuperarla.
5. **No hay forma sencilla de probar algo y descartarlo**: cualquier experimento contamina el archivo principal.

Un VCS resuelve los cinco problemas con un solo concepto: en vez de guardar archivos sueltos, guarda **snapshots etiquetados** (versiones) de todo el proyecto, junto con metadata (autor, fecha, mensaje) y relaciones entre ellos.

### Tipos de sistemas de control de versiones

| Tipo | Como funciona | Ejemplos | Pro | Contra |
| --- | --- | --- | --- | --- |
| **Local** | Versiones guardadas en una base de datos local en tu maquina | RCS | Simple, sin red | Solo una persona, sin colaboracion |
| **Centralizado (CVCS)** | Hay un servidor unico con todas las versiones; los clientes hacen checkout | CVS, Subversion (SVN), Perforce | Control central, permisos claros | Si el servidor cae, no se puede trabajar; cada operacion requiere red |
| **Distribuido (DVCS)** | Cada cliente tiene una copia completa del historial | **Git**, Mercurial, Bazaar | Trabajo offline, ramas baratas, sin punto unico de fallo | Curva de aprendizaje mayor |

Git pertenece a la familia **distribuida**: cuando clonas un repo, te llevas el historial entero, no solo la ultima version. Por eso podes trabajar sin conexion y hacer commits locales libremente.

### Conceptos puros del control de versiones

Estos conceptos existen en cualquier VCS, no solo en Git. Lo importante es entenderlos en abstracto antes de aprender la sintaxis de Git.

| Concepto | Definicion abstracta | Equivalente en Git |
| --- | --- | --- |
| **Repositorio** | Contenedor donde vive el historial del proyecto | Carpeta con `.git/` dentro |
| **Working copy / working tree** | Los archivos tal como los ves y editas | Tu carpeta de trabajo |
| **Snapshot / revision / version** | Foto del proyecto en un instante | Commit |
| **Cambio / change set** | Diferencia entre dos snapshots | Diff de un commit |
| **Historial** | Secuencia ordenada de snapshots | `git log` |
| **Branch / rama** | Linea de desarrollo paralela | Branch de Git |
| **Merge** | Integrar dos lineas paralelas en una | `git merge` / `git rebase` |
| **Conflict** | Cambios incompatibles en la misma parte del archivo | Conflicto de merge |
| **Tag / etiqueta** | Nombre fijo para una version concreta | `git tag` |
| **Author / commiter** | Quien hizo el cambio | Campos `author` y `committer` |
| **Remote / repositorio remoto** | Copia del repo en otro lugar para compartir | `origin`, `upstream`, etc. |

### Ejemplo conceptual: como se ve el historial

Sin VCS, "version 3" es solo un archivo distinto. Con VCS, la version 3 es **un nodo en una linea de tiempo** con padres, autor y mensaje:

```
v1 ──► v2 ──► v3 ──► v4   (rama principal)
            │
            └──► v3a ──► v3b   (rama de experimento)
```

Cada nodo (snapshot) sabe:
- A que nodo apunta como padre (de donde viene).
- Quien lo creo y cuando.
- Que mensaje le acompaña (el "por que").
- Que cambio respecto al padre (el "que").

Esa estructura es la base de todo lo que hace un VCS: navegar, comparar, combinar y deshacer.

### Operaciones fundamentales (en cualquier VCS)

Estas operaciones existen, con nombres distintos, en todos los sistemas. Si entendes que hace cada una en abstracto, aprender Git (o SVN, o Mercurial) se vuelve memorizar sintaxis.

| Operacion pura | Que hace | Pregunta que responde |
| --- | --- | --- |
| **Inicializar** | Crear un repositorio nuevo | "Quiero empezar a versionar este proyecto" |
| **Obtener** | Traer una copia del repositorio | "Quiero trabajar sobre lo que ya existe" |
| **Estado** | Ver que archivos cambiaron | "¿En que estoy?" |
| **Registrar / commitear** | Guardar un snapshot | "Este estado lo quiero conservar" |
| **Comparar / diff** | Ver diferencias entre dos versiones | "¿Que cambio entre X y Y?" |
| **Historial** | Listar snapshots ordenados | "¿Que paso en este proyecto?" |
| **Ramificar / branch** | Crear linea paralela de trabajo | "Quiero probar algo sin afectar lo principal" |
| **Integrar / merge** | Combinar dos lineas | "Quiero traer este experimento al proyecto principal" |
| **Etiquetar / tag** | Marcar una version | "Este snapshot es la version 1.0" |
| **Sincronizar** | Intercambiar cambios con un repo remoto | "Quiero compartir / recibir trabajo de otros" |
| **Revertir / deshacer** | Volver a un estado anterior | "Esto no era lo que queria" |

### Tabla: operacion pura -> comando en Git (y SVN para contraste)

| Operacion pura | Git | Subversion (SVN) |
| --- | --- | --- |
| Inicializar repo | `git init` | `svnadmin create` |
| Obtener copia | `git clone <url>` | `svn checkout <url>` |
| Ver estado | `git status` | `svn status` |
| Registrar snapshot | `git add` + `git commit` | `svn commit` |
| Ver diferencias | `git diff` | `svn diff` |
| Ver historial | `git log` | `svn log` |
| Crear rama | `git switch -c <rama>` | `svn copy` (sobre `/branches/`) |
| Cambiar de rama | `git switch <rama>` | `svn switch <url>` |
| Integrar cambios | `git merge <rama>` | `svn merge` |
| Etiquetar version | `git tag -a v1.0.0 -m "..."` | `svn copy` (sobre `/tags/`) |
| Traer cambios remotos | `git fetch` / `git pull` | `svn update` |
| Subir cambios | `git push` | `svn commit` (mismo paso que registrar) |
| Deshacer cambios locales | `git restore <archivo>` | `svn revert <archivo>` |
| Deshacer un commit publicado | `git revert <hash>` | `svn merge -r N:N-1` |

Observa una diferencia clave: en Git, **commit y push estan separados** (snapshot local + publicacion). En SVN, commit ya implica subir al servidor. Esa separacion es lo que permite a Git trabajar offline y hacer historia local libremente.

### Lo que un VCS NO hace por ti

- **No decide por ti** que cambios juntar o separar: eso depende de tu disciplina al commitear.
- **No documenta solo**: si tus mensajes de commit son malos, el historial es inutil.
- **No reemplaza backup**: un VCS protege el historial del proyecto, no es respaldo de tu disco.
- **No evita conflictos**: los detecta y te obliga a resolverlos, pero la decision es humana.

### Mini ejercicio mental antes de seguir

Antes de pasar al modulo 1, intenta responder en voz alta:

1. ¿Por que un snapshot es mas util que guardar copias del archivo con nombres distintos?
2. ¿Que ventaja tiene un VCS distribuido frente a uno centralizado?
3. Si un compañero te dice "perdi mis cambios", ¿que concepto del VCS deberia haber usado para no perderlos?
4. ¿Por que el mensaje de un commit es tan importante como el cambio en si?

Si responder estas preguntas te resulta natural, ya entendes el modelo. Lo que sigue es aprender a hablar el dialecto especifico de Git.

---

## Como usar este repositorio

1. Crea una rama por modulo de estudio (ej: `lab/01-fundamentos`).
2. Realiza los ejercicios del modulo paso a paso.
3. Documenta tus hallazgos en commits claros.
4. Repite los ejercicios cambiando estrategia (merge vs rebase, squash vs commits atomicos, etc).
5. Al terminar un modulo, marca su casilla en el checklist final.

> Regla del laboratorio: si rompes algo, no borres el repo. Resuelvelo con Git. Ese es el verdadero ejercicio.

### Sandbox practico: el Recetario

Este repo incluye un **mini-recetario** ([recipes/](recipes/)) que sirve como banco de pruebas real para cada modulo. En vez de practicar con archivos abstractos `archivo1.txt`, vas a:

- Agregar postres en una rama de feature.
- Resolver el conflicto clasico "con cebolla o sin cebolla" en la tortilla.
- Limpiar 4 commits "wip" del smoothie con rebase interactivo.
- Recuperar una receta de te frio "perdida" con `reflog`.
- Etiquetar `v1.0.0` cuando tu libro de cocina este listo.

Cada ejercicio del recetario esta mapeado a su modulo correspondiente en
[recipes/PRACTICAS.md](recipes/PRACTICAS.md). Empezar por ahi te ahorra inventar
ejemplos a mano.

## Requisitos

- Git instalado (`git --version`, idealmente 2.30+)
- Editor de texto o VS Code
- Terminal (cmd, PowerShell o bash)

## Configuracion inicial recomendada

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
git config --global init.defaultBranch main
git config --global pull.rebase false
git config --global rebase.autoStash true
git config --global core.editor "code --wait"
```

Alias utiles para ver el historial mejor:

```bash
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.st "status -sb"
git config --global alias.last "log -1 HEAD --stat"
git config --global alias.unstage "restore --staged"
```

Verifica con:

```bash
git config --global --list
```

---

# Ruta de aprendizaje (de 0 a avanzado)

## 1) Fundamentos del repositorio

### ¿Que es un repositorio? (en simple)

Un **repositorio** (o "repo") es una carpeta normal de tu computadora con un superpoder: dentro tiene una subcarpeta oculta llamada `.git` que guarda **toda la historia del proyecto**.

Piensa en esta analogia:

> Tu proyecto es una **cocina**.
> Cocinas platos (archivos), los modificas, los pruebas.
> El **repositorio** es esa misma cocina, pero con una **camara de seguridad** instalada (`.git/`) que va tomando fotos cada vez que tu decides "este plato esta listo".
> Si manana quemas la comida, podes mirar la grabacion y volver al momento en que todo estaba bien.

Sin `.git/`, es solo una carpeta. Con `.git/`, es un repositorio.

### Como se crea un repositorio (ejemplo minimo)

```bash
mkdir mi-proyecto              # creas una carpeta normal
cd mi-proyecto
git init                       # AHORA es un repositorio
ls -la                         # veras una carpeta oculta ".git"
```

Eso es todo. La diferencia entre "una carpeta cualquiera" y "un repositorio" son **esos 8 caracteres**: `git init`.

### Las 3 zonas de un repositorio

Cuando trabajas con Git, tus archivos viven en **3 zonas distintas** al mismo tiempo. Entender estas zonas es lo mas importante del modulo.

```
┌────────────────────┐    git add     ┌──────────────────┐   git commit   ┌─────────────────┐
│   1. WORKING TREE  │  ───────────►  │ 2. STAGING AREA  │ ─────────────► │  3. HISTORIAL   │
│  (donde trabajas)  │                │   (preparacion)  │                │  (.git/objects) │
└────────────────────┘                └──────────────────┘                └─────────────────┘
       tus archivos                       el "carrito"                       las fotos
        visibles                          de compras                         guardadas
```

#### Zona 1: Working tree (el escritorio)

Son los archivos que **ves y editas**. Si abres el explorador de archivos, son esos.

> Analogia: la **mesa de tu cocina** donde tenes los ingredientes y vas cocinando. Puedes mover, cortar, ensuciar lo que quieras. No es definitivo.

#### Zona 2: Staging area (el carrito de compras)

Es una **sala de espera** donde pones los archivos que quieres incluir en el proximo commit. No estan guardados todavia, pero ya estan "elegidos".

> Analogia: el **carrito del supermercado**. Pusiste cosas adentro, pero todavia no pagaste. Podes sacarlas, agregar otras, o ir a la caja.

Comando para mover algo aqui: `git add archivo`.

#### Zona 3: Historial (la caja fuerte)

Cuando haces `git commit`, lo que estaba en el carrito se **guarda para siempre** como una foto del proyecto (un commit). Esa foto vive dentro de `.git/` y ya no se borra facil.

> Analogia: el **album de fotos** donde pegaste la foto del plato terminado. Aunque manana cambies la receta, esa foto sigue ahi.

Comando: `git commit -m "mensaje"`.

### Los 4 estados de un archivo

Un archivo dentro del repo puede estar en uno de cuatro estados. Esto es lo que te dice `git status`:

| Estado | Que significa | Ejemplo |
| --- | --- | --- |
| **Untracked** | Git ve el archivo pero nunca lo guardo. No lo esta vigilando | Acabas de crear `notas.md` y nunca hiciste `git add` |
| **Unmodified** | Git lo conoce y esta igual a la ultima foto guardada | Abriste `app.js` pero no lo tocaste |
| **Modified** | Git lo conoce, pero lo cambiaste desde la ultima foto | Editaste `app.js` y lo guardaste |
| **Staged** | Esta en el carrito, listo para entrar en el proximo commit | Hiciste `git add app.js` |

### Flujo de vida de un archivo (visualmente)

```
   creas un archivo nuevo
            │
            ▼
       UNTRACKED ──────── git add ──────────┐
                                            ▼
                                         STAGED ──── git commit ───┐
                                            ▲                      │
                                            │                      ▼
                                       git add                 UNMODIFIED
                                            │                      │
                                            │                      │
                                            └──── MODIFIED ◄── (editas el archivo)
```

Lectura: un archivo nace untracked. Cuando lo agregas con `git add`, pasa a staged. Cuando lo commiteas, queda guardado y vuelve a unmodified. Si lo editas, pasa a modified, y vuelve a la zona de staging cuando hagas `git add` otra vez.

### ¿Que hay dentro de la carpeta .git?

Cuando ejecutas `ls -la` dentro de un repositorio, veras `.git/`. No la borres nunca: **es el repositorio**. La carpeta de tu proyecto sin `.git/` es solo una carpeta cualquiera.

Contenido principal (no hace falta memorizar):

| Archivo/carpeta dentro de `.git/` | Que guarda |
| --- | --- |
| `HEAD` | Un archivo que dice "ahora mismo estoy parado en la rama X" |
| `refs/heads/` | Un archivo por rama. Cada uno solo contiene un hash de commit |
| `objects/` | Todas las fotos (commits), carpetas (trees) y contenidos (blobs) |
| `config` | La configuracion especifica de este repo (nombre, remotes, etc.) |
| `index` | El "carrito" (staging area), en binario |
| `logs/` | El reflog: cada movimiento de HEAD |

### Ejercicio guiado: ver las 3 zonas en accion

Vamos a tocar las 3 zonas y verlas cambiar paso a paso.

```bash
# 1. Inicializa un repo de practica
mkdir lab-01 && cd lab-01
git init

# 2. Mira el estado inicial: repo vacio
git status
# -> "No commits yet" y nada para mostrar

# 3. Crea un archivo. AHORA esta en la ZONA 1 (working tree), estado: untracked
echo "hola" > saludo.txt
git status
# -> saludo.txt aparece bajo "Untracked files"

# 4. Movelo a la ZONA 2 (staging). Estado: staged
git add saludo.txt
git status
# -> ahora aparece bajo "Changes to be committed"

# 5. Crea un segundo archivo y dejalo SIN agregar
echo "console.log('hi')" > app.js
git status
# -> saludo.txt esta staged, app.js esta untracked. ¡Conviven 2 estados!

# 6. Commitea solo el primero: pasa a la ZONA 3 (historial)
git commit -m "feat: agrega saludo inicial"
git status
# -> saludo.txt desaparece (esta en unmodified), app.js sigue untracked

# 7. Edita saludo.txt: vuelve a modified
echo "hola mundo" > saludo.txt
git status
# -> saludo.txt aparece como "modified"

# 8. Mira la historia
git log --oneline
```

Si entiendes por que cada `git status` muestra lo que muestra en cada paso, dominas el modelo de las 3 zonas.

### Preguntas para responder solo

1. ¿Cual es la diferencia entre una "carpeta normal" y un "repositorio"?
2. Si borras la carpeta `.git/` por error, ¿que pasa con tu proyecto?
3. ¿En que zona vive un archivo despues de `git add` pero antes de `git commit`?
4. ¿Que diferencia hay entre `git add archivo` y `git add .`?
5. Si modificas `saludo.txt` despues de hacer `git add`, ¿que muestra `git status`? ¿Por que?
6. ¿Como deshaces `git add` sin perder los cambios? (pista: `git restore --staged`)

---

## 2) Historial y exploracion

### Conceptos clave

- `git log` no solo lista commits: te permite reconstruir el "por que" de cada cambio.
- Las flags mas utiles: `--oneline`, `--graph`, `--stat`, `--patch`, `--author`, `--since`.
- `git show <hash>` muestra el contenido completo de un commit puntual.
- `git diff` compara estados (working vs staging, staging vs HEAD, rama vs rama).
- `git blame archivo` te dice quien y cuando toco cada linea.

### Ejercicio guiado

```bash
# Modifica un archivo existente en varias lineas
echo "linea nueva 1" >> notas.md
echo "linea nueva 2" >> notas.md

git diff                          # cambios sin stagear
git add notas.md
git diff --staged                 # cambios en staging
git commit -m "docs: amplia notas con nuevas lineas"

# Explora el historial de distintas formas
git log --oneline
git log --stat                    # cuantas lineas cambiaron por archivo
git log --patch -n 1              # el ultimo commit con su diff completo
git log --graph --oneline --all

# Inspecciona un commit puntual
git show HEAD                     # el ultimo
git show HEAD~1                   # el anterior
git show <hash-corto>             # uno concreto

# ¿Quien escribio cada linea?
git blame notas.md
```

### Preguntas para responder solo

1. ¿Cual es la diferencia entre `git diff`, `git diff --staged` y `git diff HEAD`?
2. ¿Como filtrarias los commits hechos por un autor especifico en la ultima semana?
3. ¿Que te dice `git show <hash>:archivo` que no te dice `git show <hash>`?

---

## Modelo interno de Git: commit, tree, blob, branch y HEAD

Git guarda todo como objetos enlazados por hash. Entender esto ayuda a leer el historial con mas criterio.

- **Blob**: contiene el contenido de un archivo (sin nombre, solo datos).
- **Tree**: representa una carpeta; relaciona nombres de archivos/carpetas con blobs u otros trees.
- **Commit**: apunta a un tree raiz (estado completo del proyecto en ese momento), guarda autor, fecha, mensaje y referencia al commit padre.
- **Branch**: es un puntero movible a un commit (por ejemplo `main` o `feature/x`).
- **HEAD**: es un puntero especial que indica en que branch o commit estas parado ahora.

### Relacion mental rapida

1. Cambias archivos -> Git crea nuevos blobs para el contenido nuevo.
2. Git crea/actualiza trees para reflejar la estructura de carpetas.
3. Al hacer `git commit`, se crea un commit que apunta al tree raiz y al commit anterior.
4. La branch actual se mueve para apuntar a ese nuevo commit.
5. HEAD normalmente apunta a esa branch activa (si no estas en detached HEAD).

Por eso un commit no guarda "solo el diff": guarda una foto logica del proyecto, reutilizando objetos que no cambiaron, y las branches/HEAD solo se encargan de apuntar a que commit miras o actualizas.

### Verlo en vivo (ejercicio de inspeccion)

```bash
# Mira el objeto al que apunta HEAD
git rev-parse HEAD                # hash del commit actual
git cat-file -t HEAD              # tipo: "commit"
git cat-file -p HEAD              # contenido del commit (tree, parent, autor, mensaje)

# Inspecciona el tree raiz que ese commit referencia
git cat-file -p HEAD^{tree}       # lista blobs y trees hijos

# Mira el contenido de un blob concreto
git cat-file -p <hash-del-blob>

# ¿Donde apunta cada referencia?
cat .git/HEAD
cat .git/refs/heads/main
```

Cuando entiendes que una branch es solo un archivo de texto con un hash dentro de `.git/refs/heads/`, dejas de tenerle miedo a moverla.

---

## 3) Ramas y merge

### Conceptos clave

- Una rama es solo un puntero a un commit. Crear una rama es barato.
- **Fast-forward**: si la rama destino no avanzo, Git solo "adelanta el puntero". No crea merge commit.
- **Merge commit**: si ambas ramas avanzaron, Git crea un commit nuevo con dos padres.
- `--no-ff` fuerza el merge commit aunque podría ser fast-forward (util para mantener trazabilidad de la rama).
- `git switch` (moderno) reemplaza al viejo `git checkout` para cambiar de rama.

### Ejercicio guiado

```bash
# Crea y entra a una rama nueva
git switch -c feature/rama-lab

# Haz 2 commits en esa rama
echo "feature A" > feature-a.txt
git add feature-a.txt
git commit -m "feat: agrega feature A"

echo "feature B" > feature-b.txt
git add feature-b.txt
git commit -m "feat: agrega feature B"

# Vuelve a main y mergea
git switch main
git merge feature/rama-lab        # fast-forward si main no avanzo
git lg                            # observa la forma del historial

# Repite forzando merge commit
git switch -c feature/rama-lab-2
echo "feature C" > feature-c.txt
git add feature-c.txt
git commit -m "feat: agrega feature C"

git switch main
git merge --no-ff feature/rama-lab-2 -m "merge: integra feature C"
git lg                            # ahora veras la "bifurcación" en el grafo
```

### Preguntas para responder solo

1. ¿Cuando preferirías fast-forward y cuando `--no-ff`?
2. ¿Que pasa si haces `git branch -d` sobre una rama que aun no se mergeo? ¿Y con `-D`?
3. Si borras una rama por accidente, ¿como la recuperas? (pista: `git reflog`)

---

## 4) Rebase y limpieza de historial

### Conceptos clave

- `git merge` preserva la historia tal como ocurrió (puede quedar "ruidosa").
- `git rebase` reescribe los commits de tu rama "encima" de otra base, dejando una linea recta.
- **Rebase interactivo** (`git rebase -i`) te permite editar la historia: reordenar, fusionar (squash), renombrar (reword), descartar (drop).
- Regla de oro: nunca hagas rebase de commits ya publicados en una rama compartida.

### Ejercicio guiado

```bash
# Crea una rama con 4 commits pequeños
git switch -c feature/limpieza
echo "v1" > paso.txt && git add . && git commit -m "wip 1"
echo "v2" >> paso.txt && git add . && git commit -m "wip 2"
echo "v3" >> paso.txt && git add . && git commit -m "arregla typo"
echo "v4" >> paso.txt && git add . && git commit -m "wip 3"

git log --oneline                 # observa los 4 commits "sucios"

# Rebase interactivo
git rebase -i HEAD~4
# En el editor:
#   - cambia "pick" por "reword" en el primero para renombrarlo
#   - cambia "pick" por "squash" (o "s") en el 2do y 4to para fusionarlos con sus vecinos
#   - guarda y cierra
# Git abrira otro editor para que escribas el nuevo mensaje del commit combinado

git log --oneline                 # ahora el historial es limpio
```

### Diferencia visual merge vs rebase

```
Antes:
main:    A---B---C
                  \
feature:           D---E

Despues de merge:
main:    A---B---C-------M
                  \     /
feature:           D---E

Despues de rebase:
main:    A---B---C---D'---E'
```

### Preguntas para responder solo

1. ¿Que pasa con el hash de un commit despues de rebasearlo? ¿Por que?
2. ¿Cuando deberias usar `--fixup` + `--autosquash` en vez de rebase interactivo manual?
3. Si un rebase sale mal a mitad, ¿que comando lo cancela? (pista: `git rebase --abort`)

---

## 5) Conflictos (nivel obligatorio)

### Conceptos clave

- Un conflicto ocurre cuando dos ramas cambian la misma linea (o cuando una borra y otra modifica).
- Git no decide por ti: marca los conflictos en el archivo con `<<<<<<<`, `=======`, `>>>>>>>`.
- En **merge**: resuelves, `git add`, `git commit`.
- En **rebase**: resuelves, `git add`, `git rebase --continue` (no haces commit manual).
- Prevenir: ramas cortas, sincronizar `main` seguido, commits pequenos y enfocados.

### Ejercicio guiado: conflicto en merge

```bash
git switch main
echo "version main" > conflicto.txt
git add . && git commit -m "feat: linea desde main"

git switch -c feature/colision
# Reescribe la misma linea con otro contenido
echo "version feature" > conflicto.txt
git add . && git commit -m "feat: linea desde feature"

# Mientras tanto, simula que main avanzo distinto
git switch main
echo "main cambio otra vez" > conflicto.txt
git add . && git commit -m "feat: main reescribe la linea"

# Intenta mergear -> habra conflicto
git merge feature/colision
# El archivo conflicto.txt tendra los marcadores. Editalo a mano.
# Quita los marcadores y deja la version final que quieras.

git add conflicto.txt
git commit                        # Git ya pre-rellena el mensaje del merge
git lg
```

### Ejercicio guiado: el mismo conflicto en rebase

```bash
git switch feature/colision
git rebase main
# Mismo conflicto, distinto flujo:
# editas el archivo, resuelves, y luego:
git add conflicto.txt
git rebase --continue
# (Si te arrepientes: git rebase --abort)
```

### Trucos utiles

```bash
git diff --name-only --diff-filter=U      # lista archivos en conflicto
git checkout --ours conflicto.txt         # acepta tu version
git checkout --theirs conflicto.txt       # acepta la otra version
git mergetool                             # abre herramienta visual de merge
```

---

## 6) Recuperacion y seguridad

### Conceptos clave

- `git reflog` es tu red de seguridad: registra cada movimiento de HEAD, incluso commits "perdidos".
- `git restore` reemplaza al viejo `git checkout` para restaurar archivos.
- `git reset` mueve la rama actual:
  - `--soft`: mueve HEAD, mantiene staging y working tree.
  - `--mixed` (default): mueve HEAD y resetea staging, mantiene working tree.
  - `--hard`: mueve HEAD, resetea staging y working tree. **Destructivo**.
- `git revert <hash>` crea un commit que deshace otro sin reescribir historia. Seguro en ramas publicadas.

### Ejercicio guiado

```bash
# 1. Crea un commit "malo" y deshazlo con revert
echo "linea problematica" >> notas.md
git add . && git commit -m "bug: introduce error"
git revert HEAD                   # crea commit que deshace el anterior
git log --oneline                 # ambos commits siguen en el historial

# 2. Simula perdida de commit
echo "trabajo importante" > importante.txt
git add . && git commit -m "feat: trabajo critico"
git log --oneline
# Borra el commit "por accidente"
git reset --hard HEAD~1
git log --oneline                 # el commit desaparecio

# Recuperalo con reflog
git reflog                        # busca el hash del commit perdido
git reset --hard <hash-perdido>
git log --oneline                 # de vuelta
```

### Diferencia entre `reset` y `revert`

| Comando | ¿Reescribe historia? | ¿Seguro en ramas compartidas? |
| --- | --- | --- |
| `git reset --hard` | Si | No |
| `git revert` | No (crea commit nuevo) | Si |

### Preguntas para responder solo

1. ¿Cual de los tres modos de `reset` usarias para "deshacer el ultimo commit pero mantener mis cambios listos para volver a commitearlos"?
2. ¿Que pasa con un archivo nuevo (untracked) cuando haces `git reset --hard`?
3. ¿Cuanto tiempo dura una entrada en el reflog? (pista: ver `gc.reflogExpire`)

---

## 7) Trabajo remoto y colaboracion

### Conceptos clave

- Un **remote** es una referencia a un repositorio en otro lugar (normalmente `origin`).
- `git fetch` baja cambios sin tocar tu rama local.
- `git pull` = `fetch` + `merge` (o `rebase`, depende de tu config).
- `git push` sube tus commits locales al remote.
- **Tracking branch**: tu rama local recuerda con que rama remota se sincroniza (`origin/main`).
- Flujo recomendado: `main` estable, `develop` integracion, `feature/*` trabajo individual, `hotfix/*` urgencias.

### Ejercicio guiado

```bash
# Suponiendo que ya creaste el repo en GitHub/GitLab
git remote -v                             # lista remotes existentes
git remote add origin https://github.com/usuario/repo.git

# Primer push de main configurando upstream
git push -u origin main

# Crea una rama de feature y subela
git switch -c feature/nueva-funcion
echo "demo" > demo.txt
git add . && git commit -m "feat: agrega demo"
git push -u origin feature/nueva-funcion

# Trae cambios del remote sin mergear automaticamente
git fetch --all --prune
git log origin/main --oneline             # ve que cambio sin tocar tu rama

# Sincroniza tu rama con main remoto via rebase
git switch feature/nueva-funcion
git fetch origin
git rebase origin/main
```

### Buenas practicas para PRs

- Un PR = un proposito (no mezcles refactor + feature + fix).
- Titulo claro en imperativo: "Agrega validacion de email", no "agregada validacion".
- Antes de marcar "listo para revisar": auto-revisa el diff completo.
- Si te piden cambios, suma commits nuevos en vez de rebasear (hasta que se aprueba), asi el reviewer ve el delta.

### Preguntas para responder solo

1. ¿Que diferencia hay entre `git pull` y `git pull --rebase`?
2. ¿Que hace `--prune` en `git fetch`?
3. ¿Como renombras una rama local y la remota a la vez?

---

## 8) Cherry-pick, tags y releases

### Conceptos clave

- `git cherry-pick <hash>` aplica un commit puntual de otra rama sobre la actual.
- Util para llevar un fix urgente de `develop` a `main` sin traer todo lo demas.
- **Tags ligeros**: solo un alias para un commit (`git tag v1.0.0`).
- **Tags anotados**: incluyen autor, fecha, mensaje y firma opcional (`git tag -a v1.0.0 -m "..."`). Son los que se usan para releases reales.
- Versionado semantico: `MAJOR.MINOR.PATCH` (1.4.2 -> 1.4.3 fix, 1.5.0 feature, 2.0.0 breaking).

### Ejercicio guiado

```bash
# Crea una rama con 2 commits
git switch -c feature/cherry
echo "cambio importante" > importante.txt
git add . && git commit -m "feat: cambio que SI quiero portar"

echo "experimento" > experimento.txt
git add . && git commit -m "wip: experimento que NO quiero portar"

# Obten el hash del primer commit
git log --oneline

# Vuelve a main y trae solo ese commit
git switch main
git cherry-pick <hash-del-primer-commit>
git log --oneline

# Etiqueta una version
git tag -a v1.0.0 -m "Primer release del laboratorio"
git tag                                   # lista tags
git show v1.0.0                           # muestra el tag anotado

# Sube el tag al remoto
git push origin v1.0.0
# O todos los tags de golpe:
git push --tags
```

### Preguntas para responder solo

1. ¿Que pasa si haces cherry-pick de un commit que toca lineas que tu rama tambien cambio?
2. ¿Como borras un tag local? ¿Y uno remoto?
3. ¿Cuando usarias `git cherry-pick -x`?

---

## Tabla de comandos esenciales del dia a dia

### Configuracion e inicio

| Comando | Que hace | Cuando se emplea |
| --- | --- | --- |
| `git init` | Crea un repositorio nuevo en la carpeta actual | Al empezar un proyecto desde cero |
| `git clone <url>` | Descarga un repo remoto a tu maquina | Al sumarte a un proyecto que ya existe |
| `git config --global user.name "Tu Nombre"` | Define tu nombre de autor globalmente | La primera vez que configuras Git |
| `git config --global user.email "tu@email.com"` | Define tu email de autor | Junto al nombre, al configurar Git |
| `git config --list` | Muestra toda la configuracion actual | Para verificar tu setup o depurar |

### Estado y revision

| Comando | Que hace | Cuando se emplea |
| --- | --- | --- |
| `git status` | Muestra archivos modificados, staged y untracked | Antes de cada `add` o `commit`, varias veces al dia |
| `git diff` | Muestra cambios sin stagear (working vs staging) | Para revisar que vas a stagear antes de hacerlo |
| `git diff --staged` | Muestra cambios ya staged (staging vs HEAD) | Justo antes de commitear, para confirmar el contenido |
| `git diff <rama1> <rama2>` | Compara dos ramas | Antes de mergear o abrir un PR |
| `git log --oneline --graph --all` | Historial visual de todas las ramas | Para entender la forma del proyecto |
| `git show <hash>` | Muestra el contenido completo de un commit | Cuando quieres entender que cambio uno especifico |
| `git blame <archivo>` | Indica quien modifico cada linea | Investigando el origen de un bug o decision |

### Cambios y commits

| Comando | Que hace | Cuando se emplea |
| --- | --- | --- |
| `git add <archivo>` | Mueve un archivo a staging | Para preparar cambios concretos de un commit |
| `git add .` | Stagea todo lo modificado en la carpeta actual | Cuando todos los cambios son del mismo commit |
| `git add -p` | Stagea por fragmentos (interactivo) | Para separar cambios mezclados en commits distintos |
| `git commit -m "mensaje"` | Crea un commit con los cambios staged | Cuando tienes una unidad logica de trabajo lista |
| `git commit --amend` | Modifica el ultimo commit (mensaje o contenido) | Para corregir un olvido inmediato (solo si no se publico) |
| `git restore <archivo>` | Descarta cambios no staged en un archivo | Cuando te arrepientes de una modificacion |
| `git restore --staged <archivo>` | Saca un archivo de staging (sin perder cambios) | Cuando agregaste algo a staging por error |

### Ramas

| Comando | Que hace | Cuando se emplea |
| --- | --- | --- |
| `git branch` | Lista ramas locales | Para saber donde estas parado |
| `git branch -a` | Lista ramas locales y remotas | Antes de basar una rama en otra |
| `git switch <rama>` | Cambia a una rama existente | Para moverte entre lineas de trabajo |
| `git switch -c <rama>` | Crea una rama nueva y se posiciona en ella | Al iniciar una feature, fix o experimento |
| `git branch -d <rama>` | Borra una rama ya mergeada | Limpieza despues de integrar |
| `git branch -D <rama>` | Borra una rama sin importar si se mergeo | Para descartar trabajo experimental |
| `git branch -m <nuevo>` | Renombra la rama actual | Cuando el nombre original ya no refleja el proposito |

### Integracion

| Comando | Que hace | Cuando se emplea |
| --- | --- | --- |
| `git merge <rama>` | Integra otra rama en la actual | Para traer cambios sin reescribir historia |
| `git merge --no-ff <rama>` | Fuerza merge commit incluso si era fast-forward | Para preservar trazabilidad de la rama integrada |
| `git rebase <rama>` | Reaplica tus commits sobre otra base | Para mantener un historial lineal y limpio |
| `git rebase -i HEAD~N` | Rebase interactivo de los ultimos N commits | Para fusionar, renombrar o reordenar antes de subir |
| `git rebase --continue` | Sigue el rebase tras resolver conflictos | Cada vez que terminas de arreglar un conflicto |
| `git rebase --abort` | Cancela el rebase y vuelve al estado previo | Cuando el rebase se complico demasiado |
| `git cherry-pick <hash>` | Aplica un commit puntual sobre la rama actual | Para portar un fix sin traer el resto |

### Trabajo remoto

| Comando | Que hace | Cuando se emplea |
| --- | --- | --- |
| `git remote -v` | Lista los remotes configurados | Para verificar con que repos te conectas |
| `git remote add origin <url>` | Asocia un repo remoto bajo el nombre `origin` | La primera vez que conectas tu repo local |
| `git fetch` | Descarga cambios remotos sin mergear | Antes de decidir como integrar |
| `git fetch --all --prune` | Trae todo y borra refs remotas eliminadas | Al inicio del dia para sincronizar referencias |
| `git pull` | `fetch` + `merge` de la rama remota | Para actualizar tu rama local con lo remoto |
| `git pull --rebase` | `fetch` + `rebase` (historial mas limpio) | Cuando preferis evitar merge commits de sync |
| `git push` | Sube tus commits al remoto | Despues de commitear trabajo que quieres compartir |
| `git push -u origin <rama>` | Sube y configura tracking con la rama remota | La primera vez que subes una rama nueva |
| `git push --force-with-lease` | Force push seguro (no pisa cambios ajenos) | Tras un rebase de una rama propia ya publicada |

### Recuperacion y rescate

| Comando | Que hace | Cuando se emplea |
| --- | --- | --- |
| `git stash` | Guarda cambios sin commitear en una pila | Para cambiar de tarea sin perder lo en progreso |
| `git stash pop` | Recupera y aplica el ultimo stash | Cuando vuelves a la tarea pausada |
| `git stash list` | Lista todos los stashes guardados | Para revisar que tienes pendiente |
| `git reflog` | Muestra cada movimiento de HEAD | Cuando "perdiste" un commit o una rama |
| `git reset --soft HEAD~1` | Deshace ultimo commit, mantiene staging | Para reescribir el ultimo commit conservando los cambios |
| `git reset --mixed HEAD~1` | Deshace commit y unstagea (default) | Para reorganizar que va en el proximo commit |
| `git reset --hard <hash>` | Lleva la rama y working tree a un commit dado | Para volver a un estado conocido (destructivo) |
| `git revert <hash>` | Crea un commit que deshace otro | Para deshacer cambios ya publicados sin reescribir historia |
| `git clean -fd` | Borra archivos y carpetas untracked | Para limpiar la working tree de basura |

### Tags y releases

| Comando | Que hace | Cuando se emplea |
| --- | --- | --- |
| `git tag` | Lista todos los tags | Para saber que versiones existen |
| `git tag -a v1.0.0 -m "release v1.0.0"` | Crea un tag anotado | Al publicar una version |
| `git push origin v1.0.0` | Sube un tag al remoto | Tras crear el tag de release |
| `git push --tags` | Sube todos los tags | Para sincronizar versionado completo |

---

## Mini cheatsheet diario

```bash
git status                                # ¿en que estoy?
git add .                                 # prepara cambios
git commit -m "mensaje claro"             # confirma
git switch -c feature/nueva-funcion       # nueva rama
git fetch --all --prune                   # actualiza remotos
git pull --rebase                         # sincroniza limpio
git lg                                    # historial visual
git stash                                 # guarda temporalmente cambios sin commitear
git stash pop                             # recupera lo guardado
git reflog                                # log de movimientos de HEAD
```

## Reglas de oro

- Haz commits pequenos y con intencion.
- Escribe mensajes de commit claros (que y por que).
- Evita `git push --force` en ramas compartidas (usa `--force-with-lease` si es imprescindible).
- Antes de integrar, actualiza tu rama con `fetch`.
- Si algo sale mal, primero mira `reflog`.
- No commitees secretos: usa `.gitignore` desde el dia 1.
- Si el commit message no cabe en una linea, escribe titulo + linea en blanco + cuerpo.

## Convencion sugerida para mensajes de commit

Formato (Conventional Commits):

```text
tipo(alcance): descripcion breve

[cuerpo opcional explicando el por que]

[footer opcional, ej: refs #123]
```

Tipos comunes: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`.

Ejemplos:
- `feat(auth): agrega validacion de token`
- `fix(api): corrige error en paginacion`
- `docs(readme): actualiza guia de ramas`
- `refactor(db): extrae logica de conexion a modulo separado`

## Errores comunes y como salir de ellos

| Situacion | Que hacer |
| --- | --- |
| Commiteaste en `main` por error | `git reset --soft HEAD~1`, crea rama, vuelve a commitear |
| `git push` rechazado por estar atras | `git fetch`, `git rebase origin/main`, push de nuevo |
| Quieres deshacer `git add archivo` | `git restore --staged archivo` |
| Modificaste algo y te arrepientes (sin commit) | `git restore archivo` |
| Borraste una rama sin mergear | `git reflog`, encuentra el hash, `git switch -c rama <hash>` |
| Rebase a mitad y todo es caos | `git rebase --abort` |
| Conflicto que no entiendes | `git merge --abort` y revisa antes |

## Checklist de dominio real de Git

Marca cada punto cuando puedas hacerlo sin ayuda:

- [ ] Explicar staging area con un ejemplo real
- [ ] Inspeccionar un commit con `git cat-file` y entender que es un tree/blob
- [ ] Hacer merge fast-forward y forzar `--no-ff` segun el caso
- [ ] Resolver un conflicto de merge manualmente
- [ ] Resolver un conflicto de rebase manualmente
- [ ] Recuperar un commit perdido con reflog
- [ ] Limpiar una rama con rebase interactivo (reword + squash)
- [ ] Mover un commit puntual con cherry-pick
- [ ] Crear y subir tags anotados de release
- [ ] Diferenciar y usar `reset --soft`, `--mixed` y `--hard` correctamente
- [ ] Usar `revert` para deshacer en una rama compartida
- [ ] Mantener un historial legible en colaboracion

## Siguiente paso recomendado

Usa este mismo repositorio como sandbox:
- Crea ramas de practica por modulo (`lab/01-fundamentos`, `lab/02-historial`, etc).
- Repite ejercicios hasta que puedas ejecutarlos de memoria.
- Cuando falles, documenta el error y la solucion en un commit.
- Cuando termines la ruta, intenta romper algo intencionalmente y recuperalo.

Aprender Git a profundidad no es memorizar comandos, es entender el modelo mental del historial.
