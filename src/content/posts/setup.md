---
title: Setup
description: Instalación de Arch Linux en Virtual Box
tags: [linux, arch, setup]
date: 2026-05-22
order: 1
---

![Final Setup](https://github.com/user-attachments/assets/c462e76e-a1a4-4025-944e-8fcd0b5b1baa)

## Creación de máquina virtual

- Crear una nueva máquina virtual
- Click derecho en la nueva máquina virtual creada, seleccionar `settings`
- En la sección `General`, pestaña `Features`, seleccionar la opción `Bidirectional` en `Shared Clipboard`

![General Features Config](https://github.com/user-attachments/assets/b8fa927f-f2ee-4778-b21e-1da4860ab3fd)

![Display Config](https://github.com/user-attachments/assets/8b69117c-929a-4dd3-90f4-3446dcfe9db4)

- Click `OK` para guardar los cambios
- Iniciar la máquina virtual

```bash
loadkeys la-latin1
setfont ter-120b
pacman -Sy archinstall
archinstall
```

## Archinstall

- **Archinstall language**: `English`
- **Locales**:
  - **Keyboard layout**: `la-latin1`
- **Mirrors and repositories**:
  - **Select regions**: `Brazil`
- **Disk configuration**:
  - **Partitioning**:
    - **Use a best-effort default partition layout**: `ATA VBOX HARDDISK`
      - **Filesystem**: `ext4`
        - **Would you like to create a separate partition for /home?**: `No`
- **Authentication**:
  - **User account**: `Add a user`
    - **Should "user" be a superuser (sudo)?**: `yes`
  - **Confirm and exit**
- **Profile**:
  - **Type**:
    - **Desktop**: `Bspwm` (It'll install: `bspwm`, `dmenu`, `rxvt-unicode`, `sxhkd`, `xdo`)
  - **Graphics driver**: `VirtualBox (open-source)` (It'll install: `mesa`, `xorg-server`, `xorg-xinit`)
- **Applications**:
  - **Audio**: `pipewire`
- **Network configuration**: `Copy ISO network configuration to installation`
- **Timezone**: `America/Argentina/Buenos_Aires`
- **Install**:
  - **The specified configuration will be applied. Would you like to continue?**: `Yes`
- **Exit archinstall**
- `poweroff`

## Últimos ajustes de la máquina virtual

Click derecho en la nueva máquina virtual creada, seleccionar `settings`

![System Motherboard Config](https://github.com/user-attachments/assets/04eea94b-0ab1-4d39-bd19-a9320e3b0dd8)

![Storage Config](https://github.com/user-attachments/assets/3dd10781-f38e-4eab-a309-88ed5b917061)

Click `OK` para guardar los cambios

Iniciar la máquina virtual  
Iniciar sesión  
Presionar `ctrl` + `alt` + `F2` para abrir una nueva consola

![Login Arch](https://github.com/user-attachments/assets/d964f004-87f0-498f-97f8-1f10b5fbe480)

Iniciar sesión nuevamente

```bash
mkdir -p ~/.config/{bspwm,sxhkd}
cp /usr/share/doc/bspwm/examples/bspwmrc ~/.config/bspwm/bspwmrc
cp /usr/share/doc/bspwm/examples/sxhkdrc ~/.config/sxhkd/sxhkdrc
sudo pacman -S kitty virtualbox-guest-utils
sudo systemctl enable --now vboxservice
```

Agregar `pkill -x VBoxClient; sleep 1 && VBoxClient-all &` al archivo `$HOME/.config/bspwm/bspwmrc`  
Modificar `terminal emulator` en el archivo `$HOME/.config/sxhkd/sxhkdrc` por `/usr/bin/kitty`

```bash
# terminal emulator
super + Return
  /usr/bin/kitty
```

Reiniciar  
Iniciar sesión  
Presionar `super` + `Return` para abrir `kitty`

**AHORA PODÉS COPIAR Y PEGAR**

## Instalación de herramientas

```bash
sudo pacman -S apache aws-cli-v2 base-devel bat bettercap bind binutils cmake docker-buildx dig firefox fping gemini-cli git gobuster gtk3 hashcat hydra impacket ipcalc jadx jq lsd less lxc man-db medusa metasploit mktorrent mosquitto neovim net-snmp nfs-utils nikto nmap nodejs noto-fonts-emoji npm openbsd-netcat openldap openvpn p7zip perl-image-exiftool perl-xml-writer php picom plocate pocl polybar proxychains-ng qt5ct rabbitmq radare2 redis rsync rust rustscan scapy smbclient socat sqlmap tcpdump tor torbrowser-launcher tree ttf-hack-nerd unzip winetricks wireshark-qt wpscan xclip xorg-xset zaproxy zip
```

**Providers**: `ttf-dejavu`, `jre21-openjdk`, `qt6-multimedia-ffmpeg`

## Crear directorios y archivos de configuración

```bash
mkdir -p $HOME/.config/{kitty,nvim,polybar,picom,colors,gtk-3.0,gtk-4.0,vpn}
mkdir $HOME/.config/bspwm/scripts
mkdir $HOME/.config/polybar/scripts
touch $HOME/.config/polybar/scripts/{target.sh,target.txt,vpn.sh,}
touch $HOME/.config/bspwm/scripts/bspwm_resize
touch $HOME/.config/polybar/{launch.sh,env.sh}
touch $HOME/.config/colors/{colors.ini,colors.sh,colors.py}
chmod +x $HOME/.config/polybar/launch.sh
touch $HOME/.config/kitty/kitty.conf
touch $HOME/.config/picom/picom.conf
chmod +x $HOME/.config/polybar/scripts/{target.sh,vpn.sh}
chmod +x $HOME/.config/bspwm/scripts/bspwm_resize
```

## Instalar `paru` para instalar herramientas desde AUR

```bash
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si
cd ..
rm -rf paru
```

### Instalar herramientas desde AUR

```bash
paru -S arc-gtk-theme bibata-cursor-theme-bin burpsuite dotpeek ffuf i3lock-fancy-git ike-scan netexec opengrep semgrep-bin visual-studio-code-bin wafw00f
```

**Providers**: `arc-gtk-theme`, `ffuf`, `netexec`, `wafw00f`

## Configuraciones

### Greeter Dark Theme

Archivo `/etc/lightdm/lightdm-gtk-greeter.conf`

```bash
[greeter]
#background=
#user-background=
theme-name=Arc-Dark
```

### Dark Theme

`$HOME/.xprofile`

```bash
export GTK_THEME=Arc-Dark
export GTK2_RC_FILES=/usr/share/themes/Arc-Dark/gtk-2.0/gtkrc
export QT_QPA_PLATFORMTHEME=gtk3
```

`$HOME/.config/gtk-3.0/settings.ini`

```bash
[Settings]
gtk-theme-name=Arc-Dark
gtk-application-prefer-dark-theme=true
```

### Cursor

`mkdir -p $HOME/.local/share/icons/default`

`$HOME/.local/share/icons/default/index.theme`

```bash
[Icon Theme]
Inherits=Bibata-Modern-Classic
```

`$HOME/.config/gtk-3.0/settings.ini`

```bash
[Settings]
gtk-cursor-theme-name=Bibata-Modern-Classic
gtk-cursor-theme-size=24
```

`$HOME/.config/gtk-4.0/settings.ini`

```bash
[Settings]
gtk-cursor-theme-name=Bibata-Modern-Classic
gtk-cursor-theme-size=24
```

`sudo nvim /usr/share/icons/default/index.theme`

```bash
[Icon Theme]
Inherits=Bibata-Modern-Classic
```

### Git

```bash
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"
git config --global core.autocrlf input
git config --global credential.helper store
```

### Firefox

- `about:config`
- `browser.fixup.domainsuffixwhitelist.htb`, `browser.fixup.domainsuffixwhitelist.thm`
- `true`

### Nvchad

`$HOME/.local/share/nvim/lazy/NvChad/lua/nvchad/configs/cmp.lua ` avoid autocomplete

```bash
dofile(vim.g.base46_cache .. "cmp")

local cmp = require "cmp"

local options = {
  completion = { completeopt = "menu,menuone", autocomplete = false },
```

### Wireshark

```bash
sudo usermod -aG wireshark $USER
```

### Proxychains

`sudo nvim /etc/proxychains.conf`

```bash
dynamic_chain
proxy_dns
```

### Remove packages

```bash
sudo pacman -Rns rxvt-unicode xdo dmenu
```

## Instalación de herramientas adicionales

### SecLists

[Repo SecLists](https://github.com/danielmiessler/SecLists)

```bash
sudo mkdir /usr/share/wordlists
sudo git clone https://github.com/danielmiessler/SecLists.git /usr/share/wordlists/seclists
```

### Wordlists

```bash
sudo git clone https://github.com/insidetrust/statistically-likely-usernames.git /usr/share/wordlists/statistically-likely-usernames
```

### Searchsploit

[exploitdb](https://gitlab.com/exploit-database/exploitdb)

```bash
sudo git clone https://gitlab.com/exploit-database/exploitdb.git /opt/exploit-database
sudo ln -sf /opt/exploit-database/searchsploit /usr/local/bin/searchsploit
cp -n /opt/exploit-database/.searchsploit_rc ~/
```

Modificar el archivo `$HOME/.searchsploit_rc`

```bash
# Exploits
path_array+=("/opt/exploit-database")

# Shellcodes
path_array+=("/opt/exploit-database")
```

### John The Ripper

```bash
git clone https://github.com/openwall/john.git
cd john/src
./configure && make
cd ../..
sudo mv john /opt
```

### Evil-winrm

```bash
gem install evil-winrm
```

### Docker

```bash
sudo pacman -S docker
sudo systemctl start docker.service
sudo systemctl enable docker.service
sudo docker run hello-world
sudo usermod -aG docker $USER
sudo pacman -S docker-compose
```

Cerrar sesión y volver a iniciar sesión

### Tor

```bash
sudo pacman -S tor
sudo systemctl start tor
sudo systemctl status tor
sudo systemctl stop tor
```

### enum4linux-ng

```bash
sudo pacman -S smbclient python-ldap3 python-yaml impacket
git clone https://github.com/cddmp/enum4linux-ng
cd enum4linux-ng
python3 -m venv venv
source venv/bin/activate
python3 -m pip install wheel
python3 -m pip install -r requirements.txt
```

### Instalar herramientas con Go

```bash
go install github.com/ropnop/kerbrute@latest
```

Agregar al `$PATH` `/etc/profile`

```bash
append_path '$HOME/go/bin'
append_path '/home/melvin/.local/share/gem/ruby/3.4.0/bin'
```

## Tools

- `base-devel`
- `bat`
- `bettercap`
- `binutils`
- `cmake`
- `dig`
- `docker-buildx`
- `enum4linux-ng` [enum4linux-ng](https://github.com/cddmp/enum4linux-ng)
- `evil-winrm` [Evil-winrm](https://github.com/Hackplayers/evil-winrm)
- `firefox` (option 5 ttf-dejavu)
- `ffuf`
- `fping`
- `git`
- `gobuster`
- `gtk3`
- `hashcat`
- `hydra`
- `i3lock-fancy-git`
- `ike-scan`
- `impacket`
- `ipcalc`
- `jadx`
- `john`
- `kerbrute` [kerbrute](https://github.com/ropnop/kerbrute)
- `kitty`
- `lds`
- `less`
- `lxc`
- `man-db`
- `medusa`
- `metasploit`
- `mosquitto`
- `neovim`
- `netexec`
- `nfs-utils`
- `nikto`
- `nmap`
- `nodejs`
- `noto-fonts-emoji`
- `npm`
- [NvChad](https://nvchad.com/docs/quickstart/install/)
- `openbsd-netcat`
- `openldap` [OpenLDAP](https://git.openldap.org/openldap/openldap)
- `openvpn`
- `p7zip`
- `perl-image-exiftool`
- `perl-xml-writer`
- `php`
- `picom`
- `plocate`
- `pocl`
- `polybar`
- `proxychains-ng`
- `qt5ct`
- `rabbitmq`
- `radare2`
- `redis`
- `rsync`
- `rust`
- `rustscan`
- `scapy`
- `smbclient`
- `socat`
- `sqlmap`
- `tcpdump`
- `tor`
- `torbrowser-launcher`
- `tree`
- `ttf-hack-nerd`
- `type`
- `unzip`
- `virtualbox-guest-utils`
- `visual-studio-code-bin`
- `wafw00f`
- `wireshark-qt`
- `wpscan`
- `xclip`
- `xorg-xset`
- `zaproxy`
- `zip`