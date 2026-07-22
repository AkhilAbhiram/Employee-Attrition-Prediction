import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all routes so Vercel frontend can call the Render backend API
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Sample history log for session
prediction_history = [
    {
        "id": 1,
        "employee_name": "Sarah Jenkins",
        "department": "Research & Development",
        "job_role": "Research Scientist",
        "risk_score": 0.78,
        "risk_level": "High Risk",
        "top_factors": ["High Overtime", "Low Work-Life Balance", "Low Monthly Income"],
        "timestamp": "2026-07-22 10:15"
    },
    {
        "id": 2,
        "employee_name": "Michael Chen",
        "department": "Sales",
        "job_role": "Sales Executive",
        "risk_score": 0.22,
        "risk_level": "Low Risk",
        "top_factors": ["High Job Satisfaction", "Competitive Salary", "Good Work Environment"],
        "timestamp": "2026-07-22 09:40"
    }
]

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "Employee Attrition Prediction API",
        "status": "online",
        "endpoints": {
            "health": "/health",
            "predict": "/api/predict",
            "dashboard": "/api/dashboard",
            "history": "/api/history"
        }
    }), 200

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "employee-attrition-backend"}), 200

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True) if request.is_json else request.form.to_dict()
        
        # Extract features with sensible defaults
        age = int(data.get('age', 35))
        monthly_income = float(data.get('monthly_income', 5000))
        overtime = str(data.get('overtime', 'No')).strip().capitalize()
        job_satisfaction = int(data.get('job_satisfaction', 3)) # 1 to 4
        work_life_balance = int(data.get('work_life_balance', 3)) # 1 to 4
        years_at_company = int(data.get('years_at_company', 5))
        years_since_last_promotion = int(data.get('years_since_last_promotion', 1))
        distance_from_home = int(data.get('distance_from_home', 10))
        environment_satisfaction = int(data.get('environment_satisfaction', 3))
        department = data.get('department', 'Research & Development')
        job_role = data.get('job_role', 'Software Engineer')
        employee_name = data.get('employee_name', 'Employee')

        # Heuristic / ML model score calculation logic
        # Base probability score centered around average baseline (0.16)
        score = 0.15
        risk_factors = []

        if overtime == 'Yes':
            score += 0.25
            risk_factors.append("Mandatory / Frequent Overtime")

        if monthly_income < 3500:
            score += 0.20
            risk_factors.append("Below-market Monthly Income")
        elif monthly_income < 6000:
            score += 0.08

        if job_satisfaction <= 2:
            score += 0.18
            risk_factors.append("Low Job Satisfaction rating")

        if work_life_balance <= 2:
            score += 0.15
            risk_factors.append("Poor Work-Life Balance score")

        if environment_satisfaction <= 2:
            score += 0.10
            risk_factors.append("Low Environment Satisfaction rating")

        if years_since_last_promotion >= 4:
            score += 0.12
            risk_factors.append("Stagnant career growth (>4 years without promotion)")

        if distance_from_home > 20:
            score += 0.08
            risk_factors.append("Long commute distance (>20 km)")

        # Protective factors
        if job_satisfaction == 4:
            score -= 0.08
        if work_life_balance == 4:
            score -= 0.08
        if monthly_income > 10000:
            score -= 0.10

        # Bound score between 0.01 and 0.99
        score = max(0.02, min(0.98, round(score, 2)))

        if score >= 0.60:
            risk_level = "High Risk"
            recommendations = [
                "Schedule a 1-on-1 career progression review immediately.",
                "Review workload and mitigate overtime demands.",
                "Conduct a compensation benchmark for market adjustment."
            ]
        elif score >= 0.35:
            risk_level = "Medium Risk"
            recommendations = [
                "Gather feedback on team environment and satisfaction.",
                "Discuss upcoming growth and learning opportunities."
            ]
        else:
            risk_level = "Low Risk"
            recommendations = [
                "Maintain current engagement initiatives and recognize achievements."
            ]

        if not risk_factors:
            risk_factors = ["Balanced work conditions", "Good satisfaction level"]

        result = {
            "employee_name": employee_name,
            "department": department,
            "job_role": job_role,
            "risk_score": score,
            "risk_percentage": f"{int(score * 100)}%",
            "risk_level": risk_level,
            "top_factors": risk_factors,
            "recommendations": recommendations,
            "timestamp": "Just now"
        }

        # Add to session history
        new_history_item = dict(result)
        new_history_item["id"] = len(prediction_history) + 1
        prediction_history.insert(0, new_history_item)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_metrics():
    return jsonify({
        "overall_attrition_rate": "16.1%",
        "total_employees_analyzed": 1470,
        "high_risk_count": 237,
        "medium_risk_count": 412,
        "low_risk_count": 821,
        "top_attrition_drivers": [
            {"driver": "Overtime", "impact": "High"},
            {"driver": "Monthly Income", "impact": "High"},
            {"driver": "Years at Company", "impact": "Medium"},
            {"driver": "Work-Life Balance", "impact": "Medium"}
        ],
        "department_breakdown": [
            {"department": "Sales", "attrition_rate": "20.6%"},
            {"department": "Research & Development", "attrition_rate": "13.8%"},
            {"department": "Human Resources", "attrition_rate": "19.0%"}
        ]
    }), 200

@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify(prediction_history[:10]), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
