import csv
import io
from flask import Blueprint, request, Response
from database import db

export_bp = Blueprint('export_bp', __name__)

@export_bp.route('/api/export/csv', methods=['GET'])
def export_csv():
    search = request.args.get('search', None)
    skill = request.args.get('skill', None)
    university = request.args.get('university', None)
    experience = request.args.get('experience', None)

    candidates = db.get_candidates(
        search=search,
        skill=skill,
        university=university,
        experience=experience
    )

    output = io.StringIO()
    # Write UTF-8 BOM so Excel opens it with proper character encoding
    output.write('\ufeff')

    writer = csv.writer(output)
    headers = [
        'Candidate ID',
        'Candidate Name',
        'Email',
        'Phone',
        'Universities',
        'Experience Roles',
        'Programming Languages',
        'Database Skills',
        'Machine Learning',
        'Platforms',
        'Languages',
        'Hobbies',
        'Open Source',
        'Source Resume Filename',
        'Upload Date',
        'Status'
    ]
    writer.writerow(headers)

    def format_list(lst):
        if not lst:
            return 'Not detected'
        if isinstance(lst, list):
            return ', '.join(lst) if len(lst) > 0 else 'Not detected'
        return str(lst)

    for c in candidates:
        writer.writerow([
            c.get('id', ''),
            c.get('candidate_name', 'Not detected'),
            c.get('email', 'Not detected'),
            c.get('phone', 'Not detected'),
            format_list(c.get('universities', [])),
            format_list(c.get('experience', [])),
            format_list(c.get('programming_skills', [])),
            format_list(c.get('database_skills', [])),
            format_list(c.get('machine_learning', [])),
            format_list(c.get('platforms', [])),
            format_list(c.get('languages', [])),
            format_list(c.get('hobbies', [])),
            format_list(c.get('open_source', [])),
            c.get('filename', ''),
            c.get('upload_date', ''),
            c.get('resume_status', 'processed')
        ])

    csv_data = output.getvalue()
    filename = "resumepop_candidates.csv" if not search and not skill else "resumepop_candidates_filtered.csv"

    return Response(
        csv_data,
        mimetype="text/csv; charset=utf-8",
        headers={"Content-Disposition": "attachment; filename={}".format(filename)}
    )
