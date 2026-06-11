---
title: USB
tags: [linux]
lang: es
draft: true
---

## USB

Eliminar la firma del sistema de archivos si el USB se usó para una ISO

```bash
sudo wipefs -a /dev/sdb
```

Crear tabla y partición

```bash
sudo fdisk /dev/sdb
g
n
Enter
Enter
Enter
w
```

Formatear

```bash
sudo mkfs.exfat -n USB /dev/sdb1
```
