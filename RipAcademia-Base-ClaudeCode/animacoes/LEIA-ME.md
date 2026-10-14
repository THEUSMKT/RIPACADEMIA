# Animações fornecidas — escolha para a RIP

## Recomendação

**Selecionada: Ribbon Glow**, o terceiro anexo em texto e o quarto anexo visual do envio do usuário. A faixa vermelha contínua e curva combina melhor com o símbolo da RIP e com uma composição sofisticada. A escolha é de direção de arte, baseada nas capturas e na análise estática dos códigos.

| Referência | Efeito | Leitura visual | Uso nesta versão |
| --- | --- | --- | --- |
| Predictive Arc Horizon — primeiro código, segundo print | Arco formado por quadrados que variam com o tempo | Digital, tecnológico e geométrico | Alternativa preservada, não montar |
| Ribbon Glow — terceiro código, quarto print | Faixa luminosa contínua com ondulação e influência do ponteiro | Fluido, energético e mais próximo das curvas da logo | Uma instância no fundo do hero |

## Localização e composição

Use a onda no fundo da primeira seção, junto de “SEJA SUA MELHOR VERSÃO.”. Texto, CTA e foto real ficam acima do efeito. A onda aparece na borda inferior e na transição entre texto e fotografia, com movimento lento, brilho moderado e uma máscara escura que estabilize a área de leitura. A imagem real continua mostrando a academia.

Não replique a animação no Free Pass, footer ou fundo de toda a página. A continuidade nessas regiões pode usar cores e grafismos estáticos. O prompt completo, seção 7.1, define os props de partida e as camadas.

## O que os códigos revelam

- Ambos têm largura mínima de 1200 px e altura mínima de 800 px, que precisam ser removidas na adaptação responsiva.
- Ambos iniciam um loop contínuo de desenho e não tratam, no código recebido, movimento reduzido nem a visibilidade da seção.
- Predictive Arc utiliza WebGL e uma passagem de desenho. Ribbon Glow exige WebGL2, calcula um campo com 84 iterações e realiza uma segunda passagem para o acabamento; o campo já usa uma textura com metade da largura e da altura.
- A estrutura sugere maior custo gráfico do Ribbon Glow. Essa é uma inferência da leitura do shader: os códigos não foram executados ou comparados em um benchmark nesta revisão.
- A inicialização e o cleanup precisam considerar falha parcial, fallback e mudanças de tamanho. Preservar os caminhos de liberação já existentes no Ribbon Glow.

## Como usar os arquivos

Os TSX desta pasta são cópias fiéis do código enviado. Preserve a atribuição original. O desenvolvedor deve adaptar responsividade, ciclo de vida, qualidade, fallback e integração com a stack antes de usar em produção. As exigências estão no prompt completo.

Use fallback estático no mobile inicialmente; anime no desktop após os recursos principais da página estarem disponíveis. Desligue de verdade o loop quando a seção sair da tela, a aba estiver oculta, o visitante pausar ou tiver preferência por movimento reduzido. Apenas definir speed=0 não elimina os desenhos do código original.

Os screenshots de desktop serviram para análise visual e não integram este pacote. A comparação usa somente a aparência do efeito e o código fornecido.
