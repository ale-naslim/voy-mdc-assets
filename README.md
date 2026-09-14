# voy-mdc-assets

Assets da LP **Voy — Mês do Cliente 2026**, servidos via jsDelivr para o Embed do Webflow.

- `assets/video` — vídeos de header, depoimentos e brinde (H.264, faststart)
- `assets/img` — fotos, posters e loops animados (WebP)
- `assets/fonts` — Season Mix e NB International (woff2, subset Latin)
- `assets/brand` — logo

Base jsDelivr: `https://cdn.jsdelivr.net/gh/ale-naslim/voy-mdc-assets@main/`

## virada/ (R$ 349)

Versão da virada de preço, isolada nesta pasta para não tocar nos arquivos da LP que já está no ar
(raiz) nem da versão de influenciadores (`influ/`). Assets em `virada/assets/`, código em
`virada/lp.css` e `virada/lp.js`. O Embed aponta sempre para um commit fixo, nunca para `@main`.

## virada-influ/ (sem preço)

Versão de influenciadores da virada: só `lp.css` e `lp.js`. Usa os mesmos assets de `virada/assets/`
(mesmo hash, nada duplicado).
