import os
import re

def verify_active_scripts():
    html_path = r'c:\Users\samys\OneDrive\Nueva Carpeta\nuevo_cuadrante_mejorado.html'
    base_dir = r'c:\Users\samys\OneDrive\Nueva Carpeta'
    
    with open(html_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    missing = []
    for i, line in enumerate(lines):
        # Ignorar líneas comentadas
        if '<!--' in line and '-->' in line: continue
        if line.strip().startswith('<!--'): continue
        
        match = re.search(r'<script src="(.*?)"></script>', line)
        if match:
            s = match.group(1)
            if s.startswith('http'): continue
            
            s_fixed = s.replace('/', os.sep)
            full_path = os.path.join(base_dir, s_fixed)
            
            if not os.path.exists(full_path):
                missing.append(f"Line {i+1}: {s}")
            
    if missing:
        print("❌ Missing active scripts:")
        for m in missing:
            print(f"  - {m}")
    else:
        print("✅ All active scripts exist.")

verify_active_scripts()
