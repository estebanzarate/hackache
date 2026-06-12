---
title: Servicios
description: Servicios y protocolos
tags: [services]
draft: false
lang: es
translationId: services
---

> Protocolo para la carga y descarga de archivos entre un cliente y un servidor.

**Puerto**: 21

## Configuración

`/etc/vsftpd.conf`: Archivo de configuración del servidor vsFTPd en entornos Linux.

```bash
cat /etc/vsftpd.conf | grep -v "#"
```

```plaintext
listen=NO
listen_ipv6=YES
anonymous_enable=NO
local_enable=YES
dirmessage_enable=YES
use_localtime=YES
xferlog_enable=YES
connect_from_port_20=YES
secure_chroot_dir=/var/run/vsftpd/empty
pam_service_name=vsftpd
rsa_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
rsa_private_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
ssl_enable=NO
```

`/etc/ftpusers`: Archivo de configuración que contiene una lista negra de usuarios locales a los que se les deniega explícitamente el acceso al servicio FTP.

```bash
cat /etc/ftpusers
```

```plaintext
# /etc/ftpusers: list of users disallowed FTP access. See ftpusers(5).

root
daemon
bin
sys
sync
games
man
lp
mail
news
uucp
nobody
```

### Configuraciones peligrosas

| Configuración                | Descripción                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------- |
| anonymous_enable=YES         | Permite el inicio de sesión como anonymous                                       |
| anon_upload_enable=YES       | Permite la subida de archivos como anonymous                                     |
| anon_mkdir_write_enable=YES  | Permite la creación de directorios como anonymous                                |
| no_anon_password=YES         | No pide contraseña como anonymous                                                |
| anon_root=/home/username/ftp | Directorio de anonymous                                                          |
| write_enable=YES             | Permite el uso de los comandos FTP: STOR, DELE, RNFR, RNTO, MKD, RMD, APPE, SITE |

- **Anonymous FTP**: Configuración de servidor que permite a cualquier usuario conectarse y transferir archivos sin requerir credenciales válidas ni contraseña.

## Enumeración

```bash
nmap -p 21 --script "*ftp*" -vv 10.129.24.76
```

```bash
nc -nv 10.129.24.76 21
```

## Interacción

Con TLS/SSL encryption

```bash
openssl s_client -connect 10.129.24.76:21 -starttls ftp
```

Descargar todos los archivos disponibles

```bash
wget -m --no-passive ftp://nathan:'Buck3tH4TF0RM3!'@10.129.24.76
```
