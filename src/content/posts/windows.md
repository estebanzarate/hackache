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
