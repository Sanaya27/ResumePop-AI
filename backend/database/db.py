import sqlite3
import json
import os
import datetime
import logging

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'resumepop.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER NOT NULL DEFAULT 0,
        upload_date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'processed',
        error_message TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resume_id INTEGER NOT NULL UNIQUE,
        candidate_name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        experience TEXT,
        platforms TEXT,
        database_skills TEXT,
        programming_skills TEXT,
        machine_learning TEXT,
        universities TEXT,
        languages TEXT,
        hobbies TEXT,
        open_source TEXT,
        raw_text TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (resume_id) REFERENCES resumes (id) ON DELETE CASCADE
    );
    """)
    conn.commit()
    conn.close()

def add_resume(filename, file_path, file_size, status='processed', error_message=None):
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.datetime.utcnow().isoformat()
    cursor.execute("""
        INSERT INTO resumes (filename, file_path, file_size, upload_date, status, error_message)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (filename, file_path, file_size, now, status, error_message))
    resume_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return resume_id

def update_resume_status(resume_id, status, error_message=None):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE resumes SET status = ?, error_message = ? WHERE id = ?
    """, (status, error_message, resume_id))
    conn.commit()
    conn.close()

def delete_resume(resume_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT file_path FROM resumes WHERE id = ?", (resume_id,))
    row = cursor.fetchone()
    file_path = row['file_path'] if row else None

    cursor.execute("DELETE FROM resumes WHERE id = ?", (resume_id,))
    conn.commit()
    conn.close()

    # Optionally delete file if in uploads
    if file_path and os.path.exists(file_path) and "uploads" in file_path:
        try:
            os.remove(file_path)
        except Exception as e:
            logging.warning("Could not remove file {}: {}".format(file_path, e))
    return True

def add_or_update_candidate(resume_id, data):
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.datetime.utcnow().isoformat()

    def to_json(val):
        if isinstance(val, (list, set)):
            return json.dumps(sorted(list(val)))
        if isinstance(val, str):
            try:
                # check if already JSON
                json.loads(val)
                return val
            except Exception:
                return json.dumps([val] if val != "Not detected" else [])
        return json.dumps([])

    candidate_name = data.get('candidate_name', 'Not detected')
    email = data.get('email', 'Not detected')
    phone = data.get('phone', 'Not detected')
    experience = to_json(data.get('experience', []))
    platforms = to_json(data.get('platforms', []))
    database_skills = to_json(data.get('database', data.get('database_skills', [])))
    programming_skills = to_json(data.get('programming', data.get('programming_skills', [])))
    machine_learning = to_json(data.get('machinelearning', data.get('machine_learning', [])))
    universities = to_json(data.get('universities', []))
    languages = to_json(data.get('languages', []))
    hobbies = to_json(data.get('hobbies', []))
    open_source = to_json(data.get('open-source', data.get('open_source', [])))
    raw_text = data.get('text', data.get('raw_text', ''))

    cursor.execute("SELECT id FROM candidates WHERE resume_id = ?", (resume_id,))
    existing = cursor.fetchone()

    if existing:
        cursor.execute("""
            UPDATE candidates SET
                candidate_name = ?, email = ?, phone = ?, experience = ?,
                platforms = ?, database_skills = ?, programming_skills = ?,
                machine_learning = ?, universities = ?, languages = ?,
                hobbies = ?, open_source = ?, raw_text = ?, updated_at = ?
            WHERE resume_id = ?
        """, (
            candidate_name, email, phone, experience,
            platforms, database_skills, programming_skills,
            machine_learning, universities, languages,
            hobbies, open_source, raw_text, now, resume_id
        ))
        cand_id = existing['id']
    else:
        cursor.execute("""
            INSERT INTO candidates (
                resume_id, candidate_name, email, phone, experience,
                platforms, database_skills, programming_skills,
                machine_learning, universities, languages,
                hobbies, open_source, raw_text, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            resume_id, candidate_name, email, phone, experience,
            platforms, database_skills, programming_skills,
            machine_learning, universities, languages,
            hobbies, open_source, raw_text, now, now
        ))
        cand_id = cursor.lastrowid

    conn.commit()
    conn.close()
    return cand_id

def parse_candidate_row(row):
    d = dict(row)
    for field in ['experience', 'platforms', 'database_skills', 'programming_skills', 'machine_learning', 'universities', 'languages', 'hobbies', 'open_source']:
        if field in d and d[field]:
            try:
                d[field] = json.loads(d[field])
            except Exception:
                d[field] = []
        else:
            d[field] = []
    return d

def get_candidates(search=None, skill=None, university=None, experience=None, sort_by='name', sort_order='asc'):
    conn = get_connection()
    cursor = conn.cursor()
    query = """
        SELECT c.*, r.filename, r.upload_date, r.file_size, r.status as resume_status
        FROM candidates c
        JOIN resumes r ON c.resume_id = r.id
        WHERE 1=1
    """
    params = []

    if search:
        search_like = "%" + search.lower() + "%"
        query += """ AND (
            LOWER(c.candidate_name) LIKE ? OR
            LOWER(c.email) LIKE ? OR
            LOWER(c.programming_skills) LIKE ? OR
            LOWER(c.database_skills) LIKE ? OR
            LOWER(c.machine_learning) LIKE ? OR
            LOWER(c.universities) LIKE ? OR
            LOWER(r.filename) LIKE ?
        )"""
        params.extend([search_like] * 7)

    if skill:
        skill_like = "%" + skill.lower() + "%"
        query += """ AND (
            LOWER(c.programming_skills) LIKE ? OR
            LOWER(c.database_skills) LIKE ? OR
            LOWER(c.machine_learning) LIKE ? OR
            LOWER(c.platforms) LIKE ?
        )"""
        params.extend([skill_like] * 4)

    if university:
        uni_like = "%" + university.lower() + "%"
        query += " AND LOWER(c.universities) LIKE ?"
        params.append(uni_like)

    if experience:
        exp_like = "%" + experience.lower() + "%"
        query += " AND LOWER(c.experience) LIKE ?"
        params.append(exp_like)

    # Sorting
    sort_column = "c.candidate_name"
    if sort_by == 'date':
        sort_column = "r.upload_date"
    elif sort_by == 'skills':
        sort_column = "LENGTH(c.programming_skills)"

    order = "ASC" if sort_order.lower() == 'asc' else "DESC"
    query += " ORDER BY {} {}".format(sort_column, order)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    results = [parse_candidate_row(r) for r in rows]
    conn.close()
    return results

def get_candidate(candidate_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.*, r.filename, r.upload_date, r.file_size, r.file_path, r.status as resume_status
        FROM candidates c
        JOIN resumes r ON c.resume_id = r.id
        WHERE c.id = ?
    """, (candidate_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return parse_candidate_row(row)
    return None

def get_candidate_by_resume(resume_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.*, r.filename, r.upload_date, r.file_size, r.file_path, r.status as resume_status
        FROM candidates c
        JOIN resumes r ON c.resume_id = r.id
        WHERE c.resume_id = ?
    """, (resume_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return parse_candidate_row(row)
    return None

def get_resumes(search=None, status=None):
    conn = get_connection()
    cursor = conn.cursor()
    query = """
        SELECT r.*, c.id as candidate_id, c.candidate_name, c.email, c.phone
        FROM resumes r
        LEFT JOIN candidates c ON r.id = c.resume_id
        WHERE 1=1
    """
    params = []
    if search:
        search_like = "%" + search.lower() + "%"
        query += " AND (LOWER(r.filename) LIKE ? OR LOWER(COALESCE(c.candidate_name, '')) LIKE ?)"
        params.extend([search_like, search_like])
    if status:
        query += " AND r.status = ?"
        params.append(status)

    query += " ORDER BY r.id DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_resume(resume_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT r.*, c.id as candidate_id, c.candidate_name, c.email, c.phone
        FROM resumes r
        LEFT JOIN candidates c ON r.id = c.resume_id
        WHERE r.id = ?
    """, (resume_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_dashboard_stats():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as total FROM resumes")
    total_resumes = cursor.fetchone()['total']

    cursor.execute("SELECT COUNT(*) as successful FROM resumes WHERE status = 'processed'")
    successful_extractions = cursor.fetchone()['successful']

    cursor.execute("SELECT COUNT(*) as count FROM candidates WHERE candidate_name != 'Not detected' AND candidate_name != ''")
    candidates_identified = cursor.fetchone()['count']

    # Unique skills
    cursor.execute("SELECT programming_skills, database_skills, machine_learning, platforms FROM candidates")
    rows = cursor.fetchall()
    all_skills = set()
    for r in rows:
        for f in ['programming_skills', 'database_skills', 'machine_learning', 'platforms']:
            if r[f]:
                try:
                    for s in json.loads(r[f]):
                        all_skills.add(s)
                except Exception:
                    pass

    # Recent activity
    cursor.execute("""
        SELECT r.id as resume_id, r.filename, r.upload_date, r.status,
               c.id as candidate_id, c.candidate_name, c.programming_skills
        FROM resumes r
        LEFT JOIN candidates c ON r.id = c.resume_id
        ORDER BY r.id DESC
        LIMIT 6
    """)
    recent = []
    for r in cursor.fetchall():
        item = dict(r)
        skills = []
        if item.get('programming_skills'):
            try:
                skills = json.loads(item['programming_skills'])
            except Exception:
                pass
        item['skills_count'] = len(skills)
        recent.append(item)

    conn.close()

    return {
        'total_resumes': total_resumes,
        'successful_extractions': successful_extractions,
        'candidates_identified': candidates_identified,
        'skills_detected': len(all_skills),
        'recent_activity': recent
    }

def get_analytics_data():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM candidates")
    candidates = [parse_candidate_row(r) for r in cursor.fetchall()]
    conn.close()

    total_candidates = len(candidates)
    if total_candidates == 0:
        return {
            'total_candidates': 0,
            'top_programming_languages': [],
            'top_databases': [],
            'top_machine_learning': [],
            'university_distribution': [],
            'experience_distribution': [],
            'platforms_distribution': [],
            'skills_breakdown': []
        }

    from collections import Counter
    prog_counter = Counter()
    db_counter = Counter()
    ml_counter = Counter()
    uni_counter = Counter()
    exp_counter = Counter()
    plat_counter = Counter()

    for c in candidates:
        for p in c.get('programming_skills', []):
            prog_counter[p] += 1
        for d in c.get('database_skills', []):
            db_counter[d] += 1
        for m in c.get('machine_learning', []):
            ml_counter[m] += 1
        for u in c.get('universities', []):
            uni_counter[u] += 1
        for e in c.get('experience', []):
            exp_counter[e] += 1
        for pl in c.get('platforms', []):
            plat_counter[pl] += 1

    def to_sorted_list(counter, limit=10):
        return [{'name': k, 'count': v} for k, v in counter.most_common(limit)]

    skills_breakdown = [
        {'category': 'Programming', 'count': sum(prog_counter.values())},
        {'category': 'Databases', 'count': sum(db_counter.values())},
        {'category': 'Machine Learning', 'count': sum(ml_counter.values())},
        {'category': 'Platforms', 'count': sum(plat_counter.values())},
        {'category': 'Experience Roles', 'count': sum(exp_counter.values())},
    ]

    return {
        'total_candidates': total_candidates,
        'top_programming_languages': to_sorted_list(prog_counter),
        'top_databases': to_sorted_list(db_counter),
        'top_machine_learning': to_sorted_list(ml_counter),
        'university_distribution': to_sorted_list(uni_counter),
        'experience_distribution': to_sorted_list(exp_counter),
        'platforms_distribution': to_sorted_list(plat_counter),
        'skills_breakdown': skills_breakdown
    }
