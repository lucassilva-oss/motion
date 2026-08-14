# Alvorada Autopeças — Layout de E-commerce

Protótipo de UI/UX estático (`alvorada-autopecas.html`) para a home de um e-commerce de autopeças, seguindo a identidade visual da Alvorada Autopeças (azul institucional `#0069AA`, vermelho institucional `#D7181F`, preto institucional `#231F20`, tipografia Montserrat).

Este diretório é independente das composições Remotion do restante do repositório — é um artefato de design (HTML/CSS/JS vanilla, single-file, sem dependências) pronto para servir de referência à implementação em produção (Next.js, etc.).

## Abrir localmente

Basta abrir `alvorada-autopecas.html` diretamente no navegador — não há build nem dependências externas (fontes Montserrat embutidas via `@font-face` em data URI).

## O que está incluso

- Header com busca por veículo (marca → modelo → ano → versão, em cascata) e por código de peça
- Hero com CTA e widget de busca funcional
- Categorias, ofertas com contador regressivo, produtos em destaque, ranking de mais vendidos, marcas
- Diferenciais, simulador de prazo de entrega por CEP, selos de segurança
- Depoimentos (carrossel), seção institucional, newsletter
- Footer completo, menu mobile (drawer), navegação inferior mobile, botão de WhatsApp flutuante
- Estados de hover/foco/ativo/loading, favoritos e carrinho com feedback visual (toasts)
- Totalmente responsivo (mobile-first) e com paleta adaptada para modo claro/escuro
