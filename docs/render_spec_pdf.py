from __future__ import annotations

import re
from pathlib import Path

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


def _inline_md_to_rl(text: str) -> str:
    """
    Minimal inline markdown → ReportLab Paragraph markup.
    - **bold** → <b>
    - `code` → <font face="Courier">
    """
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"`(.+?)`", r'<font face="Courier">\1</font>', text)
    return text


def render_md_to_pdf(md_path: Path, pdf_path: Path) -> None:
    raw = md_path.read_text(encoding="utf-8")
    lines = [ln.rstrip() for ln in raw.splitlines()]

    styles = getSampleStyleSheet()
    title = ParagraphStyle(
        "Title",
        parent=styles["Title"],
        fontSize=18,
        leading=22,
        spaceAfter=12,
    )
    h2 = ParagraphStyle(
        "H2",
        parent=styles["Heading2"],
        fontSize=12.5,
        leading=15,
        spaceBefore=8,
        spaceAfter=6,
    )
    body = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontSize=10.5,
        leading=13,
        spaceAfter=4,
    )
    bullet = ParagraphStyle(
        "Bullet",
        parent=body,
        leftIndent=14,
        bulletIndent=6,
    )
    sub_bullet = ParagraphStyle(
        "SubBullet",
        parent=body,
        leftIndent=28,
        bulletIndent=20,
    )

    story = []
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=LETTER,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
        title="GMAT Study App — One-page product spec",
    )

    in_math_block = False

    for ln in lines:
        if ln.strip().startswith("\\["):
            in_math_block = True
            continue
        if ln.strip().endswith("\\]") and in_math_block:
            in_math_block = False
            continue
        if in_math_block:
            continue

        if not ln.strip():
            story.append(Spacer(1, 6))
            continue

        if ln.startswith("# "):
            story.append(Paragraph(_inline_md_to_rl(ln[2:].strip()), title))
            continue
        if ln.startswith("## "):
            story.append(Paragraph(_inline_md_to_rl(ln[3:].strip()), h2))
            continue

        m = re.match(r"^(\s*)-\s+(.*)$", ln)
        if m:
            indent = len(m.group(1))
            text = _inline_md_to_rl(m.group(2).strip())
            if indent >= 2:
                story.append(Paragraph(text, sub_bullet, bulletText="•"))
            else:
                story.append(Paragraph(text, bullet, bulletText="•"))
            continue

        story.append(Paragraph(_inline_md_to_rl(ln.strip()), body))

    doc.build(story)


if __name__ == "__main__":
    md = Path("gmat-study-app-spec.md")
    pdf = Path("gmat-study-app-spec.pdf")
    render_md_to_pdf(md, pdf)
    print(f"Wrote {pdf.resolve()}")

