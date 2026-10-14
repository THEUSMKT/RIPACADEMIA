# RIP Academia — site institucional

Landing page da **RIP Academia** (Av. Feitoria, 3740 — Feitoria, São Leopoldo/RS), feita para levar o visitante a entender a proposta, ver a estrutura real, encontrar horários e endereço e iniciar o contato pelo WhatsApp em poucos toques.

- **Stack:** Astro 7 (TypeScript, geração estática), CSS por componente e scripts nativos. React não entra no projeto.
- **Publicação:** GitHub Pages em `https://theusmkt.github.io/RIPACADEMIA/`
- **Material de origem:** `RipAcademia-Base-ClaudeCode/` (prompt, catálogo, fotos tratadas, logo, referências). Nada dessa pasta é publicado.

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
| Fotos da galeria | `src/data/gallery.ts` |
| Texto alternativo e enquadramento das fotos | `src/data/photos.ts` |
| Recortes, desfoques e quais fotos são publicadas | `scripts/build-images.mjs` |
| Avaliações autênticas (texto, autor, fonte, link) | `business.reviews`. Com a lista vazia, o componente não aparece. |

Para pedidos de edição prontos, use os modelos em `RipAcademia-Base-ClaudeCode/PROMPT-EDICAO-RIP-ACADEMIA.md`.

### Imagens

`npm run images` lê as matrizes em `RipAcademia-Base-ClaudeCode/` e gera somente o que o site usa, em `public/assets/`:

- fotos em **AVIF + WebP** nas larguras 480, 720 e natural (nunca ampliadas);
- logo recortada da imagem original, favicon a partir do símbolo original e imagem Open Graph 1200×630;
- `src/data/images.json`, com dimensões e caminhos para `srcset`.

O processamento completo leva alguns minutos por causa do AVIF. Para refazer só uma foto, use `node scripts/build-images.mjs --only=fachada-vista-da-rua` (ou `--only=brand`). As variantes geradas ficam versionadas, então o deploy não depende do pacote de origem.

Seleção e recortes (`object-position` em `src/data/photos.ts`):

| Uso | Foto | Tratamento |
| --- | --- | --- |
| Hero | 04 corredor central | corte do piso inferior; moldura 4:5 alinhada ao alto |
| Estrutura | 03 visão geral, 05 escada e aparelhos | 03 sem o piso inferior |
| Musculação | 09 aluno no aparelho vermelho | — |
| CrossTraining | 19 exercícios no chão (bola medicinal e peso) | as fotos com bola de futebol e cones não ilustram a modalidade |
| Free Pass | 22 aperto de mãos | — |
| História | 06 foto de grupo | legenda neutra, sem atribuir funções |
| Fechamento | 07 acompanhamento no aparelho | — |
| Localização | 01 fachada vista da rua | céu e canto inferior (placa do carro) recortados; reflexo da placa com preço desfocado com borda suave |
| Galeria | 11, 08, 17, 12, 21, 02 | agrupadas em treinos, equipamentos e fachada |

Nenhuma foto se repete entre hero, estrutura e fechamento. O catálogo completo continua em `RipAcademia-Base-ClaudeCode/catalogo.json`.

## Ribbon Glow (fundo do hero)

A adaptação do código recebido (`animacoes/RibbonGlow-referencia.tsx`, Originkit) está em `src/scripts/ribbon-glow.ts`, com o controlador em `src/components/Hero.astro` e as camadas em `src/components/HeroWaveBackground.astro`. O Predictive Arc Horizon não foi montado e não entra no bundle.

**Conferência do código real.** Os nomes citados no briefing batem com o código: `minWidth: 1200`, `minHeight: 800`, `MAX_DPR = 2`, `LAYERS = 84`, props `background`, `color1`, `color2`, `speed`, `size`, `angle`, `hover`, `reach`, `width`, `height`, campo em textura de meia resolução e cleanup de programas, textura, framebuffer e VAO. Duas observações:

- O original não tem prop de deslocamento; o `offset` desta adaptação é novo.
- O original escuta o ponteiro em `window`. A adaptação escuta só o hero.

**Adaptações feitas:**

| Tema | Implementação |
| --- | --- |
| Stack | módulo TypeScript nativo, importado dinamicamente (≈ 3,5 KB gzip) só quando vai rodar |
| Responsividade | sem `minWidth` nem `minHeight`; o canvas fica em `inset: 0` no hero, cuja altura vem do conteúdo; `ResizeObserver` no lugar de medir o layout a cada frame |
| Camadas | fundo estático em SVG → canvas com opacidade 0,30 → máscara escura atrás do texto → conteúdo e foto. Tudo decorativo tem `aria-hidden` e `pointer-events: none` |
| Composição | `offset: [0.1, -0.26]` coloca a faixa na borda inferior e na transição entre texto e foto |
| Visibilidade | IntersectionObserver no hero e `visibilitychange`. O loop só existe entre `start()` e `stop()`; ao retomar, o tempo de referência é zerado |
| Movimento reduzido | verificado antes de iniciar e acompanhado em tempo real; com a preferência ativa, fica o fundo estático e nenhum loop |
| Controle do visitante | botão “Pausar movimento” / “Retomar movimento” com `aria-pressed`, lembrado no navegador. Retomar reaproveita o mesmo renderer |
| Qualidade | DPR máximo 1,25, desenho limitado a 30 quadros/s, campo em meia resolução e `LAYERS` como parâmetro de geração do shader (mantido em 84) |
| Mobile | abaixo de 1024 px fica o fallback estático e o módulo WebGL nem é baixado |
| Inicialização | depois do `load` e em `requestIdleCallback`; shaders compilados com `KHR_parallel_shader_compile`, sem bloquear a thread principal |
| Falhas | sem WebGL2, erro de compilação ou link, framebuffer incompleto ou perda de contexto: volta ao fundo estático, sem mensagem para o visitante, liberando o que já tinha sido criado |
| Ciclo de vida | `destroy()` cancela o frame, desconecta observers e listeners e libera programas, textura, framebuffer e VAO |

**Ponteiro:** a interação com o mouse (hover 15, reach 180) só é instalada com `(hover: hover) and (pointer: fine)`.

**Camadas do shader:** a versão com 40–48 camadas não foi adotada. A medição com 84 não indicou custo relevante no dispositivo testado (veja abaixo), e reduzir camadas muda forma e brilho.

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
| `gallery_open` | abertura de foto | `image_id` | — |
| `faq_open` | expansão de pergunta | `question_id` | — |

Nenhum parâmetro leva nome, telefone ou mensagem. **Um clique no WhatsApp é intenção de contato, não lead.** Por isso o site não dispara `generate_lead`, `Lead`, `Schedule` nem `Purchase`.

Para acompanhar o funil (clique → conversa iniciada → visita agendada → matrícula), registre as etapas seguintes no processo comercial: CRM, etiquetas do WhatsApp Business ou importação offline de conversões. O site não simula essas etapas.

**Validar:**

- GA4: *Admin → DebugView*, ou extensão Tag Assistant;
- Pixel: *Events Manager → Test events*, ou extensão Meta Pixel Helper;
- clique em cada CTA e confirme um evento por ação.

## Testes realizados

Ambiente: Windows 11, Node 24.21, Edge (Chromium) local via `playwright-core`, contra o build de produção servido por `astro preview` sob `/RIPACADEMIA/`.

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
10. **GitHub Pages:** *Settings → Pages → Source: GitHub Actions*.
11. **Animação no mobile:** só ativar depois de medir em aparelho real; hoje o mobile usa o fallback estático.

## Estrutura

```text
src/
  pages/        index, privacidade, 404, sitemap.xml, robots.txt
  layouts/      BaseLayout (head, SEO, JSON-LD ExerciseGym, eventos, revelação)
  components/   Header, Hero, HeroWaveBackground, StructureSection, ModalitiesSection,
                FreePassSection, BenefitsSection, HistorySection, Gallery, LocationSection,
                FAQ, FinalCTA, MobileConversionBar, ConsentBanner, Footer, Photo, Icon, WhatsAppLink
  data/         business (config central), faq, gallery, photos, images.json (gerado)
  lib/          whatsapp, analytics, paths
  scripts/      ribbon-glow (renderer WebGL2 adaptado)
  styles/       tokens, global
scripts/        build-images.mjs, verify-dist.mjs
tests/e2e/      interact, consent, contrast, perf
public/assets/  brand/ e images/ (somente variantes geradas)
```
