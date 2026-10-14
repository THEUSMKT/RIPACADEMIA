# RIP Academia — prompt de implementação da segunda rodada

Leia este documento inteiro antes de editar. Aplique os CINCO ajustes abaixo ao site existente da RIP Academia. Este prompt consolida a segunda rodada e substitui as decisões anteriores apenas nos pontos expressamente modificados. Preserve as demais edições já aplicadas.

## Objetivo e modo de execução

Atue como desenvolvedor frontend sênior e designer de interfaces. Entregue as alterações no código do projeto, com acabamento profissional, navegação fluida, boa leitura e CTAs funcionais em desktop e mobile.

Inspecione os componentes, estilos, arquivos de imagens e scripts de build. Reutilize a stack existente. Se o projeto estiver em Astro, adapte a nova animação ao JavaScript e ao ciclo de vida usados pelo projeto; não introduza React somente porque a referência foi fornecida em TSX.

Os nomes de componentes observados na rodada anterior, como `Hero.astro`, `StructureSection.astro` e `LocationSection.astro`, são pistas de localização. Confirme a estrutura atual antes de editar. Localize os blocos também pelos textos indicados.

O pacote contém o novo código completo, as três fotos necessárias e uma referência original da logo. As fotos são cópias integrais dos assets aprovados; não foram modificadas por este empacotamento. Se o projeto já possui as mesmas fotos, reutilize-as e evite duplicações. Use o mapa de arquivos para verificar a correspondência.

## Decisões atuais que prevalecem

1. Remover o botão manual de pausa/retomada da animação.
2. Remover apenas a foto do grupo e sua legenda da seção História.
3. Sobrepor a mensagem de encerramento à foto do homem na esteira, com gradiente suave nas bordas.
4. Transformar o par de fotos da estrutura em carrossel arrastável, com tipografia refinada e gradiente superior.
5. Remover completamente a animação antiga Ribbon Glow e usar Predictive Arc 2 apenas no hero, com a logo grande em primeiro plano.

O usuário DESCARTOU a ideia de animação no fundo de todo o site. Portanto, não crie um canvas global e não mantenha Ribbon Glow na seção de convite. Preserve a foto dos punhos, o texto “Venha fazer parte desse time!” e sua animação de entrada; remova desse bloco somente o efeito de fundo antigo.

A regra de fotografias completas continua obrigatória. A expressão “foto como fundo” no ajuste 3 não autoriza corte, zoom de preenchimento ou distorção. O novo carrossel substitui a regra antiga de duas fotos fixas lado a lado.

## Identidade e dados a preservar

RIP Academia, identidade preta, vermelha e branca; logo original e assinatura “Desde 2000”. Preserve as informações corretas e a lógica de contato já configurada:

- Av. Feitoria, 3740 — Feitoria, São Leopoldo/RS.
- WhatsApp e telefone: (51) 99985-0575; número para link: `5551999850575`.
- Segunda a sexta, 05h30 às 22h; sábado, 09h às 16h.
- Instagram: `https://www.instagram.com/rip_academia/`.
- Oferta: conversar com a equipe e agendar Free Pass, consultando condições.

Não invente horários aos domingos, valores, planos, condições de benefícios, resultados ou depoimentos. Preserve as artes Wellhub e TotalPass e a correção do endereço da primeira rodada.

## Mapa dos arquivos fornecidos

| Arquivo | Utilização |
| --- | --- |
| `imagens/estrutura-vista-geral.jpg` | Primeiro slide do carrossel de estrutura |
| `imagens/estrutura-escada.jpg` | Segundo slide do carrossel de estrutura |
| `imagens/encerramento-primeiro-passo.jpg` | Fotografia do homem na esteira para a composição de encerramento |
| `marca/logo-rip-original.jpeg` | Referência de fidelidade da marca; preferir o asset adequado já existente no site |
| `animacao/PredictiveArc2-referencia.tsx` | Código completo da NOVA animação, exportada como PredictiveArcHorizon |

Não usar o antigo RibbonGlow-referencia.tsx como fonte do novo efeito. O componente novo tem um arco de pequenos quadrados vermelhos sobre fundo preto. A aparência correta vem do preset vermelho no final do arquivo, não dos defaults azuis da função base.

## Regra visual obrigatória para todas as fotos

Exiba as imagens completas, com sua proporção original. Redimensionar proporcionalmente para caber na tela é permitido. Cortar a composição, esticar, esconder bordas ou ampliar para preencher uma caixa é proibido.

Prefira imagens responsivas com altura automática. Se houver caixas de dimensões fixas, use encaixe integral equivalente a `object-fit: contain`. Não use `object-fit: cover`, `background-size: cover`, máscaras diagonais ou zoom que eliminem pixels da composição. Versões otimizadas devem preservar as quatro bordas originais.

A imagem pode exigir rolagem vertical para ser vista integralmente no celular. Isso é aceitável; ocultar parte dela dentro do card não é. Gradientes e textos solicitados atuam como camadas visuais sobre a imagem, sem recortar ou editar o arquivo fonte.

## Ajuste 1 — remover completamente o botão de pausa

Localize o botão circular com ícone de pausa no final do hero, abaixo da foto/legenda “Fachada da RIP Academia, na Av. Feitoria, 3740.” e antes de “ESTRUTURA REAL — CONHEÇA O ESPAÇO ONDE SEU PRÓXIMO TREINO ACONTECE.”.

Remova o controle de pausar e retomar em todos os breakpoints. Remova o elemento, os ícones, rótulos, foco por teclado, listeners e estados usados exclusivamente por ele. Não basta deixar o botão transparente ou esconder visualmente uma área ainda clicável.

Remova o espaço reservado exclusivamente ao controle e ajuste a transição para a seção seguinte. Preserve a fachada, sua legenda, menu, CTAs e o conteúdo da estrutura.

A nova animação do ajuste 5 também não deve receber um botão manual de pausa. Pausas automáticas por visibilidade, desempenho ou preferência de movimento reduzido continuam necessárias quando aplicáveis.

**Concluído quando:** não há controle manual nem foco ou área clicável invisível remanescente, no celular ou computador.

## Ajuste 2 — remover foto do grupo e legenda da História

Localize “HISTÓRIA — UMA HISTÓRIA QUE COMEÇOU EM 2000.”. Após o texto e o botão “Conversar com a equipe” aparece uma foto de grupo, seguida da legenda:

“Registro da academia: pessoas reunidas no espaço da RIP.”

Remova completamente o conjunto foto e legenda, incluindo o contêiner dedicado. O usuário informa que a foto não representa a equipe completa e não possui outra foto adequada no momento.

Preserve o destaque “2000”, o título, o texto sobre a história e o botão de contato. Reorganize a seção para que o conteúdo restante ocupe o espaço de forma equilibrada. Elimine coluna vazia, placeholder, margem excessiva ou altura mínima que dependiam da foto.

Não substitua por imagem gerada ou outra fotografia e não transfira o grupo para outro lugar como representação da equipe. Limpe imports sem uso. A remoção não significa apagar toda a seção História.

**Concluído quando:** foto e legenda desapareceram e a História mantém seus textos e CTA, sem buraco no layout.

## Ajuste 3 — encerramento com texto animado SOBRE a fotografia

Localize a seção “Sua melhor versão começa com o primeiro passo.”. Hoje título, apoio e botão ficam separados acima ou ao lado da foto do homem de boné vermelho treinando na esteira.

Transforme esse conjunto numa composição única: a fotografia atrás e os textos à frente, dentro da mesma área visual.

### Conteúdo exato

- Título: **Sua melhor versão começa com o primeiro passo.**
- Destaque vermelho no trecho **primeiro passo**.
- Apoio: **Venha conhecer a RIP e dê o seu primeiro passo.**
- CTA: **Agendar meu Free Pass**, com o contato funcional já usado no projeto.

Use `imagens/encerramento-primeiro-passo.jpg`, ou sua cópia idêntica existente no projeto.

### Composição

Use a imagem inteira como base do componente. Uma implementação possível é deixar o `img` responsivo no fluxo e sobrepor as camadas de gradiente e conteúdo. Assim a proporção da foto determina a área disponível e não há recorte de banner.

Crie um gradiente preto suave nas extremidades, com transição para o fundo do site e centro mais transparente. Ajuste o contraste onde ficam os textos, mantendo o homem, rosto e esteira visíveis. Não aplique uma camada preta uniforme que apague a fotografia.

Posicione o título, apoio e botão em áreas que não cubram desnecessariamente o rosto. Ajuste tamanho, quebras de linha, espaçamento e posição no celular. Tudo deve caber na composição sem vazar ou empurrar texto para fora da área da foto. Preserve legibilidade e acesso ao botão fixo de Free Pass.

Renderize texto em HTML. Não grave frases na foto nem altere características da pessoa. Remova a apresentação duplicada acima/ao lado: o resultado deve ser uma única foto com mensagem sobreposta.

### Animação

Faça a frase entrar suavemente ao aparecer na tela, com fade-in e deslocamento discreto, numa sequência breve próxima de 700 a 1.000 ms. Pode revelar os trechos em sequência sem atrasar a leitura. Execute uma vez; deixe o estado final estável.

Não aplique zoom à foto. Respeite movimento reduzido e garanta conteúdo visível se a animação não inicializar. Não acrescente o novo arco a esta seção: ele é exclusivo do hero.

Preserve integralmente contato, localização e demais dados da parte final do site.

**Concluído quando:** texto e fotografia formam um único bloco, com gradiente suave, pessoa reconhecível, entrada animada e CTA funcional, mantendo a imagem inteira.

## Ajuste 4 — carrossel de estrutura com tipografia mais refinada

Localize as duas fotos abaixo do botão “Quero conhecer a RIP”. Hoje estão pequenas, fixas lado a lado, com frases de traços grossos no topo.

Substitua a grade fixa por um carrossel horizontal arrastável com imagens maiores. Mantenha a ordem:

| Slide | Imagem | Frase exata |
| --- | --- | --- |
| 1 | `imagens/estrutura-vista-geral.jpg` | Estrutura pensada para o seu melhor desempenho. |
| 2 | `imagens/estrutura-escada.jpg` | O espaço ideal para a sua evolução. |

### Navegação e enquadramento

- Privilegie uma imagem principal por vez no celular; uma pequena indicação do próximo slide pode sugerir continuidade. O slide ativo deve exibir sua fotografia integralmente.
- Permita arrastar pelo toque e pelo mouse. Preserve a rolagem vertical e não bloqueie gestos em toda a página.
- Forneça controles discretos de anterior/próximo ou indicadores acessíveis por teclado e com nomes claros. A interação não deve depender somente de gesto.
- Alinhe a parada de rolagem a cada slide, com transição suave. Não usar autoplay ou troca contínua que atrapalhe a leitura.
- Mantenha dimensões consistentes entre slides e limite o overflow horizontal ao componente. Ocultar slides fora do viewport não permite recortar o conteúdo do slide ativo.
- Reutilize recursos existentes do projeto ou uma implementação enxuta de rolagem e arraste. Evite adicionar uma biblioteca pesada apenas para dois slides.

### Tipografia, gradiente e entrada

Troque a fonte das duas frases por uma família mais refinada, de boa legibilidade e peso moderado. Busque presença por desenho, escala, contraste e composição. Não use extra-bold/black para tentar obter impacto. Evite reproduzir a fonte excessivamente pesada ou estreita da versão atual. Uma referência de peso é 500 a 600, ajustada conforme a família real usada.

O texto fica sobre a parte superior da imagem, com gradiente preto/carvão de cima para baixo: mais escuro atrás da frase, transparente abaixo. A transição deve ser contínua, sem aparência de uma caixa escura rígida. Preserve as cores e os detalhes dos equipamentos.

Use frases HTML com quebras naturais e espaçamento interno confortável. Mantenha fade-in suave quando o slide for revelado, sem texto permanentemente oculto ou repetição constante. Respeite movimento reduzido.

Esse refinamento aplica-se às frases do carrossel; não troque automaticamente toda a tipografia do site.

**Concluído quando:** o visitante consegue percorrer as duas fotos por arraste e controles, com imagens completas, frases mais refinadas e gradiente superior, sem rolagem horizontal da página.

## Ajuste 5 — nova abertura no hero com logo e Predictive Arc 2

Remova a implementação ativa de Ribbon Glow de todo o site e substitua seu uso no hero pela referência `animacao/PredictiveArc2-referencia.tsx`.

### Remoção da implementação anterior

Remova instâncias, shaders, componentes, imports, estilos exclusivos, listeners e loops do efeito antigo. Confira usos antes de remover recursos compartilhados. Não mantenha duas renderizações sobrepostas nem componentes antigos escondidos ainda consumindo processamento.

A seção “Venha fazer parte desse time!” mantém foto, título e entrada de texto; perde somente a onda Ribbon Glow. O novo efeito não deve ser aplicado a essa seção nem ao fundo global.

### Aparência e primeira impressão

Coloque a logo verdadeira da RIP grande, nítida e integral em primeiro plano na área inicial do hero. Centralize e dê respiro à composição. Atrás, faça o arco de pequenos quadrados vermelhos se mover, valorizando a marca ao entrar no site.

Preserve as proporções, símbolo e letras da logo. Prefira o asset adequado já existente no projeto, especialmente uma versão com fundo transparente quando disponível. O arquivo `marca/logo-rip-original.jpeg` é uma referência de fidelidade; não precisa substituir uma versão melhor já usada no site.

Verifique se a caixa opaca da logo encobre o arco. Ajuste a composição sem redesenhar ou distorcer a marca. O arco deve aparecer ao redor e ao fundo, sem prejudicar a leitura.

Integre a abertura ao hero da página; não crie um carregador obrigatório ou uma tela que exige aguardar a animação. Preserve o título comercial, oferta, CTAs e a fachada já aprovada, reorganizando o conteúdo abaixo da composição de marca quando necessário. Mantenha menu e rolagem disponíveis desde a entrada.

### Preset vermelho obrigatório

Use a configuração do fonte enviado:

| Parâmetro | Valor |
| --- | --- |
| background | `#000000` |
| baseColor | `#F91700` |
| accentColor | `#AC2B2B` |
| highlight | `#000000` |
| density | 40 |
| dotSize | 100 |
| speed | 50 |
| hover | 100 |
| horizon.rise | 45 |
| horizon.radius | 90 |
| horizon.thickness | 100 |
| horizon.falloff | 250 |

O nome visual é Predictive Arc 2; o export do arquivo se chama PredictiveArcHorizon. Use esse fonte atualizado. Não confunda com a onda Ribbon Glow nem com outros códigos antigos de arco. Ajuste o enquadramento conforme a tela, mantendo o padrão vermelho aprovado. Não iniciar com os defaults azuis da função base.

### Adaptação técnica necessária

O fonte é React/TSX com WebGL 1 e precisa ser integrado à stack do site. Preserve o efeito do shader; adapte a montagem e o ciclo de vida ao projeto.

- Remova `minWidth: 1200` e `minHeight: 800`. Dimensione o canvas pela área real do hero em desktop e mobile, considerando altura útil, orientação e resize.
- Mantenha movimento automático perceptível sem depender de hover. A interação por ponteiro é complementar e deve ser compatível com cliques e rolagem.
- A camada decorativa não deve bloquear interação. Preserve camadas separadas para animação, logo, textos e CTAs.
- O código desenha a cada requestAnimationFrame com DPR máximo 2. Adapte resolução e frequência ao custo medido; comece com orçamento moderado e valide a fluidez. Não prometa ausência absoluta de travamentos.
- Pause quando o hero não estiver visível e quando a aba estiver oculta. Retome sem acumular loops e com tempo de animação coerente.
- Complete a limpeza: além de cancelar o loop e remover eventos, libere programa, shaders e buffer. Trate falhas parciais de inicialização e perda de contexto.
- Com WebGL indisponível ou preferência por movimento reduzido, exiba uma composição estática coerente do arco e a logo. Não deixe o bloco vazio ou a marca invisível. Em mobile compatível, o efeito deve animar normalmente.
- Não adicione botão manual de pausar/despausar. O ajuste 1 também se aplica a esta implementação.

**Concluído quando:** a primeira tela mostra a logo em primeiro plano com o novo arco vermelho em movimento ao fundo; Ribbon Glow foi removida do site e o novo efeito permanece somente no hero.

## Verificação e entrega

Use os comandos pertinentes de build, validação e lint já disponíveis no projeto. Revise visualmente desktop e mobile. Quando houver navegador automatizado, verifique larguras como 360, 390, 768 e 1440 px, sem afirmar teste em aparelho real se só houve emulação.

Confirme:

- [ ] Botão manual de pausa removido, sem área clicável ou foco invisível.
- [ ] Grupo e legenda removidos; História mantém textos e CTA sem espaço vazio.
- [ ] Encerramento apresenta título, apoio e CTA sobre a foto integral, com gradiente e entrada animada.
- [ ] Carrossel permite toque, mouse, teclado e controles; frases têm tipografia refinada e gradiente superior.
- [ ] Fotos exibidas inteiras, incluindo todos os limites da composição original.
- [ ] Logo real grande no hero; novo arco vermelho animado perceptível em desktop e mobile compatíveis.
- [ ] Nenhuma instância ativa de Ribbon Glow ou fundo animado global remanescente.
- [ ] Preferência de movimento reduzido, fallback, pausa automática, retorno à aba e resize funcionam.
- [ ] Nenhum CTA, menu, contato ou conteúdo correto foi perdido.
- [ ] Sem overflow horizontal no documento, sobreposição do botão fixo em conteúdo essencial ou erros de assets.
- [ ] Build e verificações pertinentes concluídos, com as imagens realmente incluídas nos arquivos do projeto.

Verifique vários frames ou um vídeo curto para comprovar o movimento; uma captura isolada não basta. Compare o enquadramento das fotos com seus fontes.

Ao concluir, informe os cinco ajustes implementados, arquivos principais alterados, verificações realmente executadas e limitações restantes. Inclua os novos arquivos necessários nas alterações do repositório para que não dependam de caminhos temporários do anexo. Preserve a forma de hospedagem e os caminhos de assets do projeto.

Este pacote é uma especificação com fontes. A implementação e os testes no site serão realizados no projeto, não estão comprovados pelo simples recebimento do ZIP.
