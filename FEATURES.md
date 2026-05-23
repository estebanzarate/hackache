# New Features

- Agregar un botón para copiar el link de cada post
- Agregar un botón para compartir cada post en redes sociales (LinkedIn, Twitter, Facebook, Telegram, Whatsapp, copiar enlace)
- Agregar un botón para descargar cada post en formato PDF, y otro para copiar todo el contenido del post en formato markdown para copiarselo a una IA
- El Sidebar no debería colapsarse cuando se abre un post, sino que debería permanecer abierto para facilitar la navegación entre posts, si expando una categoría, debería permanecer expandida incluso al abrir un post relacionado a esa categoría u otra categoría, y debería resaltar la categoría del post que se está viendo
- Eliminar la fecha de publicación de cada post (note/writeup) para mantener un enfoque atemporal, o sea, que el usuario no la vea, en vez de haber posts recientes, no debería haber una sección de recent posts, la idea es simplemente poner a discreción los posts que yo quiera en el home siguiendo cierta estructura, por ejemplo, si pongo writeups estas cards podrían tener una imagen que suelen tener en las plataformas de CTF y una lista pequeña de palabras que sería como pistas, como - SUID, - SSRF, - XSS, algo así, se podría añadir la dificultad y el OS, pero si fuera un post de una nota técnica o algo así no sería necesario que tenga una imagen
- Al agregar la dificultad en un writeup estos deberían tener un color, cada plataforma usa los suyos, por ahora vamos a usar los de HTB y THM, pero si se me ocurre otro sistema de colores o algo así, lo puedo implementar también, así también se podrían listar los writeups por dificultad, o incluso agregar un filtro para que el usuario pueda elegir qué dificultad quiere ver, lo mismo con el OS, se podrían listar por OS o agregar un filtro para que el usuario pueda elegir qué OS quiere ver
- Crear callouts customizables para destacar información importante dentro de los posts, con diferentes estilos (por ejemplo, advertencia, información, éxito) o cualquier otro estilo que se me ocurra
- Backdrop móvil en sidebarAhora en mobile el sidebar abre sin overlay, se superpone al contenido
- SEO (meta OG, sitemap bien configurado)Para cuando lo publiques
- Hacer que las imágenes sean responsive no importa el tamaño de la pantalla, no se si eso es posible con markdown o siempre tengo que usar la etiqueta img, pero me gustaría poder usar markdown normalmente y que las imágenes se adapten al tamaño de la pantalla, sin importar si es desktop o mobile, sin que se deformen ni nada, simplemente adaptándose al ancho disponible

####################################################################################################

- Las imágenes cuando las creo con markdown no se adaptan al tamaño de la pantalla y se genera un scroll horizontal. Las imágenes en las cards de los posts featured en el home deben verse dentro del contenedor de la imagen con algun padding para que no se pegue a los bordes.