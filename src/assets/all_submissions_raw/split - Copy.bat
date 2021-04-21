set "options=-crop 2x2@ +repage" 
for %%a in ("%~dp0..") do set "PATH_TWO_LEVELS_UP=%%~fa"
echo %PATH_TWO_LEVELS_UP%
set outputdir=%PATH_TWO_LEVELS_UP%\all_submissions_split
echo %outputdir%
mogrify %options% -path "%outputdir%" *.png
rem FOR /R %%X IN (*.png) DO convert "%%~X" %options% %outputdir%"%%~n_%d.png"
pause