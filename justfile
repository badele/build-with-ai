# This help
@help:
    just -l --list-heading=$'{{ file_name(justfile()) }} commands:\n'

# Query string for the committed badge (copy from the app's "Copy URL" button)
BADGE_URL := '?v=1&text=BUILD+WITH+AI&f=SPEC%3AHUMANI&f=CODE%3AAI&f=HUMAN+XP%3AMEDIUM%7C%7Cff7800&f=REVIEW%3AHUMAN%7C%7C33d17a&sz_w=546&sz_h=83&svg=%3Csvg+viewBox%3D%220+0+15+15%22+fill%3D%22none%22+xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg+id%3D%22SVGRepo_bgCarrier%22+stroke-width%3D%220%22%3E%3C%2Fg%3E%3Cg+id%3D%22SVGRepo_tracerCarrier%22+stroke-linecap%3D%22round%22+stroke-linejoin%3D%22round%22%3E%3C%2Fg%3E%3Cg+id%3D%22SVGRepo_iconCarrier%22%3E+%3Cpath+d%3D%22M5+8.5C5+8.22386+5.22386+8+5.5+8C5.77614+8+6+8.22386+6+8.5C6+8.77614+5.77614+9+5.5+9C5.22386+9+5+8.77614+5+8.5Z%22+fill%3D%22%23ffffff%22%3E%3C%2Fpath%3E+%3Cpath+d%3D%22M9+8.5C9+8.22386+9.22386+8+9.5+8C9.77614+8+10+8.22386+10+8.5C10+8.77614+9.77614+9+9.5+9C9.22386+9+9+8.77614+9+8.5Z%22+fill%3D%22%23ffffff%22%3E%3C%2Fpath%3E+%3Cpath+fill-rule%3D%22evenodd%22+clip-rule%3D%22evenodd%22+d%3D%22M8+2.02242C10.8033+2.27504+13+4.63098+13+7.5V13.5C13+14.3284+12.3284+15+11.5+15H3.5C2.67157+15+2+14.3284+2+13.5V7.5C2+4.63098+4.19675+2.27504+7+2.02242V0H8V2.02242ZM5.5+7C4.67157+7+4+7.67157+4+8.5C4+9.32843+4.67157+10+5.5+10C6.32843+10+7+9.32843+7+8.5C7+7.67157+6.32843+7+5.5+7ZM9.5+7C8.67157+7+8+7.67157+8+8.5C8+9.32843+8.67157+10+9.5+10C10.3284+10+11+9.32843+11+8.5C11+7.67157+10.3284+7+9.5+7ZM11+12H4V11H11V12Z%22+fill%3D%22%23ffffff%22%3E%3C%2Fpath%3E+%3Cpath+d%3D%22M0+8V12H1V8H0Z%22+fill%3D%22%23ffffff%22%3E%3C%2Fpath%3E+%3Cpath+d%3D%22M15+8H14V12H15V8Z%22+fill%3D%22%23ffffff%22%3E%3C%2Fpath%3E+%3C%2Fg%3E%3C%2Fsvg%3E&al_t=right&sz_rw=93&sz_th=47&sz_rs=0.75'

# Build a app docker image
docker-build:
    docker compose build app

# Build the vite app
build:
    docker compose run --rm app npm run build

# Test the vite app
test *args:
    docker compose run --rm app npm run test -- {{args}}

# Run the app in development mode
dev:
    docker compose up app

# Run the app in production mode
prod:
    docker compose --profile production up --build web

# Stop all containers
down:
    docker compose down

# Generate build-with-ai.svg and build-with-ai.png from BADGE_URL
gen-badge:
    INPUT_STYLE_URL='{{BADGE_URL}}' INPUT_OUTPUT=docs/build-with-ai.svg npx tsx src/cli/generate.ts
    node scripts/make-png.cjs docs/build-with-ai.svg docs/build-with-ai.png

# Install pre-commit hooks
[group('precommit')]
precommit-install:
    docker compose build precommit
    git config core.hooksPath .githooks

# Test pre-commit hooks
[group('precommit')]
precommit-test:
    docker compose run --rm precommit pre-commit run --all-files
