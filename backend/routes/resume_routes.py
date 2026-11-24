import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from database import db
from services import parser_service

resume_bp = Blueprint('resume_bp', __name__)
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads"))

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@resume_bp.route('/api/resumes/upload', methods=['POST'])
def upload_resumes():
    files = request.files.getlist('files')
    if not files and 'file' in request.files:
        files = [request.files['file']]

    if not files or len(files) == 0:
        return jsonify({'error': 'No files provided'}), 400

    results = []
    errors = []

    for file in files:
        if file and file.filename:
            filename = secure_filename(file.filename)
            if not filename:
                filename = "uploaded_resume.pdf"

            if not allowed_file(filename):
                errors.append({'filename': file.filename, 'error': 'Only PDF files are supported'})
                continue

            # Ensure unique filename to prevent overwrites
            base, ext = os.path.splitext(filename)
            target_path = os.path.join(UPLOAD_FOLDER, filename)
            counter = 1
            while os.path.exists(target_path):
                target_path = os.path.join(UPLOAD_FOLDER, "{}_{}{}".format(base, counter, ext))
                counter += 1

            try:
                file.save(target_path)
                file_size = os.path.getsize(target_path)

                # Parse the resume
                parsed_data = parser_service.parse_resume_file(target_path)

                # Save to database
                resume_id = db.add_resume(
                    filename=os.path.basename(target_path),
                    file_path=target_path,
                    file_size=file_size,
                    status='processed'
                )
                cand_id = db.add_or_update_candidate(resume_id, parsed_data)

                results.append({
                    'resume_id': resume_id,
                    'candidate_id': cand_id,
                    'filename': os.path.basename(target_path),
                    'candidate_name': parsed_data.get('candidate_name', 'Not detected'),
                    'email': parsed_data.get('email', 'Not detected'),
                    'phone': parsed_data.get('phone', 'Not detected'),
                    'skills_count': len(parsed_data.get('programming_skills', [])) + len(parsed_data.get('database_skills', [])),
                    'status': 'processed'
                })
            except Exception as e:
                # Still record failed resume in DB
                resume_id = db.add_resume(
                    filename=filename,
                    file_path=target_path,
                    file_size=0,
                    status='error',
                    error_message=str(e)
                )
                errors.append({'filename': filename, 'error': str(e)})

    return jsonify({
        'success': True,
        'uploaded_count': len(results),
        'results': results,
        'errors': errors
    })

@resume_bp.route('/api/resumes', methods=['GET'])
def list_resumes():
    search = request.args.get('search', None)
    status = request.args.get('status', None)
    resumes = db.get_resumes(search=search, status=status)
    return jsonify(resumes)

@resume_bp.route('/api/resumes/<int:resume_id>', methods=['GET'])
def get_resume(resume_id):
    resume = db.get_resume(resume_id)
    if not resume:
        return jsonify({'error': 'Resume not found'}), 404
    return jsonify(resume)

@resume_bp.route('/api/resumes/<int:resume_id>/reprocess', methods=['POST'])
def reprocess_resume(resume_id):
    resume = db.get_resume(resume_id)
    if not resume:
        return jsonify({'error': 'Resume not found'}), 404

    file_path = resume['file_path']
    if not os.path.exists(file_path):
        return jsonify({'error': 'Source file not found on disk: {}'.format(file_path)}), 404

    try:
        parsed_data = parser_service.parse_resume_file(file_path)
        cand_id = db.add_or_update_candidate(resume_id, parsed_data)
        db.update_resume_status(resume_id, status='processed', error_message=None)
        candidate = db.get_candidate(cand_id)
        return jsonify({
            'success': True,
            'message': 'Resume reprocessed successfully',
            'candidate': candidate
        })
    except Exception as e:
        db.update_resume_status(resume_id, status='error', error_message=str(e))
        return jsonify({'error': 'Failed to reprocess: {}'.format(e)}), 500

@resume_bp.route('/api/resumes/<int:resume_id>', methods=['DELETE'])
def delete_resume(resume_id):
    resume = db.get_resume(resume_id)
    if not resume:
        return jsonify({'error': 'Resume not found'}), 404

    db.delete_resume(resume_id)
    return jsonify({'success': True, 'message': 'Resume deleted successfully'})
