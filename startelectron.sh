#!/bin/sh
# su - pi
# su pi
# nohup su - pi >/home/pi/logelectron 2>&1 &
cd /home/pi/Desktop/electron/electron-quick-start/
# nohup npm start 1>/dev/null 2>&1 &
# su -pi
# ls
# nohup npm start >/home/pi/logelectron 2>&1 &
# npm start
# npm /home/pi/Desktop/electron/electron-quick-start/node_modules/.bin/electron . --no-sandbox 1>/dev/null 2>&1 &
/home/pi/Desktop/electron/electron-quick-start/node_modules/.bin/electron . --no-sandbox >/dev/null 2>&1 &

# /home/pi/Desktop/electron/electron-quick-start/node_modules/.bin/electron . --no-sandbox >/home/pi/logelectron 2>&1 &

