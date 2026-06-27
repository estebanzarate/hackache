---
title: C
description: C
tags: [c]
lang: es
parent: programming
translationId: c
---

- `#include` importa una header file, que es un archivo con declaraciones de funciones de la biblioteca estándar de C. Sin esto, el compilador no sabe qué es `printf`.
- `int main()` es el punto de entrada de todo programa en C. Devuelve un `int` porque el sistema operativo lee ese valor al terminar (`0` = éxito).
- `printf` escribe en stdout (salida estándar). El argumento es un string literal entre comillas dobles.
- `fflush(stdout)` fuerza que el buffer de stdout se vacíe inmediatamente. Sin esto, el texto podría quedarse en memoria y no aparecer en pantalla antes de que el programa espere input.
- `char` es el tipo de dato para caracteres individuales en C. Un string en C es simplemente un array de `char` terminado con el carácter nulo `'\0'`.
- `char buffer[100]` declara un array de 100 caracteres en el stack (memoria local de la función). Es donde se va a guardar lo que escribe el usuario.
- `fgets(buffer, sizeof(buffer), stdin)` lee una línea de texto desde `stdin` (el teclado) y la guarda en `buffer`. Incluye el `'\n'` final. Devuelve `NULL` si hay un error o si llega EOF (Ctrl+D).
- `sizeof(buffer)` devuelve el tamaño en bytes del array, en este caso 100. Usarlo así (en vez de escribir 100 directamente) es buena práctica: si se cambia el tamaño del buffer, solo se cambia en un lugar.
- `strcspn (string complement span)` busca desde el inicio del string hasta el primer carácter que aparezca en un conjunto dado. Acá la usamos para encontrar el índice del `'\n'` y reemplazarlo con `'\0'`, eliminando el salto de línea que deja `fgets`.
  Está declarada en `<string.h>`, que hay que incluir.
- `while (1)` es un bucle infinito. La shell tiene que seguir pidiendo comandos hasta que el usuario la cierre, por eso el bucle no tiene condición de parada por ahora.
- `strcmp` (string compare) compara dos strings carácter por carácter. Devuelve `0` si son idénticos. Está en `<string.h>`, que ya incluimos.
- `exit(0)` termina el proceso inmediatamente. El `0` es el código de salida (0 = éxito). Está declarado en `<stdlib.h>`, que hay que incluir.
- `strncmp` es igual a `strcmp` pero compara solo los primeros n caracteres. `strncmp(input, "echo ", 5)` devuelve `0` si el input empieza con `"echo "`. Útil para detectar comandos con argumentos.
- `input + 5` es aritmética de punteros. Un string en C es un puntero al primer carácter. Sumarle 5 desplaza ese puntero 5 posiciones, apuntando directamente a los argumentos después de `"echo "`.
- **Función auxiliar** — en lugar de repetir la lógica de "¿es un builtin?" en varios lugares, la extraemos a una función separada. `int is_builtin(char *cmd)` recibe un puntero a string y devuelve `1` (verdadero) o `0` (falso). En C, cualquier valor distinto de `0` es verdadero en un if.
- `char *` es un puntero a `char`, la forma estándar de recibir un string como argumento de función.
- `getenv` (get environment variable) lee una variable de entorno del sistema. `getenv("PATH")` devuelve un puntero al string con el valor de PATH, o `NULL` si no existe. Está en `<stdlib.h>`.
- `strtok` (string tokenize) divide un string en partes (tokens) usando un delimitador. La primera llamada recibe el string; las siguientes reciben `NULL` y continúan desde donde quedaron. Modifica el string original insertando `'\0'` en cada delimitador.
- `snprintf` es como `printf` pero escribe en un buffer de caracteres en lugar de stdout. El segundo argumento es el tamaño máximo a escribir, para evitar desbordamientos. Usamos esto para construir el path completo: `/usr/bin` + `/` + `grep` → `/usr/bin/grep`.
- `access(path, X_OK)` verifica si un archivo existe y tiene permiso de ejecución. Devuelve `0` si sí, `-1` si no. Está en `<unistd.h>`. `X_OK` es una constante que significa "check execute permission".
- `strdup` (string duplicate) copia un string en memoria nueva asignada con `malloc`. Lo necesitamos porque `strtok` modifica el string original, y PATH es memoria del sistema que no debemos tocar. Está en `<string.h>`.
- `free` libera memoria asignada dinámicamente. Todo lo que se crea con `strdup` o `malloc` debe liberarse con `free` para no tener memory leaks.
- `fork` crea un proceso hijo idéntico al proceso padre. Devuelve `0` en el hijo y el PID del hijo en el padre. Está en `<unistd.h>`. La shell necesita un proceso separado para ejecutar programas externos, sin terminar ella misma.
- `execv` (execute) reemplaza el proceso actual con un nuevo programa. Recibe el path del ejecutable y un array de argumentos. Si tiene éxito, nunca retorna. Está en `<unistd.h>`.
- `waitpid` hace que el padre espere a que el hijo termine antes de continuar. Sin esto, la shell seguiría corriendo mientras el programa externo aún ejecuta. Está en `<sys/wait.h>`.
- **Parseo de argumentos** — necesitamos dividir el input en tokens separados por espacios para armar el array de argumentos. Usamos `strtok` nuevamente, esta vez con `" "` como delimitador.
- El array de argumentos para `execv` debe ser un array de punteros a `char` terminado en `NULL`. Por ejemplo, para `ls -la /tmp` sería `{"ls", "-la", "/tmp", NULL}`.
- `getcwd` (get current working directory) escribe el path absoluto del directorio actual en un buffer. Devuelve el puntero al buffer si tiene éxito, `NULL` si falla. Está en `<unistd.h>`, que ya incluimos.
- `chdir` (change directory) cambia el directorio de trabajo del proceso actual. Devuelve `0` si tiene éxito, `-1` si falla (por ejemplo, si el directorio no existe). Está en `<unistd.h>`, que ya incluimos.
- **Parser manual con índice** — recorremos el string carácter por carácter con un índice `i`, construyendo argumentos en un buffer temporal. Es la forma estándar de implementar parseo con estados.
- **Estado de parseo** — usamos una variable `in_single_quote` (0 o 1) que indica si estamos dentro de comillas simples. Dentro, todo se trata literalmente; fuera, el espacio delimita argumentos.
- `argv` **dinámico** — en vez de un array fijo de punteros, usamos `strdup` para guardar cada argumento terminado. Cada argumento se construye carácter a carácter en un buffer temporal `arg_buf`.
- **File descriptors** — en Unix, cada proceso tiene descriptores de archivo numerados. `0` = stdin, `1` = stdout, `2` = stderr. Todo I/O pasa por estos números.
- `open` abre o crea un archivo y devuelve un file descriptor. Flags: `O_WRONLY` (solo escritura), `O_CREAT` (crear si no existe), `O_TRUNC` (truncar si existe). El tercer argumento `0644` son los permisos del archivo nuevo (lectura/escritura para el dueño, solo lectura para otros). Está en `<fcntl.h>`.
- `dup2(src, dst)` (duplicate file descriptor) hace que `dst` apunte al mismo archivo que `src`. `dup2(fd, 1)` reemplaza stdout con nuestro archivo. En el proceso hijo, esto redirige toda salida a ese archivo. Está en `<unistd.h>`.
- `close` cierra un file descriptor. Después de `dup2`, el fd original ya no es necesario.
- `O_APPEND` es un flag adicional para `open` que hace que cada escritura se agregue al final del archivo en vez de sobreescribir. Es el único cambio respecto a `>`.
- `readline` es una biblioteca que reemplaza `fgets` para leer input. Maneja el cursor, historial, y permite interceptar la tecla Tab para autocompletar. Hay que linkearla con `-lreadline` al compilar.
- `rl_completion_entry_function` es un puntero de función que readline llama cuando el usuario presiona Tab. Lo reemplazamos con nuestra propia función.
- `rl_attempted_completion_function` es otro punto de personalización: se llama antes del completion por defecto. Lo usamos para desactivar el completion de archivos (que readline hace por defecto) y usar solo el nuestro.
- `add_history` agrega el comando al historial de readline (flecha arriba).
- La función de completion recibe el texto parcial y un índice `state`: `0` en la primera llamada, incrementando en llamadas subsiguientes. Devuelve `strdup` del match encontrado, o `NULL` cuando no hay más.
- `opendir` / `readdir` / `closedir` — API de POSIX para listar el contenido de un directorio. `opendir` devuelve un `DIR*`, `readdir` devuelve un `struct dirent*` con el nombre de cada entrada (`d_name`), y `NULL` al terminar. Están en `<dirent.h>`.
- `rl_completion_display_matches_hook` es un puntero de función que readline llama cuando tiene múltiples matches para mostrar. Lo reemplazamos para controlar exactamente cómo se imprimen.
- `rl_attempted_completion_over` ya lo conocemos. El comportamiento de "bell en primer Tab, lista en segundo Tab" es el comportamiento por defecto de readline cuando hay múltiples matches — no hay que implementarlo manualmente.
- **Longest Common Prefix (LCP)** — cuando hay múltiples matches, en vez de no completar nada, completamos hasta donde todos los matches coinciden. Lo calculamos comparando todos los strings carácter por carácter.
- `rl_insert_text` inserta texto en la línea actual de readline en la posición del cursor.
- `qsort` ordena un array. Recibe el array, el número de elementos, el tamaño de cada elemento, y una función de comparación. Está en `<stdlib.h>`.
- `start` en `shell_completion` — readline pasa `start` como el índice en la línea donde empieza el texto a completar. Si `start == 0`, el usuario está completando el comando. Si `start > 0`, está completando un argumento. Hasta ahora ignorábamos el caso `start > 0`.
- `rl_filename_completion_function` es la función built-in de readline que completa nombres de archivo en el directorio actual. No hay que implementarla, solo llamarla.
- `pipe` crea un par de file descriptors conectados: lo que se escribe en `fd[1]` se puede leer desde `fd[0]`. Lo usamos para capturar el stdout del proceso hijo (el completer script) en el padre.
- `popen` / `pclose` — alternativa de alto nivel a pipe+fork, pero usamos pipe manualmente para tener más control.
- `Pipeline` — conecta el stdout de un proceso con el stdin del siguiente usando un pipe. Ya conocemos `pipe`, `fork`, y `dup2`. La diferencia es que ahora los usamos para conectar dos procesos entre sí en vez de con un archivo.
- El proceso izquierdo escribe en `pipefd[1]`, el proceso derecho lee de `pipefd[0]`. El padre cierra ambos extremos y espera a que terminen los dos hijos.
- Para que un builtin pueda participar en un pipeline, tiene que correr en un proceso hijo (fork), porque necesitamos redirigir su stdin/stdout con `dup2`. La diferencia con externos es que en vez de `execv`, ejecutamos la lógica del builtin directamente en el hijo y hacemos `exit`.
- En vez de un solo pipe entre dos procesos, necesitamos N-1 pipes para N comandos. Cada proceso intermedio lee del pipe anterior y escribe en el siguiente.