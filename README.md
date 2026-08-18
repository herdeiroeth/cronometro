# Cronômetro

Site simples de cronômetro (stopwatch) feito com HTML, CSS e JavaScript puro — sem dependências, sem build.

## Recursos

- Contagem com precisão de centésimos de segundo (`requestAnimationFrame` + `performance.now()`).
- Iniciar, pausar, continuar e zerar.
- Registro de voltas (laps) com tempo parcial e total.
- Realce automático da volta mais rápida (verde) e mais lenta (vermelho).
- Atalhos de teclado:
  - `Espaço` — iniciar / pausar
  - `L` — registrar volta
  - `R` — zerar

## Como usar

Basta abrir o `index.html` no navegador. Nenhuma instalação necessária.

```bash
# opcional: servir localmente
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## Estrutura

- `index.html` — marcação da página
- `style.css` — estilos (tema escuro)
- `app.js` — lógica do cronômetro
