from flask import Blueprint, request, jsonify
from database import db

candidate_bp = Blueprint('candidate_bp', __name__)

@candidate_bp.route('/api/candidates', methods=['GET'])
def get_candidates():
    search = request.args.get('search', None)
    skill = request.args.get('skill', None)
    university = request.args.get('university', None)
    experience = request.args.get('experience', None)
    sort_by = request.args.get('sort_by', 'name')
    sort_order = request.args.get('sort_order', 'asc')

    candidates = db.get_candidates(
        search=search,
        skill=skill,
        university=university,
        experience=experience,
        sort_by=sort_by,
        sort_order=sort_order
    )
    return jsonify(candidates)

@candidate_bp.route('/api/candidates/<int:candidate_id>', methods=['GET'])
def get_candidate(candidate_id):
    candidate = db.get_candidate(candidate_id)
    if not candidate:
        return jsonify({'error': 'Candidate not found'}), 404
    return jsonify(candidate)
