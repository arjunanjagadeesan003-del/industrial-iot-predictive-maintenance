
"""
INDUSTRIAL IoT PREDICTIVE MAINTENANCE
Flask Dashboard Backend

Connects:
Python AI Module -> Flask API -> Web Dashboard

This backend displays monitoring and anomaly information.
It does not control or repair the machine.
"""

import json
import logging

from pathlib import Path
from datetime import datetime, timezone

import pandas as pd

from flask import Flask, jsonify, render_template


# -------------------------------------------------
# 1. APPLICATION CONFIGURATION
# -------------------------------------------------

app = Flask(__name__)

ROOT_DIR = Path(__file__).resolve().parents[1]

AI_DATA_DIR = ROOT_DIR / "python_ai" / "data"

REPORT_FILE = AI_DATA_DIR / "latest_ai_report.json"

SENSOR_HISTORY_FILE = AI_DATA_DIR / "sensor_history.csv"

ANOMALY_HISTORY_FILE = AI_DATA_DIR / "anomaly_history.csv"

REFRESH_INTERVAL = 10000

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger("Dashboard")


# -------------------------------------------------
# 2. HELPER FUNCTIONS
# -------------------------------------------------

def read_json_file(file_path):

    if not file_path.exists():
        return None

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return json.load(file)

    except (json.JSONDecodeError, OSError) as error:
        logger.error("Unable to read JSON file: %s", error)
        return None


def read_csv_file(file_path):

    if not file_path.exists():
        return pd.DataFrame()

    try:
        return pd.read_csv(file_path)

    except (pd.errors.ParserError, OSError) as error:
        logger.error("Unable to read CSV file: %s", error)
        return pd.DataFrame()


def safe_number(value, default=None):

    try:
        number = float(value)

        if pd.isna(number):
            return default

        return number

    except (TypeError, ValueError):
        return default


# -------------------------------------------------
# 3. LATEST MACHINE STATUS
# -------------------------------------------------

def get_machine_status():

    report = read_json_file(REPORT_FILE)

    if not report:
        return {
            "available": False,
            "message": (
                "Waiting for the Python AI module "
                "to generate its first report."
            )
        }

    sensor = report.get("sensor_readings", {})
    ai_result = report.get("ai_result", {})

    return {
        "available": True,

        "project": report.get("project"),

        "model": report.get("model"),

        "analysis_time": report.get("analysis_time"),

        "temperature": safe_number(
            sensor.get("temperature_c")
        ),

        "humidity": safe_number(
            sensor.get("humidity_percent")
        ),

        "voltage": safe_number(
            sensor.get("voltage_v")
        ),

        "current": safe_number(
            sensor.get("current_ma")
        ),

        "power": safe_number(
            sensor.get("power_mw")
        ),

        "vibration": safe_number(
            sensor.get("vibration_index")
        ),

        "prediction": ai_result.get("prediction"),

        "ai_status": ai_result.get("status", "UNKNOWN"),

        "anomaly_score": safe_number(
            ai_result.get("anomaly_score")
        ),

        "machine_health": ai_result.get(
            "machine_health", "UNKNOWN"
        ),

        "recommended_action": ai_result.get(
            "recommended_action", "No report available"
        )
    }


# -------------------------------------------------
# 4. SENSOR GRAPH DATA
# -------------------------------------------------

def get_sensor_history():

    df = read_csv_file(SENSOR_HISTORY_FILE)

    if df.empty:
        return []

    required_columns = [
        "temperature",
        "humidity",
        "current",
        "vibration"
    ]

    for column in required_columns:

        if column not in df.columns:
            df[column] = None

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    if "created_at" not in df.columns:
        df["created_at"] = ""

    df = df.tail(50)

    history = []

    for _, row in df.iterrows():

        history.append({
            "time": str(row["created_at"]),

            "temperature": safe_number(
                row["temperature"]
            ),

            "humidity": safe_number(
                row["humidity"]
            ),

            "current": safe_number(
                row["current"]
            ),

            "vibration": safe_number(
                row["vibration"]
            )
        })

    return history


# -------------------------------------------------
# 5. FAULT HISTORY
# -------------------------------------------------

def get_fault_history():

    df = read_csv_file(ANOMALY_HISTORY_FILE)

    if df.empty:
        return []

    records = []

    for _, row in df.tail(50).iloc[::-1].iterrows():

        records.append({

            "time": str(
                row.get("created_at", "Unknown")
            ),

            "temperature": safe_number(
                row.get("temperature")
            ),

            "current": safe_number(
                row.get("current")
            ),

            "vibration": safe_number(
                row.get("vibration")
            ),

            "score": safe_number(
                row.get("anomaly_score")
            ),

            "status": str(
                row.get("ai_status", "ANOMALY")
            ),

            "health": str(
                row.get("machine_health", "CHECK REQUIRED")
            )
        })

    return records


# -------------------------------------------------
# 6. DASHBOARD STATISTICS
# -------------------------------------------------

def get_statistics():

    df = read_csv_file(SENSOR_HISTORY_FILE)

    anomalies = read_csv_file(ANOMALY_HISTORY_FILE)

    total_readings = len(df)

    total_anomalies = len(anomalies)

    normal_readings = max(
        total_readings - total_anomalies,
        0
    )

    anomaly_percentage = 0

    if total_readings > 0:

        anomaly_percentage = round(
            (total_anomalies / total_readings) * 100,
            2
        )

    return {

        "total_readings": total_readings,

        "normal_readings": normal_readings,

        "total_anomalies": total_anomalies,

        "anomaly_percentage": anomaly_percentage
    }


# -------------------------------------------------
# 7. MAIN DASHBOARD PAGE
# -------------------------------------------------

@app.route("/")
def index():

    return render_template("index.html")


# -------------------------------------------------
# 8. DASHBOARD API
# -------------------------------------------------

@app.route("/api/dashboard")
def dashboard_api():

    try:

        return jsonify({

            "success": True,

            "server_time": datetime.now(
                timezone.utc
            ).isoformat(),

            "machine": get_machine_status(),

            "history": get_sensor_history(),

            "faults": get_fault_history(),

            "statistics": get_statistics(),

            "refresh_interval": REFRESH_INTERVAL

        })

    except Exception as error:

        logger.exception(
            "Dashboard API error"
        )

        return jsonify({

            "success": False,

            "message": str(error)

        }), 500


# -------------------------------------------------
# 9. HEALTH CHECK API
# -------------------------------------------------

@app.route("/api/health")
def health_api():

    return jsonify({

        "application": "Industrial IoT Dashboard",

        "status": "ONLINE",

        "ai_report_available": REPORT_FILE.exists(),

        "timestamp": datetime.now(
            timezone.utc
        ).isoformat()

    })


# -------------------------------------------------
# 10. APPLICATION START
# -------------------------------------------------

if __name__ == "__main__":

    logger.info(
        "Starting Industrial IoT Dashboard..."
    )

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=False,

        threaded=True

    )
