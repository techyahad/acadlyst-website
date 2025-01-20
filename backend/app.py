from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS
import re
from dns.resolver import resolve, NXDOMAIN, NoAnswer
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
load_dotenv()

db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'school_erp')
}
def validate_email_mx(email):
    """Validate the email format and check its MX records."""
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not re.match(email_regex, email):
        return False, "Invalid email format."
    
    domain = email.split('@')[-1]
    try:
        resolve(domain, 'MX')
        return True, None
    except NXDOMAIN:
        return False, "Domain does not exist."
    except NoAnswer:
        return False, "Domain has no MX records."
    except Exception as e:
        return False, str(e)

@app.route('/submit-survey', methods=['POST'])
def submit_survey():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        data = request.json

        name = data.get('name', '').strip()
        school_name = data.get('school_name', '').strip()
        school_email = data.get('school_email', '').strip()
        number_of_students = data.get('number_of_students', '').strip()
        designation = data.get('designation', '').strip()
        mobile_number = data.get('mobile_number', '').strip()
        city = data.get('city', '').strip()
        website = data.get('website', '').strip()
        address = data.get('address', '').strip()
        description = data.get('description', '').strip()

        query = "SELECT 1 FROM survey_responses WHERE school_email = %s OR school_name = %s LIMIT 1"
        cursor.execute(query, (school_email, school_name))
        if cursor.fetchone():
            return jsonify({"error": "School email or name already exists."}), 400

        if not (name and school_name and school_email and number_of_students and designation and mobile_number and city and address):
            return jsonify({"error": "All required fields must be filled."}), 400

        email_valid, email_error = validate_email_mx(school_email)
        if not email_valid:
            return jsonify({"error": email_error}), 400

        mobile_regex = r'^03[0-9]{2}-?[0-9]{7}$'
        if not re.match(mobile_regex, mobile_number):
            return jsonify({"error": "Invalid mobile number. Must be in the format 0321-1234567 or 03211234567."}), 400

        query = """
            INSERT INTO survey_responses 
            (name, school_name, school_email, number_of_students, designation, 
             mobile_number, city, website, address, description, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (name, school_name, school_email, number_of_students, designation, mobile_number, city, website, address, description, 'pending'))
        conn.commit()

        return jsonify({"message": "Survey submitted successfully!"}), 200
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def validate_user_email_mx(email):
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_regex, email):
        return True, ""
    return False, "Invalid email address."

@app.route('/signup', methods=['POST'])
def signup():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        data = request.json

        full_name = data.get('fullname', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()

        if not (full_name and email and password):
            return jsonify({"error": "Full Name, Email, and Password are required."}), 400

        email_valid, email_error = validate_email_mx(email)
        if not email_valid:
            return jsonify({"error": email_error}), 400

        password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$'
        if not re.match(password_regex, password):
            return jsonify({"error": "Password must be at least 8 characters long, contain an uppercase letter, a digit, and a special character."}), 400

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        query = "SELECT 1 FROM website_auth_users WHERE email = %s LIMIT 1"
        cursor.execute(query, (email,))
        if cursor.fetchone():
            return jsonify({"error": "Email already exists."}), 400

        query = """
            INSERT INTO website_auth_users (full_name, email, password)
            VALUES (%s, %s, %s)
        """
        cursor.execute(query, (full_name, email, hashed_password))
        conn.commit()

        return jsonify({"message": "User registered successfully!"}), 200

    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/login', methods=['POST'])
def login():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        data = request.json
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()

        if not (email and password):
            return jsonify({"error": "Email and Password are required."}), 400

        email_valid, email_error = validate_user_email_mx(email)
        if not email_valid:
            return jsonify({"error": email_error}), 400

        query = "SELECT full_name, email, password FROM website_auth_users WHERE email = %s LIMIT 1"
        cursor.execute(query, (email,))
        user = cursor.fetchone()
        if user:
            full_name, email,stored_password = user
            if check_password_hash(stored_password, password):
                return jsonify({"message": "Login successful!", "name": full_name, "email": email}), 200
            else:
                return jsonify({"error": "Invalid credentials."}), 400
        else:
            return jsonify({"error": "Email not found."}), 400
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    app.run(debug=True)
