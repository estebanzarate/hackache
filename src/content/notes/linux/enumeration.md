---
title: Enumeration
description: Linux enumeration commands and techniques.
tags: [linux, enumeration, recon]
date: 2025-01-01
order: 1
---

## System Info

```bash
uname -a
hostname
id
whoami
cat /etc/passwd
cat /etc/os-release
```

## Network

```bash
ip a
netstat -tulnp
ss -tulnp
cat /etc/hosts
arp -a
```

## File System

```bash
find / -perm -4000 2>/dev/null
find / -writable -type f 2>/dev/null
ls -la /home/
cat /etc/fstab
```

## Processes & Services

```bash
ps aux
ps -ef
systemctl list-units --type=service
crontab -l
cat /etc/cron*
```