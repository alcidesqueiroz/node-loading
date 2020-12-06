#!/bin/bash
exec < /dev/tty
prevstty=$(stty -g)
stty raw -echo min 0
echo -en "\033[6n" > /dev/tty
IFS=';' read -r -d R -a coords
stty $prevstty
rowNum=$((${coords[0]:2} - 1))
colNum=$((${coords[1]} - 1))

echo \{\"row\":$rowNum,\"col\":$colNum\}
