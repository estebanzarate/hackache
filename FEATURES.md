# New Features

- Los tags deben ser clickeables y llevar a una página con todos los posts relacionados a ese tag
- Agregar un botón para copiar el link de cada post
- Agregar un botón para compartir cada post en redes sociales
- Agregar un botón para descargar cada post en formato PDF
- El Sidebar no debería colapsarse cuando se abre un post, sino que debería permanecer abierto para facilitar la navegación entre posts, si expando una categoría, debería permanecer expandida incluso al abrir un post relacionado a esa categoría u otra categoría, y debería resaltar la categoría del post que se está viendo
- Añadir paginación para navegar entre los posts
- Eliminar la fecha de publicación de cada post (note/writeup) para mantener un enfoque atemporal, en vez de haber posts recientes, la sección y todo lo relacionado se debería llamar "Destacados", eliminá la sección "Recent Notes" no me gusta, dejemos solo la de writeups
- Los writeups recientes deben poder tener una imagen que se va a tomar del writeup, en cada writeup va a haber una imagen al principio y es debe mostrarse en la card de reciente, si no hay imagen, no se muestra nada
- Crear callouts customizables para destacar información importante dentro de los posts, con diferentes estilos (por ejemplo, advertencia, información, éxito) o cualquier otro estilo que se me ocurra
- Quiero poder ordenar también la estructura de las categorías, no solo el orden de los posts dentro de cada categoría, sino también el orden de las categorías dentro del sidebar, para poder destacar ciertas categorías por sobre otras u ordenarlas a gusto según otros criterios, como primero setup, luego enumeración, luego explotación, etc. y dentro de cada categoría ordenar los posts según el orden que yo quiera, no solo por fecha o alfabéticamente
- Backdrop móvil en sidebarAhora en mobile el sidebar abre sin overlay, se superpone al contenido
- Página de tagsListar todos los posts de un tag específico
- Reading timeEstimación de tiempo de lectura en el header del post
- SEO (meta OG, sitemap bien configurado)Para cuando lo publiques
- Hacer que las imágenes sean responsive no importa el tamaño de la pantalla, no se si eso es posible con markdown o siempre tengo que usar la etiqueta img, pero me gustaría poder usar markdown normalmente y que las imágenes se adapten al tamaño de la pantalla, sin importar si es desktop o mobile, sin que se deformen ni nada, simplemente adaptándose al ancho disponible

```yaml
---
title: "Enumeration"
description: "Linux enumeration commands"
tags: [linux, enumeration]
date: 2025-01-01
order: 1
lang: en
draft: false
group: "Linux"          # nombre del grupo en el sidebar
groupOrder: 1           # orden del grupo (entre grupos)
parent: ""              # vacío = página top-level, o slug del padre = subpágina
---