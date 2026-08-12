from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SHOT = ROOT / "screenshots"
I04 = ROOT.parent / "pressure-proof-constructed-signal-iteration-04" / "screenshots"

SURFACES = [
    ("01-home", "HOME"),
    ("02-vape-nicotine-division", "VAPE & NICOTINE"),
    ("03-shared-category", "SHARED CATEGORY"),
    ("04-universal-pdp", "UNIVERSAL PDP"),
    ("05-fitted-component-pdp", "FITTED COMPONENT PDP"),
    ("06-quick-cart", "QUICK CART"),
    ("07-full-cart", "FULL CART"),
]

COMPARE = [
    ("01-home", "HOME"),
    ("03-shared-category", "SHARED CATEGORY"),
    ("04-universal-pdp", "UNIVERSAL PDP"),
    ("05-fitted-component-pdp", "FITTED COMPONENT PDP"),
    ("07-full-cart", "FULL CART"),
]

FONT = ImageFont.load_default()


def cover(image: Image.Image, size: tuple[int, int], top=True) -> Image.Image:
    image = image.convert("RGB")
    scale = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = max(0, (resized.width - size[0]) // 2)
    upper = 0 if top else max(0, (resized.height - size[1]) // 2)
    return resized.crop((left, upper, left + size[0], upper + size[1]))


def contain(image: Image.Image, size: tuple[int, int], background="#f3efe7") -> Image.Image:
    image = image.convert("RGB")
    scale = min(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, background)
    canvas.paste(resized, ((size[0] - resized.width) // 2, 0))
    return canvas


def labeled_cell(source: Path, label: str, size: tuple[int, int], grayscale=False, fraction=None) -> Image.Image:
    image = Image.open(source).convert("RGB")
    if fraction is not None:
        image = image.crop((0, 0, image.width, max(1, round(image.height * fraction))))
        image = contain(image, (size[0], size[1] - 36))
    else:
        image = cover(image, (size[0], size[1] - 36))
    if grayscale:
        image = ImageOps.grayscale(image).convert("RGB")
    cell = Image.new("RGB", size, "#f3efe7")
    cell.paste(image, (0, 36))
    draw = ImageDraw.Draw(cell)
    draw.rectangle((0, 0, size[0], 35), fill="#11110f")
    draw.text((12, 12), label, font=FONT, fill="white")
    return cell


def make_overviews() -> None:
    out = SHOT / "overview"
    out.mkdir(parents=True, exist_ok=True)
    cell_size = (320, 460)
    board = Image.new("RGB", (3 * cell_size[0] + 80, 3 * cell_size[1] + 110), "#dad5cc")
    draw = ImageDraw.Draw(board)
    draw.text((30, 24), "ITERATION 05 / ALL SEVEN DEFAULT SURFACES / GRAYSCALE", font=FONT, fill="#11110f")
    for idx, (stem, label) in enumerate(SURFACES):
        # Preserve the full drawer-and-backdrop geometry for Quick Cart; a cover crop
        # would erase the fixed action region this board is intended to compare.
        fraction = 1 if stem == "06-quick-cart" else None
        cell = labeled_cell(SHOT / "wide" / f"{stem}-1440x900.png", label, cell_size, grayscale=True, fraction=fraction)
        x = 30 + (idx % 3) * (cell_size[0] + 10)
        y = 60 + (idx // 3) * (cell_size[1] + 10)
        board.paste(cell, (x, y))
    board.save(out / "all-seven-default-grayscale-board.png", optimize=True)

    opening_size = (320, 320)
    opening = Image.new("RGB", (3 * opening_size[0] + 80, 3 * opening_size[1] + 110), "#dad5cc")
    draw = ImageDraw.Draw(opening)
    draw.text((30, 24), "ITERATION 05 / OPENING QUARTER / ALL SEVEN SURFACES", font=FONT, fill="#11110f")
    for idx, (stem, label) in enumerate(SURFACES):
        cell = labeled_cell(SHOT / "wide" / f"{stem}-1440x900.png", label, opening_size, fraction=.25)
        x = 30 + (idx % 3) * (opening_size[0] + 10)
        y = 60 + (idx // 3) * (opening_size[1] + 10)
        opening.paste(cell, (x, y))
    opening.save(out / "all-seven-openings-approximately-25-percent-board.png", optimize=True)


def make_comparison(i04_source: Path, i05_source: Path, output: Path, title: str, narrow=False) -> None:
    cell_size = (360, 800) if narrow else (700, 800)
    board = Image.new("RGB", (cell_size[0] * 2 + 50, cell_size[1] + 86), "#dad5cc")
    draw = ImageDraw.Draw(board)
    draw.text((22, 18), title, font=FONT, fill="#11110f")
    before = labeled_cell(i04_source, "ITERATION 04 / STRUCTURAL BASELINE", cell_size)
    after = labeled_cell(i05_source, "ITERATION 05 / CUSTOMER-FACING FIDELITY", cell_size)
    board.paste(before, (20, 58))
    board.paste(after, (30 + cell_size[0], 58))
    output.parent.mkdir(parents=True, exist_ok=True)
    board.save(output, optimize=True)


def make_comparisons() -> None:
    for stem, label in COMPARE:
        make_comparison(
            I04 / "wide" / f"{stem}-1440x900.png",
            SHOT / "wide" / f"{stem}-1440x900.png",
            SHOT / "comparison" / "wide" / f"{stem}-iter04-vs-iter05.png",
            f"{label} / WIDE COMPARISON",
        )
        make_comparison(
            I04 / "narrow" / f"{stem}-390x844.png",
            SHOT / "narrow" / f"{stem}-390x844.png",
            SHOT / "comparison" / "narrow" / f"{stem}-iter04-vs-iter05.png",
            f"{label} / 390 COMPARISON",
            narrow=True,
        )


def make_typography_board() -> None:
    source = Image.open(Path("/private/tmp/i05-type-viewport.jpg")).convert("RGB")
    out = SHOT / "overview" / "typography-candidate-comparison-board.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    board = Image.new("RGB", (1160, 920), "#dad5cc")
    draw = ImageDraw.Draw(board)
    draw.text((30, 22), "ITERATION 05 / TYPOGRAPHY CANDIDATE COMPARISON", font=FONT, fill="#11110f")
    # The study lays the three candidates in equal columns at this evidence width.
    candidate_lefts = [130, 529, 929]
    column_width = 381
    crop_top = 498
    crop_bottom = source.height
    labels = ["A / HELVETICA NEUE / PROVISIONAL", "B / TREBUCHET", "C / GEORGIA + ARIAL"]
    for index, label in enumerate(labels):
        left = candidate_lefts[index]
        crop = source.crop((left, crop_top, left + column_width, crop_bottom))
        specimen = crop.resize((350, 800), Image.Resampling.LANCZOS)
        cell = Image.new("RGB", (350, 836), "#f3efe7")
        cell.paste(specimen, (0, 36))
        cell_draw = ImageDraw.Draw(cell)
        cell_draw.rectangle((0, 0, 350, 35), fill="#11110f")
        cell_draw.text((10, 12), label, font=FONT, fill="white")
        board.paste(cell, (30 + index * 375, 62))
    board.save(out, optimize=True)


if __name__ == "__main__":
    make_overviews()
    make_comparisons()
    make_typography_board()
