---
title: Ataques
tags: [attacks]
lang: es
translationId: attacks
draft: false
order: 3
---

- [HTTP Verb Tampering](attacks/http-verb-tampering)

### Insecure Direct Object References (IDOR)

- Acceder a datos confidenciales debido a la falta de un sistema sólido de control de acceso en el backend.
- Manipular o suponer identificadores (números secuenciales o IDs de usuario) expuestos por la aplicación para acceder a archivos y recursos de otros usuarios.

### XML External Entity (XXE) Injection

- Explota aplicaciones web con librerías XML desactualizadas al procesar datos de entrada provenientes del frontend.
- Enviar datos XML maliciosos para exponer archivos locales del servidor, robar credenciales o lograr la ejecución remota de código.
