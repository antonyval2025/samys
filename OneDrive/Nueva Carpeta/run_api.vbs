Set objShell = CreateObject("WScript.Shell")
strPath = objShell.CurrentDirectory
objShell.Run strPath & "\servidor_turnos.py", 0, False
