---
title: IDOR (Insecure Direct Object References)
tags: [attacks, idor]
lang: es
translationId: idor
draft: false
parent: attacks-es
---

> Acceder a datos confidenciales debido a la falta de un sistema sólido de control de acceso en el backend. Manipular o suponer identificadores (números secuenciales o IDs de usuario) expuestos por la aplicación para acceder a archivos y recursos de otros usuarios.

- Identificar Direct Object References analizando HTTP requests para encontrar parámetros en la URL, APIs o headers con referencias a objetos.
