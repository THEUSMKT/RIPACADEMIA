"""
Corrige o endereço impresso nas artes Wellhub e TotalPass (ajuste 5 do pacote de edições).

As artes recebidas trazem "Rua Otto Daudt, 38 - B. Feitoria". Este script troca só essa linha por
"Av. Feitoria, 3740 - Feitoria" e mantém o resto da arte (fotos, logos, WhatsApp, "São Leopoldo/RS",
cores, composição e dimensões). Os arquivos-fonte ficam intactos; as variantes corrigidas são gravadas
em RipAcademia-Edicoes-ClaudeCode/imagens-corrigidas/ e versionadas, então o build não depende deste script.

Como funciona:
  1. a linha antiga é localizada pela posição medida em cada arte (caixa abaixo);
  2. os traços do texto antigo (pixels claros + halo da compressão) são apagados e preenchidos
     coluna a coluna com o fundo logo acima e abaixo da linha, que nessas artes é foto desfocada
     ou com estruturas verticais (coluna, corda);
  3. a nova linha é escrita na mesma posição e altura de base, em Manrope Bold, a fonte livre
     mais próxima da usada na arte (comparada com "São Leopoldo/RS", que permanece original).

Uso (uma vez, quando as artes mudarem):
  npm pack @expo-google-fonts/manrope && tar xzf expo-google-fonts-manrope-*.tgz
  python3 scripts/corrigir-endereco-artes.py package/700Bold/Manrope_700Bold.ttf

Requisitos: Python 3, Pillow e NumPy.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PKG = ROOT / 'RipAcademia-Edicoes-ClaudeCode'
OUT = PKG / 'imagens-corrigidas'

OLD = 'Rua Otto Daudt, 38 - B. Feitoria'
NEW = 'Av. Feitoria, 3740 - Feitoria'

# Medidas em pixels de cada arte-fonte: início da linha (x), linha de base, faixa vertical do texto antigo
# (do topo das maiúsculas ao pé da vírgula) e largura medida da linha antiga, usada para achar o corpo da fonte.
ARTS = [
    {
        'src': '05-wellhub-fonte.jpg',
        'out': '05-wellhub-endereco-av-feitoria.png',
        'x': 454,
        'baseline': 957,
        'band': (940, 960),
        'old_width': 747 - 454,
    },
    {
        'src': '06-totalpass-fonte.jpg',
        'out': '06-totalpass-endereco-av-feitoria.png',
        'x': 148,
        'baseline': 1161,
        'band': (1139, 1164),
        'old_width': 522 - 148,
    },
]

SS = 4  # supersampling da renderização do texto


def fit_size(font_path, width):
    """Corpo da fonte em que a linha antiga tem a largura medida na arte."""
    lo, hi = 8.0, 60.0
    for _ in range(40):
        mid = (lo + hi) / 2
        if ImageFont.truetype(font_path, mid).getlength(OLD) < width:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def text_layer(size, font_path, text, x, baseline, w, h):
    """Máscara alfa (0–255) do texto, renderizada em supersampling e reduzida com suavização."""
    font = ImageFont.truetype(font_path, size * SS)
    big = Image.new('L', (w * SS, h * SS), 0)
    ImageDraw.Draw(big).text((x * SS, baseline * SS), text, font=font, fill=255, anchor='ls')
    return big.resize((w, h), Image.LANCZOS)


def erase_old_line(img, art, size, font_path):
    """Apaga os traços da linha antiga e preenche com o fundo vizinho (interpolação vertical)."""
    a = np.asarray(img).astype(np.float32)
    h, w, _ = a.shape
    top, bottom = art['band']
    x0 = art['x'] - 6
    x1 = art['x'] + art['old_width'] + 8

    # 1) traços previstos pela fonte + 2) pixels claros reais da faixa (cobre diferenças de desenho).
    predicted = np.asarray(text_layer(size, font_path, OLD, art['x'], art['baseline'], w, h)) > 20
    lum = a.min(axis=2)
    band = np.zeros((h, w), bool)
    band[top - 2 : bottom + 3, x0:x1] = True
    bright = band & (lum > 95)
    mask = Image.fromarray(((predicted | bright) & band).astype(np.uint8) * 255)
    # Halo de compressão em volta das letras, sem sair da faixa (que já tem margem acima e abaixo).
    mask = (np.asarray(mask.filter(ImageFilter.MaxFilter(7))) > 0) & band

    out = a.copy()
    for x in range(x0 - 3, x1 + 3):
        col = mask[:, x]
        if not col.any():  # coluna sem texto
            continue
        ys = np.where(col)[0]
        # Preenche cada trecho mascarado com a interpolação entre o pixel válido acima e o abaixo.
        start = ys[0]
        prev = ys[0]
        runs = []
        for y in ys[1:]:
            if y != prev + 1:
                runs.append((start, prev))
                start = y
            prev = y
        runs.append((start, prev))
        for r0, r1 in runs:
            above = out[r0 - 1, x]
            below = out[r1 + 1, x] if r1 + 1 < h else above
            n = r1 - r0 + 2
            for i, y in enumerate(range(r0, r1 + 1), start=1):
                t = i / n
                out[y, x] = above * (1 - t) + below * t

    # Suaviza só a área preenchida (sem tocar o resto da arte) e devolve um grão leve, como o do JPEG.
    filled = Image.fromarray(out.clip(0, 255).astype(np.uint8))
    soft = np.asarray(filled.filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)
    rng = np.random.default_rng(7)
    grain = rng.normal(0, 2.2, soft.shape).astype(np.float32)
    m = mask[..., None]
    out = np.where(m, soft + grain, a)
    return Image.fromarray(out.clip(0, 255).astype(np.uint8)), mask


def text_color(img, art):
    """Cor do texto original: média dos pixels mais claros da linha "São Leopoldo/RS", que permanece."""
    a = np.asarray(img).astype(np.float32)
    top = art['band'][1] + 4
    region = a[top : top + 30, art['x'] : art['x'] + 170].reshape(-1, 3)
    lum = region.mean(axis=1)
    sel = region[lum >= np.percentile(lum, 97)]
    return tuple(int(v) for v in sel.mean(axis=0))


def main():
    if len(sys.argv) < 2:
        sys.exit('Informe o caminho do Manrope_700Bold.ttf (veja o cabeçalho do script).')
    font_path = sys.argv[1]
    OUT.mkdir(exist_ok=True)
    for art in ARTS:
        src = Image.open(PKG / 'imagens' / art['src']).convert('RGB')
        size = fit_size(font_path, art['old_width'])
        color = text_color(src, art)
        clean, _ = erase_old_line(src, art, size, font_path)
        # Alinha a borda esquerda da primeira letra nova à medida na arte ("x"), descontando o recuo do "A".
        probe = text_layer(size, font_path, NEW, art['x'], art['baseline'], *src.size)
        new_ink = probe.point(lambda v: 255 if v > 110 else 0).getbbox()[0]
        alpha = text_layer(size, font_path, NEW, 2 * art['x'] - new_ink, art['baseline'], *src.size)
        # Leve suavização: o texto da arte recebida passou por compressão e não tem borda dura.
        alpha = alpha.filter(ImageFilter.GaussianBlur(0.35))
        result = Image.composite(Image.new('RGB', src.size, color), clean, alpha)
        assert result.size == src.size
        result.save(OUT / art['out'], optimize=True)  # PNG: sem recompressão fora da área corrigida
        print(f"✓ {art['out']} — corpo {size:.1f}px, cor {color}")


if __name__ == '__main__':
    main()
