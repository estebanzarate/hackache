---
title: Configuración
description: Archivos de configuración del sistema y scripts
tags: [configuration, scripts]
lang: es
order: 99
parent: setup
---

## bspwm

### bspwmrc

```bash
#!/bin/sh

pgrep -x sxhkd > /dev/null || sxhkd &

bspc monitor DP-0 -d I II III IV V
bspc monitor HDMI-0 -d VI VII VIII IX X

bspc config border_width         1
bspc config window_gap          10

bspc config split_ratio          0.5
bspc config borderless_monocle   true
bspc config gapless_monocle      true

xset r rate 250 25

source $HOME/.config/polybar/env.sh
$HOME/.config/polybar/launch.sh &
```

## bspwm_resize.sh

```bash
#!/usr/bin/env sh

if bspc query -N -n focused.floating > /dev/null; then
	step=20
else
	step=100
fi

case "$1" in
	west) dir=right; falldir=left; x="-$step"; y=0;;
	east) dir=right; falldir=left; x="$step"; y=0;;
	north) dir=top; falldir=bottom; x=0; y="-$step";;
	south) dir=top; falldir=bottom; x=0; y="$step";;
esac

bspc node -z "$dir" "$x" "$y" || bspc node -z "$falldir" "$x" "$y"
```

## sxhkd

### sxhkdrc

```bash
# terminal emulator
super + Return
	/usr/bin/kitty

# make sxhkd reload its configuration files:
super + Escape
	pkill -USR1 -x sxhkd

# quit/restart bspwm
super + alt + {q,r}
	bspc {quit,wm -r}

# close and kill
super + {_,shift + }w
	bspc node -{c,k}

# alternate between the tiled and monocle layout
super + m
	bspc desktop -l next

# send the newest marked node to the newest preselected node
super + y
	bspc node newest.marked.local -n newest.!automatic.local

# swap the current node and the biggest window
super + g
	bspc node -s biggest.window

# set the window state
super + {t,shift + t,s,f}
	bspc node -t {tiled,pseudo_tiled,floating,fullscreen}

# set the node flags
super + ctrl + {m,x,y,z}
	bspc node -g {marked,locked,sticky,private}

# focus the node in the given direction
super + {_,shift + }{Left,Down,Up,Right}
	bspc node -{f,s} {west,south,north,east}

# focus the node for the given path jump
super + {p,b,comma,period}
	bspc node -f @{parent,brother,first,second}

# focus the next/previous window in the current desktop
super + {_,shift + }c
	bspc node -f {next,prev}.local.!hidden.window

# focus the next/previous desktop in the current monitor
super + bracket{left,right}
	bspc desktop -f {prev,next}.local

# focus the last node/desktop
super + {grave,Tab}
	bspc {node,desktop} -f last

# focus the older or newer node in the focus history
super + {o,i}
	bspc wm -h off; \
	bspc node {older,newer} -f; \
	bspc wm -h on

# focus or send to the given desktop
super + {_,shift + }{1-9,0}
	bspc {desktop -f,node -d} '^{1-9,10}'

# preselect the direction
super + ctrl + {h,j,k,l}
	bspc node -p {west,south,north,east}

# preselect the ratio
super + ctrl + {1-9}
	bspc node -o 0.{1-9}

# cancel the preselection for the focused node
super + ctrl + space
	bspc node -p cancel

# cancel the preselection for the focused desktop
super + ctrl + shift + space
	bspc query -N -d | xargs -I id -n 1 bspc node id -p cancel

# move a floating window
super + {Left,Down,Up,Right}
	bspc node -v {-20 0,0 20,0 -20,20 0}

# custom resize
super + alt + {Left,Down,Up,Right}
	$HOME/.config/bspwm/scripts/bspwm_resize.sh {west,south,north,east}

# flameshot
super + shift + alt + f
  /usr/bin/flameshot gui

XF86AudioRaiseVolume
    wpctl set-volume @DEFAULT_AUDIO_SINK@ 1%+

XF86AudioLowerVolume
    wpctl set-volume @DEFAULT_AUDIO_SINK@ 1%-

XF86AudioMute
    wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle
```

## kitty

### kitty.conf

```bash
window_margin_width 5
single_window_margin_width 0
window_padding_width 5
single_window_padding_width 4 6

font_size 14

map ctrl+shift+enter new_window_with_cwd
map ctrl+shift+t new_tab_with_cwd

map ctrl+left neighboring_window left
map ctrl+right neighboring_window right
map ctrl+up neighboring_window up
map ctrl+down neighboring_window down

map f1 copy_to_buffer a
map f2 paste_from_buffer a
map f3 copy_to_buffer b
map f4 paste_from_buffer b
map f5 copy_to_buffer c
map f6 paste_from_buffer c
map f7 copy_to_buffer d
map f8 paste_from_buffer d
map f9 copy_to_buffer e
map f10 paste_from_buffer e

map ctrl+shift+z toggle_layout stack

enable_audio_bell no
```

## polybar

### launch.sh

```bash
#!/bin/bash

killall -q polybar

polybar main 2>&1 | tee -a /tmp/polybar.log & disown
```

## config.ini

```bash
include-file = $HOME/.config/colors/colors.ini

[bar/main]
modules-left = shutdown reboot logout lock date vpn target desk
modules-right = audio kitty vsc tor wire fire burp dog
width = 98%
offset-x = 1%
offset-y = 10
padding = 1
module-margin = 1
font-0 = Adwaita-Sans:size=14;3
font-1 = Hack Nerd Font:size=14;3
cursor-click = pointer
cursor-scroll = ns-resize

[module/shutdown]
type = custom/text
label = " 󰤆 "
label-foreground = ${colors.danger}
click-left = /usr/bin/poweroff

[module/reboot]
type = custom/text
label = "  "
label-foreground = ${colors.orange}
click-left = /usr/bin/reboot

[module/logout]
type = custom/text
label = "  "
label-foreground = ${colors.warning}
click-left = bspc quit

[module/lock]
type = custom/text
label = " 󰌾 "
label-foreground = ${colors.secondary}
click-left = /usr/bin/i3lock-fancy

[module/date]
type = internal/date
interval = 1.0
time = %H:%M
time-alt = %H:%M:%S
format = <label>
label = %time%
label-foreground = ${colors.pink}

[module/vpn]
type = custom/script
exec = $HOME/.config/polybar/scripts/vpn.sh
click-left = echo -n "$(ip a show tun0 | grep -oP '(?<=inet\s)\d+\.\d+\.\d+\.\d+')" | xclip -sel clip
interval = 2
format = <label>
label-foreground = ${colors.primary}

[module/target]
type = custom/script
exec = $HOME/.config/polybar/scripts/target.sh
click-left = echo -n "$(cat $HOME/.config/polybar/scripts/target.txt)" | xclip -sel clip
interval = 2
format = <label>
label-foreground = ${colors.danger}

[module/desk]
type = internal/xworkspaces
label-empty-foreground = ${colors.secondary}
label-active-foreground = ${colors.success}
label-occupied-foreground = ${colors.warning}

[module/audio]
type = internal/pulseaudio
interval = 1
format-volume = <label-volume>
label-volume = ${env:MAIN_AUDIO_LABEL}
format-muted = <label-muted>
label-muted = ${env:MAIN_MUTED_LABEL}
click-right = $HOME/.config/polybar/scripts/audio-switch.sh

[module/dog]
type = custom/text
label = ${env:MAIN_DOG_LABEL}

[module/fire]
type = custom/text
label = ${env:MAIN_FIRE_LABEL}
click-left = /usr/bin/firefox > /dev/null 2>&1 & disown

[module/burp]
type = custom/text
label = ${env:MAIN_BURP_LABEL}
click-left = /usr/bin/burpsuite > /dev/null 2>&1 & disown

[module/wire]
type = custom/text
label = ${env:MAIN_WIRE_LABEL}
click-left = /usr/bin/wireshark > /dev/null 2>&1 & disown

[module/tor]
type = custom/text
label = ${env:MAIN_TOR_LABEL}
click-left = /usr/bin/torbrowser-launcher > /dev/null 2>&1 & disown

[module/vsc]
type = custom/text
label = ${env:MAIN_VSC_LABEL}
click-left = /usr/bin/code > /dev/null 2>&1 & disown

[module/kitty]
type = custom/text
label = ${env:MAIN_KITTY_LABEL}
click-left = bash -c 'umask 022; exec /usr/bin/kitty'
```

## env.sh

```bash
source $HOME/.config/colors/colors.sh

export MAIN_DOG_LABEL="[%{F$COLOR_DOG} 󰩃  %{F-}]"
export MAIN_FIRE_LABEL="(%{F$COLOR_DANGER} F %{F-})"
export MAIN_BURP_LABEL="(%{F$COLOR_ORANGE} B %{F-})"
export MAIN_WIRE_LABEL="(%{F$COLOR_PRIMARY} W %{F-})"
export MAIN_TOR_LABEL="(%{F$COLOR_PURPLE} T %{F-})"
export MAIN_VSC_LABEL="(%{F$COLOR_PRIMARY} V %{F-})"
export MAIN_KITTY_LABEL="(%{F$COLOR_SUCCESS} K %{F-})"
export MAIN_AURIS_LABEL="[%{F$COLOR_WARNING} 󰋋%{F-}  %{F$COLOR_ORANGE}%percentage%%{F-}]"
export MAIN_SPEAKERS_LABEL="[%{F$COLOR_WARNING} 󰕾%{F-}  %{F$COLOR_ORANGE}%percentage% %{F-}]"
export MAIN_MUTED_LABEL="[ %{F$COLOR_DANGER} 󰝟 %{F-} ]"
export MAIN_AUDIO_LABEL=$MAIN_SPEAKERS_LABEL
```

## audio-switch.sh

```bash
#!/usr/bin/env bash

ENV_FILE="$HOME/.config/polybar/env.sh"

CURRENT=$(wpctl status | awk '/Sinks:/ { in_sinks=1; next } /Sources:/ { in_sinks=0 } in_sinks && /\*/ { for(i=1;i<=NF;i++) if($i=="*") { print $(i+1); break } }' | tr -d '.')

SINKS=($(wpctl status | awk '/Sinks:/ { in_sinks=1; next } /Sources:/ { in_sinks=0 } in_sinks && /[0-9]+\./ && !/HDMI/ { for(i=1;i<=NF;i++) if($i ~ /^[0-9]+\.$/) { print $i; break } }' | tr -d '.'))

for i in "${!SINKS[@]}"; do
    if [[ "${SINKS[$i]}" == "$CURRENT" ]]; then
        NEXT=$(( (i + 1) % ${#SINKS[@]} ))
        wpctl set-default "${SINKS[$NEXT]}"
        break
    fi
done

ACTIVE_SINK=$(wpctl status | awk '/Sinks:/ { in_sinks=1; next } /Sources:/ { in_sinks=0 } in_sinks && /\*/')

echo "ACTIVE_SINK >>> $ACTIVE_SINK"

if echo "$ACTIVE_SINK" | grep -q "Razer"; then
    sed -i 's|export MAIN_AUDIO_LABEL=.*|export MAIN_AUDIO_LABEL=$MAIN_AURIS_LABEL|' "$ENV_FILE"
else
    sed -i 's|export MAIN_AUDIO_LABEL=.*|export MAIN_AUDIO_LABEL=$MAIN_SPEAKERS_LABEL|' "$ENV_FILE"
fi

source $ENV_FILE

$HOME/.config/polybar/launch.sh &
```

## target.sh

```bash
#!/bin/bash

ip_address=$(/bin/cat $HOME/.config/polybar/scripts/target.txt)

if [ -n "$ip_address" ]; then
  echo "$ip_address"
else
  echo ""
fi
```

## vpn.sh

```bash
#!/bin/sh

IFACE=$(ip -o link show | awk -F': ' '/tun0/ {print $2}')

if [ "$IFACE" = "tun0" ]; then
  echo "$(ip a show tun0 | grep -oP '(?<=inet\s)\d+\.\d+\.\d+\.\d+')"
else
  echo ""
fi
```

## colors

### colors.ini

```bash
[colors]
primary   = #3B71CA
secondary = #9FA6B2
success   = #14A44D
danger    = #DC4C64
warning   = #E4A11B
info      = #54B4D3
light     = #FBFBFB
dark      = #332D2D
pink      = #C2527A
purple    = #7952B3
dog       = #C68642
orange    = #E8703A
```

### colors.py

```bash
PRIMARY   = "#3B71CA"
SECONDARY = "#9FA6B2"
SUCCESS   = "#14A44D"
DANGER    = "#DC4C64"
WARNING   = "#E4A11B"
INFO      = "#54B4D3"
LIGHT     = "#FBFBFB"
DARK      = "#332D2D"
PINK      = "#C2527A"
PURPLE    = "#7952B3"
DOG       = "#C68642"
ORANGE    = "#E8703A"
```

### colors.sh

```bash
COLOR_PRIMARY="#3B71CA"
COLOR_SECONDARY="#9FA6B2"
COLOR_SUCCESS="#14A44D"
COLOR_DANGER="#DC4C64"
COLOR_WARNING="#E4A11B"
COLOR_INFO="#54B4D3"
COLOR_LIGHT="#FBFBFB"
COLOR_DARK="#332D2D"
COLOR_PINK="#C2527A"
COLOR_PURPLE="#7952B3"
COLOR_DOG="#C68642"
COLOR_ORANGE="#E8703A"

COLOR_RESET="\033[0m"

# -- ANSI (truecolor para bash scripts) --
_hex() { local h="${1#"#"}"; echo "\e[38;2;$((16#${h:0:2}));$((16#${h:2:2}));$((16#${h:4:2}))m"; }

ANSI_PRIMARY=$(_hex "$COLOR_PRIMARY")
ANSI_SECONDARY=$(_hex "$COLOR_SECONDARY")
ANSI_SUCCESS=$(_hex "$COLOR_SUCCESS")
ANSI_DANGER=$(_hex "$COLOR_DANGER")
ANSI_WARNING=$(_hex "$COLOR_WARNING")
ANSI_INFO=$(_hex "$COLOR_INFO")
ANSI_LIGHT=$(_hex "$COLOR_LIGHT")
ANSI_DARK=$(_hex "$COLOR_DARK")
ANSI_PINK=$(_hex "$COLOR_PINK")
ANSI_PURPLE=$(_hex "$COLOR_PURPLE")
ANSI_DOG=$(_hex "$COLOR_DOG")
ANSI_ORANGE=$(_hex "$COLOR_ORANGE")
```