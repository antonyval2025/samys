# 🛡️ PREVENCIÓN FUTURA - AUTOMATIZACIÓN Y MEJORES PRÁCTICAS

**Objetivo**: Evitar que estos errores se repitan en el futuro  
**Fecha**: 2 de enero de 2026

---

## 📋 TABLA DE CONTENIDOS

1. [Herramientas de Automatización](#herramientas)
2. [Configuración ESLint](#eslint)
3. [Configuración EditorConfig](#editorconfig)
4. [Pre-commit Hooks](#pre-commit)
5. [Convenciones de Código](#convenciones)
6. [Proceso de Revisión](#revision)

---

## 🔧 Herramientas de Automatización {#herramientas}

### 1. **ESLint** - Detección de Errores en Tiempo Real

ESLint es la herramienta estándar para detectar problemas en JavaScript.

#### Instalación:
```bash
npm install --save-dev eslint eslint-config-airbnb-base eslint-plugin-import
```

#### Configuración `.eslintrc.json`:
```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["airbnb-base"],
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "camelcase": ["error", { "properties": "always" }],
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

#### Uso:
```bash
# Analizar todos los archivos JS
eslint js/*.js

# Auto-corregir algunos errores
eslint js/*.js --fix

# Ver resultados en formato JSON
eslint js/*.js --format json > eslint-report.json
```

#### Detección de Errores Específicos:

**Detectaría Error EC-001** (colaNotiicaciones):
```javascript
// ESLint reportaría:
// ✓ Typo en nombre: Verificar que la variable se usa consistentemente
// ✓ Con regla "camelcase" podría alertar sobre inconsistencia
```

**Detectaría Error EM-002** (carrasArray):
```javascript
// ESLint reportaría:
// ✓ Variable no usada si tiene typo consistente
// ✓ Inconsistencia en nombres camelCase
```

---

### 2. **TypeScript** - Prevención a Nivel de Compilación

TypeScript detectaría muchos de estos errores en tiempo de compilación.

#### Ejemplo - Cómo TypeScript lo hubiese prevenido:

```typescript
// ANTES (JavaScript - permite errores)
class SistemaNotificaciones {
    static colaNotiicaciones = [];  // ❌ Typo sin error
    
    static enviarNotificacion() {
        this.colaNotiicaciones.push({});  // Falla en runtime
    }
}

// DESPUÉS (TypeScript - previene errores)
class SistemaNotificaciones {
    static colaNotificaciones: Array<Notificacion> = [];
    
    static enviarNotificacion(mensaje: Mensaje) {
        // Si escribes colaNotiicaciones → Error en compilación
        this.colaNotiicaciones.push(mensaje);
        // ↑ TypeScript error: Property 'colaNotiicaciones' does not exist
    }
}
```

#### Instalación:
```bash
npm install --save-dev typescript @types/node
npx tsc --init
```

#### Configuración `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["js/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### 3. **Prettier** - Formateo Consistente

Prettier asegura un estilo consistente en todo el código.

#### Instalación:
```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

#### Configuración `.prettierrc.json`:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 4,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

#### Uso:
```bash
# Formatear todos los archivos
prettier --write js/*.js

# Verificar si hay archivos sin formato
prettier --check js/*.js
```

---

## 📋 Configuración ESLint Completa {#eslint}

### Archivo `.eslintrc.json` Mejorado:

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module"
  },
  "rules": {
    // Variables
    "prefer-const": ["error", { "destructuring": "all" }],
    "no-var": "error",
    "no-unused-vars": ["error", { 
      "argsIgnorePattern": "^_",
      "caughtErrors": "none"
    }],
    
    // Nombres y Convenciones
    "camelcase": ["error", { 
      "properties": "always",
      "ignoreDestructuring": false
    }],
    "no-underscore-dangle": ["warn", { 
      "allow": ["_id", "_key"]
    }],
    
    // Funciones
    "no-func-assign": "error",
    "no-const-assign": "error",
    "no-param-reassign": "warn",
    
    // Strings
    "no-eval": "error",
    "quotes": ["error", "single", { "avoidEscape": true }],
    
    // Objetos
    "no-dupe-keys": "error",
    "no-dupe-class-members": "error",
    
    // Debugging
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "warn"
  },
  "overrides": [
    {
      "files": ["**/*.test.js", "**/*.spec.js"],
      "env": {
        "jest": true
      },
      "rules": {
        "no-console": "off"
      }
    }
  ]
}
```

### Comandos npm para ESLint:

Agregar a `package.json`:
```json
{
  "scripts": {
    "lint": "eslint js/**/*.js",
    "lint:fix": "eslint js/**/*.js --fix",
    "lint:report": "eslint js/**/*.js --format json > eslint-report.json",
    "lint:strict": "eslint js/**/*.js --max-warnings 0"
  }
}
```

---

## ⚙️ Configuración EditorConfig {#editorconfig}

EditorConfig asegura consistencia entre diferentes editores.

Archivo `.editorconfig`:
```ini
# EditorConfig es universal para todos los IDEs

root = true

# Archivos por defecto
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

# Archivos JavaScript
[*.js]
indent_style = space
indent_size = 4
max_line_length = 100

# Archivos JSON
[*.json]
indent_style = space
indent_size = 2

# Archivos Markdown
[*.md]
max_line_length = off
trim_trailing_whitespace = false

# Archivos YAML
[*.{yml,yaml}]
indent_style = space
indent_size = 2
```

---

## 🔐 Pre-commit Hooks {#pre-commit}

Los pre-commit hooks ejecutan validaciones antes de cada commit.

### Instalación:
```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npm run lint:fix && npm run test"
```

### Configuración `.husky/pre-commit`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Ejecutando validaciones pre-commit..."

# 1. Lint-staged: solo archivos modificados
npx lint-staged

# 2. ESLint: análisis completo
npm run lint

# 3. Tests: si existen
npm run test -- --bail

# Si algo falla, no permite el commit
if [ $? -ne 0 ]; then
  echo "❌ Pre-commit validations failed!"
  exit 1
fi

echo "✅ Pre-commit validations passed!"
```

### Configuración `lint-staged` en `package.json`:
```json
{
  "lint-staged": {
    "js/**/*.js": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.json": ["prettier --write"],
    "*.md": ["prettier --write"]
  }
}
```

### Configuración `.husky/pre-push`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Ejecutando validaciones pre-push..."

npm run lint:strict
npm run test

if [ $? -ne 0 ]; then
  echo "❌ Pre-push validations failed!"
  exit 1
fi

echo "✅ All validations passed! Pushing..."
```

---

## 📝 Convenciones de Código {#convenciones}

### 1. Convención de Nombres

Documento: `.naming-convention.md`

```markdown
# CONVENCIÓN DE NOMBRES

## Variables y Constantes
- camelCase para variables: `miVariable`, `colaNotificaciones`
- UPPER_SNAKE_CASE para constantes: `MAX_INTENTOS`, `API_URL`

## Funciones y Métodos
- camelCase: `validarEmail()`, `calcularDesviacion()`
- Prefijo para tipo: get*, set*, is*, has*
  - `getNombreMes()`, `setValor()`, `isValido()`, `hasPermiso()`

## Clases
- PascalCase: `SistemaNotificaciones`, `IntegracionCalendario`
- Singular y descriptivo: `Empleado` (no `Empleados`)

## Archivos
- kebab-case: `sistema-notificaciones.js`, `integracion-calendario.js`
- Correlacionar con nombre de clase

## Propiedades de Objetos
- camelCase: `colaNotificaciones`, `desviacionEstandar`, `cargasArray`
- Nunca usar caracteres especiales (ñ, acentos en nombres de código)
  - ❌ `cargarFestivosEspaña` (en definición)
  - ✅ `cargarFestivosEspana` o dejar comentarios en español

## Ejemplos Correctos
```javascript
// ✅ BIEN
class SistemaNotificaciones {
    static colaNotificaciones = [];
    static MAX_RETRIES = 3;
    
    static notificarCambioTurno(empleadoId, fecha, turnoNuevo) {
        // ...
    }
    
    isValido() { return true; }
    hasPermiso() { return true; }
}

// ❌ MAL
class sistemanotificaciones {  // Debe ser PascalCase
    static cola_notiicaciones = [];  // Typo + convención
    static MAX_RETRIES = 3;  // OK pero inconsistente
    
    static notificarCambioTurno_() {  // Guion bajo innecesario
        // ...
    }
}
```
```

---

## 👀 Proceso de Revisión {#revision}

### 1. Checklist de Code Review

```markdown
# CODE REVIEW CHECKLIST

## Sintaxis
- [ ] No hay typos en nombres de variables
- [ ] No hay duplicación de caracteres (ii, tt, etc.)
- [ ] Nombres camelCase/PascalCase consistentes
- [ ] No hay caracteres especiales en identificadores

## Funcionalidad
- [ ] Todos los métodos llamados existen
- [ ] Todos los propiedades inicializadas se usan
- [ ] No hay variables sin usar
- [ ] No hay código muerto

## Estilo
- [ ] Sigue convención de nombres del proyecto
- [ ] Indentación consistente (4 espacios)
- [ ] Máximo 100 caracteres por línea
- [ ] Comentarios cuando es necesario

## Testing
- [ ] Tests unitarios para nueva funcionalidad
- [ ] Tests de integración pasan
- [ ] No hay errores en consola
- [ ] Validado en múltiples navegadores

## Performance
- [ ] No hay loops innecesarios
- [ ] No hay console.log en producción
- [ ] Optimización de métodos lentos
```

### 2. Template de Pull Request

```markdown
# Pull Request: [Descripción breve]

## Cambios
- [ ] Fix: Corrección de bugs
- [ ] Feature: Nueva funcionalidad
- [ ] Docs: Documentación
- [ ] Style: Formato/Convenciones
- [ ] Refactor: Mejora de código

## Descripción
Explicar qué cambios se hacen y por qué.

## Errores Corregidos
- Corrige #123 (número del issue)

## Cambios Principales
1. Cambio 1: descripción
2. Cambio 2: descripción

## Testing
- [ ] Tests unitarios agregados
- [ ] Tests existentes pasan
- [ ] Testing manual realizado

## Checklist
- [ ] El código sigue guías de estilo
- [ ] Self-review completado
- [ ] Comentarios agregados donde es necesario
- [ ] Documentación actualizada
- [ ] No hay warnings en consola
```

---

## 📊 Métricas y Monitoreo

### Dashboard de Calidad de Código:

```javascript
// script: check-code-quality.js
const fs = require('fs');
const path = require('path');

function analyzeCodeQuality(directory) {
    const files = fs.readdirSync(directory).filter(f => f.endsWith('.js'));
    
    const metrics = {
        totalFiles: files.length,
        issues: [],
        warnings: [],
        stats: {}
    };
    
    files.forEach(file => {
        const content = fs.readFileSync(path.join(directory, file), 'utf-8');
        const lines = content.split('\n');
        
        // Detectar typos comunes
        const typos = [
            { pattern: /colaNotiicaciones/g, correct: 'colaNotificaciones', file },
            { pattern: /carrasArray/g, correct: 'cargasArray', file },
            { pattern: /desviacioEstantdar/g, correct: 'desviacionEstandar', file }
        ];
        
        typos.forEach(typo => {
            if (typo.pattern.test(content)) {
                metrics.issues.push({
                    type: 'TYPO',
                    message: `Encontrado: ${typo.pattern} → Cambiar a: ${typo.correct}`,
                    file: typo.file,
                    severity: 'HIGH'
                });
            }
        });
        
        // Contar líneas
        metrics.stats[file] = {
            lines: lines.length,
            functions: (content.match(/static \w+\(/g) || []).length,
            variables: (content.match(/static \w+ =/g) || []).length
        };
    });
    
    return metrics;
}

module.exports = analyzeCodeQuality;
```

---

## 📚 Recursos Adicionales

1. **ESLint Docs**: https://eslint.org/
2. **TypeScript Handbook**: https://www.typescriptlang.org/docs/
3. **Prettier Docs**: https://prettier.io/
4. **Husky Docs**: https://typicode.github.io/husky/
5. **Google JavaScript Style Guide**: https://google.github.io/styleguide/tsguide.html

---

## 🎯 Implementación Recomendada

### Fase 1: Inmediata (Esta semana)
1. ✅ Corregir los 5 errores encontrados
2. ✅ Instalar y configurar ESLint
3. ✅ Crear `.eslintrc.json`

### Fase 2: Corto Plazo (Este mes)
1. Instalar Prettier
2. Configurar EditorConfig
3. Crear guía de convenciones de nombres

### Fase 3: Mediano Plazo (Este trimestre)
1. Implementar Husky pre-commit hooks
2. Crear tests unitarios
3. Configurar CI/CD con validaciones

### Fase 4: Largo Plazo (Este año)
1. Migrar a TypeScript
2. Implementar GitHub Actions
3. Automatizar reportes de calidad

---

**Conclusión**: Con estas herramientas y procesos, se prevendrán errores similares en el futuro y se mejorará significativamente la calidad del código.
