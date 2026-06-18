---
title: Active Directory
description: ""
tags: [active-directory]
draft: false
lang: es
translationId: activeDirectory
---

> Servicio de directorio jerárquico y distribuido para la gestión centralizada de recursos (users, computers, groups, network devices, trusts) en entornos Windows.

## Estructura lógica y organizativa

- **Object**: Cualquier recurso individual presente dentro del entorno de Active Directory (ej. users, computers, printers, OUs).
- **Attributes**: Conjunto de características que definen a un Object (ej. hostname). Cada uno posee un nombre LDAP para realizar consultas.
- **Schema**: Plano estructural de la base de datos de AD. Define las clases de objetos permitidos y sus respectivos Attributes. La creación e un objeto a partir de una clase es una instantiation y el resultado es una instance.
- **Container**: Objeto intermedio diseñado para almacenar otros objetos dentro de la jerarquía del directorio.
- **Leaf**: Objeto final de la jerarquía que no puede contener otros elementos.
- **Domain**: Agrupación lógica de objetos (computers, users, groups). Funciona de manera independiente o conectado a otros mediante trust elationships.
- **Tree**: Colección de Domains interconectados que inician desde un único root domain, comparten un namespace contiguo y un Global Catalog.
- **Forest**: El contenedor jerárquico de nivel superior. Agrupa múltiples Trees y Domains, actuando como el límite máximo de seguridad de la nfraestructura.

## Identificadores y nomenclatura

- **Global Unique Identifier (GUID)**: Valor único de 128 bits asignado internamente por AD a cada objeto al ser creado (guardado en el atributo ObjectGUID). Permanece inalterable durante toda la existencia del objeto.
- **Distinguished Name (DN)**: Ruta absoluta y completa que identifica un objeto dentro de la jerarquía de AD (ej. `cn=bjones,ou=IT,dc=domain,dc=local`).
- **Relative Distinguished Name (RDN)**: Componente individual y único del DN que identifica al objeto únicamente al nivel de su contenedor actual (ej. cn=bjones).
- **sAMAccountName**: Nombre único de inicio de sesión del usuario (logon name) limitado a un máximo de 20 caracteres.
- **userPrincipalName**: Atributo opcional de inicio de sesión con formato de correo electrónico (`prefix@suffix`, ej. `bjones@domain.local`).
- **Fully Qualified Domain Name (FQDN)**: Nombre DNS completo y absoluto de un host dentro de la red ([host].[domain].[tld]).

## Identidades y seguridad (Principals y ACLs)

- **Security principals**: Cualquier entidad que el sistema operativo puede autenticar (users, computer accounts, processes) capaz de gestionar el acceso a recursos.
- **Security Identifier (SID)**: Valor único e irrepetible emitido por el Domain Controller para identificar un security principal o grupo. Se incluye en el access token de la sesión y nunca se reutiliza.
- **Access Control List (ACL)**: Colección ordenada de entradas de control de acceso (ACEs) vinculadas a un objeto.
- **Access Control Entries (ACEs)**: Elemento individual de una ACL que determina los derechos específicos (permitidos, denegados o auditados) de un trustee.
- **Discretionary Access Control List (DACL)**: Lista de ACEs que define explícitamente qué security principals tienen permitido o denegado el acceso a un objeto.
- **System Access Control Lists (SACL)**: Lista de ACEs destinada a auditar y registrar los intentos de acceso a objetos dentro del security event log.

## Roles, servicios y almacenamiento

- **FSMO Roles (Flexible Single Master Operation)**: Cinco funciones críticas distribuidas entre los Domain Controllers para evitar puntos únicos de falla. Se dividen en:
  - **Forest**: Schema Master y Domain Naming Master.
  - **Domain**: RID Master, PDC Emulator e Infrastructure Master.
- **Global Catalog (GC)**: Domain Controller que almacena una copia íntegra de los objetos de su propio dominio y una copia parcial de todos los objetos del Forest, facilitando búsquedas globales y autenticación.
- **Read-Only Domain Controller (RODC)**: Domain Controller con base de datos de AD y DNS de solo lectura. No almacena credenciales en caché por defecto, reduciendo riesgos en entornos físicos inseguros.
- **Replication**: Proceso de sincronización automatizado que propaga los cambios de los objetos de AD entre los diferentes Domain Controllers a través del servicio KCC.
- **Service Principal Name (SPN)**: Identificador único que asocia una instancia de servicio con una cuenta de inicio de sesión para el funcionamiento de la autenticación Kerberos.
- **Group Policy Object (GPO)**: Colecciones virtuales de configuraciones y políticas de seguridad aplicables a cuentas de usuarios y computadoras a nivel de dominio u OU.
- **SYSVOL**: Carpeta compartida y replicada entre todos los Domain Controllers que almacena las políticas públicas, scripts de inicio de sesión y configuraciones del dominio.
- **NTDS.DIT**: Archivo de base de datos central de Active Directory. Almacena todos los objetos, relaciones y los hashes de contraseñas de los usuarios del dominio.

## Ciclo de vida y protección de objetos

- **Tombstone**: Estado y contenedor temporal de un objeto marcado como eliminado (isDeleted=TRUE). Permanece allí durante el Tombstone Lifetime (60 a 180 días) perdiendo la mayoría de sus atributos antes de su borrado definitivo.
- **AD Recycle Bin**: Característica que preserva los objetos eliminados con todos sus atributos intactos por un tiempo definido, permitiendo su restauración directa sin recurrir a copias de seguridad.
- **AdminSDHolder**: Objeto especial que contiene la plantilla de ACL aplicada automáticamente por el proceso SDProp (ejecutado en el PDC Emulator) para proteger las cuentas y grupos privilegiados del dominio de modificaciones no autorizadas.
- **dsHeuristics**: Atributo de configuración global del Forest empleado para definir directivas operativas, como la exclusión de grupos específicos de la protección de AdminSDHolder.
- **adminCount**: Atributo numérico de los objetos de usuario. Si su valor es 1, indica que la cuenta está protegida de forma activa por el proceso SDProp.

## Herramientas y protocolos heredados

- **Active Directory Users and Computers (ADUC)**: Consola gráfica (GUI) estándar orientada a la gestión cotidiana de usuarios, grupos, computadoras y unidades organizativas.
- **ADSI Edit**: Herramienta gráfica avanzada de bajo nivel diseñada para modificar, añadir o eliminar directamente cualquier atributo en la base de datos de AD.
- **sIDHistory**: Atributo que almacena los SIDs antiguos de un objeto migrado entre dominios para conservar accesos previos. Puede ser explotado si carece de SID Filtering.
- **MSBROWSE**: Protocolo heredado y obsoleto utilizado en versiones antiguas de Windows para listar recursos compartidos en redes locales, actualmente reemplazado por SMB y CIFS.
