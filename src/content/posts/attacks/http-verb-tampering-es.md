---
title: HTTP Verb Tampering
tags: [attacks, http]
lang: es
translationId: http-verb-tampering
draft: false
parent: attacks-es
---

- Explota servidores web que aceptan múltiples verbos y métodos HTTP configurados de forma insegura.
- Enviar solicitudes maliciosas mediante métodos inesperados para evadir los mecanismos de autorización del servidor o sus controles de seguridad.

[HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)

[Test HTTP Methods](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/06-Test_HTTP_Methods)

Alternar métodos HTTP para ver como el servidor y la aplicación frontend responden.

## Insecure Configurations

Se limitan directivas de autenticación a ciertos verbos dejando la misma ruta desprotegida ante solicitudes que utilizan otros métodos.

## Insecure Coding

Filtros de sanitización validan una variable vinculada a un método específico pero la función que ejecuta la acción procesa una variable global permitiendo evadir el filtro cambiando el método de la solicitud.

## Prevention

### Insecure Configurations

- Evitar restringir la autorización a un método HTTP en particular y permitir/denegar todos los verbos y métodos HTTP.
- Usar palabras clave seguras, como `LimitExcept` en Apache, `http-method-omission` en Tomcat y `add/remove` en ASP.NET, que cubren todos los verbos excepto los especificados.
- Deshabilitar o denegar todas las solicitudes HEAD, a menos que la aplicación web lo requiera específicamente.

### Insecure Coding

- Ser coherentes en el uso de los métodos HTTP.
- Usar el mismo método para cualquier funcionalidad en toda la aplicación web.
- Ampliar el alcance de las pruebas en los filtros de seguridad probando todos los parámetros de la solicitud.
