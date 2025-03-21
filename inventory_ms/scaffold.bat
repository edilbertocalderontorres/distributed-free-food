@echo off
setlocal

:: Inicializar un nuevo proyecto Node.js
if not exist package.json (
    echo Creando nuevo proyecto Node.js...
    call npm init -y
)

:: Instalar dependencias de desarrollo
call pnpm add -D typescript ts-node @types/node

:: Inicializar TypeScript
call npx tsc --init

:: Crear directorio src
mkdir src

:: Definir la ruta base
set BASE_DIR=%CD%\src

:: Crear directorios dentro de /src
mkdir "%BASE_DIR%\config"
mkdir "%BASE_DIR%\controllers"
mkdir "%BASE_DIR%\services"
mkdir "%BASE_DIR%\repositories"
mkdir "%BASE_DIR%\routes"
mkdir "%BASE_DIR%\models"
mkdir "%BASE_DIR%\events"
mkdir "%BASE_DIR%\middlewares"
mkdir "%BASE_DIR%\tests"
mkdir "%BASE_DIR%\utils"

:: Crear archivos vacíos en la raíz
copy NUL index.js >NUL
copy NUL Dockerfile >NUL

echo Proyecto Node.js con TypeScript inicializado y estructura de directorios creada correctamente.
endlocal