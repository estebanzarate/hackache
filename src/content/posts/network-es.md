---
title: Red
description: Redes, tipos de redes, modelos OSI y TCP/IP, protocolos y transmisión de datos.
tags: [network]
lang: es
translationId: network
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
