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

### Proceso de arranque

1. Encendido
2. **BIOS (Basic Input/Output System)**: Programa alojado en un chip de solo memoria ROM (read-only memory). Ejecuta el POST (Power-On Self-Test). Inicializa componentes de hardware y carga el bootloader.
3. **Master Boot Record (MBR) o EFI Partition**: Programa alojado en un dispositivo de almacenamiento.
4. **Boot Loader**: Carga la imagen del kernel y el disco RAM inicial (initrd o initramfs) en la memoria. Estos componentes contienen controladores y archivos esenciales que mantienen el arranque del sistema hasta que se carga todo el sistema operativo.
   1. Etapa 1
      - **BIOS/MBR**:
        - **Master Boot Record (MBR)**: Primer sector físico del disco duro (512 bytes) que almacena el código inicial mínimo del boot loader. Examina la tabla de particiones para localizar una partición marcada como booteable. Carga el second-stage boot loader (ej. GRUB) en la memoria RAM.
      - **EFI/UEFI**:
        - **UEFI Firmware**: Código de interfaz que lee los datos del Boot Manager para identificar la aplicación a ejecutar.
        - **EFI System Partition (ESP)**: Partición de disco específica que almacena la aplicación UEFI definida en la entrada de arranque para ser lanzada por el firmware.
   2. Etapa 2
      - `/boot`: Directorio del sistema de archivos donde se almacena de forma centralizada el second-stage boot loader. Despliega un splash screen interactivo para la selección del sistema operativo (OS) o la versión específica del kernel. Carga el kernel elegido en la memoria RAM y le transfiere el control absoluto del sistema.
   3. Inicialización del Kernel
      - **Autodescompresión**: Tarea primaria donde el kernel (almacenado de forma compacta) extrae su propio código en la memoria RAM.
      - **Hardware Check**: Fase de análisis de los componentes físicos del sistema e inicialización de los device drivers integrados para habilitar la carga subsiguiente del sistema operativo.
5. Kernel
6. Initial RAM disk - initramfs
7. /sbin/init (proceso padre)
8. Command Shell usando getty
9. Graphical User Interface (X Window o Wayland)

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

## Navegación

- `pwd`: En qué directorio estamos.
- `ls`: Listar el contenido de un directorio.
- `ls -l`: Mostrar más información en directorios y archivos.
- `ls -la`: Listar todos los archivos y directorios.
- `ls -l /home`: Listar el contenido de un path.
- `cd /home`: Cambiar al directorio.
- `cd -`: Cambiar al directorio anterior.
- `cd /hom [TAB 2x]`: Autocompletado.
- `.`: Directorio actual.
- `..`: Directorio padre.
- `clear`: Limpiar la consola.

- [Capabilities](linux/capabilities)

## Transferir archivos al Android

```bash
sudo mkdir /mnt/android
sudo aft-mtp-mount /mnt/android/
aft-mtp-cli
```
