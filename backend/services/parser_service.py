import os
import sys
import logging
import spacy

# Ensure ResumeParser-master is in sys.path
BASE_REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ResumeParser-master"))
if BASE_REPO not in sys.path:
    sys.path.insert(0, BASE_REPO)

from bin import lib
from bin import field_extraction
from database import db

# Load spaCy NLP once
_nlp = None

def get_nlp():
    global _nlp
    if _nlp is None:
        logging.info("Loading spaCy model en_core_web_sm...")
        _nlp = spacy.load('en_core_web_sm')
    return _nlp

def parse_resume_file(file_path):
    """
    Given an absolute or relative path to a resume file (PDF or text),
    extracts all structured fields using the enhanced extraction pipeline.
    """
    logging.info("Parsing resume file: {}".format(file_path))
    nlp = get_nlp()

    # Convert PDF to text
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    if ext == '.pdf':
        try:
            text = lib.convert_pdf(file_path)
        except Exception as e:
            logging.error("Failed to convert PDF {}: {}".format(file_path, e))
            # Fallback direct read if already text
            with open(file_path, 'r', encoding='utf-8', errors='replace') as fp:
                text = fp.read()
    else:
        with open(file_path, 'r', encoding='utf-8', errors='replace') as fp:
            text = fp.read()

    # Extract name, email, phone
    candidate_name = field_extraction.candidate_name_extractor(text, nlp)
    email = field_extraction.extract_email(text)
    phone = field_extraction.extract_phone(text)

    # Extract all configured fields
    extractors = lib.get_conf('extractors')
    extracted_fields = {}
    for extractor, items in extractors.items():
        if extractor == 'universities':
            extracted_fields[extractor] = list(field_extraction.extract_universities(text, items))
        else:
            extracted_fields[extractor] = list(field_extraction.extract_skills(text, extractor, items))

    result = {
        'candidate_name': candidate_name,
        'email': email,
        'phone': phone,
        'experience': extracted_fields.get('experience', []),
        'platforms': extracted_fields.get('platforms', []),
        'database_skills': extracted_fields.get('database', []),
        'programming_skills': extracted_fields.get('programming', []),
        'machine_learning': extracted_fields.get('machinelearning', []),
        'universities': extracted_fields.get('universities', []),
        'languages': extracted_fields.get('languages', []),
        'hobbies': extracted_fields.get('hobbies', []),
        'open_source': extracted_fields.get('open-source', []),
        'text': text
    }
    return result

def seed_example_resumes_if_needed():
    """
    Checks if database already has resumes. If empty, processes the 5 sample PDFs
    so the app has live, real data upon first startup.
    """
    existing = db.get_resumes()
    if len(existing) > 0:
        logging.info("Database already contains {} resumes. Skipping seed.".format(len(existing)))
        return

    example_dir = os.path.join(BASE_REPO, "data", "input", "example_resumes")
    if not os.path.exists(example_dir):
        logging.warning("Example resumes directory not found: {}".format(example_dir))
        return

    logging.info("Seeding database with example resumes from {}".format(example_dir))
    for f in os.listdir(example_dir):
        if f.lower().endswith('.pdf'):
            full_path = os.path.join(example_dir, f)
            size = os.path.getsize(full_path)
            try:
                parsed = parse_resume_file(full_path)
                resume_id = db.add_resume(
                    filename=f,
                    file_path=full_path,
                    file_size=size,
                    status='processed'
                )
                db.add_or_update_candidate(resume_id, parsed)
                logging.info("Successfully seeded resume: {} (Candidate: {})".format(f, parsed['candidate_name']))
            except Exception as e:
                logging.error("Failed to seed resume {}: {}".format(f, e))
