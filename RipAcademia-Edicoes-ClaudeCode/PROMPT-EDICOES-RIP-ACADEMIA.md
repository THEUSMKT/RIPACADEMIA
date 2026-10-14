# RIP Academia — prompt completo para aplicar as edições

Leia este arquivo inteiro e examine as oito imagens da pasta `imagens/` antes de editar o projeto. O código completo da onda vermelha está em `animacao/RibbonGlow-referencia.tsx`. Este pacote contém os assets reais necessários às substituições. Não depende do prompt original ou do histórico de outra conversa.

## Missão

Atue como desenvolvedor frontend sênior, designer de interfaces e especialista em páginas de conversão. Aplique os sete ajustes abaixo ao site existente da RIP Academia, com acabamento profissional e consistência entre desktop e mobile. Entregue a implementação no projeto, com validação do comportamento e do resultado visual.

Inspecione a estrutura, os componentes, o CSS, as imagens e os comandos disponíveis no repositório. Preserve a stack e a forma de hospedagem existentes. Localize cada bloco pelos títulos, textos e função descritos neste documento, não apenas pela ordem dos elementos no código. Não recrie o site inteiro nem mude de framework para fazer essas edições. Preserve a logo, os dados corretos, os destinos de contato e as funcionalidades das seções que permanecem.

Este documento é a especificação atual das edições. Ele substitui instruções anteriores que permitiam recortar fotos, usar fundo estático como padrão no celular, manter legendas descritivas sob o par de fotos ou limitar Ribbon Glow a uma única seção. O usuário quer a onda no hero e na seção de convite, fotos inteiras e os novos textos aqui definidos.

## Marca e dados fornecidos

- Nome: RIP Academia. Logo existente: RIPACADEMIA, desde 2000.
- Identidade: preto, vermelho intenso e branco; acabamento sóbrio e tipografia forte. Reutilize os tokens do projeto, ajustando apenas o que for necessário para contraste e consistência.
- Referência de cores para a onda: fundo `#09090B`, vermelho `#F20A16` e vermelho profundo `#8F1018`. São referências de implementação, não uma alegação de valores oficiais extraídos da logo.
- Endereço atual: Av. Feitoria, 3740 — Feitoria, São Leopoldo/RS.
- WhatsApp e telefone: (51) 99985-0575. Número para link: `5551999850575`.
- Instagram: `https://www.instagram.com/rip_academia/`.
- Horários fornecidos: segunda a sexta, 05h30 às 22h; sábado, 09h às 16h. Não inventar funcionamento aos domingos ou feriados.
- Oferta de contato: agendamento de Free Pass. Preservar orientação para consultar horários e condições; não inventar duração, gratuidade irrestrita, planos ou garantia de resultados.
- Benefícios informados: Wellhub e TotalPass; condições devem ser consultadas com a academia.

## Assets: correspondência obrigatória

As imagens foram aprovadas pelo usuário. Use os arquivos deste pacote, preservando a aparência e a composição. A única correção de conteúdo necessária nas artes de benefícios é o endereço antigo, descrita no ajuste 5.

| Arquivo no pacote | Aplicação |
| --- | --- |
| `imagens/01-fachada-rip.jpg` | Ajuste 2: fachada na segunda seção, no lugar da foto interna |
| `imagens/02-estrutura-vista-geral.jpg` | Ajuste 3: foto esquerda do par, vista do salão em direção à entrada |
| `imagens/03-estrutura-escada.jpg` | Ajuste 3: foto direita do par, escada e aparelhos |
| `imagens/04-crosstraining.jpg` | Ajuste 4: imagem completa de CrossTraining |
| `imagens/05-wellhub-fonte.jpg` | Ajuste 5: arte Wellhub; corrigir endereço antes do uso público |
| `imagens/06-totalpass-fonte.jpg` | Ajuste 5: arte TotalPass; corrigir endereço antes do uso público |
| `imagens/07-convite-time.jpg` | Ajuste 6: foto dos punhos se cumprimentando, no lugar da galeria |
| `imagens/08-encerramento-primeiro-passo.jpg` | Ajuste 7: foto da pessoa treinando no espaço final que hoje repete a fachada |

`MAPA-DAS-IMAGENS.md` e `mapa-das-imagens.json` registram os nomes originais, dimensões e correspondências. As fotos desta pasta são cópias dos arquivos fornecidos; não estão editadas nem recortadas pelo empacotamento.

## Regra global: nenhuma imagem pode ser cortada

Esta é uma exigência obrigatória em todo o site, inclusive em imagens existentes que não serão substituídas. Toda fotografia e arte deve aparecer inteira, com sua proporção e composição original, em celular e computador. A logo também deve preservar todos os elementos.

“Tamanho original” significa enquadramento completo e proporção original, não exibir o arquivo obrigatoriamente em sua resolução nativa em pixels. Redimensione proporcionalmente para caber na tela. Adapte o layout às imagens.

1. Prefira imagens com largura responsiva, `max-width: 100%` e `height: auto`, reservando espaço com dimensões intrínsecas corretas.
2. Quando o design exigir caixas iguais, use `object-fit: contain` e fundo discreto da marca. Aceite espaço livre em vez de cortar ou esticar.
3. Remova `object-fit: cover`, `background-size: cover`, zoom de preenchimento, escala que ultrapasse a caixa, alturas restritivas e qualquer máscara que elimine conteúdo das fotografias.
4. Remova também cortes diagonais dos cantos, `clip-path` e bordas que suprimam partes da foto. Se quiser um acabamento decorativo, coloque-o fora da área da imagem, preservando os quatro limites originais.
5. Não recorte arquivos para gerar variantes de `srcset`. Otimização pode alterar formato, compressão e resolução, mantendo sempre toda a composição.
6. A foto pode ser mais alta que a tela; o usuário pode rolar para vê-la. Isso é diferente de cortar o conteúdo dentro do componente.
7. Compare todas as bordas da imagem exibida com o arquivo fonte na validação. Não basta mostrar apenas a pessoa ou o elemento principal.

Os títulos sobrepostos pedidos no ajuste 3 continuam permitidos. Posicione-os com discrição no topo, sem alterar o arquivo ou esconder desnecessariamente a estrutura.

## Ajuste 1 — restaurar a onda vermelha no hero

O topo mobile atualmente aparece com fundo preto sem a onda vermelha desejada. Restaure o efeito Ribbon Glow fornecido em `animacao/RibbonGlow-referencia.tsx`, com movimento real e visualmente perceptível no hero, em desktop e mobile. Não trocar pelo efeito de arco pixelado Predictive Arc Horizon.

Investigue a causa no projeto: componente ausente, regras CSS mobile, tamanho do canvas, camadas opacas, z-index, opacidade, erros de WebGL, lifecycle ou resize. A ausência observada não comprova uma causa específica. Corrija o problema efetivo, sem declarar uma hipótese como diagnóstico confirmado.

A onda deve permanecer atrás de logo, textos, CTAs e fotos, visível nos espaços de fundo. Use o mínimo de máscara necessário para legibilidade. Não esconda o efeito inteiro sob uma superfície preta. A camada decorativa deve ter `pointer-events: none` e não bloquear cliques.

### Integração do código fornecido

- O arquivo é uma referência React/TSX com WebGL2. Adapte à stack encontrada. Em um projeto estático, integre o shader e a renderização ao JavaScript existente sem introduzir React apenas para esse efeito.
- O código original contém `minWidth: 1200` e `minHeight: 800`: remova essas restrições na versão integrada. O canvas deve acompanhar a seção e funcionar em telas pequenas.
- A referência contém 84 camadas e DPR máximo 2. Ajuste orçamento de renderização conforme o dispositivo, medindo o resultado. DPR mais baixo e menos camadas são opções de otimização, não motivos para eliminar a onda no mobile.
- Inicie com movimento contínuo suave, velocidade positiva e cores da marca. Confira a assinatura real dos props antes de configurar o componente.
- Pause a renderização quando a seção estiver fora da área visível ou a aba estiver oculta. Retome corretamente ao retornar. Evite múltiplos loops acumulados e libere recursos no desmontar ou na falha parcial de inicialização.
- Respeite `prefers-reduced-motion` com composição estática vermelha visível. Use fallback estático também quando WebGL2 estiver realmente indisponível. Ser celular, isoladamente, não autoriza fundo estático.
- Não simule a correção com uma mancha vermelha imóvel em dispositivos que devem animar. Verifique a mudança visual ao longo de vários frames.

O mesmo efeito também será usado no ajuste 6. Reutilize uma implementação comum, gerenciando visibilidade e recursos para as duas seções.

## Ajuste 2 — fachada na segunda seção

Localize a imagem interna sob as informações “Desde 2000”, “Av. Feitoria, 3740” e “Wellhub e TotalPass”, cuja legenda atual é “Salão de musculação da RIP, na Av. Feitoria”.

Substitua por `imagens/01-fachada-rip.jpg`. Exiba a fotografia completa, incluindo céu, placa, entrada e limites do arquivo, sem distorção ou recorte. Ajuste a altura do bloco à proporção vertical.

Atualize a legenda para “Fachada da RIP Academia, na Av. Feitoria, 3740.” e o texto alternativo para descrever a fachada com placa e entrada de vidro. A fachada permanece neste trecho inicial; sua repetição no final será removida no ajuste 7.

## Ajuste 3 — par de fotos iguais com frases sobrepostas e fade-in

Localize o par de fotos abaixo do botão “Quero conhecer a RIP”, hoje acompanhado das legendas “Vista geral do salão, em direção à entrada” e “Escada, aparelhos e área de treino”.

- Foto esquerda: `imagens/02-estrutura-vista-geral.jpg`.
- Foto direita: `imagens/03-estrutura-escada.jpg`.
- As duas devem ter igual largura e altura visual, alinhadas nas bordas superior e inferior, lado a lado também no mobile mostrado pelo usuário. Elimine o deslocamento vertical existente.
- Preserve as fotos inteiras. Se as proporções divergirem, encaixe integralmente em contêineres iguais. Não force o preenchimento com corte.
- Mantenha o tratamento mais escuro aprovado, sem aplicar escurecimento adicional que apague detalhes.

Remova as legendas visíveis abaixo e coloque, dentro da área superior de cada foto, textos HTML com estas frases:

| Foto | Frase exata |
| --- | --- |
| Esquerda | Estrutura pensada para o seu melhor desempenho. |
| Direita | O espaço ideal para a sua evolução. |

Use a mesma hierarquia, alinhamento e espaçamento interno nos dois cards. Garanta contraste com um gradiente localizado no topo, se necessário. As palavras devem caber em quebras naturais, sem abreviação, reticências ou fonte ilegível no celular. Dimensione a área de texto sem deslocar um card em relação ao outro.

As frases entram com fade-in suave de aproximadamente 600 a 800 ms ao aparecerem na tela, com atraso discreto entre elas. Um pequeno deslocamento vertical é permitido. Dispare uma vez, sem loop ou dependência de hover. Preserve o conteúdo visível quando movimento reduzido estiver ativo ou quando a animação não inicializar. Atualize os textos alternativos das fotos.

## Ajuste 4 — CrossTraining inteiro e revisão global dos cortes

Localize a imagem imediatamente acima do título “CROSSTRAINING”, perto do botão “Conhecer a musculação”. Atualmente a parte inferior da fotografia está cortada, ocultando as pessoas e o exercício.

Substitua por `imagens/04-crosstraining.jpg`. Exiba exatamente a composição completa fornecida, preservando pessoas, rostos, exercício, ambiente e tratamento aprovado. Adapte o card à proporção vertical da imagem, mantendo o título e os conteúdos da modalidade.

Além desta substituição, revise TODOS os usos de imagens do site conforme a regra global. A exigência vale para desktop e mobile, fotos e artes, imagens novas e as que permanecerão no projeto. Elimine cortes por CSS e por variantes de arquivos previamente geradas. Não basta corrigir apenas CrossTraining.

## Ajuste 5 — artes Wellhub e TotalPass nos cards de benefícios

Localize os cards atualmente compostos por “Benefício aceito”, nome do benefício e botão de consulta.

Inclua a arte `imagens/05-wellhub-fonte.jpg` no card Wellhub e a arte `imagens/06-totalpass-fonte.jpg` no card TotalPass, respeitando essa ordem. As imagens tornam-se o destaque visual dos blocos. Mantenha botões de consulta funcionais próximos de cada arte; evite duplicar desnecessariamente o texto “Aceitamos” presente nas imagens.

Exiba as artes inteiras, em sua proporção original, sem sobrepor novos títulos sobre suas escritas. Em desktop, os dois cards podem ficar lado a lado; no celular, priorize a leitura dos textos das artes com cards empilhados de largura confortável. A exigência específica de duas colunas no ajuste 3 não se estende a esses cards.

### Corrigir o endereço impresso antes de usar as artes

Os dois arquivos fornecidos ainda contêm “Rua Otto Daudt, 38 — B. Feitoria”, endereço antigo. O endereço correto fornecido é:

**Av. Feitoria, 3740 — Feitoria, São Leopoldo/RS.**

Prepare variantes dessas mesmas artes com correção localizada apenas no painel de endereço. Preserve fotografias, rostos, marcas, logo, WhatsApp, cores, composição e dimensões. Não corte a área inferior, não substitua a arte inteira e não deixe o endereço antigo visível junto do novo. Conserve os fontes recebidos e use nomes claros para as variantes finais.

Se as ferramentas do projeto não permitirem editar o bitmap com precisão, implemente um painel de endereço em HTML posicionado exatamente sobre a região antiga, com fundo opaco suficiente para substituí-la, tipografia legível e posicionamento responsivo medido na imagem. Esse painel deve corrigir somente o endereço, sem encobrir a foto ou outras informações. Valide-o em cada breakpoint. Não use recorte como solução.

Mantenha também nomes dos benefícios e dados essenciais em HTML acessível. Os botões “Consultar acesso pelo Wellhub” e “Consultar acesso pelo TotalPass” devem abrir o contato com mensagens correspondentes. Não invente planos, modalidades cobertas ou regras de check-in.

## Ajuste 6 — convite no lugar da galeria, com título marcante e onda

Substitua a seção “GALERIA — POR DENTRO DA RIP.”, atualmente uma grade com várias fotos, etiquetas “Treinos” e controles de ampliação, por um bloco simplificado:

1. Título grande: **Venha fazer parte desse time!**
2. Foto completa: `imagens/07-convite-time.jpg`, com os dois punhos se cumprimentando.
3. Fundo preto com a onda vermelha Ribbon Glow em movimento.

O título fica acima da foto e domina a hierarquia. Dê respiro entre os elementos e deixe a onda aparecer no fundo ao redor. A foto permanece opaca, inteira e sem filtros adicionais ou recortes. Remova o título antigo, a grade e os controles da galeria nessa seção. Não apague arquivos antigos que outros componentes ainda usem.

### Entrada diferenciada do título

Revele as palavras em sequência com opacidade e deslocamento vertical moderado, desacelerando suavemente. Destaque “desse time!” em vermelho e desenhe um traço vermelho sob esse trecho ao concluir a revelação. Busque duração total próxima de 900 a 1.200 ms, com intervalos de 70 a 100 ms entre palavras. A animação dispara uma vez ao entrar na área visível.

Mantenha as palavras inteiras, as quebras naturais e a frase acessível aos leitores de tela. Se usar spans decorativos duplicados, forneça uma única leitura sem repetição. Máscaras da animação podem atuar no texto, nunca na foto. Na preferência por movimento reduzido, exiba o resultado final diretamente. Não use pisca-pisca, digitação lenta ou loop de entrada.

### Ribbon Glow também aqui

A onda deve funcionar nesta seção e no hero, inclusive no mobile. A regra antiga de apenas uma instância foi substituída. Escolha arquitetura compartilhada ou instâncias gerenciadas, desde que o efeito seja realmente visível e animado nas duas áreas. Pause o trabalho das seções fora da tela, preserve os recursos e evite sobreposição de loops.

Reveja os links de navegação antes ligados à galeria. Faça-os apontar para o bloco de convite, com rótulo coerente e ancoragem que considere o cabeçalho fixo. Não mantenha links para elementos removidos.

## Ajuste 7 — encerramento com a foto de treino e mensagem final

Localize o espaço no final da página que atualmente repete a fachada, junto ou próximo das informações de WhatsApp e telefone, com a legenda “Fachada da RIP Academia, Av. Feitoria, 3740.”.

Substitua a foto por `imagens/08-encerramento-primeiro-passo.jpg`. Crie um encerramento visual próximo e antes do bloco final de informações com:

- Título: **Sua melhor versão começa com o primeiro passo.**
- Destaque vermelho em “primeiro passo”.
- Apoio: “Venha conhecer a RIP e dê o seu primeiro passo.”
- Um único CTA local: **Agendar meu Free Pass**. Reutilize ou reposicione o botão existente se já cumprir essa função.

Em desktop, componha foto inteira e mensagem lado a lado; em mobile, frase acima da foto com CTA próximo. Não corte a foto para adequá-la ao formato de banner. Faça a imagem entrar com fade-in e deslocamento vertical discreto, seguida da frase, numa sequência de aproximadamente 700 a 1.000 ms. Sem escala, zoom ou loop. Garanta visibilidade e movimento reduzido como nos demais blocos.

Remova a legenda antiga da fachada e atualize a descrição alternativa para a pessoa treinando. Preserve integralmente os dados finais: telefone, WhatsApp, localização, horários, links e demais informações corretas do site. A fachada aprovada no início permanece. O convite do ajuste 6 também permanece.

Não acrescentar uma terceira onda nesta seção: as duas áreas definidas para Ribbon Glow são o hero e o convite “Venha fazer parte desse time!”.

## Acabamento, conversão e comportamento

- Mantenha uma hierarquia clara de títulos, espaçamento consistente e contraste forte. Evite que os efeitos disputem atenção com o conteúdo e o agendamento.
- Preserve CTAs com rótulos diretos e links corretos. Mensagens de WhatsApp devem ser codificadas corretamente na URL.
- O botão fixo de Free Pass não deve cobrir conteúdo, contatos ou botões locais. Considere sua altura e a área segura no celular.
- Use animações de entrada breves, disparadas por visibilidade, com estado final estável e conteúdo disponível mesmo sem execução da animação.
- Aplique textos como HTML e CSS, não gravando frases nas fotografias. Não adicione depoimentos, resultados, números ou condições comerciais inexistentes.
- Otimize imagens com versões responsivas que preservem integralmente a composição. Carregue as imagens abaixo da dobra de forma adequada e reserve espaço para evitar saltos de layout.
- Preserve a compatibilidade do caminho de assets com a hospedagem atual. Se for GitHub Pages em subpasta, respeite o base path e confira URLs após o build. Não introduza dependências de servidor incompatíveis com o projeto.

## Validação obrigatória e entrega

Use os comandos de build e verificação disponíveis no projeto. Faça revisão visual em desktop e mobile; se tiver navegador automatizado, verifique larguras como 360, 390, 768 e 1440 px. Não declare validação em iPhone real se só houve emulação.

Confirme todos os critérios:

- [ ] Onda Ribbon Glow visível e em movimento no hero e no convite, em desktop e mobile compatíveis.
- [ ] A onda retoma após resize, rolagem e retorno à aba; fallback e movimento reduzido funcionam.
- [ ] Fachada correta na segunda seção; foto interna foi substituída e legenda foi atualizada.
- [ ] Duas fotos da estrutura corretas, lado a lado, de tamanho igual e alinhadas, com frases no topo e fade-in.
- [ ] Foto CrossTraining correta e inteira; todas as outras imagens também preservam as quatro bordas originais.
- [ ] Artes Wellhub e TotalPass nos respectivos cards, completas, com endereço atual corrigido e consulta funcional.
- [ ] Galeria antiga substituída pela foto dos punhos, título exato e entrada diferenciada.
- [ ] Encerramento mostra a foto de treino com a frase definida; fachada não se repete ali.
- [ ] Informações finais e destinos de contato preservados; navegação sem âncoras quebradas.
- [ ] Sem rolagem horizontal, cortes de textos, interferência do CTA fixo ou erros de carregamento de assets.
- [ ] Build e verificações pertinentes concluídos; console sem erros introduzidos pelas edições.

Compare a exibição de cada imagem ao arquivo fonte. Para comprovar movimento da onda, observe vários frames ou registre um pequeno vídeo: uma captura isolada não demonstra animação.

Ao concluir, entregue um relato conciso com os sete ajustes implementados, arquivos principais alterados, validações realmente executadas e limitações que ainda precisem de verificação. Este pacote contém instruções e fontes; ele não afirma que o site já foi editado ou que o código de referência já foi testado no projeto.
