# PROMPT DE EDIÇÃO — SITE RIP ACADEMIA

Use este arquivo **depois** que o site estiver implementado, para pedir alterações ao Claude Code sem quebrar o que já funciona.
Abra o Claude Code na pasta do projeto, copie o modelo que serve ao seu caso, preencha o que está entre `[colchetes]` e envie.

## Regras que valem para toda edição

- Leia o `README.md` do projeto e o `PROMPT-CLAUDE-CODE-RIP-ACADEMIA.md` antes de mexer em qualquer coisa.
- Dados comerciais (nome, endereço, horários, telefone, Instagram, mensagens de WhatsApp, IDs de analytics) vivem **em um único arquivo de configuração**. Altere lá, nunca copie o dado para dentro de componentes.
- Não invente preços, planos, horários, depoimentos, avaliações, nomes de profissionais nem números de alunos. Se faltar informação, pergunte.
- Mantenha as regras do prompt original: nada de dados da Rua Otto Daudt nem dos horários antigos, nada de “Aberto agora”, nada de promessas sobre o Free Pass além do que o prompt autoriza.
- Depois de editar: rode o build, confira em 360, 390, 768 e 1440 px e diga o que foi testado de fato.
- Faça um commit pequeno, com mensagem clara em português. Sem push forçado.

## Modelos prontos

**1. Mudar horário, endereço ou telefone**
> Atualize no arquivo de configuração central: [campo] de “[valor atual]” para “[valor novo]”. Confira que a tabela de horários, o rodapé, o JSON-LD e o link do WhatsApp refletem a mudança sem edição manual em outro lugar. Mostre onde a informação aparece no site.

**2. Informar horário de domingo ou feriados**
> O horário de domingo e feriados passou a ser: [informação confirmada pela academia]. Atualize a configuração, a tabela da seção Localização, a resposta do FAQ e o JSON-LD. Não exiba “Aberto agora”.

**3. Trocar ou acrescentar uma foto**
> Use a imagem [caminho do arquivo] na seção [seção]. Gere as variantes WebP/AVIF, defina `width`, `height`, `alt` descritivo e `object-position`. Não use a mesma foto em mais de uma seção principal e não publique o arquivo original.

**4. Ativar GA4, GTM e/ou Meta Pixel**
> Ative a mensuração com estes IDs: GA4 [ID], GTM [ID], Meta Pixel [ID]. Os rastreadores só carregam depois do consentimento. Mostre como validar no Tag Assistant e no Pixel Helper e confirme que os eventos do prompt (seção 12) disparam uma vez por ação e sem dados pessoais.

**5. Ligar o domínio próprio**
> O domínio de produção é [dominio]. Atualize `site`, `base`, canonical, sitemap, robots, Open Graph e JSON-LD. Remova o prefixo do GitHub Pages onde não for mais necessário e documente o apontamento de DNS no README.

**6. Incluir depoimentos reais**
> A academia forneceu estas avaliações autênticas: [texto, autoria, fonte, link]. Ative o componente de avaliações com esses dados exatos, sem editar o texto. Não crie nota média nem selo.

**7. Ajustar a animação Ribbon Glow**
> A onda do hero está [muito forte / pesada no celular / cobrindo o título]. Ajuste dentro da seção 7.1 do prompt (opacidade, máscara, camadas ou DPR). Compare com a animação ligada e desligada e informe a diferença medida, sem afirmar ganho que você não mediu.

**8. Textos e chamadas**
> Reescreva [seção/título/CTA] mantendo o tom do prompt (acolhedor, sem intimidar iniciantes). Não prometa resultado, vagas ou condições do Free Pass que não foram informadas.

**9. Corrigir um bug ou visual**
> Em [dispositivo/largura], [descreva o problema]. Reproduza, corrija a causa e confirme em 360, 390, 768 e 1440 px. Não altere outras seções.

## Antes de publicar uma mudança

1. O telefone do site continua `(51) 99985-0575` e o link usa `5551999850575`?
2. Os horários batem com a arte atual `referencias-atualizadas/IMG_8516.jpeg` (ou com a nova informação confirmada pela academia)?
3. Alguma foto nova mostra pessoas? Se sim, a academia confirmou a autorização de uso de imagem?
