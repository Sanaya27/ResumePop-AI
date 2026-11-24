import os
import sys
import logging
from flask import Flask, send_from_directory
from flask_cors import CORS

from database import db
from services import parser_service
from routes.health_routes import health_bp
from routes.dashboard_routes import dashboard_bp
from routes.resume_routes import resume_bp
from routes.candidate_routes import candidate_bp
from routes.analytics_routes import analytics_bp
from routes.export_routes import export_bp

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(candidate_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(export_bp)

    # Initialize SQLite database
    logging.info("Initializing database...")
    db.init_db()

    # Seed example resumes if empty
    logging.info("Checking example resumes seed...")
    parser_service.seed_example_resumes_if_needed()

    # Serve uploaded resumes for preview if needed
    uploads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads"))
    @app.route('/uploads/<path:filename>')
    def serve_upload(filename):
        return send_from_directory(uploads_dir, filename)

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("==================================================")
    print("  🚀 ResumePop AI Backend running on http://127.0.0.1:{}".format(port))
    print("  Turn resumes into structured talent data")
    print("==================================================")
    app.run(host='0.0.0.0', port=port, debug=False)
