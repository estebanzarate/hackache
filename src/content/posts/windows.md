---
title: Windows
description: ""
tags: [windows]
draft: false
lang: es
translationId: windows
---

## Estructura

| **Directorio**             | **Función**                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Perflogs                   | Puede tener registros de rendimiento de Windows                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Program Files              | En sistemas de 32 bits, los programas de 16 y 32 bits se instalan ahí. En sistemas de 64 bits, solo los de 64 bits                                                                                                                                                                                                                                                                                                                                                             |
| Program Files (x86)        | En ediciones de Windows de 64 bits, los programas de 16 y 32 bits se instalan ahí                                                                                                                                                                                                                                                                                                                                                                                              |
| ProgramData                | Directorio oculto que contiene datos esenciales para la ejecución de algunos programas instalados                                                                                                                                                                                                                                                                                                                                                                              |
| Users                      | Contiene perfiles de usuario para cada usuario que inicia sesión y contiene las carpetas **Default** y **Public**                                                                                                                                                                                                                                                                                                                                                              |
| Defautl                    | Plantilla de perfil de usuario para todos los usuarios creados                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Public                     | Destinada para compartir archivos entre usuarios de una computadora, es accesible a todos los usuarios por defecto, se comparte a través de la red por defecto, requiere una cuenta de red                                                                                                                                                                                                                                                                                     |
| AppData                    | Los datos y la configuración de cada aplicación de usuario se almacenan en una subcarpeta oculta (`melvin\AppData`). Contiene 3 subcarpetas: **Roaming** contiene datos independientes del sistema que deben seguir el perfil del usuari, **Local** es específica de la propia computadora y no se sincroniza a través de la red, **LocalLow** tiene un nivel de integridad de datos inferior, puede ser utilizada por un navegador web configurado en modo protegido o seguro |
| Windows                    | Contiene la mayoría de archivos requeridos por Windows                                                                                                                                                                                                                                                                                                                                                                                                                         |
| System, System32, SysWOW64 | Contiene todas las DLL necesarias para las funciones principales de Windows y la API de Windows. El sistema operativo busca en estas carpetas cada vez que un programa solicita cargar una DLL sin especificar una ruta absoluta                                                                                                                                                                                                                                               |
| WinSxS                     | Contiene una copia de todos los componentes, actualizaciones y paquetes de servicio de Windows                                                                                                                                                                                                                                                                                                                                                                                 |

## Comandos

[Comandos de Windows](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands)

- `dir`
- `tree`

## Sistema de archivos

### FAT32 (File Allocation Table)

Se usa en memorias USB, SD cards o para formatear discos duros. Usa 32 bits de datos para identificar clústeres de datos en un dispositivo de almacenamiento. Compatible con distintos dispositivos y múltiples sistemas operativos. Soporta archivos menores a 4GB. No incluye funciones integradas de protección de datos ni de compresión de archivos.

### NTFS (New Technology File System)

Puede restablecer la coherencia del sistema de archivos en caso de fallo del sistema o pérdida de energía. Permite establecer permisos detallados tanto para archivos como para carpetas. Admite particiones de gran tamaño. Las modificaciones de archivos (adición, modificación, eliminación) quedan registradas en un sistema de registro de transacciones integrado. La mayoría de los dispositivos móviles no son compatibles con NTFS de forma nativa. Dispositivos multimedia antiguos no son compatibles con dispositivos de almacenamiento NTFS.

## Permisos

| Tipo                 | Descripción                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Full Control         | Leer, escribir, modificar y eliminar archivos y directorios                                                         |
| Modify               | Leer, escribir y eliminar archivos y directorios                                                                    |
| List Folder Contents | Permite ver y listar directorios y subdirectorios, y ejecutar archivos. Los directorios solo heredan estos permisos |
| Read and Execute     | Permite ver y listar archivos y subdirectorios, y ejecutar archivos. Archivos y directorios heredan este permiso    |
| Write                | Permite agregar archivos a directorios y subdirectorios y escribir a un archivo                                     |
| Read                 | Permite ver y listar directorios y subdirectorios y ver el contenido de archivos                                    |
| Traverse Folder      | Permite o niega la habilidad de moverse a través de directorios para llegar a otros archivos o directorios          |

Archivos y directorios heredan permisos NTFS de su directorio padre.

### Integrity Control Access Control List (icacls)

Gestiona permisos NTFS en archivos y directorios.

[icacls](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/icacls)

#### Configuraciones de herencia

- `(CI)`: container inherit
- `(OI)`: object inherit
- `(IO)`: inherit only
- `(NP)`: no propaga herencia
- `(I)`: permiso heredado de su contenedor padre

#### Permisos de acceso básicos

- `F`: full access
- `D`:  delete access
- `N`:  no access
- `M`:  modify access
- `RX`:  read and execute access
- `R`:  read-only access
- `W`:  write-only access

Otorgar permisos: `icacls c:\users /grant joe:f`  
Revocar permisos: `icacls c:\users /remove joe`
