from flask import Blueprint, jsonify
from database import db

analytics_bp = Blueprint('analytics_bp', __name__)

@analytics_bp.route('/api/analytics', methods=['GET'])
def get_analytics():
    data = db.get_analytics_data()
    return jsonify(data)
