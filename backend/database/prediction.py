"""
prediction.py

Database helper module for the predictions table.

Provides:
- Saving prediction results linked to employees.
- Fetching prediction history joined with employee features.
- Calculating aggregate dashboard statistics.

Written to be simple and easy to understand for beginners.
"""

def insert_prediction(conn, employee_id, prediction_result):
    """
    Inserts a prediction result into the predictions table.

    Parameters:
        conn (sqlite3.Connection): An open database connection.
        employee_id (int): Foreign key ID linking to the employee record.
        prediction_result (dict): The output dictionary returned by predictor.py
    """
    cursor = conn.cursor()
    
    query = """
    INSERT INTO predictions (
        employee_id, 
        prediction_label, 
        probability, 
        rf_probability, 
        lgbm_probability, 
        ann_probability
    ) VALUES (?, ?, ?, ?, ?, ?)
    """
    
    values = (
        employee_id,
        prediction_result["prediction"],
        prediction_result["probability"],
        prediction_result["base_predictions"]["random_forest"],
        prediction_result["base_predictions"]["lightgbm"],
        prediction_result["base_predictions"]["neural_network"]
    )
    
    cursor.execute(query, values)
    conn.commit()


def get_prediction_history(conn, limit=100):
    """
    Retrieves the prediction history, joining each prediction with its corresponding
    employee features. Returns a list of dictionaries.
    """
    cursor = conn.cursor()
    query = """
    SELECT 
        p.id AS prediction_id,
        p.prediction_label,
        p.probability,
        p.rf_probability,
        p.lgbm_probability,
        p.ann_probability,
        p.created_at AS predicted_at,
        e.*
    FROM predictions p
    JOIN employees e ON p.employee_id = e.id
    ORDER BY p.created_at DESC
    LIMIT ?
    """
    cursor.execute(query, (limit,))
    rows = cursor.fetchall()
    
    # Convert Row objects to standard python dictionaries
    return [dict(row) for row in rows]


def get_dashboard_stats(conn):
    """
    Calculates summary metrics and distributions for the dashboard page.
    """
    cursor = conn.cursor()
    
    # 1. Basic counts (Total, Stay vs Leave)
    cursor.execute("SELECT COUNT(*) FROM predictions")
    total_predictions = cursor.fetchone()[0]
    
    if total_predictions == 0:
        return {
            "total_predictions": 0,
            "attrition_rate": 0.0,
            "attrition_by_department": [],
            "attrition_by_overtime": [],
            "attrition_by_jobrole": []
        }
        
    cursor.execute("SELECT COUNT(*) FROM predictions WHERE prediction_label = 'Yes'")
    total_attrition = cursor.fetchone()[0]
    attrition_rate = (total_attrition / total_predictions) * 100
    
    # 2. Attrition by Department
    cursor.execute("""
    SELECT 
        e.Department, 
        COUNT(*) AS total_count,
        SUM(CASE WHEN p.prediction_label = 'Yes' THEN 1 ELSE 0 END) AS attrition_count
    FROM predictions p
    JOIN employees e ON p.employee_id = e.id
    GROUP BY e.Department
    """)
    dept_rows = cursor.fetchall()
    dept_stats = []
    for row in dept_rows:
        dept_stats.append({
            "department": row["Department"],
            "total": row["total_count"],
            "attrition": row["attrition_count"],
            "rate": round((row["attrition_count"] / row["total_count"]) * 100, 2)
        })
        
    # 3. Attrition by Overtime
    cursor.execute("""
    SELECT 
        e.OverTime, 
        COUNT(*) AS total_count,
        SUM(CASE WHEN p.prediction_label = 'Yes' THEN 1 ELSE 0 END) AS attrition_count
    FROM predictions p
    JOIN employees e ON p.employee_id = e.id
    GROUP BY e.OverTime
    """)
    ot_rows = cursor.fetchall()
    ot_stats = []
    for row in ot_rows:
        ot_stats.append({
            "overtime": row["OverTime"],
            "total": row["total_count"],
            "attrition": row["attrition_count"],
            "rate": round((row["attrition_count"] / row["total_count"]) * 100, 2)
        })

    # 4. Attrition by Job Role
    cursor.execute("""
    SELECT 
        e.JobRole, 
        COUNT(*) AS total_count,
        SUM(CASE WHEN p.prediction_label = 'Yes' THEN 1 ELSE 0 END) AS attrition_count
    FROM predictions p
    JOIN employees e ON p.employee_id = e.id
    GROUP BY e.JobRole
    """)
    role_rows = cursor.fetchall()
    role_stats = []
    for row in role_rows:
        role_stats.append({
            "job_role": row["JobRole"],
            "total": row["total_count"],
            "attrition": row["attrition_count"],
            "rate": round((row["attrition_count"] / row["total_count"]) * 100, 2)
        })
        
    return {
        "total_predictions": total_predictions,
        "attrition_rate": round(attrition_rate, 2),
        "attrition_by_department": dept_stats,
        "attrition_by_overtime": ot_stats,
        "attrition_by_jobrole": role_stats
    }
