---
title: Linux
description: Sistema operativo Linux
tags: [linux]
draft: false
lang: es
translationId: linux
---

Todos los archivos de configuración para los distintos servicios corriendo en el sistema operativo Linux se guardan en uno o más archivos.

## Componentes

| Componente      | Descripción                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| Bootloader      | Código que se ejecuta el proceso de booteo para arrancar el sistema operativo                             |
| OS kernel       | Gestiona los recursos para los dispositivos de entrada y salida del sistema a nivel de hardware           |
| Daemons         | Servicios que se ejecutan en segundo plano, se cargan después de arrancar la computadora o iniciar sesión |
| OS shell        | Interfaz entre el OS y el usuario                                                                         |
| Graphics server | Permite ejecutar programas gráficos de forma local o remota en el sistema de ventanas X                   |
| Window manager  | Interfaz gráfica de usuario (GUI)                                                                         |

## Arquitectura

| Capa           | Descripción                                                                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hardware       | Dispositivos periféricos                                                                                                                                                                    |
| Kernel         | Virtualiza y controla los recursos de hardware comunes de la computadora, asigna a cada proceso sus propios recursos virtuales y previene o mitiga los conflictos entre diferentes procesos |
| Shell          | A command-line interface (**CLI**) that a user can enter commands into to execute the kernel's functions                                                                                    |
| System Utility | Pone a disposición del usuario todas las funcionalidades del OS                                                                                                                             |

## Sistema de archivos

| Path   | Descripción                                                                                                                                                                  |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /      | Directorio raíz del sistema de archivos, contiene todos los archivos necesarios para arrancar el OS amtes de montar otros sistemas de archivos                               |
| /bin   | Contiene archivos binarios de comandos esenciales                                                                                                                            |
| /boot  | Consta del gestor de arranque estático, el ejecutable del kernel y los archivos necesarios para arrancar el OS                                                               |
| /dev   | Contiene archivos de dispositivo para facilitar el acceso a todos los dispositivos de hardware conectados al sistema                                                         |
| /etc   | Archivos de configuración del sistema local y archivos de configuración de aplicaciones instaladas                                                                           |
| /home  | Cada usuario del sistema tiene un subdirectorio para almacenamiento                                                                                                          |
| /lib   | Archivos de biblioteca compartida necesarios para el arranque del sistema                                                                                                    |
| /media | Se montan los dispositivos de almacenamiento externos extraíbles                                                                                                             |
| /mnt   | Punto de montaje temporal para sistemas de archivos regulares                                                                                                                |
| /opt   | Se pueden guardar archivos opcionales como herramientas de terceros                                                                                                          |
| /root  | Directorio principal del usuario root                                                                                                                                        |
| /sbin  | Contiene archivos ejecutables utilizados para la administración del sistema (archivos binarios del sistema)                                                                  |
| /tmp   | Utilizado para almacenar archivos temporales, se vacía al iniciar el sistema y puede eliminarse en otros momentos sin previo aviso                                           |
| /usr   | Contiene archivos ejecutables, bibliotecas, archivos de manual, etc.                                                                                                         |
| /var   | Contiene archivos de datos variables, como archivos de registro, bandejas de entrada de correo electrónico, archivos relacionados con aplicaciones web, archivos cron y más. |

## Help

```bash
<tool> -h
<tool> --help
man <tool>
apropos <keyword>
```

[https://explainshell.com/](https://explainshell.com/)

## Información del sistema

| **Comando** | **Descripción**                                                                  |
| ----------- | -------------------------------------------------------------------------------- |
| `whoami`    | Muestra el usuario actual                                                        |
| `id`        | Devuelve la identidad de usuarios                                                |
| `hostname`  | Establece o imprime el nombre del sistema host actual system.                    |
| `uname`     | Imprime información sobre el nombre del sistema operativo y hardware del sistema |
| `pwd`       | Returns working directory name.                                                  |
| `ip`        | Muestra o manipula ruteo, dispositivos de red, interfaces y túneles              |
| `netstat`   | Muestra el estado de la red                                                      |
| `ss`        | Investigar sockets                                                               |
| `ps`        | Muestra estado de procesos                                                       |
| `who`       | Muestra quien está logueado                                                      |
| `env`       | Imprime el entorno o establece y ejecuta el comando                              |
| `lsblk`     | Lista dispositivos de bloque                                                     |
| `lsusb`     | Lista dispositivos USB                                                           |
| `lsof`      | Lista archivos abiertos                                                          |
| `lspci`     | Lista archivos PCI                                                               |

- [Capabilities](linux/capabilities)
