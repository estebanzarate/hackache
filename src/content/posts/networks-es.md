---
title: Redes
description: Redes, tipos de redes, modelos OSI y TCP/IP, protocolos y transmisión de datos.
tags: [network]
lang: es
translationId: network
draft: false
---

> Una red es un conjunto de dispositivos interconectados que pueden enviar y recibir datos, y también compartir recursos entre sí.

### Tipos de redes

#### Local Area Network (LAN)

- Cubre una superficie pequeña.
- Por lo general, son propiedad de una sola persona u organización y están gestionados por ella.
- Altas tasas de transferencia de datos.
- Utiliza conexiones por cable (cables Ethernet) o inalámbricas (Wi-Fi).

#### Wide Area Network (WAN)

- Abarca ciudades, países o continentes.
- A menudo se trata de una propiedad colectiva o distribuida (por ejemplo, los proveedores de servicios de Internet).
- Las velocidades de transferencia de datos son más lentas en comparación con las redes LAN debido a la larga distancia que recorre la transmisión de datos.
- Utiliza fibra óptica, enlaces satelitales y líneas de telecomunicaciones arrendadas.

## Modelo OSI (Open Systems Interconnection)

Es un marco conceptual que estandariza las funciones de un sistema de telecomunicaciones o informático en siete capas abstractas.

### Capa física # 1

- Se encarga de transmitir flujos de bits sin procesar a través de un medio físico.
- Gestiona la conexión física entre dispositivos, incluyendo componentes de hardware como cables Ethernet, hubs y repetidores.

### Capa de enlace de datos # 2

- Proporciona transferencia de datos entre nodos, un enlace directo entre dos nodos conectados físicamente.
- Garantiza que las tramas de datos se transmitan con la sincronización adecuada, detección y corrección de errores.

### Capa de red # 3

- Gestiona el reenvío de paquetes, su enrutamiento a través de diferentes routers hasta la red de destino.
- Es responsable del direccionamiento lógico y la determinación de rutas, asegurando que los datos lleguen al destino correcto a través de múltiples redes.

### Capa de transporte # 4

- Proporciona servicios de comunicación de extremo a extremo para las aplicaciones.
- Es responsable de la entrega de datos, la segmentación, el reensamblaje de mensajes, el control de flujo y la detección de errores.

### Capa de sesión # 5

- Gestiona las sesiones entre aplicaciones.
- Establece, mantiene y finaliza las conexiones, permitiendo que los dispositivos mantengan comunicaciones continuas conocidas como sesiones.
- Control y recuperación de sesiones, asegurando que la transferencia de datos se reanude sin interrupciones.

### Capa de presentación # 6

- Gestiona la representación de datos, asegurando que la información enviada por la capa de aplicación de un sistema sea legible por la capa de aplicación de otro. Incluye cifrado y descifrado de datos, compresión de datos y conversión de formatos de datos.

### Capa de aplicación # 7

- Proporciona servicios de red directamente a las aplicaciones de usuario final.
- Permite compartir recursos, acceder a archivos remotos y otros servicios de red.

## Modelo TCP/IP (Transmission Control Protocol/Internet Protocol)

Versión condensada del modelo OSI, diseñada para implementación práctica en internet y otras redes.

### Capa de enlace

- Gestiona los aspectos físicos del hardware y los medios de red.

### Capa de Internet

- Gestiona el direccionamiento lógico de los dispositivos y el enrutamiento de paquetes a través de las redes.

### Capa de transporte

- Proporciona servicios de comunicación de extremo a extremo. Incluye el uso de TCP (Protocolo de Control de Transmisión) para una comunicación fiable y UDP (Protocolo de Datagramas de Usuario) para servicios más rápidos y sin conexión.
- Garantiza que los paquetes de datos se entreguen de forma secuencial y sin errores.

### Capa de aplicación

- Contiene protocolos que ofrecen servicios de comunicación de datos a las aplicaciones.

## Protocolos

Reglas estandarizadas que determinan el formato y el procesamiento de los datos para facilitar la comunicación entre dispositivos en una red.

- [Registros de protocolos](https://www.iana.org/protocols)
- [Números de protocolo](https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml)

## Transmisión

Proceso de enviar señales de datos a través de un medio, de un dispositivo a otro.

### Tipos de transmisión

- **Analógica**: Utiliza señales continuas para representar información.
- **Digital**: Emplea señales discretas (bits) para codificar datos.

### Modos de transmisión

Cómo se envían los datos entre dos dispositivos.

- **Simplex**: permite la comunicación unidireccional, las señales viajan en una sola dirección.
- **Semidúplex**: permite la comunicación bidireccional, no simultáneamente.
- **Dúplex completo**: admite la comunicación bidireccional simultánea.

### Medios de transmisión

Medio físico mediante el cual se transmiten los datos en una red.

- **Alámbricos**: incluyen cables de par trenzado, cables coaxiales y cables de fibra óptica.
- **Inalámbricos**: abarcan ondas de radio para Wi-Fi y redes celulares, microondas para comunicaciones por satélite y tecnología infrarroja utilizada para comunicaciones de corto alcance, como los mandos a distancia.

## Componentes de una red

| **Componente**                   | **Descripción**                                           |
| -------------------------------- | --------------------------------------------------------- |
| Dispositivos finales             | Computers, Smartphones, Tablets, IoT / Smart Devices      |
| Dispositivos intermediarios      | Switches, Routers, Modems, Access Points                  |
| Medios de transmisión y software | Cables, Protocols, Management and Firewalls Software      |
| Servers                          | Web Servers, File Servers, Mail Servers, Database Servers |

- **Dispositivos finales**: Termina enviando o recibiendo datos dentro de una red.
- **Dispositivos intermediarios**: Facilita el flujo de información entre dispositivos finales.
  - **Network Interface Cards (NIC)**: Componente de hardware instalado en dispositivo que permite la conexión a una red.
    - Cada NIC tiene una única MAC address que sirve para que los dispositivos se identifiquen entre si.
  - **Routers**: Reenvía paquetes de datos entre redes y la dirección del tráfico de Internet. Leen la información de la dirección de red en los paquetes de datos para determinar sus destinos. Utilizan tablas y protocolos de enrutamiento.
  - **Switches**: Conecta múltiples dispositivos dentro de la misma red. Utiliza MAC address para reenviar datos solo al destinatario previsto.
  - **Hubs**: Conecta múltiples dispositivos en un segmento de red y transmite datos entrantes a todos los puertos conectados, independientemente del destino.
- **Medios de transmisión y software**:
  - **Cableado y conectores**: Materiales físicos utilizados para enlazar dispositivos dentro de una red.
  - **Protocolos de red**: Conjunto de reglas y convenciones que controlan cómo se formatean, transmiten, reciben e interpretan los datos a través de una red.
  - **Software de gestión de redes**: Herramientas y aplicaciones utilizadas para monitorear, controlar y mantener los componentes y operaciones de la red.
  - **Software Firewalls**: Aplicación de seguridad instalada en dispositivos que monitorean y controlan el tráfico de red entrante y saliente basado en reglas de seguridad predeterminadas.
- **Servidores**: Presta servicios a otras PC, como alojar servicios, compartir recursos, centralizar los datos, controlar el acceso.

## MAC address (Media Access Control MAC address)

Identificador único asignado a la tarjeta de interfaz de red (NIC) de un dispositivo. 48 bits de longitud y se representa en formato hexadecimal, seis pares de dígitos hexadecimales separados por dos puntos o guiones. Los primeros 24 bits representan el Organizationally Unique Identifier (OUI) asignado al fabricante y los 24 bits restantes son para el dispositivo individual.

- Un dispositivo encapsula los datos en un frame conteniendo la MAC address.
- Los switches utilizan la MAC address para reenviar el frame al puerto apropiado.
- El protocolo ARP mapea la dirección IP a la MAC address.

## IP addresses (Internet Protocol (IP) address)

Es una etiqueta numérica asignada a cada dispositivo conectado a una red que utiliza el Protocolo de Internet para la comunicación.

### IPv4

Direcciones de 32 bits, típicamente formateado como cuatro números decimales separados por puntos `192.168.1.1`.

### IPv6

Direcciones de 128 bits formateadas en ocho grupos de cuatro dígitos hexadecimales `2001:0db8:85a3:0000:0000:8a2e:0370:7334`.

## Puerto

Número asignado a procesos o servicios en una red para ayudar a los ordenadores a ordenar y dirigir el tráfico de red correctamente. Van del 0 al 65535.

- **Well-Known Ports (0-1023)**: Servicios y protocolos comunes y universalmente reconocidos, estandarizados y gestionados por la Internet Assigned Numbers Authority (IANA).
- **Registered Ports (1024-49151)**: Servicios externos que los usuarios pueden instalar en un dispositivo.
- **Dynamic/Private Ports (49152-65535)**: Utilizado por aplicaciones cliente para enviar y recibir datos de servidores. Puede ser seleccionado aleatoriamente por el sistema operativo del cliente según sea necesario para cada sesión. Para sesiones de comunicación temporal, se cierran una vez que finaliza la interacción.

## Dynamic Host Configuration Protocol (DHCP)

Protocolo de gestión de red para automatizar el proceso de configuración de dispositivos en redes IP. Permite a los dispositivos recibir automáticamente una dirección IP, máscara de subred, puerta de enlace predeterminada y servidores DNS, sin intervención manual. Recicla direcciones IP que ya no están en uso cuando los dispositivos se desconectan de la red.

### DORA (Discover, Offer, Request, Acknowledge)

| Paso        | Descripción                                                                                                                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Discover    | Un dispositivo se conecta a la red transmite un mensaje DHCP Discover para encontrar servidores DHCP disponibles                                                                                |
| Offer       | Los servidores DHCP en la red reciben el mensaje de descubrimiento y responden con un mensaje de oferta DHCP, ofreciendo una dirección IP al cliente                                            |
| Request     | El cliente recibe la oferta y responde con un mensaje de solicitud DHCP, indicando que acepta la dirección IP ofrecida                                                                          |
| Acknowledge | El servidor DHCP envía un mensaje de confirmación de DHCP, confirmando que al cliente se le ha asignado la dirección IP. El cliente ahora puede usar la dirección IP para comunicarse en la red |

## Network Address Translation (NAT)

Permite que varios dispositivos en una red privada compartan una única dirección IP pública. Proceso llevado a cabo por un router o un dispositivo similar que modifica la dirección IP de origen o destino en los encabezados de los paquetes IP a medida que pasan, para traducir las direcciones IP privadas de los dispositivos dentro de una red local a una única dirección IP pública que se asigna al router.

- **IP pública**: Son identificadores únicos a nivel mundial asignados por los Proveedores de Servicios de Internet (ISP).
- **IP privada**: Designadas para su dentro de redes locales, no son enrutables en el Internet global. Los rangos incluyen 10.0.0.0 a 10.255.255.255, 172.16.0.0 a 172.31.25.255 y 192.168.0.0 a 192.168.255.255.

### Tipos de NAT

| Tipo                                          | Descripción                                                                                                                                          |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static NAT                                    | Cada dirección IP privada corresponde directamente a una dirección IP pública                                                                        |
| Dynamic NAT                                   | Asigna una IP pública de un grupo de direcciones disponibles a una IP privada según la demanda de la red                                             |
| Port Address Translation (PAT) o NAT Overload | Múltiples direcciones IP privadas comparten una única dirección IP pública, diferenciando las conexiones mediante el uso de números de puerto únicos |

## Domain Name System (DNS)

Ayuda a encontrar el número correcto (una dirección IP) para un nombre determinado (un dominio como www.google.com).

- **Domain Name**: Dirección legible como `www.example.com`.
- **Dirección IP**: Una etiqueta numérica, por ejemplo, `93.184.216.34`.

### Jerarquía DNS

| Layer                    | Descripción                                                       |
| ------------------------ | ----------------------------------------------------------------- |
| Root Servers             | La parte superior de la jerarquía DNS                             |
| Top-Level Domains (TLDs) | .com, .org, .net, códigos de país como .uk, .de.                  |
| Second-Level Domains     | `example` en `example.com`                                        |
| Subdomains or Hostname   | `www` en `www.example.com`, o `accounts` en `accounts.google.com` |

### DNS Resolution Process (Domain Translation)

| Paso | Descripción                                                                                                                                                        |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | Escribimos `www.example.com` en el navegador                                                                                                                       |
| 2    | Nuestro equipo comprueba su caché DNS local para ver si ya conoce la dirección IP                                                                                  |
| 3    | Si no la encuentra localmente, consulta un recursive DNS server proporcionado por el proveedor de servicios de Internet o servicio DNS de terceros como Google DNS |
| 4    | El recursive DNS server contacta con un root server, que lo apunta al servidor de nombres TLD apropiado (como dominios `.com`)                                     |
| 5    | El servidor de nombres TLD dirige la consulta al servidor de nombres autorizado para `example.com`                                                                 |
| 6    | El servidor de nombres autorizado responde con la dirección IP de `www.example.com`                                                                                |
| 7    | El recursive server devuelve esta dirección IP a su computadora, que luego puede conectarse al servidor del sitio web directamente                                 |
