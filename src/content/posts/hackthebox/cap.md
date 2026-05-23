---
title: Cap
featured: true
order: 1
image: /images/hackthebox/Cap.webp
platform: htb
difficulty: easy
os: linux
hints: []
tags: [htb, linux]
group: Hack The Box
groupOrder: 2
---

## Enumeration

```bash
sudo nmap -p- -sS --min-rate 5000 -Pn -n -vv -oA nmap/Cap 10.129.4.66
```

```
PORT   STATE SERVICE REASON
21/tcp open  ftp     syn-ack ttl 63
22/tcp open  ssh     syn-ack ttl 63
80/tcp open  http    syn-ack ttl 63
```

## Exploitation

## User flag

## Privilege escalation

## Root flag