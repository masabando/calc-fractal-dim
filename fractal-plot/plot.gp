file="fractal-dimension.csv"

set pm3d
set pm3d map
set ticslevel 0
unset key
set cbrange[1:2]
set xlabel "files"
set ylabel "threshold"

set term pngcairo size 800,600
set output "fractal-dimension.png"
splot file u 2:3:4 w pm3d
unset output
set term pop
