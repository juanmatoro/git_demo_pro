# Git a Profundidad - Laboratorio de Aprendizaje

Este repositorio esta pensado como un espacio de practica para dominar Git de forma progresiva, desde fundamentos hasta flujos avanzados de colaboracion.

## Objetivo

Aprender Git de manera profunda, entendiendo no solo que comando usar, sino por que usarlo y como afecta al historial del repositorio.

## Como usar este repositorio

1. Crea una rama por modulo de estudio.
2. Realiza los ejercicios del modulo.
3. Documenta tus hallazgos en commits claros.
4. Repite los ejercicios cambiando estrategia (merge vs rebase, squash vs commits atomicos, etc).

## Requisitos

- Git instalado (`git --version`)
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

Opcional para ver historial mejor:

```bash
git config --global alias.lg "log --oneline --graph --decorate --all"
```

## Ruta de aprendizaje (de 0 a avanzado)

## 1) Fundamentos del repositorio

Temas:
- Working tree, staging area e historial
- `git init`, `git status`, `git add`, `git commit`
- Diferencia entre archivo tracked, untracked y staged

Ejercicio:
1. Crea 3 archivos de prueba.
2. Haz commits separados por tipo de cambio.
3. Revisa el historial con `git log --oneline`.

## 2) Historial y exploracion

Temas:
- `git log` avanzado (`--stat`, `--patch`, `--graph`)
- `git show`, `git diff`, `git blame`
- Como leer commits de otros sin perder contexto

Ejercicio:
1. Modifica un archivo en varias lineas.
2. Compara antes y despues con `git diff`.
3. Revisa un commit puntual con `git show <hash>`.

## 3) Ramas y merge

Temas:
- Crear, cambiar y borrar ramas
- Fast-forward vs merge commit
- Estrategias de integracion

Ejercicio:
1. Crea una rama `feature/rama-lab`.
2. Haz 2 commits en esa rama.
3. Vuelve a `main` y fusiona con merge normal.
4. Repite forzando `--no-ff` y compara historial.

## 4) Rebase y limpieza de historial

Temas:
- `git rebase` vs `git merge`
- Rebase interactivo (`git rebase -i`)
- Squash, reword, fixup y orden de commits

Ejercicio:
1. Crea 4 commits pequenos en una rama.
2. Usa `git rebase -i HEAD~4` para:
	- renombrar un commit
	- hacer squash de dos commits
3. Compara el historial antes y despues.

## 5) Conflictos (nivel obligatorio)

Temas:
- Como se produce un conflicto real
- Resolucion manual en merge y en rebase
- Buenas practicas para prevenir conflictos grandes

Ejercicio:
1. En `main`, cambia una linea en un archivo.
2. En una rama secundaria, cambia la misma linea diferente.
3. Intenta mergear y resuelve el conflicto manualmente.
4. Repite el escenario con rebase.

## 6) Recuperacion y seguridad

Temas:
- `git reflog` para recuperar estados
- `git restore`, `git reset` (soft/mixed/hard)
- `git revert` para deshacer sin reescribir historia publicada

Ejercicio:
1. Haz un commit "malo".
2. Prueba `git revert`.
3. Simula perdida de commit y recuperalo con `reflog`.

## 7) Trabajo remoto y colaboracion

Temas:
- `git remote`, `git fetch`, `git pull`, `git push`
- Pull requests y revision de cambios
- Buenas practicas de ramas: `main`, `develop`, `feature/*`, `hotfix/*`

Ejercicio:
1. Crea un repositorio remoto (GitHub/GitLab).
2. Sube una rama de feature.
3. Abre un PR y auto-revisa tus cambios.

## 8) Cherry-pick, tags y releases

Temas:
- `git cherry-pick` para mover commits puntuales
- Tags ligeros vs anotados
- Versionado semantico basico

Ejercicio:
1. Crea una rama con 2 commits.
2. Lleva solo 1 commit a `main` con cherry-pick.
3. Etiqueta una version con `git tag -a v1.0.0 -m "Primer release"`.

## Mini cheatsheet diario

```bash
git status
git add .
git commit -m "mensaje claro"
git switch -c feature/nueva-funcion
git fetch --all --prune
git pull --rebase
git lg
```

## Reglas de oro

- Haz commits pequenos y con intencion.
- Escribe mensajes de commit claros (que y por que).
- Evita `git push --force` en ramas compartidas.
- Antes de integrar, actualiza tu rama con `fetch`.
- Si algo sale mal, primero mira `reflog`.

## Convencion sugerida para mensajes de commit

Formato:

```text
tipo(alcance): descripcion breve
```

Ejemplos:
- `feat(auth): agrega validacion de token`
- `fix(api): corrige error en paginacion`
- `docs(readme): actualiza guia de ramas`

## Checklist de dominio real de Git

Marca cada punto cuando puedas hacerlo sin ayuda:

- [ ] Explicar staging area con un ejemplo real
- [ ] Resolver un conflicto de merge manualmente
- [ ] Resolver un conflicto de rebase manualmente
- [ ] Recuperar un commit perdido con reflog
- [ ] Limpiar una rama con rebase interactivo
- [ ] Mover un commit puntual con cherry-pick
- [ ] Crear y usar tags de release
- [ ] Mantener un historial legible en colaboracion

## Siguiente paso recomendado

Usa este mismo repositorio como sandbox:
- Crea ramas de practica por modulo.
- Repite ejercicios hasta que puedas ejecutarlos de memoria.
- Cuando falles, documenta el error y la solucion en un commit.

Aprender Git a profundidad no es memorizar comandos, es entender el modelo mental del historial.