# Celebrity Joias

Site institucional estático da Celebrity, com catálogo responsivo e galerias de imagens dos produtos.

## Estrutura

- `dist/index.html`: conteúdo do site
- `dist/styles.css`: estilos e responsividade
- `dist/script.js`: menu, perguntas frequentes, formulário e galerias
- `dist/assets/`: logotipos e imagens locais

## Publicação

O diretório público do site é `dist`. Em serviços de hospedagem, configure `dist` como diretório de publicação.

Para visualizar localmente:

```bash
python3 -m http.server 8000 --directory dist
```

Depois, acesse `http://localhost:8000`.
