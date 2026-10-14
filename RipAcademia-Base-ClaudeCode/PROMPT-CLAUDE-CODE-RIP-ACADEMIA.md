# PROMPT DE IMPLEMENTAÇÃO — SITE RIP ACADEMIA

**Destino:** Claude Code, aberto na pasta do projeto.  
**Objetivo:** implementar um site institucional com forte identidade de marca e uma jornada clara para transformar visitantes em contatos interessados.  
**Material de apoio:** pacote `RipAcademia-Base-ClaudeCode`, fotografias tratadas, logo original e referências atualizadas anexadas.  
**Idioma:** português brasileiro.

**Direção de movimento aprovada nesta revisão:** Ribbon Glow, a segunda animação fornecida pelo usuário. Usar uma única instância no fundo do hero, conforme a seção 7.1. O código Predictive Arc Horizon acompanha o pacote como alternativa não selecionada.

---

## 0. Repositório, pacote e verificação inicial

**Repositório:** `THEUSMKT/RIPACADEMIA` (GitHub, público). Ele começa praticamente vazio, apenas com um `README.md` de uma linha. Não há stack nem código a preservar: trate como projeto novo, adote a stack da seção 8 e substitua o README por um README real.

**Pacote:** o pacote `RipAcademia-Base-ClaudeCode` deve estar extraído dentro do repositório. Estrutura esperada a partir da raiz: `marca/`, `imagens-tratadas/`, `referencias-atualizadas/`, `animacoes/`, `LEIA-ME.md`, `CATALOGO.md` e `catalogo.json`. Os originais e as artes antigas também podem estar presentes.

**Passo zero, obrigatório e anterior a qualquer código:**

1. Confira se existem todos os arquivos citados nas seções 5, 7.1 e 9 (logo, fotos escolhidas, `IMG_8516.jpeg`, os dois `.tsx`, `LEIA-ME.md`, `CATALOGO.md`, `catalogo.json`) e mostre uma tabela curta com o resultado de cada um.
2. Se faltar a logo, o catálogo ou as fotos do hero e da fachada, **pare e informe exatamente o que falta**. Não invente substitutos, não use fotos de banco e não recrie a logo.
3. Se faltar algo secundário (por exemplo, uma foto de galeria), escolha outra do catálogo, registre no README e continue.
4. Trate `catalogo.json` como fonte de verdade da lista de fotos. Ele traz 23 assets tratados: 22 fotografias e uma arte antiga de horários (`23-arte-horarios-e-contato.png`, apenas referência histórica). Não fixe contagens nos textos do site.

**Arquivos de origem não são arquivos do site.** Originais, matrizes PNG, artes antigas, referências e os `.tsx` de referência ficam fora de `public/` e de qualquer pasta publicada. Gere as variantes por script ou pelo pipeline de imagens da stack e publique somente o resultado (WebP/AVIF em larguras responsivas), a logo derivada e o favicon. Assim o site não publica as artes antigas com endereço e horário desatualizados nem originais pesados.

---

## 1. Sua responsabilidade

Atue como diretor de criação, designer de interfaces, especialista em conversão e desenvolvedor front-end sênior. Implemente o site completo, funcional e responsivo. Combine direção de arte consistente, fotografias reais, conteúdo útil, velocidade e ações de contato simples.

O resultado deve fazer a RIP Academia parecer organizada, confiável, experiente e bem equipada. A primeira tela precisa comunicar o que a academia oferece, onde fica e qual é o próximo passo. Use a ambição visual deste briefing para criar uma experiência com personalidade; traduza-a em escolhas concretas de composição, tipografia, fotografia e interação.

Execute o trabalho no repositório. Uma resposta com ideias, um wireframe ou somente um plano não conclui esta tarefa. Entregue código executável, arquivos de configuração, instruções de execução e evidências dos testes que conseguir realizar. Não prometa taxa de conversão: construa e instrumente uma jornada que possa ser medida e melhorada.

## 2. Antes de implementar

1. Leia as instruções do repositório, examine a estrutura, as dependências, a hospedagem e o estado atual dos arquivos. Preserve a stack e os recursos úteis se já houver um projeto.
2. Localize `LEIA-ME.md`, `CATALOGO.md`, `catalogo.json` e este prompt. Inspecione a logo e as fotografias que pretende utilizar; não escolha imagens apenas pelo nome do arquivo.
3. Procure o pacote pela pasta ou pelo nome caso tenha sido extraído em outro nível. Use caminhos relativos ao projeto, nunca caminhos absolutos do computador de quem preparou o material.
4. Organize os dados comerciais em um único arquivo de configuração. A ordem de prioridade é: novas instruções do usuário; dados atualizados da seção 3; referências mais recentes; materiais antigos. As artes antigas não podem substituir os dados atualizados.
5. Faça um plano curto de implementação e prossiga. Dados ausentes, como domínio e identificadores de analytics, devem ficar documentados na configuração de desenvolvimento sem impedir a construção da interface.

## 3. Base factual e prioridade das referências

Use a tabela abaixo como fonte de conteúdo inicial. Ela foi transcrita dos anexos do usuário, não de uma consulta independente à empresa.

| Campo | Conteúdo para o projeto | Fonte recebida |
| --- | --- | --- |
| Marca | RIP Academia | Logo `IMG_8515.jpeg` |
| Assinatura da marca | Seja sua melhor versão | Perfil `IMG_8508.jpeg` |
| História | Desde 2000 | Logo original |
| Localização principal | Av. Feitoria, 3740 — Feitoria, São Leopoldo/RS | Perfil e arte atualizada `IMG_8516.jpeg` |
| WhatsApp exibido | (51) 99985-0575 | Artes de contato e horários |
| WhatsApp para link | `5551999850575` | Mesmo número, com código do Brasil e DDD |
| Instagram | `https://www.instagram.com/rip_academia/` | Nome de usuário visível no perfil |
| Segunda a sexta | 5h30 às 22h | Arte de horários atualizada |
| Sábado | 9h às 16h | Arte de horários atualizada |
| Domingo e feriados | Consultar a equipe | A referência atualizada não informa esses períodos |
| Chamada comercial principal | Agendar meu Free Pass | Convite presente na bio do Instagram |
| Benefícios corporativos apresentados | Wellhub e TotalPass | Destaques do perfil e artes recebidas |
| Atividades com evidência no material | Musculação e CrossTraining | Fotografias, legenda da publicação fixada e materiais da academia |

**Atualizações que devem prevalecer:** as artes antigas exibem Rua Otto Daudt, 38, abertura às 6h e sábado até 15h. Esses dados não são a localização nem os horários principais desta versão. Use Av. Feitoria, 3740, abertura às 5h30 e sábado até 16h. Não anuncie duas unidades: os anexos não confirmam que o endereço antigo continua atendendo.

Use “Desde 2000”, que não exige atualização anual, em vez de transformar a quantidade de anos do perfil em um contador automático. O número de seguidores e de publicações não equivale a alunos, resultados ou avaliações. Não use esses números como prova de atendimento.

Wellhub e TotalPass podem aparecer como benefícios aceitos conforme o material recebido, com convite para consultar as condições de acesso. Não invente categorias de plano, horários elegíveis ou procedimentos de check-in. Não chame a academia de representante oficial dessas empresas.

O Free Pass é apresentado pelo perfil, mas duração, restrições e disponibilidade não foram informadas. Use “Agendar meu Free Pass” e “Consulte os horários e as condições com a equipe”. Não prometa sete dias, acesso ilimitado, vagas garantidas ou ausência de qualquer condição.

A imagem de fachada antiga menciona massagem. Esse serviço não entra na oferta principal sem confirmação específica. As fotos com bola e cones também não autorizam anunciar uma escola de futebol, atendimento clínico ou preparação para atletas profissionais.

## 4. Estratégia de conversão

O público inicial são pessoas da Feitoria e de São Leopoldo que querem começar a treinar, voltar à rotina, ganhar força ou melhorar o condicionamento. Inclua quem ainda não conhece aparelhos e quem possui Wellhub ou TotalPass. A comunicação deve combinar energia com acolhimento, sem intimidar iniciantes.

Organize a decisão do visitante nesta sequência:

**Entender a proposta → reconhecer uma estrutura real → encontrar uma atividade ou benefício adequado → esclarecer dúvidas → iniciar contato pelo WhatsApp.**

Defina três intenções de contato e mensagens específicas:

- **Free Pass:** “Olá! Vi o site da RIP Academia e gostaria de agendar meu Free Pass. Como funciona?”
- **Informações e planos:** “Olá! Vi o site da RIP Academia e gostaria de conhecer os planos e as opções de treino.”
- **Benefício corporativo:** “Olá! Vi no site que a RIP Academia aceita [Wellhub/TotalPass]. Gostaria de consultar as condições de acesso com o meu benefício.”

O botão principal deve abrir diretamente a conversa. O usuário pode chegar ao WhatsApp sem preencher cadastro. Não coloque um questionário entre o visitante e todos os CTAs.

Repita o CTA principal em momentos pertinentes: header, hero, bloco do Free Pass e fechamento. Mantenha a mesma intenção e o mesmo destino. No celular, use uma única barra persistente de conversão, sem disputar espaço com outro botão flutuante.

## 5. Direção de arte específica da RIP

### Conceito visual

**Energia, estrutura e história.** A identidade parte do preto da marca, dos aparelhos vermelhos e das linhas de luz da academia. Use uma composição editorial: títulos expressivos, imagens grandes, poucos elementos por bloco, alinhamentos precisos e contraste entre superfícies escuras e uma seção clara de informação.

O símbolo inclinado da logo pode inspirar uma pequena diagonal na moldura de uma foto, uma linha de transição ou um detalhe de botão. Escolha dois ou três usos discretos desse motivo e mantenha consistência. Não preencha a página com formas aleatórias ou simulações de equipamentos.

### Paleta proposta para a interface

Os valores abaixo são uma interpretação para o site, não um manual oficial de marca. Preserve as cores do arquivo da logo.

| Token | Cor | Aplicação |
| --- | --- | --- |
| `--background` | `#09090B` | Fundo principal |
| `--surface` | `#151518` | Superfícies e navegação |
| `--surface-elevated` | `#202024` | Estados e pequenos destaques |
| `--brand-red` | `#F20A16` | Detalhes, grandes títulos e grafismos |
| `--action-red` | `#D90D18` | Botões com texto branco |
| `--action-hover` | `#B90A14` | Hover e ação pressionada |
| `--text` | `#FAFAF7` | Texto sobre fundo escuro |
| `--muted` | `#A6A6AF` | Texto secundário sobre fundo escuro |
| `--light-section` | `#F3F2EF` | Seção clara de localização e horários |
| `--ink` | `#17171A` | Texto na seção clara |

Valide os contrastes nos pares reais de fundo e texto. Use o vermelho mais escuro nos botões; o vermelho de destaque não deve receber automaticamente textos pequenos brancos. As cores oficiais de Wellhub e TotalPass ficam restritas às suas identificações, sem mudar a paleta da RIP.

### Logo

Use `marca/logo-rip-original.jpeg`, cópia fiel de `IMG_8515.jpeg`. A imagem recebida tem símbolo, lettering, “DESDE 2000”, círculo preto e margem externa cinza. Preserve desenho, proporções, grafia e cores. Não recrie a marca com uma fonte parecida nem use um gerador de imagens para substituí-la.

Prepare uma derivação por recorte fiel do arquivo original para reduzir a margem e permitir uma leitura confortável no header. Preserve todo o símbolo e lettering. Se não conseguir um recorte limpo, use o original sobre superfície preta com tamanho suficiente para legibilidade. Registre a necessidade de um arquivo vetorial, sem impedir a entrega.

O favicon pode derivar do símbolo original, com corte preciso; não invente outro ícone. Não utilize o anel colorido do Instagram como parte da marca.

### Tipografia e composição

- Títulos: uma família condensada e robusta, como Barlow Condensed, com boa legibilidade. Corpo: Inter ou outra sans-serif legível e compatível com o projeto. Use no máximo duas famílias e poucos pesos.
- Hospede fontes localmente quando possível e mantenha fallback adequado. Não bloqueie a exibição do conteúdo por causa das fontes.
- H1 com `clamp()`, aproximadamente 64–88 px no desktop e 38–52 px no celular; ajuste pela largura real. Use até três linhas no mobile e duas no desktop quando couber.
- Corpo mínimo de 16 px, entrelinha confortável e parágrafos curtos. Evite longos blocos em caixa alta.
- Container principal até cerca de 1200–1280 px. Margens laterais de 20–24 px no celular. Seções com aproximadamente 80–112 px de respiro no desktop e 48–64 px no mobile, ajustadas ao conteúdo.
- Botões com pelo menos 52 px de altura e área de toque generosa. Raios discretos, bordas finas e sombra moderada. Prefira imagens com cantos levemente arredondados a cápsulas gigantes.
- Evite uma sequência de grades idênticas. Alterne bloco de abertura, fotografia dominante, conteúdo em duas colunas, galeria e painel de informação.

## 6. Página principal: estrutura e conteúdo

Implemente uma landing page institucional completa. A ordem abaixo é intencional; adapte pequenos detalhes ao material disponível sem eliminar a lógica de conversão.

### 6.1 Header

Logo à esquerda; navegação com “Estrutura”, “Modalidades”, “Benefícios” e “Localização”; CTA “Agendar Free Pass” à direita. Header compacto, fixo ou sticky, com mudança sutil de fundo após o início do scroll. Links âncora devem respeitar a altura do header.

No mobile, use logo legível e menu acessível. O menu abre e fecha com teclado, fecha após escolher um link e devolve foco ao acionador quando necessário. Não deixe um menu full-screen ocultar o único caminho de contato.

### 6.2 Hero: proposta, localização e ação

Desktop: composição de aproximadamente 52% texto e 48% imagem. Use fotografia real do ambiente com presença, crop planejado e uma linha vermelha discreta. A foto do corredor central funciona como ponto de partida; avalie a vista geral como alternativa. Aproveite a verticalidade das imagens, sem deformá-las para simular uma foto panorâmica.

Integre **Ribbon Glow** como uma camada decorativa no fundo deste hero. A onda vermelha deve aparecer principalmente na borda inferior e na transição entre o bloco de texto e a fotografia, com zonas escuras estáveis atrás do conteúdo. Preserve a fotografia real em uma camada própria, sem tingir ou esconder os aparelhos. A composição, a intensidade e a hierarquia seguem a seção 7.1; não transforme a primeira tela em uma demonstração de shader.

Copy inicial:

> **RIP ACADEMIA · FEITORIA, SÃO LEOPOLDO**
>
> **SEJA SUA MELHOR VERSÃO.**
>
> Musculação e CrossTraining em uma estrutura que você pode conhecer de perto. Dê o primeiro passo e converse com a equipe sobre o seu Free Pass.

CTA principal: **“Agendar meu Free Pass”**. Secundário discreto: **“Conhecer a estrutura”**, com scroll até a seção correspondente. Microcopy: **“Agendamento pelo WhatsApp. Consulte horários e condições.”**

Use três fatos curtos para apoiar a decisão: “Desde 2000”, “Av. Feitoria, 3740” e “Wellhub e TotalPass”. Apresente esses fatos em uma linha ou faixa compacta, sem contadores fictícios ou estrelas.

No celular, título, explicação e CTA vêm antes da fotografia dominante. O visitante deve encontrar proposta e contato na primeira tela, sem precisar atravessar uma imagem de altura excessiva.

### 6.3 Estrutura real

Título: **“Conheça o espaço onde seu próximo treino acontece.”**

Monte uma composição com duas ou três fotos grandes do interior. Identifique conteúdo visível: salão de musculação, aparelhos, área de treino e vista geral. Inclua uma descrição curta e um CTA contextual “Quero conhecer a RIP”. Não declare metros quadrados, quantidade de máquinas, acessibilidade física ou estacionamento exclusivo sem evidência.

As fotos precisam revelar o ambiente, não desaparecer atrás de um degradê preto. Uma sobreposição localizada pode melhorar leitura quando houver texto sobre a imagem.

### 6.4 Modalidades

Apresente duas ofertas principais com fotografias próprias e explicação objetiva:

| Modalidade | Copy inicial | CTA |
| --- | --- | --- |
| Musculação | “Treine força e construa uma rotina com os aparelhos e a estrutura da RIP.” | “Conhecer a musculação” |
| CrossTraining | “Conheça a proposta de CrossTraining e consulte a equipe sobre turmas e horários.” | “Saber sobre o CrossTraining” |

Use mensagens específicas no WhatsApp para cada modalidade. Não transforme o horário de funcionamento em grade de aulas. Não associe automaticamente as fotos de treino com bola a uma turma de CrossTraining; selecione uma foto compatível ou use uma vista neutra do ambiente.

Depois das modalidades, inclua um pequeno bloco para diferentes momentos do visitante: “Quero começar”, “Quero voltar à rotina” e “Quero evoluir no treino”. Cada opção pode personalizar a mensagem de contato. Não recolha peso, medidas ou informações de saúde.

### 6.5 Free Pass como oferta principal

Crie um bloco destacado com contraste, fotografia de treino ou de acolhimento e explicação de três passos:

1. **Converse com a equipe:** envie uma mensagem pelo WhatsApp.
2. **Consulte as condições e combine um horário:** confirme como funciona o Free Pass.
3. **Conheça a RIP:** visite o espaço no horário combinado.

Título sugerido: **“Seu primeiro passo pode ser conhecer a RIP.”**  
CTA: **“Quero agendar meu Free Pass”**.  
Microcopy: **“A equipe orienta você sobre disponibilidade e condições.”**

Não mostre um calendário que confirme automaticamente uma vaga sem sistema real de agenda. O clique inicia o contato; o agendamento é combinado com a academia.

### 6.6 Wellhub e TotalPass

Título: **“Tem benefício corporativo? Consulte seu acesso à RIP.”**

Mostre Wellhub e TotalPass com leitura clara. Use arquivos oficiais fornecidos ou identificações textuais bem compostas; não recorte as modelos das artes como se fossem alunas ou profissionais da RIP.

Cada benefício terá seu próprio CTA: “Consultar acesso pelo Wellhub” e “Consultar acesso pelo TotalPass”. Microcopy: “Verifique com a equipe os planos e as condições compatíveis com o seu benefício.” Use links para o WhatsApp da academia, sem inventar páginas de credenciamento.

### 6.7 História e presença humana

Título sugerido: **“Uma história que começou em 2000.”**

Combine a informação histórica da logo com uma foto humana real. Copy curta: “A RIP Academia reúne uma história de treino em São Leopoldo e um espaço para você conhecer pessoalmente. Converse com a equipe e encontre uma forma de começar.” Refine a redação sem inventar biografia, premiações, quantidade de alunos ou especializações.

A foto de grupo pode ser apresentada como um registro da academia. Não identifique todas as pessoas como professores. Só crie fichas individuais quando houver nomes e funções informados.

Caso o usuário forneça avaliações autênticas, implemente um componente opcional com texto, autoria, fonte e link. Na ausência delas, mantenha o componente desativado. Não fabrique depoimentos, nota Google, fotos de clientes ou selo “a mais bem avaliada”.

### 6.8 Galeria

Selecione de seis a oito fotos complementares. Evite publicar cinco quadros quase iguais do mesmo treino. Agrupe visualmente ambiente, treino e fachada; preserve o catálogo completo nos arquivos do projeto.

Use grid assimétrico moderado ou composição editorial. Permita ampliar imagens em um lightbox acessível, com botões reais para fechar e navegar. Gestos no celular podem complementar os botões, mas não substituí-los. Não use slideshow automático que esconda a estrutura.

### 6.9 Localização e horários

Use uma seção clara para variar a composição e facilitar a consulta. Mostre a fotografia da fachada, endereço em texto selecionável, horários em uma tabela legível e duas ações: “Como chegar” e “Falar com a academia”.

Conteúdo inicial:

| Período | Funcionamento |
| --- | --- |
| Segunda a sexta | 5h30 às 22h |
| Sábado | 9h às 16h |
| Domingo e feriados | Consulte a equipe |

Endereço: **Av. Feitoria, 3740 — Feitoria, São Leopoldo/RS**. WhatsApp: **(51) 99985-0575**.

O botão de localização deve abrir uma busca ou rota no Google Maps para o endereço informado. Não invente coordenadas ou um marcador aproximado. Se existir URL oficial confirmada da unidade, use-a na configuração. Um mapa incorporado é opcional e deve carregar somente depois de interação ou quando se aproximar da área visível.

Não exiba “Aberto agora” sem regras completas para domingo e feriados. Não transforme horários em uma imagem com texto que o visitante não possa selecionar.

### 6.10 Perguntas frequentes

Use um accordion acessível com respostas curtas:

- **Como agendo meu Free Pass?** “Clique no botão e converse com a equipe pelo WhatsApp para consultar condições e combinar um horário.”
- **Preciso ter experiência para conhecer a academia?** “Você pode entrar em contato mesmo se estiver começando. A equipe explica as opções para o seu primeiro contato com a RIP.”
- **A RIP aceita Wellhub e TotalPass?** “A RIP aceita Wellhub e TotalPass. Consulte com a equipe os planos e as condições de acesso.” A confirmação final do conteúdo comercial deve acompanhar a preparação para produção, sem inserir notas de bastidor nesta resposta pública.
- **Quais são os horários?** Use os horários atuais da tabela, sem duplicar dados manualmente no código.
- **Onde fica?** Use o endereço atual da configuração.
- **Quais são os valores dos planos?** “Converse com a equipe para conhecer os planos disponíveis e suas condições.”
- **Como conheço as turmas de CrossTraining?** “Peça pelo WhatsApp as informações sobre turmas, horários e condições.”

Respostas completas e úteis. Não esconda uma informação já conhecida apenas para forçar contato.

### 6.11 Fechamento e footer

Bloco final com título **“Seu próximo treino começa com uma conversa.”**, foto compatível e CTA principal. Footer com logo, Instagram, contato, endereço, navegação resumida e link para a página de privacidade que descreva o funcionamento real do site.

No celular, a barra persistente pode exibir **“Agendar Free Pass”**, respeitando `env(safe-area-inset-bottom)`. Reserve espaço no layout para que ela não cubra conteúdo, FAQ, footer ou botões. Oculte-a quando houver dialog aberto ou teclado virtual sobre um campo, caso implemente campos.

## 7. Interações e movimento

Use animação para guiar atenção e transmitir cuidado, mantendo a leitura imediata:

- Entrada inicial discreta de título, imagem e CTA, com duração aproximada de 350–600 ms. O conteúdo já deve existir e permanecer acessível se o script falhar.
- Revelação de seções com deslocamento curto, por volta de 12–20 px, e uma única execução por elemento.
- Hover de botão com mudança de cor e ícone, e deslocamento máximo de 1–2 px; equivalente visual no foco de teclado.
- Zoom de fotografia sutil, até aproximadamente 1.025, somente quando houver hover disponível.
- Transição de accordion suave e estado expandido claramente identificado.
- Movimento decorativo pontual associado à linha vermelha ou ao motivo da logo; não anime todos os blocos simultaneamente.

Priorize `transform` e `opacity`, CSS e IntersectionObserver. Respeite `prefers-reduced-motion` e elimine deslocamentos, parallax e scroll suave quando essa preferência estiver ativa. Nenhuma animação pode atrasar um clique no WhatsApp.

Não utilize preloader artificial, intro obrigatória, cursor customizado, scroll sequestrado, flash vermelho ou partículas cobrindo a fotografia. **A única animação WebGL autorizada neste briefing é Ribbon Glow, com uma instância no hero e as adaptações da seção 7.1.** Não acrescente outros efeitos WebGL nem vídeo automático.

### 7.1 Ribbon Glow — integração da onda vermelha

#### Escolha e papel na página

Use como referência `animacoes/RibbonGlow-referencia.tsx`, fornecido pelo usuário. A segunda opção tem uma faixa contínua, luminosa e fluida que combina com as curvas do símbolo da RIP e com a energia visual da academia. O arquivo `animacoes/PredictiveArcHorizon-referencia.tsx` produz um arco de quadrados, com aparência mais digital; preserve-o como alternativa e não o monte nesta versão.

Esta decisão é de direção de arte, baseada nas capturas e na leitura dos códigos. Não constitui um teste de desempenho nem prova de melhora de conversão.

**Aplicação principal:** fundo do hero, a primeira seção com “SEJA SUA MELHOR VERSÃO.” e “Agendar meu Free Pass”. Use uma única instância e limite o canvas aos limites dessa seção. Nas seções de oferta e fechamento, mantenha a continuidade visual com cor e grafismos estáticos; não duplique o renderer.

#### Composição e camadas

1. Hero com fundo estável `#09090B`, altura responsiva definida pelo conteúdo, `position: relative`, `isolation: isolate` e recorte apropriado.
2. Renderer de fundo absoluto, `inset: 0`, na camada inferior, decorativo, sem receber foco e com `pointer-events: none`.
3. Máscara ou sobreposição escura acima do canvas, produzindo uma região escura consistente atrás do título, da explicação e dos botões. Atenue também a faixa sob a fotografia para não alterar sua aparência.
4. Conteúdo e fotografia reais em camada superior, com posição própria e cliques preservados. O título e o CTA não podem depender do canvas para existir.

A onda deve ser perceptível como assinatura da marca na borda inferior e entre texto e foto. Reposicione ou ajuste sua orientação após inspecionar a composição final. Não aplique a intensidade vermelha da demonstração a toda a tela. Use uma opacidade inicial do renderer de aproximadamente **0,20–0,30**, e ajuste pela leitura dos quadros mais claros. A máscara é obrigatória; apenas diminuir a opacidade não garante contraste constante.

Teste inicialmente estes props de aparência, que existem no componente recebido:

```tsx
<RibbonGlow
  background="#09090B"
  color1="#F20A16"
  color2="#8F1018"
  speed={25}
  size={100}
  angle={-180}
  hover={15}
  reach={180}
  style={{
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    pointerEvents: "none",
  }}
/>
```

Esses valores são um ponto de partida, não um resultado visual já testado. A opacidade e a máscara devem ser aplicadas na camada de composição. Não passe `opacity`, `maxDpr`, `fps` ou `layers` como props inexistentes: implemente esses controles explicitamente na adaptação se precisar deles.

Mantenha interação com mouse discreta apenas em dispositivos com ponteiro fino e hover real. Se o canvas não receber eventos, capture o movimento no wrapper externo do hero, sem capturar ou bloquear seus links. No mobile, desative a influência do ponteiro e não instale listeners de mouse desnecessários.

#### Adaptações necessárias no código recebido

O código é referência de efeito, não um componente pronto para copiar sem revisão. Antes de adaptar, abra `animacoes/RibbonGlow-referencia.tsx` e confirme os nomes e valores citados abaixo (`minWidth`, `minHeight`, `MAX_DPR`, `LAYERS`, props e cleanup). Se o código real divergir deste texto, prevalece o código real, e a divergência vai para o README. Adaptações necessárias:

- **Responsividade:** os dois exemplos declaram `minWidth: 1200` e `minHeight: 800`. Remova essas restrições da implementação de produção. Use `min-width: 0`, `min-height: 0` e dimensionamento pelo hero real. O conteúdo deve determinar a altura; o canvas não pode criar uma tela extra de 800 px ou scroll horizontal no celular.
- **Visibilidade:** o Ribbon Glow recebido usa um loop contínuo de `requestAnimationFrame`. Suspenda o desenho quando o hero sair da área visível e quando a aba estiver oculta. Use observação da seção e mudanças de visibilidade. Ao retomar, resete a referência de tempo e garanta somente um loop ativo.
- **Movimento reduzido:** detecte `prefers-reduced-motion` antes de iniciar o loop e responda a alterações dessa preferência. Use um fundo estático equivalente quando houver preferência por menos movimento. `speed={0}` sozinho não resolve: no código original, ele para o relógio da animação, mas o loop de desenho continua.
- **Controle do visitante:** ofereça uma ação discreta e acessível “Pausar movimento”, sem competir com o CTA principal. Ao pausar, suspenda o loop; a ação de retomar deve continuar sem criar um segundo renderer.
- **Qualidade adaptável:** o original usa `MAX_DPR = 2`, duas etapas de desenho e `LAYERS = 84` no shader de campo; esse campo já é calculado em uma textura com metade da largura e da altura. Preserve essa redução e avalie um limite inicial de DPR em torno de 1,25 no desktop e 1 no mobile. Avalie limitar a decoração a 30 quadros por segundo. Reduzir velocidade não reduz, por si, a quantidade de desenhos por segundo.
- **Camadas do shader:** se a medição indicar custo alto, compare uma versão com cerca de 40–48 camadas no desktop à original de 84. As camadas são uma constante do shader, não um prop existente. Ajuste conscientemente a geração do shader e revise a imagem, pois mudar a quantidade pode alterar a forma e o brilho. Não prometa equivalência visual sem conferir.
- **Mobile:** a primeira versão mobile deve usar fallback estático bem composto. Ative a animação mobile somente depois de medir e conferir fluidez e consumo em um dispositivo real. O título, a foto e o contato são entregues em ambos os casos.
- **Inicialização:** primeiro entregue conteúdo, CTA e imagem principal. Carregue o renderer separado e inicialize quando os recursos principais já estiverem disponíveis, sem travar a primeira renderização. Carregue apenas o componente selecionado; não importe a alternativa para o bundle público.
- **Fallback:** se não houver WebGL2, ocorrer erro de compilação, framebuffer inválido ou perda de contexto, mostre o fundo estático. Uma composição com gradientes escuros e vermelhos pode manter o caráter visual, sem prometer reproduzir exatamente o shader. Não mostre erro técnico para o visitante.
- **Ciclo de vida:** desconecte observers e listeners, cancele frames e libere programas, texturas, framebuffer e vertex array ao desmontar. Revise também os caminhos de falha parcial de inicialização. O cleanup normal do Ribbon Glow já libera vários desses objetos; preserve-o e complete a adaptação.
- **Redimensionamento:** trate dimensões quando o container mudar, preferencialmente por observação de tamanho, evitando recalcular o layout inteiro a cada frame.

A estimativa de maior custo do Ribbon Glow em relação ao Predictive Arc vem da estrutura dos shaders: o primeiro componente possui um desenho simples, enquanto o Ribbon Glow combina um campo com 84 iterações e uma etapa final. Essa leitura sugere maior trabalho gráfico, mas não permite afirmar uma taxa de quadros ou duração de bateria. Meça o resultado integrado.

Fontes técnicas para estas adaptações: [WebGL — boas práticas](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices), [movimento reduzido](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) e [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). Os limites de DPR, FPS, opacidade e camadas propostos acima são orçamentos deste projeto, a validar na implementação.

#### Integração com a stack

Se o projeto já usa React, adapte o TSX como um componente isolado. Se usa Astro sem React, prefira extrair o renderer para um módulo TypeScript nativo, preservando os shaders e o movimento; se mantiver React, utilize uma ilha exclusiva para essa decoração. Não transforme toda a página estática em uma aplicação React por causa do fundo. Nenhum acesso a `window`, `document` ou canvas deve ocorrer durante a renderização no servidor.

#### Critérios de aceite específicos

- Não existe overflow horizontal em 360 e 390 px nem dimensões mínimas de desktop impondo a altura do hero.
- Título, explicação e CTA mantêm contraste no quadro mais claro da animação e permanecem clicáveis.
- A fotografia mantém cor e leitura, e a onda não cobre logo, rosto ou equipamento relevante.
- O loop realmente para fora da área visível, com aba oculta ou movimento reduzido.
- Sem suporte WebGL2, o site mantém composição, conteúdo e contato completos.
- Compare a página com animação habilitada e desabilitada no mesmo dispositivo e condições. Confira a primeira renderização, carregamento da foto, resposta dos botões e estabilidade; se houver degradação relevante, reduza qualidade ou mantenha o fallback.
- Registre as adaptações e os testes realizados. Não descreva a animação como otimizada apenas porque ela está se movendo na sua tela.

## 8. Implementação e organização

### Stack

Se já houver projeto, aproveite a stack e evite uma reescrita desnecessária. Se a pasta estiver vazia, a opção inicial é **Astro com TypeScript, geração estática e CSS organizado por componentes**. Use a versão estável disponível e consulte sua documentação; não fixe uma versão antiga por memória. Interações pequenas podem usar scripts nativos. Para Ribbon Glow, siga a integração isolada da seção 7.1. Não instale React ou uma biblioteca de animação apenas para abrir menu e accordion.

O site deve funcionar em hospedagem estática. Caso o projeto use GitHub Pages, configure `site`, `base` e os caminhos de imagens conforme a URL real do repositório; valide a prévia também sob esse prefixo. Se houver domínio próprio, adapte a configuração ao domínio confirmado. Referência técnica: [Astro — GitHub Pages](https://docs.astro.build/en/guides/deploy/github/).

**Hospedagem prevista:** GitHub Pages deste repositório, salvo nova instrução do usuário. Sem domínio próprio, o endereço é `https://theusmkt.github.io/RIPACADEMIA/`; use `site: 'https://theusmkt.github.io'` e `base: '/RIPACADEMIA'`, com as maiúsculas do nome do repositório. Defina esses valores em um único ponto, sobrescrevíveis por variável de ambiente para o dia em que houver domínio. Links internos, imagens, CSS, JS, favicon, sitemap e imagem Open Graph devem respeitar o `base`. Crie `.github/workflows/deploy.yml` com a ação oficial do Astro para GitHub Pages. No README, documente o passo manual que o código não faz: em *Settings → Pages*, definir *Source: GitHub Actions*.

### Estrutura sugerida

Adapte nomes e extensão à stack existente, preservando responsabilidades claras:

```text
src/
  pages/
    index
    privacidade
    404
  components/
    Header
    Hero
    HeroWaveBackground
    StructureSection
    ModalitiesSection
    FreePassSection
    BenefitsSection
    HistorySection
    Gallery
    LocationSection
    FAQ
    FinalCTA
    MobileConversionBar
    ConsentBanner
    Footer
  data/
    business
    gallery
    faq
  styles/
    tokens
    global
  lib/
    whatsapp
    analytics
public/
  assets/
    brand/
    images/
```

Centralize nome, endereço, horários, telefone, Instagram, mensagens, domínio e flags de conteúdo. Conteúdo não deve exigir alterar dez componentes para corrigir um horário. Componentes podem gerar headings, cards e CTAs a partir desses dados.

Use controles nativos e HTML semântico. Conteúdo principal, navegação e links de contato devem funcionar sem depender da hidratação de uma aplicação inteira. Não exponha campos de configuração, comentários técnicos ou textos “em desenvolvimento” na experiência do visitante.

### WhatsApp

Crie uma função central para montar a URL com `https://wa.me/5551999850575` e a mensagem em `text`, codificada corretamente. O número não recebe espaços, parênteses nem “+” na URL. Cada CTA deve possuir `href` real, inclusive antes do JavaScript executar.

Use intenções e posições previsíveis, como `free_pass`, `plans`, `musculacao`, `cross_training`, `wellhub` e `totalpass`. Informe na mensagem a intenção escolhida; não copie os códigos técnicos de posição para a conversa.

Se abrir nova aba, use as proteções adequadas e indique a ação de forma compreensível. Ofereça o telefone visível como alternativa. O site não deve enviar uma mensagem sozinho nem afirmar que uma conversa foi iniciada apenas porque abriu o WhatsApp.

### Formulário

Nesta primeira versão, WhatsApp direto é o fluxo principal. Não adicione um formulário de cadastro sem necessidade. Se houver um backend real já disponível e solicitado, um formulário adicional pode usar nome, WhatsApp e objetivo de treino, com validação e confirmação somente após sucesso real do endpoint.

Sem backend, uma seleção de interesse pode apenas montar a mensagem do WhatsApp e deve ser descrita como tal. Não finja salvar dados nem mostre “cadastro enviado com sucesso” após um simples clique externo.

## 9. Uso das fotos e assets

Use as 22 fotografias tratadas como base visual. A arte antiga de horários é referência histórica de design; não deve aparecer como informação atual da unidade. As novas capturas de Instagram são referências de conteúdo e marca, não elementos para inserir com barras e ícones na página.

| Aplicação | Asset inicial recomendado |
| --- | --- |
| Hero | `imagens-tratadas/ambiente/04-corredor-central.png` |
| Estrutura principal | `imagens-tratadas/ambiente/03-visao-geral-entrada.png` |
| Vista complementar | `imagens-tratadas/ambiente/05-escada-e-aparelhos.png` |
| Localização | `imagens-tratadas/fachada/01-fachada-vista-da-rua.png` |
| Contexto externo | `imagens-tratadas/fachada/02-fachada-vista-aerea.png` |
| Musculação | `imagens-tratadas/treinos/09-aluno-no-aparelho-vermelho.png` ou `11-aparelho-inclinado-pegada.png` na mesma pasta |
| Acompanhamento visual | `imagens-tratadas/treinos/07-acompanhamento-no-aparelho.png` |
| Presença humana | `imagens-tratadas/equipe/06-foto-de-grupo.png` |
| Acolhimento | `imagens-tratadas/conexao/22-aperto-de-maos.png` |
| Logo | `marca/logo-rip-original.jpeg` |
| Fonte de horários atuais | `referencias-atualizadas/IMG_8516.jpeg` |

Gere variantes WebP ou AVIF e larguras responsivas a partir das matrizes. Inclua `width`, `height`, `srcset` e `sizes` quando aplicáveis. Carregue a imagem principal com prioridade; imagens abaixo da dobra podem usar lazy loading. A logo não deve receber lazy loading.

Preserve o enquadramento e registre `object-position` para cada foto selecionada. Não corte cabeça, mãos ou aparelho de forma confusa. Não repita a mesma imagem em hero, estrutura e fechamento. Evite fotos de banco ou modelos das artes de benefícios como substitutos do espaço real.

Os tratamentos anteriores envolveram reconstrução por IA. Confira detalhes relevantes no original quando uma imagem for usada para provar uma característica do espaço ou identificar uma pessoa. A data de fundação vem da logo original, não de uma camiseta reconstruída.

**Resolução e enquadramento:** as fotografias tratadas são verticais e têm de 853 a 1135 px de largura. Não as use como fundo de largura total no desktop nem as amplie além de cerca de 1,3 vez o tamanho natural; prefira molduras verticais, composições de duas ou três colunas e lightbox limitado ao tamanho natural. Em `04-corredor-central.png` e `03-visao-geral-entrada.png`, o conteúdo relevante fica na metade superior e a inferior é piso: planeje o recorte e o `object-position` para o alto da imagem. Em `01-fachada-vista-da-rua.png`, uma placa à direita tem texto parcialmente legível (possivelmente um valor) e a placa de um carro aparece cortada no canto inferior esquerdo; recorte ou desfoque essas áreas nas variantes publicadas e mantenha a matriz intacta.

As fotos mostram pessoas e parte delas foi reconstruída por IA. Registre no README, como pendência de produção, que a academia deve aprovar as fotos tratadas e confirmar a autorização de uso de imagem de quem aparece. Nos textos do site, não escreva que as fotos são “sem edição”, “originais” ou “sem filtro”.

## 10. Desempenho e acessibilidade

Trabalhe para LCP até 2,5 s, INP até 200 ms e CLS até 0,1 no percentil 75 de visitas reais, avaliando mobile e desktop separadamente. Um teste de laboratório não comprova os resultados de campo; documente ambos de forma correta. Referência: [Core Web Vitals](https://web.dev/articles/vitals).

Defina como orçamento inicial de projeto, a ajustar após medição: imagem principal até aproximadamente 300 KB; fotos de galeria normalmente até 120–180 KB por variante exibida; JavaScript próprio comprimido preferencialmente abaixo de 100 KB. Preserve a qualidade quando uma meta de tamanho causar degradação visível. Os PNGs originais podem permanecer como matrizes, sem serem todos baixados pelo visitante.

Evite carregar mapa, feed social e trackers antes de serem necessários. Um link de Instagram e fotos locais são preferíveis a um feed externo que atrase a página. Fixe dimensões de imagens e fontes para reduzir mudanças no layout.

Use WCAG 2.2 AA como referência de implementação: contraste mínimo de 4,5:1 para texto comum e 3:1 para texto grande, foco visível, navegação por teclado, rótulos claros e conteúdo que se reorganize com zoom. Verifique os pares de cor. Referência: [WCAG 2.2](https://www.w3.org/TR/WCAG22/). A meta de área de toque deste projeto é 48 × 48 px nos controles principais.

Lightbox e outros modais devem mover foco para dentro, manter a navegação no dialog enquanto ele estiver aberto, fechar com Escape e devolver foco ao acionador. Não deixe o conteúdo de fundo interativo durante um modal. Referência: [WAI — Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

Textos alternativos devem descrever as imagens sem inventar identidade ou qualificações. Use `lang="pt-BR"`, um H1, sequência coerente de headings e link de pular para o conteúdo. Informação importante não pode existir apenas em cor, hover ou animação.

## 11. SEO e presença local

Título inicial: **“RIP Academia na Feitoria | Musculação e CrossTraining em São Leopoldo”**.

Descrição inicial: **“Conheça a RIP Academia na Feitoria, São Leopoldo. Veja a estrutura, os horários, Wellhub e TotalPass e converse com a equipe sobre o Free Pass.”**

Inclua metadados de compartilhamento, favicon e uma imagem Open Graph com marca e fotografia real, sem ofertas fictícias. Ajuste o recorte para compartilhamento mantendo boa legibilidade.

Mantenha nome, endereço e telefone consistentes no corpo da página, footer e dados estruturados. Crie JSON-LD `ExerciseGym` com dados compatíveis com o conteúdo visível, horários atuais, telefone e Instagram. Use URL, imagem e domínio definitivos somente quando configurados. Não invente coordenadas, CEP, `priceRange` ou `aggregateRating`. Referência: [Schema.org — ExerciseGym](https://schema.org/ExerciseGym).

Sitemap, robots e canonical devem acompanhar o domínio de produção real. Em prévia sem domínio confirmado, registre essa pendência na documentação e evite canonical fictício. Não espalhe palavras-chave em cada frase e não prometa posição no Google.

## 12. Mensuração para tráfego pago

Centralize o disparo de eventos em uma função que possa operar em modo de depuração sem identificadores reais. Crie configuração para GA4/GTM e para Meta Pixel; o usuário é gestor de tráfego pago e precisa ativar ambos apenas informando os IDs. Os dois ficam desligados enquanto não houver ID. Não inclua IDs inventados nem chaves privadas no front-end. Respeite a escolha de consentimento para analytics e marketing e descreva na página de privacidade o que estiver efetivamente ativado.

**Consentimento:** se algum rastreador estiver configurado, exiba um aviso simples com “Aceitar” e “Recusar” de mesmo destaque; GA4, GTM e Pixel não carregam antes da escolha. Sem nenhum ID configurado, não exiba aviso algum. Posicione o aviso para que ele não cubra o CTA do hero nem a barra persistente do mobile; quando os dois coexistirem, reserve espaço no layout.

| Evento do projeto | Momento | Parâmetros sem dados pessoais |
| --- | --- | --- |
| `whatsapp_click` | Clique real em link de WhatsApp | `cta_id`, `placement`, `intent` |
| `free_pass_click` | Clique em CTA do Free Pass | `cta_id`, `placement` |
| `benefit_contact_click` | Clique para consultar benefício | `benefit`, `placement` |
| `directions_click` | Clique em Como chegar | `placement` |
| `gallery_open` | Abertura de uma fotografia | `image_id` |
| `faq_open` | Expansão de uma pergunta | `question_id` |

Os eventos acima são convenções deste projeto. Não registre nome, telefone ou mensagem do visitante nos parâmetros. Se captar UTMs, use uma lista restrita de campos de campanha e valores de origem; não copie indiscriminadamente a query string ou identificadores de publicidade para a mensagem do WhatsApp.

**Meta Pixel:** mapeie `whatsapp_click`, `free_pass_click` e `benefit_contact_click` para o evento padrão `Contact`, e `directions_click` para `FindLocation`. Não use `Lead`, `Schedule` nem `Purchase` sem uma confirmação real que os sustente.

Um clique em WhatsApp é intenção de contato, não prova de mensagem enviada ou lead confirmado. Use `generate_lead` quando houver captação verificável, por exemplo sucesso real de formulário integrado. Evite disparar esse evento em todo botão por conveniência. Referência: [GA4 — generate_lead](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#generate_lead).

Documente como ativar os IDs, validar eventos e distinguir clique, contato, visita agendada e matrícula. Acompanhar essas etapas posteriores exige processo comercial ou integração real; não simule essa integração no site.

## 13. Critérios de qualidade e validação

Antes de entregar, execute os comandos disponíveis de build, lint e verificação de tipos. Corrija os problemas de sua implementação. Use teste de navegador quando houver ferramenta disponível e valide o build de produção, não apenas o servidor de desenvolvimento.

Verifique objetivamente:

1. Layout em 360, 390, 768, 1024 e 1440 px; nenhum scroll horizontal involuntário, texto cortado ou CTA encoberto.
2. Header, âncoras, menu mobile, accordion, lightbox e barra persistente funcionando com teclado e toque.
3. Todos os CTAs de WhatsApp apontando para o número correto, com a intenção adequada e mensagem codificada; teste os destinos sem enviar mensagens reais.
4. Endereço e horários atuais consistentes em toda a interface, na configuração e no JSON-LD. Busca pela ocorrência de Rua Otto Daudt e horários antigos não deve encontrar esses dados no site público.
5. Logo fiel, imagens corretas, recortes ajustados e texto legível sobre fotos. Nenhuma captura de Instagram publicada como bloco principal da interface.
6. Conteúdo, navegação e contato ainda utilizáveis sem animações e, quando possível, sem JavaScript.
7. Console sem erros da implementação; sem imagens quebradas, `href="#"` usado como ação falsa ou formulários de sucesso simulado.
8. Preferência de movimento reduzido, foco visível, contraste, zoom e leitura por tecnologias assistivas verificados na medida das ferramentas disponíveis.
9. Eventos disparados uma vez por ação, sem dados pessoais e sem falsos leads. A página funciona mesmo com analytics desativado.
10. Resultado visual conferido por screenshots de desktop e mobile, quando a ferramenta de navegador estiver disponível. Ajuste o layout depois da inspeção; não declare inspeção que não realizou.
11. Ribbon Glow adaptado e validado conforme a seção 7.1, com uma única instância, fallback estático mobile, contraste constante, frames suspensos quando necessário e contato funcional sem renderer.
12. Build de produção servido sob o `base` do GitHub Pages (`/RIPACADEMIA/`, por exemplo com `astro preview`): imagens, CSS, JS, favicon, âncoras e links internos carregam, sem 404 no console.
13. A pasta publicada (`dist/`) não contém originais, artes antigas, `IMG_*.jpeg` de referência nem os `.tsx` de referência.

Se uma validação depender de credenciais, domínio ou configuração externa ainda ausente, mantenha o restante completo e registre a dependência no README de desenvolvimento. Nada disso deve aparecer como um aviso técnico para o visitante.

## 14. Entregáveis

- Site implementado e executável, com componentes, conteúdo e assets locais organizados.
- Configuração central de dados comerciais, URLs, horários e integrações.
- Imagens otimizadas para exibição e matrizes preservadas.
- README com execução, build, hospedagem, atualização de conteúdo e ativação de mensuração.
- Lista de pendências de produção no README: domínio, IDs de GA4/GTM e Pixel, confirmação comercial de Wellhub, TotalPass e Free Pass, horário de domingo e feriados, logo em vetor, aprovação das fotos tratadas, autorização de uso de imagem e o ajuste manual de *Settings → Pages*.
- Histórico em commits pequenos por etapa (estrutura, hero, seções, SEO e mensuração, testes), com mensagens claras em português, e `.gitignore` com `node_modules`, `dist`, `.astro` e `.env*`. Sem push forçado e sem apagar arquivos do pacote.
- Resumo curto do que foi implementado, dos testes realmente realizados e das pendências específicas para produção.
- Evidências de inspeção visual, quando disponíveis.
- Renderer Ribbon Glow integrado ou adaptado, fundo estático equivalente e documentação dos testes com a decoração habilitada e desabilitada.

**Definição de concluído:** o visitante identifica a RIP Academia, entende a proposta, reconhece a estrutura real, encontra endereço e horários atuais e consegue iniciar o contato certo em poucos toques. A interface transmite o cuidado da marca por meio de composição, conteúdo e execução. Não interrompa o trabalho depois de montar somente o hero.

---

### Referências técnicas para consultar durante a implementação

As metas e os padrões citados foram conferidos em fontes primárias em 14/10/2026 UTC. Consulte a documentação da versão adotada ao implementar.

- [Astro e GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [Core Web Vitals](https://web.dev/articles/vitals)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI — Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Schema.org — ExerciseGym](https://schema.org/ExerciseGym)
- [GA4 — eventos recomendados](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#generate_lead)
