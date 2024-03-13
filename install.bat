@echo off
title P4NKK INSTALL TOPBANDAS BOT


for /f %%i in (req.txt) do (
  npm install %%i
)

echo Pulsa una tecla para salir
pause>nul
exit

echo.
echo INSTALADO CON EXITO
echo.


