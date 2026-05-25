---
title: Nmap
tags: [nmap]
lang: es
parent: tools
---

[Sitio web](https://nmap.org/)

## Flags

`-sn` Deshabilita el escaneo de puertos, usa ARP  
`-PE` Solo usa ICMP Echo  
`--disable-arp-ping` Deshabilita ARP  
`--top-ports` Escanea los puertos más comunes  
`--packet-trace` Muestra todos los paquetes enviados y recibidos  

## Host Discovery

Escanear un rango

```bash
sudo nmap 10.129.2.0/24 -sn
```

Escanear una lista de IPs

```bash
sudo nmap -sn -iL hosts.lst
```

Escanear múltiples IPs

```bash
sudo nmap -sn 10.129.2.18 10.129.2.19 10.129.2.20
```

Escanear direcciones IP consecutivas

```bash
sudo nmap -sn 10.129.2.18-20
```

Escanear IP única

```bash
sudo nmap 10.129.2.18 -sn
```

## Escaneo de hosts y puertos

### Estados de un puerto escaneado

**open**: La conexión con el puerto escaneado se estableció  
**closed**: El paquete de la respuesta contiene una flag `RST`  
**filtered**: No hubo respuesta o se recibe un código de error  
**unfiltered**: El puerto es accesible pero no se pudo determinar si está abierto o cerrado  
**open|filtered**: Si no se recibe una respuesta e indica que un firewall o un filtro de paquetes podría proteger el puerto  
**closed|filtered**: Se produce en escaneos de IP ID inactivos e indica que no se pudo determinar si el puerto está cerrado o filtrado por un firewall  

Escaneo de puertos TCP

```bash
sudo nmap 10.129.2.28 --top-ports=10
```

Escaneo de conexión TCP

```bash
sudo nmap 10.129.2.28 -p 443 --packet-trace --disable-arp-ping -Pn -n --reason -sT
```

Escaneo de puerto UDP

```bash
sudo nmap 10.129.2.28 -F -sU
```