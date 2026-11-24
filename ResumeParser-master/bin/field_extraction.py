import logging
import re
from bin import lib

# Enhanced, robust regex patterns
EMAIL_REGEX = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
PHONE_PATTERNS = [
    r'(?:\+\s*(\d{1,3})\s*)?(?:\(?(\d{3})\)?[\s\.-]*)(\d{3})[\s\.-]*(\d{4})'
]

UNIVERSITY_PATTERNS = [
    r'(?:University\s+of\s+[A-Za-z\s]+?(?=,|\n|\r|\.|\s*–|\s*-|\s*\(|May|June|July|August|Expected|\d{4}))',
    r'(?:[A-Za-z\s]+?\s+(?:University|College|Institute\s+of\s+Technology))',
]

def clean_text(text):
    if not text:
        return ''
    cleaned = re.sub(r'\(cid:\d+\)', ' ', text)
    cleaned = re.sub(r'[ÂŸ·•\t]+', ' ', cleaned)
    cleaned = cleaned.replace('\r', ' ')
    return cleaned


def candidate_name_extractor(input_string, nlp):
    """
    Extracts the candidate name reliably from header lines or NER.
    """
    if not input_string:
        return "Not detected"

    cleaned_text = clean_text(input_string)
    lines = [l.strip() for l in cleaned_text.split('\n') if l.strip()]
    if not lines:
        return "Not detected"

    blacklist = ['resume', 'curriculum vitae', 'cv', 'summary', 'profile', 'contact', 'objective']

    candidate_lines = []
    for l in lines[:6]:
        low = l.lower()
        if any(b in low for b in blacklist):
            continue
        if '@' in l or 'http' in low or '.com' in low or re.search(r'\d{3}[\s\.-]\d{4}', l):
            continue
        candidate_lines.append(l)

    for line in candidate_lines:
        clean_line = re.sub(r'[^a-zA-Z\s\-\.\'\u00C0-\u017F]', '', line).strip()
        words = clean_line.split()
        if 2 <= len(words) <= 4:
            doc = nlp(clean_line)
            is_person = any(ent.label_ == 'PERSON' for ent in doc.ents)
            if is_person or all(w.isupper() for w in words) or all(w.istitle() for w in words):
                return ' '.join([w.capitalize() for w in words])

    doc = nlp(cleaned_text[:1200])
    for ent in doc.ents:
        if ent.label_ == 'PERSON':
            words = ent.text.strip().split()
            if 2 <= len(words) <= 4 and not any(b in ent.text.lower() for b in blacklist):
                return ' '.join([w.capitalize() for w in words])

    words = candidate_lines[0].split() if candidate_lines else lines[0].split()
    if 1 <= len(words) <= 4:
        return ' '.join([w.capitalize() for w in words])

    return "Not detected"


def extract_email(text):
    if not text:
        return "Not detected"
    cleaned = clean_text(text)
    m = re.search(EMAIL_REGEX, cleaned)
    if m:
        email = m.group(0).strip('.,;:!? ')
        return email
    return "Not detected"


def extract_phone(text):
    if not text:
        return "Not detected"
    cleaned = clean_text(text)
    for p in PHONE_PATTERNS:
        m = re.search(p, cleaned)
        if m:
            country, area, prefix, line = m.groups()
            formatted = ''
            if country:
                formatted += '+{} '.format(country)
            formatted += '({}) {}-{}'.format(area, prefix, line)
            return formatted
    return "Not detected"


def extract_universities(resume_text, items_of_interest):
    matched = set()
    cleaned = clean_text(resume_text)

    if items_of_interest:
        for uni_input in items_of_interest:
            alias_list = uni_input if isinstance(uni_input, list) else [uni_input]
            uni_name = alias_list[0]
            for alias in alias_list:
                if lib.term_count(cleaned, alias) > 0:
                    matched.add(uni_name)
                    break

    lines = cleaned.split('\n')
    for line in lines:
        line_s = line.strip()
        if not line_s or len(line_s) > 120:
            continue
        for p in UNIVERSITY_PATTERNS:
            for m in re.finditer(p, line_s):
                uni = m.group(0).strip(' \t\n\r-,.;:')
                words = uni.split()
                if 2 <= len(words) <= 7 and len(uni) > 5:
                    low = uni.lower()
                    if not any(w in low for w in ['resume', 'experience', 'objective', 'coursework', 'cum laude', 'scholarship', 'gpa', 'project']):
                        matched.add(uni)

    return matched


def extract_fields(df):
    extractors = lib.get_conf('extractors')
    for extractor, items_of_interest in extractors.items():
        if extractor == 'universities':
            df[extractor] = df['text'].apply(lambda x: extract_universities(x, items_of_interest))
        else:
            df[extractor] = df['text'].apply(lambda x: extract_skills(x, extractor, items_of_interest))
    return df


def extract_skills(resume_text, extractor, items_of_interest):
    if not resume_text:
        return set()

    potential_skills_dict = dict()
    matched_skills = set()

    for skill_input in items_of_interest:
        if type(skill_input) is list and len(skill_input) >= 1:
            potential_skills_dict[skill_input[0]] = skill_input
        elif type(skill_input) is str:
            potential_skills_dict[skill_input] = [skill_input]
        else:
            logging.warning('Unknown skill listing type: {}'.format(skill_input))

    for (skill_name, skill_alias_list) in potential_skills_dict.items():
        skill_matches = 0
        for skill_alias in skill_alias_list:
            skill_matches += lib.term_count(resume_text, skill_alias)
        if skill_matches > 0:
            matched_skills.add(skill_name)

    return matched_skills
