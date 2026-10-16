# RIP Academia — site institucional

Landing page da **RIP Academia** (Av. Feitoria, 3740 — Feitoria, São Leopoldo/RS), feita para levar o visitante a entender a proposta, ver a estrutura real, encontrar horários e endereço e iniciar o contato pelo WhatsApp em poucos toques.

- **Stack:** Astro 7 (TypeScript, geração estática), CSS por componente e scripts nativos. React não entra no projeto.
- **Publicação:** GitHub Pages em `https://theusmkt.github.io/RIPACADEMIA/`
- **Material de origem:** `RipAcademia-Base-ClaudeCode/` (prompt, catálogo, fotos tratadas, logo, referências), `RipAcademia-Edicoes-ClaudeCode/` (primeira rodada de edições: prompt, oito imagens aprovadas e as artes de benefícios com o endereço corrigido) e `RipAcademia-Ajustes-Rodada-2/` (segunda rodada: prompt e o código do Predictive Arc 2; as fotos dessa rodada já estavam no repositório). Nada dessas pastas é publicado.

## Executar

Requisitos: Node 22 ou superior (testado com Node 24.21 e npm 11.19).

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:4321/RIPACADEMIA/
npm run build      # astro check + build estático + verificação do dist/
npm run preview    # serve o build de produção sob /RIPACADEMIA/
```

`npm run build` termina com `scripts/verify-dist.mjs`, que **falha o build** se encontrar:

- arquivos de origem em `dist/`: PNG matriz, `IMG_*.jpeg`, `.tsx` de referência, arte antiga;
- dados antigos (Rua Otto Daudt, 6h–22h, 9h–15h);
- links de WhatsApp com número errado, sem mensagem ou com códigos técnicos na mensagem;
- `href="#"` ou recursos locais inexistentes, ou caminhos sem o `base`.

## Publicação no GitHub Pages

O workflow `.github/workflows/deploy.yml` usa a ação oficial `withastro/action` e publica a cada push em `main`.

**Passo manual (uma vez):** no GitHub, em *Settings → Pages → Build and deployment*, defina **Source: GitHub Actions**.

`site` e `base` ficam definidos em um único ponto (`astro.config.mjs`) e podem ser sobrescritos por variável de ambiente:

| Cenário | `SITE_URL` | `BASE_PATH` |
| --- | --- | --- |
| GitHub Pages (padrão) | `https://theusmkt.github.io` | `/RIPACADEMIA` |
| Domínio próprio | `https://www.seudominio.com.br` | `/` |

No GitHub, essas variáveis ficam em *Settings → Secrets and variables → Actions → Variables*. Em domínio próprio, configure também o domínio em *Settings → Pages*. Canonical, Open Graph, sitemap, robots e JSON-LD seguem esses valores automaticamente.

## Atualizar conteúdo

Todos os dados comerciais ficam em **`src/data/business.ts`**: nome, endereço, telefone, horários, Instagram, benefícios, Free Pass, avaliações e flags. A tabela de horários, o FAQ, o rodapé e o JSON-LD leem desse arquivo, então um horário é corrigido em um só lugar.

| O que mudar | Onde |
| --- | --- |
| Horários, endereço, telefone, Instagram | `src/data/business.ts` |
| Mensagens do WhatsApp por intenção | `src/lib/whatsapp.ts` |
| Perguntas frequentes | `src/data/faq.ts` |
| Texto alternativo das fotos | `src/data/photos.ts` |
| Quais fotos e artes são publicadas | `scripts/build-images.mjs` |
| Avaliações autênticas (texto, autor, fonte, link) | `business.reviews`. Com a lista vazia, o componente não aparece. |

Para pedidos de edição prontos, use os modelos em `RipAcademia-Base-ClaudeCode/PROMPT-EDICAO-RIP-ACADEMIA.md`.

### Imagens

`npm run images` lê as matrizes em `RipAcademia-Base-ClaudeCode/` e `RipAcademia-Edicoes-ClaudeCode/` e gera somente o que o site usa, em `public/assets/`:

- fotos e artes em **AVIF + WebP** nas larguras 480, 720 e natural (nunca ampliadas), **sempre com a composição inteira**: o pipeline não recorta nem desfoca nada;
- logo recortada da imagem original, favicon a partir do símbolo original e imagem Open Graph 1200×630;
- `src/data/images.json`, com dimensões e caminhos para `srcset`.

O processamento completo leva alguns minutos por causa do AVIF. Para refazer só uma foto, use `node scripts/build-images.mjs --only=fachada-rip` (ou `--only=brand`). As variantes geradas ficam versionadas, então o deploy não depende do pacote de origem.

**Regra do site: nenhuma imagem é cortada.** Toda foto e arte aparece inteira, na proporção original, em celular e computador: sem `object-fit: cover`, sem `clip-path` ou cantos chanfrados, sem cantos arredondados sobre a foto e sem zoom no hover. Fotos muito verticais ficam mais estreitas (`.frame--fit`, que limita a altura pela largura) e os slides do carrossel da estrutura usam caixas iguais com `object-fit: contain` (`.frame--contain`). Gradientes e textos sobre fotos (carrossel e encerramento) são camadas por cima; o arquivo da foto não é editado. O teste de interação confere tudo isso em 390 e 1440 px.

| Uso | Imagem | Origem |
| --- | --- | --- |
| Hero | fachada | `Edicoes/imagens/01-fachada-rip.jpg` |
| Estrutura (carrossel com frases) | vista geral em direção à entrada, escada e aparelhos | `Edicoes/imagens/02-…`, `03-…` |
| Musculação | aluno no aparelho vermelho | `Base/imagens-tratadas/treinos/09-…` |
| CrossTraining | exercícios no chão (bola medicinal e peso) | `Edicoes/imagens/04-crosstraining.jpg` |
| Free Pass | aperto de mãos | `Base/imagens-tratadas/conexao/22-…` |
| Benefícios | artes Wellhub e TotalPass | `Edicoes/imagens-corrigidas/` (endereço atualizado) |
| Convite “Venha fazer parte desse time!” | punhos se cumprimentando | `Edicoes/imagens/07-convite-time.jpg` |
| Encerramento (mensagem sobre a foto) | aluno na esteira | `Edicoes/imagens/08-encerramento-primeiro-passo.jpg` |

A fachada aparece só no hero. A História não tem foto: a foto de grupo saiu na segunda rodada porque não representa a equipe completa. O catálogo completo continua em `RipAcademia-Base-ClaudeCode/catalogo.json`.

### Endereço nas artes de benefícios

As artes recebidas (`Edicoes/imagens/05-wellhub-fonte.jpg` e `06-totalpass-fonte.jpg`) traziam “Rua Otto Daudt, 38 - B. Feitoria”. `scripts/corrigir-endereco-artes.py` troca só essa linha por “Av. Feitoria, 3740 - Feitoria”: apaga os traços do texto antigo preenchendo com o fundo vizinho e escreve a linha nova na mesma posição, em Manrope Bold (a fonte livre mais próxima da arte). Fotos, logos, WhatsApp, “São Leopoldo/RS”, cores e dimensões ficam idênticos (o script grava PNG, sem recompressão; só a faixa do endereço muda). Os fontes recebidos ficam intactos. O cabeçalho do script explica como rodar de novo.

## Abertura do hero: logo e Predictive Arc 2

A primeira tela mostra a logo real da RIP, grande e inteira, com o arco de pequenos quadrados vermelhos do **Predictive Arc 2** em movimento ao fundo. O título, a oferta, os CTAs e a fachada vêm logo abaixo, sem tela de carregamento. Este é o **único** efeito animado do site: a Ribbon Glow (hero e convite) foi removida por completo, junto com o botão manual de pausa.

- Código recebido: `RipAcademia-Ajustes-Rodada-2/animacao/PredictiveArc2-referencia.tsx` (Originkit, exportado como `PredictiveArcHorizon`).
- Adaptação: `src/scripts/predictive-arc.ts` (renderer) e o controlador no `<script>` de `src/components/Hero.astro`.
- Preset vermelho do final do arquivo, sem alterações: fundo `#000000`, base `#F91700`, acento `#AC2B2B`, highlight `#000000`, density 40, dotSize 100, speed 50, hover 100, horizon rise 45 / radius 90 / thickness 100 / falloff 250. Os defaults azuis da função base não são usados.

**Logo:** é o mesmo recorte fiel usado no cabeçalho (`assets/brand/logo-rip-400.webp` e `logo-rip-790.webp`). O recorte tem fundo preto puro; com `mix-blend-mode: lighten`, esse preto deixa o arco aparecer em volta das letras, sem caixa opaca e sem redesenhar a marca. Um halo escuro e suave fica só atrás das letras, para o “RIP” vermelho não se perder nos quadrados vermelhos.

| Tema | Implementação |
| --- | --- |
| Stack | módulo TypeScript nativo com WebGL 1, importado sob demanda depois do `load`, em momento ocioso (sem React) |
| Shader | o fragment shader do original, sem alterações |
| Tamanho | sem `minWidth 1200` / `minHeight 800`: o canvas cobre a área da abertura (60 % da altura da tela no desktop, 52 % no celular), medida por `ResizeObserver` |
| Orçamento | DPR até 1,5 e 30 quadros/s (o original desenha todo quadro com DPR até 2) |
| Visibilidade | IntersectionObserver na abertura e `visibilitychange`: fora da tela ou com a aba oculta, o loop para; ao voltar, retoma sem salto de tempo e sem segundo loop |
| Movimento reduzido | desenha um único quadro parado do próprio shader (nenhum loop); acompanha a mudança da preferência em tempo real |
| Sem WebGL ou falha | arco estático em CSS com a mesma geometria (raio 0,9 × largura, ápice a 45 % da base) e grade de quadrados; a logo continua visível. Também é o que aparece no primeiro instante, antes do renderer iniciar |
| Ponteiro | complemento só com mouse/trackpad, lido na abertura (o canvas não recebe eventos); não bloqueia cliques nem rolagem |
| Limpeza | `destroy()` cancela o frame, desconecta o observer e os listeners e libera programa, shaders e buffer; perda de contexto e falhas de compilação ou link voltam ao arco estático, sem mensagens para o visitante |
| Botão de pausa | não há; as pausas são automáticas (visibilidade, aba oculta, movimento reduzido) |

`scripts/verify-dist.mjs` falha o build se algum resto da Ribbon Glow ou do botão de pausa voltar a ser publicado.

## Surgimento das fotos

Na primeira vez que entram na tela, a fachada do hero, as duas fotos do carrossel da estrutura e a foto da Musculação aparecem com fade-in enquanto uma faixa de quadradinhos vermelhos sobe por elas e se desfaz até a foto ficar inteira (`src/scripts/image-reveal.ts`, cerca de 1,3 s). As artes de Wellhub e TotalPass e as fotos do CrossTraining, do Free Pass, do convite e do encerramento ficam sem o efeito, a pedido; o contêiner delas tem `data-img-fx-off`. Para ligar ou desligar o efeito numa foto, basta tirar ou pôr esse atributo. As partículas usam as cores do arco do hero (`#F91700` e `#AC2B2B`) e a mesma grade, com o menor lado ÷ 40 e quadrados de 7 a 16 px.

- As partículas ficam num canvas 2D temporário sobre a foto, removido no fim; a foto não é recortada, ampliada nem alterada.
- Não há efeito com movimento reduzido nem sem JavaScript.
- Fotos já visíveis quando a página abre ficam como estão, para não piscar. No desktop, isso vale para a fachada do hero.
- No carrossel, cada slide surge quando aparece.

## Carrossel da estrutura

As duas fotos da estrutura ficam num carrossel horizontal (`src/components/StructureSection.astro`), na ordem: vista geral (“Estrutura pensada para o seu melhor desempenho.”) e escada (“O espaço ideal para a sua evolução.”).

- Rolagem nativa com parada em cada slide (toque e trackpad) e arraste com mouse. A rolagem vertical da página continua livre.
- Botões “Foto anterior” e “Próxima foto”, indicadores (“Ir para a foto 1 de 2”) e setas do teclado com o carrossel em foco. Sem autoplay e sem biblioteca.
- Um slide principal por vez e a borda do próximo. Os slides têm o mesmo tamanho e as fotos aparecem inteiras.
- Frases em Inter (peso 550), sobre um gradiente contínuo no alto da foto, com fade de 0,7 s na primeira vez que o slide aparece.
- Sem JavaScript, os controles ficam ocultos e a rolagem nativa continua funcionando.

## Mensuração (GA4, GTM, Meta Pixel)

Tudo fica desligado enquanto não houver ID, e sem ID nenhum aviso de consentimento aparece. Para ativar, preencha as *Repository variables* `PUBLIC_GA4_ID`, `PUBLIC_GTM_ID` e/ou `PUBLIC_META_PIXEL_ID` e faça um novo deploy. Para testar localmente:

```bash
PUBLIC_GA4_ID=G-XXXXXXX PUBLIC_META_PIXEL_ID=123 PUBLIC_ANALYTICS_DEBUG=true npm run build && npm run preview
```

Com algum ID configurado:

- aparece um aviso com **Aceitar** e **Recusar** de mesmo destaque;
- nada carrega antes da escolha;
- o aviso fica acima da barra do mobile, com espaço reservado no layout;
- a página `/privacidade/` lista apenas as ferramentas efetivamente ativadas.

`PUBLIC_ANALYTICS_DEBUG=true` escreve os eventos no console mesmo sem IDs.

| Evento | Quando | Parâmetros | Meta Pixel |
| --- | --- | --- | --- |
| `whatsapp_click` | clique em qualquer link de WhatsApp | `cta_id`, `placement`, `intent` | `Contact` |
| `free_pass_click` | CTA de Free Pass (inclui “Quero começar” e “Quero voltar”) | `cta_id`, `placement` | `Contact` (um só por clique) |
| `benefit_contact_click` | Wellhub / TotalPass | `benefit`, `placement` | `Contact` (um só por clique) |
| `directions_click` | “Como chegar” | `placement` | `FindLocation` |
| `faq_open` | expansão de pergunta | `question_id` | — |

Nenhum parâmetro leva nome, telefone ou mensagem. **Um clique no WhatsApp é intenção de contato, não lead.** Por isso o site não dispara `generate_lead`, `Lead`, `Schedule` nem `Purchase`.

Para acompanhar o funil (clique → conversa iniciada → visita agendada → matrícula), registre as etapas seguintes no processo comercial: CRM, etiquetas do WhatsApp Business ou importação offline de conversões. O site não simula essas etapas.

**Validar:**

- GA4: *Admin → DebugView*, ou extensão Tag Assistant;
- Pixel: *Events Manager → Test events*, ou extensão Meta Pixel Helper;
- clique em cada CTA e confirme um evento por ação.

## Testes realizados

### Segunda rodada (ajustes 1–5)

Ambiente: container Linux, Node 22, Chromium headless do Playwright com WebGL **por software** (SwiftShader), contra o build de produção servido por `astro preview` sob `/RIPACADEMIA/`. Celular = emulação (viewport, toque e `isMobile`); não houve teste em aparelho real.

| Verificação | Resultado |
| --- | --- |
| `npm run build` | `astro check` 0 erros; `verify-dist` aprovado, incluindo a nova checagem de restos da Ribbon Glow |
| Larguras 360, 390, 768 e 1440 | sem scroll horizontal, sem erros de console nem respostas 4xx; capturas da página inteira revisadas |
| `npm run test:e2e` | **64/64**. Inclui: um único contexto WebGL (nenhum WebGL2) e nenhum canvas fora do hero; nenhum botão de pausa, área clicável ou resto da Ribbon Glow; logo grande, inteira, na primeira tela e com `lighten`; loop rodando (41–59 rAF/s), parado fora da tela e com a aba oculta, retomado sem segundo loop; resize 1440 → 390 → 1440 com o mesmo renderer; movimento reduzido com quadro parado e 0 rAF; sem WebGL com o arco em CSS; carrossel por botões, indicadores, teclado, arraste com mouse e toque; slides do mesmo tamanho; frases exatas em Inter 550; História sem foto e com CTA; convite sem canvas; encerramento com título, apoio e CTA dentro da foto (no celular, a partir de 44 % da altura, abaixo do rosto); imagens sem recorte em 390 e 1440 px; conteúdo sem JavaScript |
| Movimento do arco | entre capturas com 1,5 s de intervalo mudam 8–9 % dos pixels da primeira tela no desktop e 10–11 % no celular |
| Contraste (`tests/e2e/contrast.mjs`, pixel mais claro sob cada texto) | frases do carrossel ≥ 4,65:1; título e apoio do encerramento ≥ 14:1; “primeiro passo.” ≥ 3,87:1 (texto grande); texto do hero ≥ 8,2:1 |

| Desempenho (`npm run test:perf`, 1440 × 900, 3 amostras) | arco animado: 30 desenhos/s, quadros p50 17–33 ms e p95 33–50 ms, clique → pintura 32–34 ms; arco parado (movimento reduzido): 0 desenhos/s, quadros 16,7 ms, clique → pintura 5–10 ms; LCP 168–200 ms e CLS ≤ 0,005 nos dois casos |

Os rAF/s e os tempos de quadro acima são do Chromium headless com WebGL **por software**: o arco é desenhado na CPU e o custo aparece exagerado. O desempenho em GPU e em aparelhos reais não foi medido.

### Surgimento das fotos com partículas

Mesmo ambiente da segunda rodada.

- **`npm run test:e2e`: 80/80**, com 16 verificações do efeito em 1440 e 390 px:
  - fotos fora da tela marcadas para surgir, e as já visíveis sem piscar;
  - durante o surgimento, partículas sobre a foto e foto em fade;
  - ao fim, foto inteira e canvas removido;
  - no carrossel, a segunda foto surge quando o slide aparece;
  - as seis fotos marcadas com `data-img-fx-off` aparecem direto, sem partículas;
  - sem efeito com movimento reduzido, e fotos visíveis sem JavaScript.
- **Larguras 360, 390, 768 e 1440 px:** rolando a página inteira, as 10 fotos terminam visíveis, sem partículas sobrando, sem rolagem horizontal nem erros.

### Primeira rodada de edições (ajustes 1–7)

Resultados da versão com a Ribbon Glow no hero e no convite, substituída na segunda rodada; ficam aqui como registro.

Ambiente: container Linux, Node 22, Chromium headless do Playwright com WebGL2 **por software** (SwiftShader), contra o build de produção servido por `astro preview` sob `/RIPACADEMIA/`. Celular = emulação (viewport, toque e `isMobile`); não houve teste em iPhone ou Android reais.

| Verificação | Resultado |
| --- | --- |
| `npm run build` | `astro check` 0 erros; `verify-dist` aprovado (23 links de WhatsApp, nada do pacote publicado) |
| Larguras 360, 390, 768, 1024, 1440 | sem scroll horizontal, sem erros de console, sem respostas 4xx; capturas da página inteira revisadas |
| Imagens inteiras | as 11 variantes publicadas têm a mesma proporção dos arquivos-fonte e bordas iguais (diferença média 1–3 em 0–255, só compressão); no navegador, nenhuma `<img>` com `cover`, `clip-path` ou proporção diferente da do arquivo, em 390 e 1440 px |
| Onda em movimento | entre capturas com 1,5 s de intervalo mudam 44–50 % dos pixels do hero no celular e ~18 % no convite; continua após redimensionar 1440 → 390 → 1440, rolar e voltar da aba oculta (aba oculta: 0 %), sempre com um renderer por seção |
| `npm run test:e2e` | **53/59**. As 6 falhas são as verificações de taxa de quadros (`> 20 rAF/s`): aqui o WebGL por software entrega 3–11 por segundo. Na versão anterior, neste mesmo ambiente, as verificações de taxa também falhavam. Passaram: renderer criado no convite só ao aparecer, pausa e retomada sem segundo renderer, controle 48 × 48 px com `aria-label` alternando, aba oculta, movimento reduzido (nenhum renderer, conteúdo no estado final), sem WebGL2 (fundo estático nas duas seções, sem botão), sem JavaScript, par da estrutura lado a lado e alinhado com as frases, título do convite lido uma vez, galeria removida sem links quebrados, barra mobile sem cobrir o rodapé |
| Contraste sobre a onda (`tests/e2e/contrast.mjs`, pior de 8–10 quadros) | hero: texto ≥ 4,93:1 em 360, 390, 768 e 1440 px; vermelho grande ≥ 3,66:1. Convite: branco ≥ 14:1, “desse time!” ≥ 3,52:1 |
| Consentimento (`tests/e2e/consent.mjs`) | 19/27, **igual à `main` anterior** rodada no mesmo ambiente: as 8 falhas são as mesmas verificações de eventos do GA4 e não mudaram com estas edições; consentimento, bloqueio antes da escolha e o `Contact` único do Pixel passam |

Não medidos nesta rodada: desempenho (`test:perf` não é representativo com WebGL por software), leitores de tela reais e aparelhos físicos.

### Versão inicial

Ambiente: Windows 11, Node 24.21, Edge (Chromium) local via `playwright-core`, contra o build de produção servido por `astro preview` sob `/RIPACADEMIA/`. Estes números são da versão anterior às edições (galeria, onda só no desktop).

| Verificação | Resultado |
| --- | --- |
| `astro check` | 0 erros, 0 avisos |
| `verify-dist` | sem arquivos de origem nem dados antigos; 23 links de WhatsApp com número e mensagem corretos; todos os recursos existem sob o `base` |
| Larguras 360, 390, 768, 1024, 1440 | sem scroll horizontal, sem erros de console, sem respostas 4xx |
| `npm run test:e2e` | **50/50**. Inclui: loop do renderer parado fora da tela, com aba oculta, pausado e com movimento reduzido; uma única instância; fallback sem WebGL2; mobile sem renderer e sem baixar o módulo; menu, lightbox e FAQ por teclado; foco devolvido; barra mobile sem cobrir o rodapé e oculta com dialog aberto; conteúdo e contato sem JavaScript |
| Consentimento e eventos (`tests/e2e/consent.mjs`, build com IDs fictícios e requisições externas bloqueadas) | **27/27**. Nada carrega antes da escolha; recusar não carrega; cada clique gera os eventos previstos e um único `Contact` |
| Contraste no hero (`npm run test:contrast`) | no pior quadro da animação: ≥ 8:1 para texto secundário e ≥ 13:1 para texto principal |
| Pares da paleta | branco/action-red 5,22; muted/fundo 8,24; muted/surface-elevated 6,72; ink/seção clara 15,98; ink-muted/seção clara 7,84; brand-red/fundo 4,58 (só em títulos e números) |

**Animação habilitada × desabilitada** (`npm run test:perf`, 1440×900, mesmo Edge e mesma máquina, 3 amostras cada):

| | LCP (lab) | CLS | Tarefas longas | Quadros p95 | Clique → pintura | Desenhos/s |
| --- | --- | --- | --- | --- | --- | --- |
| Habilitada | 0,65–0,94 s | ≤ 0,0012 | 1 (máx. 110–130 ms) | 16,9 ms | 4–14 ms | 30 |
| Desabilitada | 0,69–0,76 s | 0,0006 | 1 (máx. 66–126 ms) | 17,3 ms | 3–8 ms | 0 |

Antes da compilação paralela, a animação acrescentava uma tarefa longa de 145–292 ms depois do carregamento; ela foi eliminada. A primeira amostra logo após cada build saiu fria (LCP 2–5 s) e não entrou na faixa.

**Limites destes números.** São medições de laboratório em um desktop com GPU. Não representam o campo (LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1 no p75 precisam ser acompanhados com dados reais, por exemplo Search Console ou CrUX) nem dispositivos modestos. Leitores de tela não foram testados manualmente; a semântica (landmarks, headings, `aria-*`, dialog nativo) foi revisada no código.

Para repetir: `npm run build && npm run preview` em um terminal e, em outro, `npm run test:e2e` (use `BROWSER_PATH` para apontar outro Chromium).

## Pendências de produção

1. **Domínio:** sem domínio próprio, o site fica em `theusmkt.github.io/RIPACADEMIA/`. Nesse modo o `robots.txt` não fica na raiz do domínio e os buscadores o ignoram.
2. **IDs de GA4/GTM e Meta Pixel:** ainda não informados; tudo está desligado.
3. **Confirmação comercial** de Wellhub, TotalPass (planos e condições) e do Free Pass (duração e regras). O site não promete prazos nem acesso ilimitado.
4. **Horário de domingo e feriados:** hoje aparece “Consulte a equipe”; por isso o site não mostra “Aberto agora”.
5. **Logo em vetor (SVG/PDF):** a logo atual é um recorte fiel do JPEG recebido.
6. **Aprovação das fotos tratadas pela academia:** houve reconstrução por IA; compare com `originais-referencia/`.
7. **Autorização de uso de imagem** de todas as pessoas que aparecem nas fotos.
8. **URL oficial no Google Maps** (opcional): sem ela, “Como chegar” abre uma busca pelo endereço. Não há coordenadas inventadas.
9. **Avaliações autênticas** (opcional): o componente está pronto e desativado.
10. **Arco no celular:** anima também no celular, mas só foi validado por emulação. Medir em aparelho real, inclusive um Android modesto; se pesar, reduzir `maxDpr` ou `fps` no controlador de `src/components/Hero.astro`, sem desligar o arco.
11. **Artes Wellhub e TotalPass:** confirmar com a academia a linha corrigida (“Av. Feitoria, 3740 - Feitoria”), escrita em fonte livre parecida com a original. Se houver os arquivos editáveis das artes, o ideal é exportá-las de novo com o endereço atual.

## Estrutura

```text
src/
  pages/        index, privacidade, 404, sitemap.xml, robots.txt
  layouts/      BaseLayout (head, SEO, JSON-LD ExerciseGym, eventos, revelação)
  components/   Header, Hero (abertura com logo e arco), StructureSection (carrossel), ModalitiesSection,
                FreePassSection, BenefitsSection, HistorySection, InviteSection, LocationSection,
                FAQ, FinalCTA, MobileConversionBar, ConsentBanner, Footer, Photo, Icon, WhatsAppLink
  data/         business (config central), faq, photos, images.json (gerado)
  lib/          whatsapp, analytics, paths, images
  scripts/      predictive-arc (renderer WebGL do arco do hero)
  styles/       tokens, global
scripts/        build-images.mjs, verify-dist.mjs, corrigir-endereco-artes.py
tests/e2e/      interact, consent, contrast, perf
public/assets/  brand/ e images/ (somente variantes geradas)
```
