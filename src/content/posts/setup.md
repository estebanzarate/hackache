---
title: Setup
description: Instalación de Arch Linux
tags: [linux, arch, setup]
lang: es
order: 1
---

![Final Setup](@images/setup/setup.png)

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
    - **Use a best-effort default partition layout**: `A ELECCIÓN`
      - **Filesystem**: `ext4`
        - **Would you like to create a separate partition for /home?**: `No`
- **Authentication**:
  - **User account**: `Add a user`
    - **Should "user" be a superuser (sudo)?**: `yes`
  - **Confirm and exit**
- **Profile**:
  - **Type**:
    - **Desktop**: `Bspwm` (It'll install: `bspwm`, `dmenu`, `rxvt-unicode`, `sxhkd`, `xdo`)
  - **Graphics driver**: `A ELECCIÓN`
- **Applications**:
  - **Audio**: `pipewire`
- **Network configuration**: `Copy ISO network configuration to installation`
- **Timezone**: `America/Argentina/Buenos_Aires`
- **Install**:
  - **The specified configuration will be applied. Would you like to continue?**: `Yes`
- **Exit archinstall**
- `poweroff`

Presionar `ctrl` + `alt` + `F2` para abrir una nueva consola

![Login Arch](https://github.com/user-attachments/assets/d964f004-87f0-498f-97f8-1f10b5fbe480)

Iniciar sesión nuevamente

```bash
mkdir -p ~/.config/{bspwm,sxhkd}
cp /usr/share/doc/bspwm/examples/bspwmrc ~/.config/bspwm/bspwmrc
cp /usr/share/doc/bspwm/examples/sxhkdrc ~/.config/sxhkd/sxhkdrc
```

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
sudo pacman -S base-devel bat bluez bluez-utils feh firefox git gtk3 lsd neovim nodejs noto-fonts noto-fonts-emoji papirus-icon-theme picom plank polybar qt6ct rtkit sshpass ttf-dejavu-nerd ttf-hack-nerd xclip xorg-xset
```

**Providers**: `ttf-dejavu`, `jre21-openjdk`

## Crear directorios y archivos de configuración

```bash
mkdir -p $HOME/.config/{kitty,nvim,polybar,picom,colors,gtk-3.0,vpn,dunst,plank,systemd}
mkdir $HOME/.config/bspwm/scripts
mkdir $HOME/.config/polybar/scripts
mkdir $HOMW/.config/systemd/user
touch $HOME/.config/systemd/user/{check-updates.service,check-updates.timer}
touch $HOME/.config/polybar/scripts/{target.sh,target.txt,vpn.sh,gmail.py,spotify.sh}
touch $HOME/.config/bspwm/scripts/bspwm_resize
touch $HOME/.config/polybar/{launch.sh,env.sh}
touch $HOME/.config/colors/{colors.ini,colors.sh,colors.py}
chmod +x $HOME/.config/polybar/launch.sh
touch $HOME/.config/plank/launch.sh
chmod +x $HOME/.config/plank/launch.sh
touch $HOME/.config/kitty/kitty.conf
touch $HOME/.config/picom/picom.conf
touch $HOME/.config/dunst/dunstrc
chmod +x $HOME/.config/polybar/scripts/{target.sh,vpn.sh,gmail.py,spotify.sh}
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

### Instalaciones desde AUR para terminar de configurar el sistema

```bash
paru -S bibata-cursor-theme-bin catppuccin-gtk-theme-mocha i3lock-fancy-git nordic-theme
```

## Instalar tools del sistema, ciber, programación, etc

```bash
sudo pacman -S 7zip bind cmake cuda discord dunst exfatprogs ffmpeg flameshot fzf gobuster hashcat hydra impacket jq kdenlive kimageformats less libnotify libva-nvidia-driver man-db metasploit nfs-utils nmap nodejs npm numlockx obs-studio obsidian openbsd-netcat opencl-nvidia openvpn pacman-contrib perl-image-exiftool playerctl ripgrep qt6-imageformats ruby-getoptlong ruby-resolv-replace smbclient socat spotify sqlmap tcpdump tree unzip wireshark-qt zip
```

```bash
paru -S burpsuite ffuf netexec stremio visual-studio-code-bin whatweb
```

## Configuraciones

### Bluetooth

```bash
bluetoothctl
power on
agent on
default-agent
scan on
pair XX:XX:XX:XX:XX:XX
connect XX:XX:XX:XX:XX:XX
trust XX:XX:XX:XX:XX:XX
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
gtk-theme-name = catppuccin-mocha-blue-standard+default
gtk-application-prefer-dark-theme = true
gtk-icon-theme-name = Papirus-Dark
gtk-cursor-theme-name = Bibata-Modern-Classic
gtk-cursor-theme-size = 24
```

`$HOME/.config/gtk-4.0/settings.ini`

```bash
[Settings]
gtk-theme-name = catppuccin-mocha-blue-standard+default
gtk-application-prefer-dark-theme = true
gtk-icon-theme-name = Papirus-Dark
gtk-cursor-theme-name = Bibata-Modern-Classic
gtk-cursor-theme-size = 24
```

`/usr/share/icons/default/index.theme`

```bash
[Icon Theme]
Inherits=Bibata-Modern-Classic
```

### Dark Theme

`$HOME/.xprofile`

```bash
export QT_QPA_PLATFORMTHEME=gtk3
```

`$HOME/.gtkrc-2.0`

```bash
gtk-theme-name = "catppuccin-mocha-blue-standard+default"
```

`$HOME/.config/gtk-3.0/settings.ini`

```bash
[Settings]
gtk-theme-name = catppuccin-mocha-blue-standard+default
gtk-application-prefer-dark-theme = true
gtk-icon-theme-name = Papirus-Dark
gtk-cursor-theme-name = Bibata-Modern-Classic
gtk-cursor-theme-size = 24
```

`$HOME/.config/gtk-4.0/settings.ini`

```bash
[Settings]
gtk-theme-name = catppuccin-mocha-blue-standard+default
gtk-application-prefer-dark-theme = true
gtk-icon-theme-name = Papirus-Dark
gtk-cursor-theme-name = Bibata-Modern-Classic
gtk-cursor-theme-size = 24
```

```bash
gsettings set org.gnome.desktop.interface gtk-theme "catppuccin-mocha-blue-standard+default"
gsettings set org.gnome.desktop.interface color-scheme "prefer-dark"
```

### Firefox

`about:config`  
`browser.fixup.domainsuffixwhitelist.htb`, `browser.fixup.domainsuffixwhitelist.thm` > `true`  
`general.autoScroll` > `true`  
`middlemouse.paste` > `false`
`toolkit.legacyUserProfileCustomizations.stylesheets` > `true`  
`datareporting.healthreport.uploadEnabled` > `false`  
`network.http.max-persistent-connections-per-server` > `10`  
`about:support`  
Buscar `Profile Directory`, abrir el directorio, dentro crear un directorio `chrome`, dentro de `chrome` crear un archivo `userChrome.css` y añadirle el siguiente código

```css
/* Ocultar la barra de pestañas superior por completo */
#TabsToolbar {
  visibility: collapse !important;
}

/* Barra de herramientas flotante y minimalista que solo aparece al pasar el mouse */
#nav-bar {
  margin-top: -35px !important;
  transition: margin-top 0.2s ease-in-out !important;
  opacity: 0 !important;
}

#navigator-toolbox:hover #nav-bar {
  margin-top: 0 !important;
  opacity: 1 !important;
}

/* Bordes redondeados */
#main-window {
  background-color: #0d0e15 !important;
}
```

### Git

```bash
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"
git config --global core.autocrlf input
git config --global credential.helper store
```

### LightDM

`/etc/lightdm/lightdm.conf`

```bash
greeter-setup-script=/usr/bin/numlockx on
```

### LightDM GTK Greeter

```bash
sudo mkdir -p /usr/share/backgrounds
sudo cp $HOME/.config/img/archI.png /usr/share/backgrounds/login-bg.png
sudo touch /usr/share/pixmaps/avatar.png
```

`/etc/lightdm/lightdm-gtk-greeter.conf`

```bash
[greeter]
theme-name = catppuccin-mocha-mauve-standard+default
icon-theme-name = Papirus-Dark
cursor-theme-name = Bibata-Modern-Classic
cursor-theme-size = 24
font-name = DejaVuSans 11

background = /usr/share/backgrounds/login-bg.png
user-background = false
default-user-image = /usr/share/pixmaps/avatar.png

indicators = ~host;~spacer;~clock;~spacer;~session;~power
position = 50%,center 50%,center
active-monitor = DP-0
screensaver-timeout = 60
clock-format = %d-%m  •  %H:%M

greeter-hide-users = true
```

### Monitores

`/etc/X11/xorg.conf.d/10-monitor.conf`

```bash
Section "Monitor"
    Identifier  "DP-0"
    Option      "Primary" "true"
    Option      "PreferredMode" "1920x1080"
EndSection

Section "Monitor"
    Identifier  "HDMI-0"
    Option      "RightOf" "DP-0"
    Option      "PreferredMode" "1920x1080"
EndSection
```

### NPM

Antes de instalar Gemini CLI

```bash
mkdir -p ~/.config/npm/global
npm config set prefix '~/.config/npm/global'
```

### Nvchad

[Repo](https://nvchad.com/docs/quickstart/install/)

Evita el autocompletado

`$HOME/.local/share/nvim/lazy/NvChad/lua/nvchad/configs/cmp.lua`

```bash
dofile(vim.g.base46_cache .. "cmp")

local cmp = require "cmp"

local options = {
  completion = { completeopt = "menu,menuone", autocomplete = false },
```

Transparencia

`$HOME/.config/nvim/lua/chadrc.lua`

```bash
-- This file needs to have same structure as nvconfig.lua
-- https://github.com/NvChad/ui/blob/v3.0/lua/nvconfig.lua
-- Please read that file to know all available options :(

---@type ChadrcConfig
local M = {}

M.base46 = {
	theme = "onedark",

	-- hl_override = {
	-- 	Comment = { italic = true },
	-- 	["@comment"] = { italic = true },
	-- },
}

-- M.nvdash = { load_on_startup = true }
-- M.ui = {
--       tabufline = {
--          lazyload = false
--      }
-- }

M.ui = {
  theme = "tokyonight",

  hl_override = {
    Normal = {
      bg = "none",
    },

    NormalFloat = {
      bg = "none",
    },

    FloatBorder = {
      bg = "none",
    },

    SignColumn = {
      bg = "none",
    },

    EndOfBuffer = {
      bg = "none",
    },
  },
}

return M
```

### Proxychains

`/etc/proxychains.conf`

```bash
dynamic_chain
proxy_dns
```

### Steam

`/etc/pacman.conf`

```bash
[multilib]
Include = /etc/pacman.d/mirrorlist
```

```bash
sudo pacman -Sy
sudo pacman -S lib32-nvidia-utils
sudo pacman -S steam
```

#### CS2

En Steam, clic derecho en Counter-Strike 2 en la biblioteca y elegir Properties (Propiedades).

En la pestaña General, Launch Options (Parámetros de lanzamiento).

```plaintext
-vulkan -novid -nojoy +fps_max 0
```

### Wallpaper

[wallhaven](https://wallhaven.cc/)  
[unixporn](https://www.reddit.com/r/unixporn/)

```bash
feh --bg-fill $HOME/.config/img/archI.png $HOME/.config/img/archII.png
```

### Wireshark

```bash
sudo usermod -aG wireshark $USER
```

## Eliminar paquetes

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

### Gemini CLI

```bash
npm install -g @google/gemini-cli
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

`$HOME/.searchsploit_rc`

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
sudo pacman -S tor torbrowser-launcher
sudo systemctl enable --now tor
sudo pacman -S torsocks
```

```bash
curl --socks5-hostname 127.0.0.1:9050 https://icanhazip.com
curl --socks5-hostname 127.0.0.1:9050 https://check.torproject.org/api/ip
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

## Agregar rutas al `$PATH`

`/etc/profile.d/custom_paths.sh`

`sudo chmod +x /etc/profile.d/custom_paths.sh`

```bash
if [ -n "$HOME" ]; then
    export PATH="$PATH:$HOME/go/bin"
    export PATH="$PATH:$HOME/.local/share/gem/ruby/3.4.0/bin"
    export PATH="$PATH:$HOME/.local/share/pnpm"
    export PATH="$PATH:$HOME/.config/npm/global/bin"
fi
```

## Systemd

```bash
systemctl --user daemon-reload
systemctl --user enable --now check-updates.timer
```
