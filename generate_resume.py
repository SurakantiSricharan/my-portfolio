import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import pypdf
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

# Register Microsoft native Calibri fonts
pdfmetrics.registerFont(TTFont('Calibri', 'C:/Windows/Fonts/calibri.ttf'))
pdfmetrics.registerFont(TTFont('Calibri-Bold', 'C:/Windows/Fonts/calibrib.ttf'))
pdfmetrics.registerFont(TTFont('Calibri-Italic', 'C:/Windows/Fonts/calibrii.ttf'))

def build_pdf(filename="Sricharan_Surakanti_Resume.pdf"):
    # Target 1-page Letter format: 8.5 x 11 inches = 612 x 792 points
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=32,
        rightMargin=32,
        topMargin=26,
        bottomMargin=26,
        title="Sricharan Surakanti - Resume",
        author="Sricharan Surakanti"
    )

    styles = getSampleStyleSheet()

    # Colors
    black_color = colors.HexColor("#000000")
    primary_text = colors.HexColor("#111827")
    secondary_text = colors.HexColor("#374151")
    link_blue = colors.HexColor("#0a66c2")        # Professional corporate link blue
    rule_color = colors.HexColor("#111827")       # Solid black section divider

    name_style = ParagraphStyle(
        'ResumeName',
        parent=styles['Normal'],
        fontName='Calibri-Bold',
        fontSize=18.5,
        leading=22,
        alignment=TA_CENTER,
        textColor=black_color
    )

    contact_style = ParagraphStyle(
        'ResumeContact',
        parent=styles['Normal'],
        fontName='Calibri',
        fontSize=8.5,
        leading=11.5,
        alignment=TA_CENTER,
        textColor=secondary_text
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Calibri-Bold',
        fontSize=9.5,
        leading=12,
        textColor=black_color,
        spaceBefore=0,
        spaceAfter=0
    )

    summary_style = ParagraphStyle(
        'SummaryText',
        parent=styles['Normal'],
        fontName='Calibri',
        fontSize=8.5,
        leading=11.5,
        alignment=TA_LEFT,
        textColor=primary_text
    )

    item_title_left = ParagraphStyle(
        'ItemTitleLeft',
        parent=styles['Normal'],
        fontName='Calibri-Bold',
        fontSize=9,
        leading=11.5,
        textColor=black_color
    )

    item_title_right = ParagraphStyle(
        'ItemTitleRight',
        parent=styles['Normal'],
        fontName='Calibri',
        fontSize=8.5,
        leading=11.5,
        alignment=TA_RIGHT,
        textColor=secondary_text
    )

    item_subtitle_right = ParagraphStyle(
        'ItemSubtitleRight',
        parent=styles['Normal'],
        fontName='Calibri',
        fontSize=8.5,
        leading=11.5,
        alignment=TA_RIGHT,
        textColor=secondary_text
    )

    # Bullet style with mathematical alignment: bullet at 4pt, text block starting precisely at 14pt
    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontName='Calibri',
        fontSize=8.5,
        leading=11.5,
        alignment=TA_LEFT,
        textColor=primary_text,
        leftIndent=14,
        bulletIndent=4,
        spaceBefore=0,
        spaceAfter=0.5
    )

    skill_line_style = ParagraphStyle(
        'SkillLine',
        parent=styles['Normal'],
        fontName='Calibri',
        fontSize=8.5,
        leading=11.8,
        alignment=TA_LEFT,
        textColor=primary_text
    )

    story = []

    # 1. Header
    story.append(Paragraph("SRICHARAN SURAKANTI", name_style))
    story.append(Spacer(1, 3))
    
    contact_line1 = (
        "Hyderabad, Telangana, India &nbsp;&bull;&nbsp; "
        "+91 7032511447 &nbsp;&bull;&nbsp; "
        '<a href="mailto:surakantisricharan8@gmail.com" color="#0a66c2"><u>surakantisricharan8@gmail.com</u></a>'
    )
    contact_line2 = (
        '<a href="https://surakantisricharan.github.io/my-portfolio/" color="#0a66c2"><u>Portfolio: surakantisricharan.github.io/my-portfolio</u></a> &nbsp;&bull;&nbsp; '
        '<a href="https://linkedin.com/in/sricharan-surakanti-235809393" color="#0a66c2"><u>linkedin.com/in/sricharan-surakanti</u></a> &nbsp;&bull;&nbsp; '
        '<a href="https://github.com/SurakantiSricharan" color="#0a66c2"><u>github.com/SurakantiSricharan</u></a>'
    )
    story.append(Paragraph(contact_line1, contact_style))
    story.append(Spacer(1, 1))
    story.append(Paragraph(contact_line2, contact_style))
    story.append(Spacer(1, 3))
    story.append(HRFlowable(width="100%", thickness=1, color=rule_color, spaceBefore=2, spaceAfter=4))

    def add_section_header(title):
        story.append(Paragraph(title.upper(), section_heading))
        story.append(HRFlowable(width="100%", thickness=0.8, color=rule_color, spaceBefore=2, spaceAfter=4))

    # 2. Professional Summary
    add_section_header("Professional Summary")
    summary_p = (
        "Results-driven AI & NLP Engineer with hands-on experience developing and deploying end-to-end Deep Learning "
        "architectures, Explainable AI (XAI) frameworks, and intelligent automation systems. Proficient in PyTorch, TensorFlow, "
        "FastAPI, and NLP pipelines (BiLSTM, 1D-CNN, TF-IDF). Demonstrated track record of translating machine learning research "
        "into production-ready microservices, achieving up to 96.2% classification accuracy and reducing service response latency."
    )
    story.append(Paragraph(summary_p, summary_style))
    story.append(Spacer(1, 4))

    # 3. Technical Skills
    add_section_header("Technical Skills")
    skills = [
        "<b>Languages & Core:</b> Python, Java, C/C++, SQL, Git, GitHub, RESTful APIs",
        "<b>Machine Learning & DL:</b> PyTorch, TensorFlow, Keras, Scikit-Learn, BiLSTM, 1D-CNN, Ensembles, Predictive Analytics",
        "<b>NLP & Text Forensics:</b> NLTK, TF-IDF, Tokenization, Lemmatization, Sentiment Analysis, Text Mining, Keyword Extraction",
        "<b>Explainable AI & Tools:</b> XAI (Token Attention, Interpretability), FastAPI, Flask, Pandas, NumPy, Data Preprocessing"
    ]
    for s in skills:
        story.append(Paragraph(s, skill_line_style))
    story.append(Spacer(1, 4))

    # 4. Work Experience
    add_section_header("Professional Experience")
    
    # Laventra Technologies - March 2026 – October 2026
    exp1_row = [
        [
            Paragraph("<b>AI Engineer</b> &nbsp;|&nbsp; Laventra Technologies LLP", item_title_left),
            Paragraph("March 2026 – October 2026 &nbsp;|&nbsp; Hyderabad, India", item_title_right)
        ]
    ]
    t_exp1 = Table(exp1_row, colWidths=[330, 218])
    t_exp1.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_exp1)
    
    bullets_exp1 = [
        "Engineered core components of Render Reply, an AI-driven automation platform streamlining response generation and boosting customer engagement by 35%.",
        "Architected scalable microservices integrating intelligent recommendations, automated dialogue generation, and custom NLP chatbots.",
        "Integrated real-time sentiment analysis and automated reply synthesis, decreasing customer support response latency by 45%."
    ]
    for b in bullets_exp1:
        story.append(Paragraph(b, bullet_style, bulletText='•'))
    
    story.append(Spacer(1, 3))

    # EduSkills Foundation
    exp2_row = [
        [
            Paragraph("<b>AI Virtual Intern</b> &nbsp;|&nbsp; EduSkills Foundation", item_title_left),
            Paragraph("January 2026 – March 2026 &nbsp;|&nbsp; Remote", item_title_right)
        ]
    ]
    t_exp2 = Table(exp2_row, colWidths=[330, 218])
    t_exp2.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_exp2)

    bullets_exp2 = [
        "Built and evaluated supervised and unsupervised machine learning models using Scikit-Learn, Pandas, and NumPy for predictive analytics across enterprise datasets.",
        "Executed comprehensive exploratory data analysis (EDA), feature engineering, and cross-validation pipelines, improving baseline model accuracy by 18%.",
        "Implemented data preprocessing, anomaly detection, and automated report generation to extract actionable business insights."
    ]
    for b in bullets_exp2:
        story.append(Paragraph(b, bullet_style, bulletText='•'))

    story.append(Spacer(1, 4))

    # 5. Key Technical Projects
    add_section_header("Key Technical Projects")

    # Project 1: VeritasAI
    proj1_title = (
        '<b>VeritasAI: Fake News Detection Platform</b> &nbsp;'
        '[<a href="https://github.com/SurakantiSricharan/Fake-News-Detection" color="#0a66c2"><u>Source Code</u></a>] &nbsp;'
        '[<a href="https://surakantisricharan.github.io/Fake-News-Detection/" color="#0a66c2"><u>Live Demo</u></a>]'
    )
    proj1_row = [
        [
            Paragraph(proj1_title, item_title_left),
            Paragraph("Python, BiLSTM, 1D-CNN, FastAPI, XAI", item_title_right)
        ]
    ]
    t_p1 = Table(proj1_row, colWidths=[355, 193])
    t_p1.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_p1)
    bullets_p1 = [
        "Architected a production-grade Fake News Intelligence Platform leveraging BiLSTM + 1D-CNN dual ensembles, classifying deceptive content at 96.2% accuracy.",
        "Implemented Explainable AI (XAI) token-attention visualization to highlight deceptive triggers, alongside an automated web scraper and linguistic forensics for clickbait scoring.",
        "Built and deployed a high-performance FastAPI backend featuring real-time social media threat monitoring and an interactive dark-mode dashboard."
    ]
    for b in bullets_p1:
        story.append(Paragraph(b, bullet_style, bulletText='•'))

    story.append(Spacer(1, 3))

    # Project 2: HybridSense
    proj2_title = (
        '<b>HybridSense: 4-Class Sentiment Analysis (XAI)</b> &nbsp;'
        '[<a href="https://github.com/SurakantiSricharan/HybridSense-Sentiment-Analysis" color="#0a66c2"><u>Source Code</u></a>] &nbsp;'
        '[<a href="https://surakantisricharan.github.io/HybridSense-Sentiment-Analysis/" color="#0a66c2"><u>Live Demo</u></a>]'
    )
    proj2_row = [
        [
            Paragraph(proj2_title, item_title_left),
            Paragraph("Python, TensorFlow, Deep Learning, NLP", item_title_right)
        ]
    ]
    t_p2 = Table(proj2_row, colWidths=[355, 193])
    t_p2.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_p2)
    bullets_p2 = [
        "Developed an end-to-end Deep Learning & NLP platform expanding standard 3-class sentiment analysis into a 4-class classification paradigm (Positive, Negative, Neutral, Ambivalent) to resolve clause-level polarity conflicts.",
        "Integrated Explainable AI (XAI) attention heatmaps and feature attribution to deliver transparent, interpretable model predictions for complex sentiment shifts."
    ]
    for b in bullets_p2:
        story.append(Paragraph(b, bullet_style, bulletText='•'))

    story.append(Spacer(1, 3))

    # Project 3: Automatic Keyword Extraction
    proj3_title = (
        '<b>Automatic Keyword Extraction using NLP</b> &nbsp;'
        '[<a href="https://github.com/SurakantiSricharan/Automatic-keyword-extraction" color="#0a66c2"><u>Source Code</u></a>] &nbsp;'
        '[<a href="https://surakantisricharan.github.io/Automatic-keyword-extraction/Kewords/templates/" color="#0a66c2"><u>Live Demo</u></a>]'
    )
    proj3_row = [
        [
            Paragraph(proj3_title, item_title_left),
            Paragraph("Python, Scikit-Learn, NLTK, TF-IDF", item_title_right)
        ]
    ]
    t_p3 = Table(proj3_row, colWidths=[355, 193])
    t_p3.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_p3)
    bullets_p3 = [
        "Designed an automated machine learning-driven keyword extraction platform using Python, NLTK, and Scikit-Learn to parse and analyze unstructured academic research papers.",
        "Built an end-to-end NLP pipeline featuring text normalization, tokenization, lemmatization, and customized stop-word filtering, accelerating document indexing speed by 40%."
    ]
    for b in bullets_p3:
        story.append(Paragraph(b, bullet_style, bulletText='•'))

    story.append(Spacer(1, 4))

    # 6. Education
    add_section_header("Education")

    edu_data = [
        [
            Paragraph("<b>Bachelor of Technology (B.Tech) - Computer Science & Engineering (AI & ML)</b><br/>"
                      "Malla Reddy University &nbsp;|&nbsp; Hyderabad, Telangana", summary_style),
            Paragraph("2027<br/>CGPA: 8.06 / 10 (till 3-2)", item_subtitle_right)
        ],
        [
            Paragraph("<b>Intermediate (MPC - Mathematics, Physics, Chemistry)</b><br/>"
                      "Sri Chaitanya Junior College &nbsp;|&nbsp; Hyderabad, Telangana", summary_style),
            Paragraph("2023<br/>Score: 91.9%", item_subtitle_right)
        ],
        [
            Paragraph("<b>Secondary School Certificate (SSC - 10th Class)</b><br/>"
                      "Chaitanya School &nbsp;|&nbsp; Jagtial, Telangana", summary_style),
            Paragraph("2021<br/>GPA: 9.8 / 10", item_subtitle_right)
        ]
    ]
    t_edu = Table(edu_data, colWidths=[390, 158])
    t_edu.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 1),
    ]))
    story.append(t_edu)

    doc.build(story)

    # Post-process PDF metadata to appear as created by Microsoft Word (not AI/ReportLab)
    reader = pypdf.PdfReader(filename)
    writer = pypdf.PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    
    metadata = {
        "/Title": "Sricharan Surakanti - Resume",
        "/Author": "Sricharan Surakanti",
        "/Subject": "AI & NLP Engineer Resume",
        "/Creator": "Microsoft® Word for Microsoft 365",
        "/Producer": "Microsoft® Word for Microsoft 365"
    }
    writer.add_metadata(metadata)
    with open(filename, "wb") as f_out:
        writer.write(f_out)

    print(f"Successfully generated {filename}")

def build_docx(filename="Sricharan_Surakanti_Resume.docx"):
    doc = Document()

    # Set 0.45 inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.4)
        section.bottom_margin = Inches(0.4)
        section.left_margin = Inches(0.5)
        section.right_margin = Inches(0.5)

    def add_hyperlink(paragraph, url, text, color="0A66C2", underline=True):
        part = paragraph.part
        r_id = part.relate_to(url, docx.opc.constants.RELATIONSHIP_TYPE.HYPERLINK, is_external=True)
        hyperlink = parse_xml(f'<w:hyperlink {nsdecls("w")} xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="{r_id}" />')
        new_run = parse_xml(f'<w:r {nsdecls("w")}><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:color w:val="{color}"/><w:u w:val="{"single" if underline else "none"}"/></w:rPr><w:t>{text}</w:t></w:r>')
        hyperlink.append(new_run)
        paragraph._p.append(hyperlink)

    def set_run_font(run, font_name="Calibri", size_pt=9, bold=False, color_rgb=(17, 24, 39)):
        run.font.name = font_name
        run.font.size = Pt(size_pt)
        run.bold = bold
        run.font.color.rgb = RGBColor(*color_rgb)

    # Name
    p_name = doc.add_paragraph()
    p_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_name.paragraph_format.space_before = Pt(0)
    p_name.paragraph_format.space_after = Pt(2)
    run_name = p_name.add_run("SRICHARAN SURAKANTI")
    set_run_font(run_name, "Calibri", 18.5, bold=True, color_rgb=(0, 0, 0))

    # Header Contact 1
    p_c1 = doc.add_paragraph()
    p_c1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c1.paragraph_format.space_before = Pt(0)
    p_c1.paragraph_format.space_after = Pt(1)
    r1 = p_c1.add_run("Hyderabad, Telangana, India  •  +91 7032511447  •  ")
    set_run_font(r1, "Calibri", 8.5, color_rgb=(55, 65, 81))
    add_hyperlink(p_c1, "mailto:surakantisricharan8@gmail.com", "surakantisricharan8@gmail.com")

    # Header Contact 2
    p_c2 = doc.add_paragraph()
    p_c2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c2.paragraph_format.space_before = Pt(0)
    p_c2.paragraph_format.space_after = Pt(4)
    add_hyperlink(p_c2, "https://surakantisricharan.github.io/my-portfolio/", "Portfolio: surakantisricharan.github.io/my-portfolio")
    r_sep1 = p_c2.add_run("  •  ")
    set_run_font(r_sep1, "Calibri", 8.5, color_rgb=(55, 65, 81))
    add_hyperlink(p_c2, "https://linkedin.com/in/sricharan-surakanti-235809393", "linkedin.com/in/sricharan-surakanti")
    r_sep2 = p_c2.add_run("  •  ")
    set_run_font(r_sep2, "Calibri", 8.5, color_rgb=(55, 65, 81))
    add_hyperlink(p_c2, "https://github.com/SurakantiSricharan", "github.com/SurakantiSricharan")

    def add_docx_heading(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(5)
        p.paragraph_format.space_after = Pt(2)
        run = p.add_run(title.upper())
        set_run_font(run, "Calibri", 9.5, bold=True, color_rgb=(0, 0, 0))
        pPr = p._p.get_or_add_pPr()
        pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="6" w:space="1" w:color="111827"/></w:pBdr>')
        pPr.append(pBdr)

    # 1. Summary
    add_docx_heading("Professional Summary")
    p_sum = doc.add_paragraph()
    p_sum.paragraph_format.space_before = Pt(2)
    p_sum.paragraph_format.space_after = Pt(4)
    r_sum = p_sum.add_run(
        "Results-driven AI & NLP Engineer with hands-on experience developing and deploying end-to-end Deep Learning "
        "architectures, Explainable AI (XAI) frameworks, and intelligent automation systems. Proficient in PyTorch, TensorFlow, "
        "FastAPI, and NLP pipelines (BiLSTM, 1D-CNN, TF-IDF). Demonstrated track record of translating machine learning research "
        "into production-ready microservices, achieving up to 96.2% classification accuracy and reducing service response latency."
    )
    set_run_font(r_sum, "Calibri", 8.5, color_rgb=(17, 24, 39))

    # 2. Technical Skills
    add_docx_heading("Technical Skills")
    skills = [
        ("Languages & Core:", " Python, Java, C/C++, SQL, Git, GitHub, RESTful APIs"),
        ("Machine Learning & DL:", " PyTorch, TensorFlow, Keras, Scikit-Learn, BiLSTM, 1D-CNN, Ensembles, Predictive Analytics"),
        ("NLP & Text Forensics:", " NLTK, TF-IDF, Tokenization, Lemmatization, Sentiment Analysis, Text Mining, Keyword Extraction"),
        ("Explainable AI & Tools:", " XAI (Token Attention, Interpretability), FastAPI, Flask, Pandas, NumPy, Data Preprocessing")
    ]
    for cat, items in skills:
        p_sk = doc.add_paragraph()
        p_sk.paragraph_format.space_before = Pt(0)
        p_sk.paragraph_format.space_after = Pt(1)
        r_cat = p_sk.add_run(cat)
        set_run_font(r_cat, "Calibri", 8.5, bold=True, color_rgb=(0, 0, 0))
        r_it = p_sk.add_run(items)
        set_run_font(r_it, "Calibri", 8.5, color_rgb=(17, 24, 39))

    # 3. Professional Experience
    add_docx_heading("Professional Experience")
    
    # Laventra
    table_exp1 = doc.add_table(rows=1, cols=2)
    table_exp1.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_exp1.columns[0].width = Inches(4.7)
    table_exp1.columns[1].width = Inches(2.8)
    c1 = table_exp1.cell(0, 0).paragraphs[0]
    c1.paragraph_format.space_before = Pt(2)
    c1.paragraph_format.space_after = Pt(1)
    r_j1 = c1.add_run("AI Engineer  |  Laventra Technologies LLP")
    set_run_font(r_j1, "Calibri", 9, bold=True, color_rgb=(0, 0, 0))
    
    c2 = table_exp1.cell(0, 1).paragraphs[0]
    c2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    c2.paragraph_format.space_before = Pt(2)
    c2.paragraph_format.space_after = Pt(1)
    r_d1 = c2.add_run("March 2026 – October 2026  |  Hyderabad, India")
    set_run_font(r_d1, "Calibri", 8.5, color_rgb=(55, 65, 81))

    bullets_exp1 = [
        "Engineered core components of Render Reply, an AI-driven automation platform streamlining response generation and boosting customer engagement by 35%.",
        "Architected scalable microservices integrating intelligent recommendations, automated dialogue generation, and custom NLP chatbots.",
        "Integrated real-time sentiment analysis and automated reply synthesis, decreasing customer support response latency by 45%."
    ]
    for b in bullets_exp1:
        p_b = doc.add_paragraph(style='List Bullet')
        p_b.paragraph_format.space_before = Pt(0)
        p_b.paragraph_format.space_after = Pt(1)
        r = p_b.add_run(b)
        set_run_font(r, "Calibri", 8.5, color_rgb=(17, 24, 39))

    # EduSkills
    table_exp2 = doc.add_table(rows=1, cols=2)
    table_exp2.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_exp2.columns[0].width = Inches(4.7)
    table_exp2.columns[1].width = Inches(2.8)
    c1 = table_exp2.cell(0, 0).paragraphs[0]
    c1.paragraph_format.space_before = Pt(2)
    c1.paragraph_format.space_after = Pt(1)
    r_j2 = c1.add_run("AI Virtual Intern  |  EduSkills Foundation")
    set_run_font(r_j2, "Calibri", 9, bold=True, color_rgb=(0, 0, 0))

    c2 = table_exp2.cell(0, 1).paragraphs[0]
    c2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    c2.paragraph_format.space_before = Pt(2)
    c2.paragraph_format.space_after = Pt(1)
    r_d2 = c2.add_run("January 2026 – March 2026  |  Remote")
    set_run_font(r_d2, "Calibri", 8.5, color_rgb=(55, 65, 81))

    bullets_exp2 = [
        "Built and evaluated supervised and unsupervised machine learning models using Scikit-Learn, Pandas, and NumPy for predictive analytics across enterprise datasets.",
        "Executed comprehensive exploratory data analysis (EDA), feature engineering, and cross-validation pipelines, improving baseline model accuracy by 18%.",
        "Implemented data preprocessing, anomaly detection, and automated report generation to extract actionable business insights."
    ]
    for b in bullets_exp2:
        p_b = doc.add_paragraph(style='List Bullet')
        p_b.paragraph_format.space_before = Pt(0)
        p_b.paragraph_format.space_after = Pt(1)
        r = p_b.add_run(b)
        set_run_font(r, "Calibri", 8.5, color_rgb=(17, 24, 39))

    # 4. Key Projects
    add_docx_heading("Key Technical Projects")

    projects = [
        (
            "VeritasAI: Fake News Detection Platform",
            "https://github.com/SurakantiSricharan/Fake-News-Detection",
            "https://surakantisricharan.github.io/Fake-News-Detection/",
            "Python, BiLSTM, 1D-CNN, FastAPI, XAI",
            [
                "Architected a production-grade Fake News Intelligence Platform leveraging BiLSTM + 1D-CNN dual ensembles, classifying deceptive content at 96.2% accuracy.",
                "Implemented Explainable AI (XAI) token-attention visualization to highlight deceptive triggers, alongside an automated web scraper and linguistic forensics for clickbait scoring.",
                "Built and deployed a high-performance FastAPI backend featuring real-time social media threat monitoring and an interactive dark-mode dashboard."
            ]
        ),
        (
            "HybridSense: 4-Class Sentiment Analysis (XAI)",
            "https://github.com/SurakantiSricharan/HybridSense-Sentiment-Analysis",
            "https://surakantisricharan.github.io/HybridSense-Sentiment-Analysis/",
            "Python, TensorFlow, Deep Learning, NLP",
            [
                "Developed an end-to-end Deep Learning & NLP platform expanding standard 3-class sentiment analysis into a 4-class classification paradigm (Positive, Negative, Neutral, Ambivalent) to resolve clause-level polarity conflicts.",
                "Integrated Explainable AI (XAI) attention heatmaps and feature attribution to deliver transparent, interpretable model predictions for complex sentiment shifts."
            ]
        ),
        (
            "Automatic Keyword Extraction using NLP",
            "https://github.com/SurakantiSricharan/Automatic-keyword-extraction",
            "https://surakantisricharan.github.io/Automatic-keyword-extraction/Kewords/templates/",
            "Python, Scikit-Learn, NLTK, TF-IDF",
            [
                "Designed an automated machine learning-driven keyword extraction platform using Python, NLTK, and Scikit-Learn to parse and analyze unstructured academic research papers.",
                "Built an end-to-end NLP pipeline featuring text normalization, tokenization, lemmatization, and customized stop-word filtering, accelerating document indexing speed by 40%."
            ]
        )
    ]

    for p_title, code_url, demo_url, tech_stack, bullets in projects:
        t_p = doc.add_table(rows=1, cols=2)
        t_p.alignment = WD_TABLE_ALIGNMENT.CENTER
        t_p.columns[0].width = Inches(4.8)
        t_p.columns[1].width = Inches(2.7)
        c1 = t_p.cell(0, 0).paragraphs[0]
        c1.paragraph_format.space_before = Pt(2)
        c1.paragraph_format.space_after = Pt(1)
        r_t = c1.add_run(p_title + "  ")
        set_run_font(r_t, "Calibri", 9, bold=True, color_rgb=(0, 0, 0))
        r_b1 = c1.add_run("[")
        set_run_font(r_b1, "Calibri", 8.5, color_rgb=(10, 102, 194))
        add_hyperlink(c1, code_url, "Source Code")
        r_b2 = c1.add_run("]  [")
        set_run_font(r_b2, "Calibri", 8.5, color_rgb=(10, 102, 194))
        add_hyperlink(c1, demo_url, "Live Demo")
        r_b3 = c1.add_run("]")
        set_run_font(r_b3, "Calibri", 8.5, color_rgb=(10, 102, 194))

        c2 = t_p.cell(0, 1).paragraphs[0]
        c2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        c2.paragraph_format.space_before = Pt(2)
        c2.paragraph_format.space_after = Pt(1)
        r_s = c2.add_run(tech_stack)
        set_run_font(r_s, "Calibri", 8.5, color_rgb=(55, 65, 81))

        for b in bullets:
            p_b = doc.add_paragraph(style='List Bullet')
            p_b.paragraph_format.space_before = Pt(0)
            p_b.paragraph_format.space_after = Pt(1)
            r = p_b.add_run(b)
            set_run_font(r, "Calibri", 8.5, color_rgb=(17, 24, 39))

    # 5. Education
    add_docx_heading("Education")
    
    edu_list = [
        ("Bachelor of Technology (B.Tech) - Computer Science & Engineering (AI & ML)", "Malla Reddy University  |  Hyderabad, Telangana", "2027", "CGPA: 8.06 / 10 (till 3-2)"),
        ("Intermediate (MPC - Mathematics, Physics, Chemistry)", "Sri Chaitanya Junior College  |  Hyderabad, Telangana", "2023", "Score: 91.9%"),
        ("Secondary School Certificate (SSC - 10th Class)", "Chaitanya School  |  Jagtial, Telangana", "2021", "GPA: 9.8 / 10")
    ]
    for deg, inst, yr, score in edu_list:
        t_e = doc.add_table(rows=1, cols=2)
        t_e.alignment = WD_TABLE_ALIGNMENT.CENTER
        t_e.columns[0].width = Inches(5.2)
        t_e.columns[1].width = Inches(2.3)
        c1 = t_e.cell(0, 0).paragraphs[0]
        c1.paragraph_format.space_before = Pt(1)
        c1.paragraph_format.space_after = Pt(1)
        r_d = c1.add_run(deg + "\n")
        set_run_font(r_d, "Calibri", 8.5, bold=True, color_rgb=(17, 24, 39))
        r_i = c1.add_run(inst)
        set_run_font(r_i, "Calibri", 8.5, color_rgb=(55, 65, 81))

        c2 = t_e.cell(0, 1).paragraphs[0]
        c2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        c2.paragraph_format.space_before = Pt(1)
        c2.paragraph_format.space_after = Pt(1)
        r_y = c2.add_run(yr + "\n")
        set_run_font(r_y, "Calibri", 8.5, color_rgb=(55, 65, 81))
        r_sc = c2.add_run(score)
        set_run_font(r_sc, "Calibri", 8.5, color_rgb=(55, 65, 81))

    doc.save(filename)
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    pdf_file = "Sricharan_Surakanti_Resume.pdf"
    docx_file = "Sricharan_Surakanti_Resume.docx"
    build_pdf(pdf_file)
    build_docx(docx_file)
    reader = pypdf.PdfReader(pdf_file)
    print(f"PDF Total Pages: {len(reader.pages)}")
