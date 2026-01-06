Set objShell = CreateObject("WScript.Shell")
strPath = objShell.CurrentDirectory
objShell.Run "python -m http.server 8000", 0, False
