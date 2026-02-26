#!/usr/bin/env bash
# install.sh — Install Antigravity workflows, skills, and rules into a target project.
#
# Usage:
#   ./install.sh [options] <project-path> <language> [<language> ...]
#
# Options:
#   -h, --help            Show help message
#   --list-languages      List available languages
#
# Examples:
#   ./install.sh ~/myproject python
#   ./install.sh ~/myproject typescript python
#   ./install.sh . python                    # install into current directory
#
# What gets installed:
#   workflows/        → <project>/.antigravity/workflows/
#   skills/           → <project>/.antigravity/skills/
#   rules/common/     → <project>/.antigravity/rules/common/
#   rules/<language>/ → <project>/.antigravity/rules/<language>/

set -euo pipefail

# Resolve symlinks — needed when invoked as `ecc-install` via npm/bun bin symlink
SCRIPT_PATH="$0"
while [ -L "$SCRIPT_PATH" ]; do
    link_dir="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"
    SCRIPT_PATH="$(readlink "$SCRIPT_PATH")"
    # Resolve relative symlinks
    [[ "$SCRIPT_PATH" != /* ]] && SCRIPT_PATH="$link_dir/$SCRIPT_PATH"
done
SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"

WORKFLOWS_DIR="$SCRIPT_DIR/workflows"
SKILLS_DIR="$SCRIPT_DIR/skills"
RULES_DIR="$SCRIPT_DIR/rules"

# --- ANSI Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

show_help() {
    local error_msg="${1:-}"
    if [[ -n "$error_msg" ]]; then
        echo -e "${RED}Error: ${error_msg}${NC}" >&2
        echo "" >&2
    fi

    echo -e "${BOLD}Usage:${NC} $0 [options] <project-path> <language> [<language> ...]"
    echo ""
    echo "Installs Antigravity workflows, skills, and rules into a target project."
    echo "This script configures Workspace Rules for a specific project directory."
    echo ""
    echo -e "${YELLOW}Context:${NC}"
    echo "  Antigravity supports 'Global Rules' and 'Workspace Rules'."
    echo "  This script currently handles 'Workspace Rules' by installing them into your project's .antigravity directory."
    echo -e "  Learn more: ${BLUE}https://antigravity.google/docs/rules-workflows${NC}"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo -e "  ${CYAN}-h, --help${NC}            Show this help message and exit"
    echo -e "  ${CYAN}--list-languages${NC}      List available languages and exit"
    echo ""
    echo -e "${YELLOW}What gets installed:${NC}"
    echo "  workflows/        → <project>/.antigravity/workflows/"
    echo "  skills/           → <project>/.antigravity/skills/"
    echo "  rules/common/     → <project>/.antigravity/rules/common/"
    echo "  rules/<language>/ → <project>/.antigravity/rules/<language>/"
    echo ""
    echo -e "${YELLOW}Available languages:${NC}"
    for dir in "$RULES_DIR"/*/; do
        [[ -d "$dir" ]] || continue
        name="$(basename "$dir")"
        [[ "$name" == "common" ]] && continue
        echo -e "  - ${GREEN}$name${NC}"
    done
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  $0 ~/myproject python"
    echo "  $0 ~/myproject typescript python"
    echo "  $0 ~/myproject all               # install all available languages"
    echo "  $0 . python                    # install into current directory"
}

list_languages() {
    for dir in "$RULES_DIR"/*/; do
        [[ -d "$dir" ]] || continue
        name="$(basename "$dir")"
        [[ "$name" == "common" ]] && continue
        echo "$name"
    done
}

# --- Parse options ---
while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)
            show_help
            exit 0
            ;;
        --list-languages)
            list_languages
            exit 0
            ;;
        -*)
            show_help "Unknown option: $1"
            exit 1
            ;;
        *)
            break
            ;;
    esac
done

# --- Check required parameters ---
if [[ $# -lt 2 ]]; then
    show_help "Missing required parameters. You must specify a project path and at least one language."
    exit 1
fi

# --- Parse arguments ---
PROJECT_PATH="$1"
shift

# Resolve project path
if [[ ! -d "$PROJECT_PATH" ]]; then
    echo "Error: '$PROJECT_PATH' is not a directory." >&2
    exit 1
fi
PROJECT_PATH="$(cd "$PROJECT_PATH" && pwd)"
DEST_DIR="$PROJECT_PATH/.antigravity"

echo -e "${BOLD}Installing to:${NC} ${CYAN}$DEST_DIR/${NC}"
echo ""

# --- Warn if destination already exists ---
if [[ -d "$DEST_DIR" ]] && [[ "$(ls -A "$DEST_DIR" 2>/dev/null)" ]]; then
    echo -e "${YELLOW}Note: $DEST_DIR/ already exists. Existing files will be overwritten.${NC}"
    echo -e "${YELLOW}      Back up any local customizations before proceeding.${NC}"
    echo ""
    read -r -p "Do you wish to continue and overwrite these files? [y/N] " response
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo -e "\n${RED}Installation cancelled.${NC}"
        exit 1
    fi
    echo ""
fi

# --- Install workflows ---
if [[ -d "$WORKFLOWS_DIR" ]]; then
    echo -e "Installing workflows → ${CYAN}$DEST_DIR/workflows/${NC}"
    mkdir -p "$DEST_DIR/workflows"
    cp -r "$WORKFLOWS_DIR/." "$DEST_DIR/workflows/"
else
    echo -e "${YELLOW}Warning: workflows/ directory not found in repo, skipping.${NC}" >&2
fi

# --- Install skills ---
if [[ -d "$SKILLS_DIR" ]]; then
    echo -e "Installing skills → ${CYAN}$DEST_DIR/skills/${NC}"
    mkdir -p "$DEST_DIR/skills"
    cp -r "$SKILLS_DIR/." "$DEST_DIR/skills/"
else
    echo -e "${YELLOW}Warning: skills/ directory not found in repo, skipping.${NC}" >&2
fi

# --- Install common rules (always) ---
echo -e "Installing common rules → ${CYAN}$DEST_DIR/rules/common/${NC}"
mkdir -p "$DEST_DIR/rules/common"
cp -r "$RULES_DIR/common/." "$DEST_DIR/rules/common/"

# --- Expand 'all' language if requested ---
REQUESTED_LANGS=()
for arg in "$@"; do
    if [[ "$arg" == "all" ]]; then
        for dir in "$RULES_DIR"/*/; do
            [[ -d "$dir" ]] || continue
            name="$(basename "$dir")"
            [[ "$name" == "common" ]] && continue
            REQUESTED_LANGS+=("$name")
        done
    else
        REQUESTED_LANGS+=("$arg")
    fi
done

# --- Install each requested language ---
for lang in "${REQUESTED_LANGS[@]}"; do
    # Validate language name to prevent path traversal
    if [[ ! "$lang" =~ ^[a-zA-Z0-9_-]+$ ]]; then
        echo -e "${RED}Error: invalid language name '$lang'. Only alphanumeric, dash, and underscore allowed.${NC}" >&2
        continue
    fi
    lang_dir="$RULES_DIR/$lang"
    if [[ ! -d "$lang_dir" ]]; then
        echo -e "${YELLOW}Warning: rules/$lang/ does not exist, skipping.${NC}" >&2
        continue
    fi
    echo -e "Installing ${GREEN}$lang${NC} rules → ${CYAN}$DEST_DIR/rules/$lang/${NC}"
    mkdir -p "$DEST_DIR/rules/$lang"
    cp -r "$lang_dir/." "$DEST_DIR/rules/$lang/"
done

echo ""
echo -e "${GREEN}${BOLD}Done!${NC} Installed to ${CYAN}$DEST_DIR/${NC}"
echo ""
echo -e "${BOLD}Installed:${NC}"
echo -e "  ${GREEN}✓${NC} Workflows ($(ls "$DEST_DIR/workflows/" 2>/dev/null | wc -l | tr -d ' ') files)"
echo -e "  ${GREEN}✓${NC} Skills ($(ls -d "$DEST_DIR/skills/"*/ 2>/dev/null | wc -l | tr -d ' ') skills)"
echo -e "  ${GREEN}✓${NC} Rules (common + $(echo "${REQUESTED_LANGS[@]}" | tr ' ' ', '))"
echo ""
echo -e "${YELLOW}Try it:${NC} open your project in Antigravity and use ${CYAN}/plan${NC}, ${CYAN}/tdd${NC}, ${CYAN}/code-review${NC}, etc."
