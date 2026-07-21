"""
employee.py

Database helper module for the employees table.

Provides:
- An insert function to save raw employee features.
- A select function to get an employee by ID.

Written to be simple and easy to understand for beginners.
"""

def insert_employee(conn, employee_dict):
    """
    Inserts a single employee's features into the employees table.

    Parameters:
        conn (sqlite3.Connection): An open database connection.
        employee_dict (dict): Dictionary containing the 30 features. E.g. {"Age": 35, ...}

    Returns:
        int: The auto-generated ID of the newly inserted employee.
    """
    cursor = conn.cursor()

    # Extract all the keys and values from the input dictionary.
    # This automatically matches the 30 columns without writing a massive SQL query.
    columns = list(employee_dict.keys())
    values = [employee_dict[col] for col in columns]

    # Create placeholders: e.g. "?, ?, ?, ..." for the SQL parameters
    placeholders = ", ".join(["?" for _ in columns])
    columns_str = ", ".join(columns)

    if conn.dialect == "postgresql":
        query = f"INSERT INTO employees ({columns_str}) VALUES ({placeholders}) RETURNING id"
        cursor.execute(query, values)
        employee_id = cursor.fetchone()[0]
        conn.commit()
        return employee_id
    else:
        query = f"INSERT INTO employees ({columns_str}) VALUES ({placeholders})"
        cursor.execute(query, values)
        conn.commit()
        return cursor.lastrowid


def get_employee(conn, employee_id):
    """
    Retrieves an employee's raw features by their ID.
    """
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM employees WHERE id = ?", (employee_id,))
    row = cursor.fetchone()
    
    if row:
        return dict(row)
    return None
