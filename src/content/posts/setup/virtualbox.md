---
title: Virtual Box
description: Instalación de Arch Linux en Virtual Box
tags: [linux, arch, setup, virtualbox]
draft: false
lang: es
parent: setup
translationId: setupVirtualBox
---

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

## Instalar herramientas

```bash
sudo pacman -S apache aws-cli-v2 base-devel bettercap bind binutils cmake dig firefox fping gemini-cli git gobuster gtk3 hashcat hydra impacket ipcalc jadx jq less lxc man-db medusa metasploit mktorrent mosquitto neovim net-snmp nfs-utils nikto nmap nodejs noto-fonts-emoji npm openbsd-netcat openldap openvpn p7zip perl-image-exiftool perl-xml-writer php picom plocate pocl polybar proxychains-ng qt5ct rabbitmq radare2 redis rsync rust rustscan scapy smbclient socat sqlmap tcpdump tor torbrowser-launcher tree ttf-hack-nerd unzip winetricks wireshark-qt wpscan xclip xorg-xset zaproxy zip gvfs gvfs-mtp gvfs-gphoto2 file-roller sushi udisks2 polkit numlockx papirus-icon-theme
```

**Providers**: `ttf-dejavu`, `jre21-openjdk`, `qt6-multimedia-ffmpeg`

## Crear directorios y archivos de configuración

```bash
mkdir -p $HOME/.config/{kitty,nvim,polybar,picom,colors,gtk-3.0,gtk-4.0,vpn}
mkdir $HOME/.config/bspwm/scripts
mkdir $HOME/.config/polybar/scripts
touch $HOME/.config/polybar/scripts/{target.sh,target.txt,vpn.sh,ip.sh}
touch $HOME/.config/bspwm/scripts/bspwm_resize
touch $HOME/.config/polybar/{launch.sh}
touch $HOME/.config/colors/{colors.ini,colors.sh,colors.py}
chmod +x $HOME/.config/polybar/launch.sh
touch $HOME/.config/kitty/kitty.conf
touch $HOME/.config/picom/picom.conf
chmod +x $HOME/.config/polybar/scripts/{target.sh,vpn.sh,ip.sh}
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
paru -S bibata-cursor-theme-bin burpsuite catppuccin-gtk-theme-mocha dotpeek ffuf ike-scan netexec opengrep semgrep-bin visual-studio-code-bin wafw00f
```

**Providers**: `arc-gtk-theme`, `ffuf`, `netexec`, `wafw00f`

## Configuraciones

### bash

`$HOME/.bashrc`

```bash
source $HOME/.config/colors/colors.sh

[[ $- != *i* ]] && return

export _JAVA_AWT_WM_NONREPARENTING=1
export WPSCAN_API_TOKEN=

alias burp='/usr/bin/burpsuite > /dev/null 2>&1 & disown'
alias fire='/usr/bin/firefox > /dev/null 2>&1 & disown'
alias nau='/usr/bin/nautilus > /dev/null 2>&1 & disown'
alias tor='/usr/bin/torbrowser-launcher > /dev/null 2>&1 & disown'
alias wire='/usr/bin/wireshark > /dev/null 2>&1 & disown'

PS1=" \[\033[38;2;228;161;27m\]\w\[\033[0m\] \[\033[38;2;20;164;77m\]\[\033[0m\] "

target() {
    local target_file="$HOME/.config/polybar/scripts/target.txt"
    local usage="\nUsage: target [ip] or target [ip:port]\n  target 10.10.10.10        → set target IP in Polybar\n  target 10.10.10.10:8080   → set target IP and port in Polybar\n  target                    → clear target from Polybar\n"

    if [[ $# -eq 0 ]]; then
        : > "$target_file"
        return 0
    elif [[ $# -ne 1 ]]; then
        echo -e "$usage"
        return 1
    fi

    local input="$1"
    local ip="${input%%:*}"
    local port="${input##*:}"
    [[ "$ip" == "$port" ]] && port=""

    if ! [[ "$ip" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: '$ip' is not a valid IP address"
        echo -e "$usage"
        return 1
    fi

    local octet
    for octet in ${ip//./ }; do
        if (( octet > 255 )); then
            echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: invalid IP (octets must be between 0 and 255)"
            return 1
        fi
    done

    if [[ -n "$port" ]]; then
        if ! [[ "$port" =~ ^[0-9]+$ ]] || (( port < 1 || port > 65535 )); then
            echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: invalid port (must be between 1 and 65535)"
            return 1
        fi
        echo "$ip:$port" > "$target_file"
    else
        echo "$ip" > "$target_file"
    fi
}

_ports_error() {
    local usage="Usage: ports <file>
  ports lookup.gnmap   → parses grepable nmap output
  ports lookup.nmap    → parses normal nmap output
  ports lookup.xml     → parses XML nmap output"
    echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: $1\n"
    echo -e "$usage\n"
}

ports() {
    if [[ $# -ne 1 ]]; then
        if [[ $# -eq 0 ]]; then
            _ports_error "no file specified"
        else
            _ports_error "too many arguments"
        fi
        return 1
    fi

    local file="$1"
    if [[ ! -f "$file" ]]; then
        _ports_error "'$file' is not a valid file"
        return 1
    fi

    local result
    case "$file" in
        *.gnmap)
            result=$(grep -oP '\d{1,5}/open' "$file" | awk -F'/' '{print $1}' | sort -un | xargs | tr ' ' ',')
            ;;
        *.nmap)
            result=$(grep -oP '^\s*\d{1,5}/\w+\s+open' "$file" | grep -oP '^\s*\d+' | tr -d ' ' | sort -un | xargs | tr ' ' ',')
            ;;
        *.xml)
            result=$(grep 'state="open"' "$file" | grep -oP 'portid="\K\d+' | sort -un | xargs | tr ' ' ',')
            ;;
        *)
            _ports_error "unrecognized file extension (expected .gnmap, .nmap or .xml)"
            return 1
            ;;
    esac

    if [[ -z "$result" ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] No open ports found in '$file'\n"
        return 1
    fi

    echo "$result"
}

_venv_error() {
    echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: $1\n"
}

_venv_success() {
    echo -e "\n[${ANSI_SUCCESS}+${COLOR_RESET}] $1"
}

venv() {
    local venv_dir="venv"
    local libs=("$@")

    if [[ ${#libs[@]} -eq 0 ]]; then
        if [[ -d "$venv_dir" ]]; then
            [[ -n "$VIRTUAL_ENV" ]] && deactivate
            rm -rf "$venv_dir"
            _venv_success "venv removed\n"
        else
            python3 -m venv "$venv_dir"
            source "$venv_dir/bin/activate"
            _venv_success "venv created and activated\n"
        fi
        return 0
    fi

    if [[ ! -d "$venv_dir" ]]; then
        python3 -m venv "$venv_dir"
        _venv_success "venv created"
    fi

    if [[ -z "$VIRTUAL_ENV" ]]; then
        source "$venv_dir/bin/activate"
    fi

    echo -e "\n[${ANSI_SUCCESS}*${COLOR_RESET}] Installing libraries: ${libs[*]}\n"
    python3 -m pip install "${libs[@]}"
}

_vpn_error() {
    local usage="Usage: vpn <htbm|htbc|htba|thm>
  vpn htbm   → connect to HackTheBox
  vpn htbc  → connect to HackTheBox Competitive
  vpn htba  → connect to HackTheBox Academy
  vpn thm   → connect to TryHackMe"
    echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: $1\n"
    [[ "$2" != "no-usage" ]] && echo -e "$usage\n"
}

vpn() {
    local config_dir="$HOME/.config/vpn"

    if [[ $# -eq 0 ]]; then
        _vpn_error "no arguments provided"
        return 1
    fi
    if [[ $# -gt 1 ]]; then
        _vpn_error "too many arguments"
        return 1
    fi

    local config
    case "$1" in
        htbm)  config="$config_dir/htbm.ovpn" ;;
        htbc) config="$config_dir/htbc.ovpn" ;;
        htba) config="$config_dir/htba.ovpn" ;;
        thm)  config="$config_dir/thm.ovpn" ;;
        *)
            _vpn_error "unknown VPN '$1' (expected htb, htbc, htba or thm)"
            return 1
            ;;
    esac

    if [[ ! -f "$config" ]]; then
        _vpn_error "config file not found at '$config'" "no-usage"
        return 1
    fi

    echo -e "\n[${ANSI_WARNING}*${COLOR_RESET}] Connecting to $1 VPN\n"
    sudo openvpn --config "$config"
}

clip() {
    if [[ $# -eq 0 ]]; then
        echo -e "\nUsage: clip <file>\n"
        return 1
    fi
    if [[ $# -gt 1 ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: too many arguments\n"
        echo -e "Usage: clip <file>\n"
        return 1
    fi
    if [[ ! -f "$1" ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: '$1' is not a valid file\n"
        return 1
    fi
    xclip -sel clip < "$1"
    echo -e "\n[${ANSI_SUCCESS}+${COLOR_RESET}] '$1' copied to clipboard\n"
}
```

### Themes

`$HOME/.config/gtk-3.0/settings.ini`

```bash
[Settings]
gtk-theme-name=catppuccin-mocha-mauve-standard+default
gtk-icon-theme-name=Papirus-Dark
gtk-cursor-theme-name=Bibata-Modern-Classic
gtk-application-prefer-dark-theme=true
```

`$HOME/.config/gtk-4.0/settings.ini`

```bash
[Settings]
gtk-theme-name=catppuccin-mocha-mauve-standard+default
gtk-icon-theme-name=Papirus-Dark
gtk-cursor-theme-name=Bibata-Modern-Classic
gtk-application-prefer-dark-theme=true
```

`$HOME/.xprofile`

```bash
xrdb $HOME/.Xresources
export GTK_THEME=catppuccin-mocha-mauve-standard+default
export XCURSOR_THEME=Bibata-Modern-Classic
export XCURSOR_SIZE=24
export QT_QPA_PLATFORMTHEME=gtk3
```

`$HOME/.Xresources`

```bash
Xcursor.theme: Bibata-Modern-Classic
```

`/etc/lightdm/lightdm.conf`

```bash
[LightDM]
run-directory=/run/lightdm

[Seat:*]
autologin-user=melvin
autologin-user-timeout=0
autologin-session=bspwm
greeter-setup-script=/usr/bin/numlockx on
session-wrapper=/etc/lightdm/Xsession
```

`/etc/lightdm/lightdm-gtk-greeter.conf`

```bash
[greeter]
background=#11111b
user-background=false
theme-name=catppuccin-mocha-mauve-standard+default
icon-theme-name=Papirus-Dark
cursor-theme-name=Bibata-Modern-Classic
hide-user-image=true
panel-position=top
indicators=~session;~power
```

### Firefox

- `about:config`
- `browser.fixup.domainsuffixwhitelist.htb`, `browser.fixup.domainsuffixwhitelist.thm`
- `true`

### Git

```bash
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"
git config --global core.autocrlf input
git config --global credential.helper store
```

### Nvchad

[Repo](https://nvchad.com/docs/quickstart/install/)

`$HOME/.local/share/nvim/lazy/NvChad/lua/nvchad/configs/cmp.lua ` avoid autocomplete

```bash
dofile(vim.g.base46_cache .. "cmp")

local cmp = require "cmp"

local options = {
  completion = { completeopt = "menu,menuone", autocomplete = false },
```

### Polybar

`$HOME/.config/polybar/config.ini`

```bash
include-file = $HOME/.config/colors/colors.ini

[bar/main]
background = #11111b
modules-left = arch desk ip vpn target
modules-right = dog
width = 99%
offset-x = 0.5%
offset-y = 10
padding = 1
module-margin = 1
font-0 = Adwaita-Sans:size=14;3
font-1 = Hack Nerd Font:size=14;3
font-2 = JetBrainsMono Nerd Font Mono:size=16;3
cursor-click = pointer
cursor-scroll = ns-resize

[module/arch]
type = custom/text
label = [ %{F#1793D1}%{T3}󰣇%{T-}%{F-} ]

[module/desk]
type = internal/xworkspaces
label-empty-foreground = ${colors.secondary}
label-active-foreground = ${colors.success}
label-occupied-foreground = ${colors.warning}

[module/ip]
type = custom/script
exec = $HOME/.config/polybar/scripts/ip.sh
click-left = echo -n "$(ip a show enp0s3 | grep -oP '(?<=inet\s)\d+\.\d+\.\d+\.\d+')" | xclip -sel clip
interval = 2

[module/vpn]
type = custom/script
exec = $HOME/.config/polybar/scripts/vpn.sh
click-left = echo -n "$(ip a show tun0 | grep -oP '(?<=inet\s)\d+\.\d+\.\d+\.\d+')" | xclip -sel clip
interval = 2

[module/target]
type = custom/script
exec = $HOME/.config/polybar/scripts/target.sh
click-left = echo -n "$(cat $HOME/.config/polybar/scripts/target.txt)" | xclip -sel clip
interval = 2

[module/dog]
type = custom/text
label = [ %{F#C68642}%{T3}󰩃%{T-}%{F-} ]
```

`$HOME/.config/polybar/launch.sh`

```bash
#!/bin/bash

killall -q polybar

polybar main 2>&1 | tee -a /tmp/polybar.log & disown
```

`$HOME/.config/polybar/scripts/ip.sh`

```bash
#!/bin/bash

source $HOME/.config/colors/colors.sh

IP=$(ip a show enp0s3 2>/dev/null | grep -oP '(?<=inet\s)\d+\.\d+\.\d+\.\d+')

if [ -n "$IP" ]; then
  echo "%{F$COLOR_PRIMARY}󰈀%{F-}%{O12}$IP"
else
  echo "%{F$COLOR_DARK}󰈀%{F-}%{O10}"
fi
```

`$HOME/.config/polybar/scripts/vpn.sh`

```bash
#!/bin/bash

source $HOME/.config/colors/colors.sh

IFACE=$(ip -o link show | awk -F': ' '/tun0/ {print $2}')

if [ "$IFACE" = "tun0" ]; then
  echo "%{F$COLOR_SUCCESS}󰆧%{F-}%{O10}$(ip a show tun0 | grep -oP '(?<=inet\s)\d+\.\d+\.\d+\.\d+')"
else
  echo ""
fi
```

`$HOME/.config/polybar/scripts/target.sh`

```bash
#!/bin/bash

source $HOME/.config/colors/colors.sh

ip_address=$(/bin/cat $HOME/.config/polybar/scripts/target.txt)

if [ -n "$ip_address" ]; then
  echo "%{F$COLOR_DANGER}󰓾%{F-}%{O10}$ip_address"
else
  echo ""
fi
```

### Proxychains

`sudo nvim /etc/proxychains.conf`

```bash
dynamic_chain
proxy_dns
```

### Wireshark

```bash
sudo usermod -aG wireshark $USER
```

## Remove packages

```bash
sudo pacman -Rns rxvt-unicode xdo dmenu
```

## Instalación de herramientas adicionales

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

### enum4linux-ng

[Repo](https://github.com/cddmp/enum4linux-ng)

```bash
sudo pacman -S smbclient python-ldap3 python-yaml impacket
git clone https://github.com/cddmp/enum4linux-ng
cd enum4linux-ng
python3 -m venv venv
source venv/bin/activate
python3 -m pip install wheel
python3 -m pip install -r requirements.txt
```

### Evil-winrm

```bash
gem install evil-winrm
```

### John The Ripper

[Repo](https://github.com/openwall/john)

```bash
git clone https://github.com/openwall/john.git
cd john/src
./configure && make
cd ../..
sudo mv john /opt
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

### SecLists

[Repo SecLists](https://github.com/danielmiessler/SecLists)

```bash
sudo mkdir /usr/share/wordlists
sudo git clone https://github.com/danielmiessler/SecLists.git /usr/share/wordlists/seclists
```

### Tor

```bash
sudo pacman -S tor
sudo systemctl start tor
sudo systemctl status tor
sudo systemctl stop tor
```

### Wordlists

```bash
sudo git clone https://github.com/insidetrust/statistically-likely-usernames.git /usr/share/wordlists/statistically-likely-usernames
```

### Instalar herramientas con Go

[kerbrute](https://github.com/ropnop/kerbrute)

```bash
go install github.com/ropnop/kerbrute@latest
```

`/etc/profile.d/custom.sh`

```bash
append_path '$HOME/go/bin'
append_path '/home/melvin/.local/share/gem/ruby/3.4.0/bin'
```
