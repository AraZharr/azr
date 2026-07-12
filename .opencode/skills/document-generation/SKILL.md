---
name: document-generation
description: Generate DOCX, XLSX, PPTX, PDF artifacts with python-docx/openpyxl/python-pptx/reportlab. Includes image processing (Pillow + rembg), batch file operations, and structural templates for proposals/specs/reports.
license: MIT
metadata:
  source: superagent-m8
---

## Render Targets
| Format | Library | Use Case |
|--------|---------|----------|
| .docx | python-docx | Proposals, contracts, briefs |
| .xlsx | openpyxl / xlsxwriter | Trackers, budgets, data |
| .pptx | python-pptx | Decks, pitches |
| .pdf | reportlab | Invoices, certificates |
| .csv | csv / pandas | Data export |
| .html | jinja2 / direct | Reports, landing pages |

## Structural Templates
- **Proposal**: Executive summary → Problem → Solution → Timeline → Investment (3 tiers) → Proof → Next step
- **Technical spec**: Goals → Non-goals → Setup → Usage → Reference → Edge cases
- **Insight report**: Executive summary → Method → Findings → Analysis → Prescriptions (3, dated) → Appendix

## Image Processing
- Background removal: `rembg.remove(input_data)`
- Resize: `ImageOps.fit(img, (400, 400), Image.LANCZOS)`

## Render Protocol
1. Confirm scope (max 1 exchange)
2. Generate artifact
3. Save with descriptive filename
4. Offer: "Adjust [specific section]?"

## Constraints
- Render ACTUAL artifact, not inline preview
- Descriptive filenames (e.g., `q3-revenue-analysis.xlsx`)
- One specific edit offer after delivery
- Zip when > 3 files
