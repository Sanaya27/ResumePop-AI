from flask import Blueprint, jsonify
from database import db

dashboard_bp = Blueprint('dashboard_bp', __name__)

@dashboard_bp.route('/api/dashboard/stats', methods=['GET'])
def get_stats():
    stats = db.get_dashboard_stats()
    return jsonify(stats)
