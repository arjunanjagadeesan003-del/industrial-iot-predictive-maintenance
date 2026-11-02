# AI-Driven Predictive Maintenance System for Industrial IoT

### ESP32-Based Machine Monitoring, Machine Learning Anomaly Detection and Web-Based Fault Monitoring

---

## 1. Project Overview

The AI-Driven Predictive Maintenance System for Industrial IoT is an intelligent machine monitoring solution designed to identify abnormal operating conditions in industrial equipment using sensor data and machine learning techniques.

The system uses an ESP32 microcontroller to collect real-time machine parameters through multiple sensors. The collected sensor readings are transmitted to the ThingSpeak cloud platform for storage and monitoring.

A Python-based Artificial Intelligence module uses the Isolation Forest algorithm to analyse historical sensor readings and identify unusual machine behaviour. A Flask-based web application presents sensor measurements, machine health information, anomaly detection results, historical data, and monitoring statistics through a user-friendly dashboard.

The proposed system helps identify abnormal machine conditions at an early stage and supports predictive maintenance decisions.

**Project Scope:** Industrial monitoring, machine learning-based anomaly detection, abnormal condition identification, and fault alerts. The system does not perform automatic equipment repair or recovery.

---

## 2. Project Objectives

The main objectives of this project are:

- To develop an IoT-based industrial machine monitoring system using ESP32.
- To monitor machine temperature and humidity using the DHT11 sensor.
- To measure voltage, current, and power using the INA219 sensor.
- To monitor machine vibration using the MPU6050 sensor.
- To transmit sensor information to the ThingSpeak cloud platform.
- To develop a machine learning model using the Isolation Forest algorithm.
- To identify abnormal machine operating conditions through historical sensor analysis.
- To develop a web dashboard for displaying machine parameters and health information.
- To maintain historical sensor readings and anomaly detection records.
- To provide useful information for predictive maintenance decisions.

---

## 3. System Architecture

The project consists of five major layers.

### Layer 1: Hardware Monitoring Layer

The ESP32 collects sensor readings from the connected hardware components.

Sensors used:

- DHT11 – Temperature and humidity monitoring.
- INA219 – Voltage, current, and power monitoring.
- MPU6050 – Machine vibration monitoring.

The ESP32 also uses an LCD, LEDs, and a buzzer to provide local monitoring and alert indications.

### Layer 2: Cloud Communication Layer

ThingSpeak is used as the IoT cloud platform.

It stores the sensor measurements transmitted by the ESP32 and provides historical readings for further analysis.

### Layer 3: Artificial Intelligence Layer

The Python AI module retrieves historical sensor data from ThingSpeak.

The Isolation Forest algorithm analyses the sensor parameters and identifies unusual operating patterns.

### Layer 4: Backend Application Layer

Flask provides communication between the AI module and the web dashboard.

It reads the generated AI reports and historical data and provides them through API endpoints.

### Layer 5: Web Visualization Layer

The web dashboard displays:

- Sensor measurements.
- Machine health status.
- AI anomaly detection results.
- Sensor monitoring graphs.
- Fault history.
- Monitoring statistics.

### System Architecture Diagram

```text
             INDUSTRIAL MACHINE
                     |
                     v
             ESP32 MICROCONTROLLER
                     |
       +-------------+-------------+
       |             |             |
       v             v             v
    DHT11          INA219        MPU6050
 Temperature     Voltage       Vibration
 Humidity        Current
                 Power
       |             |             |
       +-------------+-------------+
                     |
                     v
              SENSOR PROCESSING
                     |
                     v
              THINGSPEAK CLOUD
                     |
                     v
              PYTHON AI MODULE
                     |
                     v
             DATA PREPROCESSING
                     |
                     v
             FEATURE ENGINEERING
                     |
                     v
            ISOLATION FOREST MODEL
                     |
                     v
             ANOMALY DETECTION
                     |
                     v
             MACHINE HEALTH REPORT
                     |
                     v
                FLASK BACKEND
                     |
                     v
               DASHBOARD API
                     |
                     v
             WEB-BASED DASHBOARD
                     |
          +----------+----------+
          |          |          |
          v          v          v
       SENSOR      AI STATUS   FAULT
       GRAPHS      DISPLAY     HISTORY
```

---

## 4. Hardware Components

| S.No. | Component | Purpose |
|---|---|---|
| 1 | ESP32 DevKit V1 | Main microcontroller |
| 2 | DHT11 | Temperature and humidity measurement |
| 3 | INA219 | Voltage and current measurement |
| 4 | MPU6050 | Vibration monitoring |
| 5 | 16x2 I2C LCD | Local parameter display |
| 6 | Red LED | Critical fault indication |
| 7 | Yellow LED | Warning indication |
| 8 | Green LED | Normal condition indication |
| 9 | Buzzer | Audible alert indication |
| 10 | Relay module | Hardware switching component, if used in the monitoring setup |
| 11 | DC Fan | Physical test load, if used |

**Note:** The relay and fan are not used by the AI module for automatic recovery. Any switching or control function must be treated separately from the anomaly detection functionality.

---

## 5. Hardware Pin Configuration

The following pin configuration is used in the current Arduino source code.

| Component | ESP32 Pin |
|---|---|
| DHT11 Data | GPIO 4 |
| Red LED | GPIO 25 |
| Green LED | GPIO 27 |
| Yellow LED | GPIO 14 |
| Buzzer | GPIO 13 |
| I2C SDA | GPIO 21 |
| I2C SCL | GPIO 22 |

### I2C Devices

The following components share the same I2C communication bus:

- INA219
- MPU6050
- 16x2 I2C LCD

The LCD address used in the Arduino source is `0x27`.

**Important:** Verify the actual sensor addresses, wiring, supply voltage, and GPIO assignments before connecting the hardware.

---

## 6. Software and Technologies

| Technology | Application |
|---|---|
| Arduino IDE | ESP32 programming |
| Embedded C/C++ | Hardware programming |
| Python | AI development and data processing |
| Isolation Forest | Unsupervised anomaly detection |
| Scikit-learn | Machine learning implementation |
| Pandas | Sensor data processing |
| NumPy | Numerical operations |
| Joblib | AI model serialization |
| Requests | ThingSpeak communication |
| ThingSpeak | IoT cloud data storage |
| Flask | Backend development |
| HTML5 | Dashboard structure |
| CSS3 | Dashboard styling |
| JavaScript | Dashboard interaction |
| Chart.js | Sensor data visualization |
| Git and GitHub | Version control and project hosting |

---

## 7. Sensor Data Collection

The ESP32 collects six important machine parameters.

| ThingSpeak Field | Parameter | Unit |
|---|---|---|
| Field 1 | Temperature | °C |
| Field 2 | Humidity | % |
| Field 3 | Bus Voltage | V |
| Field 4 | Current | mA |
| Field 5 | Power | mW |
| Field 6 | Vibration Index | Sensor-derived index |
| Field 7 | ESP32 Fault Code | Numeric code |
| Field 8 | ESP32 Alert Level | Numeric level |

### ESP32 Fault Codes

The current Arduino source uses the following fault codes:

| Fault Code | Description |
|---|---|
| 0 | Normal |
| 1 | Warning |
| 2 | High temperature |
| 3 | Overcurrent |
| 4 | High vibration |
| 5 | Sensor fault |

### ESP32 Alert Levels

| Alert Level | Description |
|---|---|
| 0 | Normal |
| 1 | Warning |
| 2 | Critical |

The fault code and alert level are kept separate from the six AI sensor input features.

---

## 8. Cloud Integration Using ThingSpeak

ThingSpeak is used to store and retrieve the machine sensor readings.

### Cloud Communication Process

1. The ESP32 reads sensor measurements.
2. The ESP32 establishes a Wi-Fi connection.
3. Sensor measurements are uploaded to ThingSpeak.
4. ThingSpeak stores the measurements as channel fields.
5. The Python AI module retrieves historical records using the channel Read API.
6. The AI module processes the retrieved data.

### ThingSpeak Configuration

Create a ThingSpeak channel and configure the following fields:

- Field 1 – Temperature
- Field 2 – Humidity
- Field 3 – Voltage
- Field 4 – Current
- Field 5 – Power
- Field 6 – Vibration
- Field 7 – Fault Code
- Field 8 – Alert Level

The ESP32 requires the channel Write API Key.

The Python application requires the channel Read API Key if the channel is private.

**Security:** Never publish actual API keys, Wi-Fi passwords, or private credentials in the GitHub repository.

---

## 9. Artificial Intelligence and Machine Learning

### Isolation Forest Algorithm

The project uses the Isolation Forest algorithm for unsupervised anomaly detection.

Isolation Forest identifies unusual data points by isolating observations through randomly selected features and split values.

Unusual observations are generally isolated using fewer splits than normal observations.

This makes Isolation Forest suitable for identifying abnormal patterns in industrial sensor data.

### AI Input Parameters

The AI model analyses the following six sensor parameters:

1. Temperature
2. Humidity
3. Voltage
4. Current
5. Power
6. Vibration

### Feature Engineering

The AI module also prepares additional features from the sensor measurements:

- Temperature-to-current ratio.
- Power-to-current ratio.
- Voltage deviation from the observed reference.

These features provide additional information about relationships between machine operating parameters.

### Data Preprocessing

The Python module performs:

- Cloud data retrieval.
- Conversion of sensor values into numeric format.
- Missing-value removal.
- Invalid-value filtering.
- Duplicate timestamp removal.
- Timestamp sorting.
- Normal-operation data selection.
- Feature engineering.
- Feature scaling.

### Model Training

The Isolation Forest model is trained using historical readings selected as normal operation data.

The ESP32 fault code and alert level are used to exclude records already identified as faulty or warning conditions from the training baseline, when those fields are available.

These two fields are not used as direct AI prediction features.

### AI Prediction

The model produces two prediction values:

| Output | Meaning |
|---|---|
| 1 | Normal |
| -1 | Anomaly |

The model also calculates an anomaly score using its decision function.

A negative decision-function score indicates that the observation is classified as an anomaly by the trained model.

**Important:** The anomaly score is not a fault probability. AI predictions require validation using real machine operating data.

---

## 10. Python AI Module

The Python AI module is responsible for analysing historical industrial sensor data.

### Main Functions

- Retrieve sensor records from ThingSpeak.
- Clean and prepare sensor measurements.
- Select known-normal training records.
- Perform feature engineering.
- Train the Isolation Forest algorithm.
- Detect abnormal operating patterns.
- Generate machine health information.
- Save the trained model.
- Store sensor history.
- Record detected anomalies.
- Generate a JSON monitoring report.

### Main Python Files

| File | Purpose |
|---|---|
| `ai_model.py` | Main AI processing and anomaly detection |
| `requirements.txt` | Python dependency list |
| `.env.example` | ThingSpeak configuration template |

### Generated Files

| File | Purpose |
|---|---|
| `isolation_forest_model.pkl` | Saved machine learning model |
| `sensor_history.csv` | Historical sensor readings |
| `anomaly_history.csv` | Detected anomaly records |
| `latest_ai_report.json` | Latest machine health report |
| `ai_system.log` | AI processing log |

Generated files are created when the Python application is executed.

---

## 11. Web Dashboard

The project includes a Flask-based web dashboard for visualizing industrial sensor information and AI analysis results.

### Dashboard Features

#### 1. System Overview

Displays the current availability of AI-generated monitoring information and the latest analysis timestamp.

#### 2. Sensor Monitoring

Displays:

- Temperature in °C.
- Humidity in percentage.
- Voltage in volts.
- Current in milliamperes.
- Power in milliwatts.
- Vibration index.

#### 3. AI Machine Health Analysis

Displays:

- Machine health status.
- AI algorithm name.
- AI prediction.
- Anomaly score.
- Recommended inspection information.

#### 4. Monitoring Statistics

Displays:

- Total sensor readings.
- Normal readings.
- Detected anomalies.
- Anomaly percentage.

#### 5. Sensor Graphs

The dashboard provides graphs for:

- Temperature monitoring.
- Current monitoring.
- Vibration monitoring.
- Humidity monitoring.

#### 6. Anomaly History

Displays historical anomaly records with:

- Timestamp.
- Temperature.
- Current.
- Vibration.
- Anomaly score.
- AI status.

#### 7. Automatic Dashboard Refresh

The dashboard JavaScript periodically requests the Flask API and updates the displayed information.

The current reference implementation uses a 10-second dashboard refresh interval.

The displayed values are the latest values available in the generated AI report, not guaranteed instantaneous hardware measurements.

---

## 12. Backend Integration Using Flask

Flask acts as the backend interface between the Python AI module and the web dashboard.

### Main Backend Responsibilities

- Read the latest AI JSON report.
- Read historical sensor CSV data.
- Read anomaly history.
- Calculate monitoring statistics.
- Provide machine status information.
- Provide graph data.
- Provide anomaly history.
- Expose dashboard API endpoints.

### API Endpoints

| Endpoint | Purpose |
|---|---|
| `/` | Main dashboard page |
| `/api/dashboard` | Sensor readings, AI results, graphs, and statistics |
| `/api/health` | Backend application health information |

### Data Flow

The Python AI module generates the report and history files.

The Flask backend reads these files and converts the information into JSON responses.

The JavaScript frontend receives the JSON responses and updates the dashboard.

---

## 13. Project Folder Structure

```text
industrial-iot-predictive-maintenance/
│
├── arduino/
│   └── industrial_iot_monitor.ino
│
├── python_ai/
│   │
│   ├── ai_model.py
│   ├── requirements.txt
│   ├── .env.example
│   │
│   ├── models/
│   │   └── .gitkeep
│   │
│   ├── data/
│   │   └── .gitkeep
│   │
│   └── logs/
│       └── .gitkeep
│
├── dashboard/
│   │
│   ├── app.py
│   ├── requirements.txt
│   │
│   ├── templates/
│   │   └── index.html
│   │
│   └── static/
│       ├── style.css
│       └── script.js
│
├── README.md
│
└── .gitignore
```

---

## 14. Installation and Setup

### Prerequisites

Install the following software:

- Python 3.10 or later.
- Arduino IDE.
- Git.
- Visual Studio Code (recommended).
- A ThingSpeak account.
- ESP32 board support in Arduino IDE.

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/industrial-iot-predictive-maintenance.git
```

Move into the project directory:

```bash
cd industrial-iot-predictive-maintenance
```

### Step 2: Configure the ESP32

1. Open Arduino IDE.
2. Open `arduino/industrial_iot_monitor.ino`.
3. Install the required Arduino libraries.
4. Enter your Wi-Fi credentials.
5. Enter your ThingSpeak channel ID and Write API Key.
6. Select the correct ESP32 board and COM port.
7. Upload the program.

### Step 3: Configure the Python AI Module

Move into the Python AI folder:

```bash
cd python_ai
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file using `.env.example` as a template.

Configure:

```env
THINGSPEAK_CHANNEL_ID=YOUR_CHANNEL_ID
THINGSPEAK_READ_API_KEY=YOUR_READ_API_KEY

FETCH_LIMIT=8000
MIN_TRAINING_SAMPLES=50
CONTAMINATION=0.03
N_ESTIMATORS=300
```

The example values are initial configuration settings and should be calibrated using actual operating data.

### Step 4: Run the AI Module

```bash
python ai_model.py
```

The module retrieves historical ThingSpeak data, trains the Isolation Forest model, performs anomaly analysis, and generates the monitoring report.

### Step 5: Install Dashboard Dependencies

Open another terminal.

Move to the dashboard directory:

```bash
cd dashboard
```

Install the dashboard requirements:

```bash
pip install -r requirements.txt
```

### Step 6: Start the Flask Backend

Run:

```bash
python app.py
```

The Flask development server will start at:

```text
http://127.0.0.1:5000
```

### Step 7: Open the Dashboard

Open the following address in your browser:

```text
http://127.0.0.1:5000
```

The dashboard will display the information available in the AI-generated reports and historical data files.

**Note:** The current AI module and Flask backend are separate processes. Run the AI module again when you want to generate an updated report. The dashboard refreshes its display automatically but does not itself trigger AI analysis.

---

## 15. Data Storage and Output

The project uses CSV, JSON, and Joblib files for storing the AI model and monitoring information.

### Sensor History

` sensor_history.csv `

Stores historical readings collected from ThingSpeak.

### Anomaly History

` anomaly_history.csv `

Stores records classified as anomalous by the AI model.

### AI Model

` isolation_forest_model.pkl `

Stores the trained Isolation Forest model and associated configuration.

### Latest AI Report

` latest_ai_report.json `

Stores the latest machine sensor readings, AI prediction, anomaly score, and machine health assessment.

### Log File

` ai_system.log `

Stores application execution information and error messages.

---

## 16. Testing and Validation Plan

The system should be evaluated using different machine operating conditions.

| Test Case | Test Condition | Expected Observation |
|---|---|---|
| 1 | Normal machine operation | Normal sensor readings |
| 2 | Increased temperature | Temperature variation displayed |
| 3 | Increased current | Current variation displayed |
| 4 | Increased vibration | Vibration variation displayed |
| 5 | Combined abnormal readings | AI anomaly detection evaluated |
| 6 | Wi-Fi disconnection | Cloud communication interruption |
| 7 | Missing sensor reading | Invalid or incomplete data handled |
| 8 | ThingSpeak unavailable | Data retrieval error recorded |
| 9 | Dashboard unavailable report | Waiting or unavailable status displayed |
| 10 | Historical anomaly analysis | Anomaly records displayed |

### Performance Evaluation

The system can be evaluated using:

- Sensor measurement accuracy.
- Data transmission reliability.
- Cloud data availability.
- AI anomaly detection performance.
- False positive rate.
- False negative rate.
- Dashboard response time.
- Historical data consistency.

For a proper machine learning evaluation, labelled normal and faulty test records should be collected separately. Precision, recall, F1-score, and confusion matrix can then be calculated.

---

## 17. Advantages

- Continuous industrial parameter monitoring.
- Cloud-based sensor data storage.
- Machine learning-based anomaly identification.
- Detection of unusual combinations of sensor readings.
- Historical monitoring and anomaly records.
- Web-based visualization.
- Modular hardware and software architecture.
- Support for predictive maintenance decisions.
- Easy extension with additional sensors and AI models.

---

## 18. Applications

The proposed system can be adapted for:

- Industrial motor monitoring.
- Manufacturing equipment monitoring.
- Industrial fan monitoring.
- Pump condition monitoring.
- Small industrial machinery.
- Laboratory equipment monitoring.
- Electrical equipment condition monitoring.
- IoT-based industrial monitoring systems.

The sensors and model must be calibrated for the specific equipment and operating conditions before practical industrial deployment.

---

## 19. Current Limitations

- AI detection quality depends on the quantity and quality of historical sensor data.
- Isolation Forest may identify unusual readings that are not actual equipment faults.
- Initial model parameters require calibration.
- ThingSpeak communication depends on network availability.
- Dashboard information depends on the latest generated AI report.
- Sensor accuracy and mounting conditions affect vibration and electrical measurements.
- The current reference implementation uses file-based communication between the AI module and Flask backend.
- The current implementation requires additional validation before real industrial deployment.

---

## 20. Future Enhancements

The following features can be considered in future development:

1. Continuous AI monitoring with scheduled inference.
2. Separation of model training and real-time prediction.
3. Advanced machine learning algorithms for comparative analysis.
4. Equipment-specific anomaly thresholds.
5. Email and mobile fault notifications.
6. Long-term sensor trend analysis.
7. Predictive maintenance scheduling.
8. Database integration for larger historical datasets.
9. User authentication and dashboard access control.
10. Cloud deployment of the Flask application.
11. Model performance evaluation using labelled fault datasets.
12. Support for additional industrial sensors.

---

## 21. Safety and Project Scope

This project is developed for industrial condition monitoring and predictive maintenance research.

It identifies unusual sensor readings and provides monitoring information for inspection.

The system does not automatically repair equipment, reset machinery, or perform automatic recovery operations.

Any practical industrial deployment must use independently designed safety protection systems and appropriate engineering validation.

---

## 22. Contributors

**Project Domain:** Electronics and Communication Engineering

**Project Category:** Industrial IoT, Artificial Intelligence, Embedded Systems and Predictive Maintenance

**Development Areas:**

- ESP32 Embedded Programming
- Sensor Interfacing
- IoT Cloud Integration
- Python Machine Learning
- Web Application Development
- Industrial Anomaly Detection

---

## 23. License

This project is distributed under the MIT License.

See the `LICENSE` file for more information.

---

## 24. Acknowledgement

We acknowledge the support of our institution, faculty members, and project guidance team in developing this Industrial IoT Predictive Maintenance System.

We also acknowledge the developers and communities behind ESP32, Arduino, Python, Scikit-learn, Flask, ThingSpeak, and Chart.js for providing the technologies and resources used in this project.

---

## 25. Keywords

Industrial IoT, Predictive Maintenance, ESP32, Machine Learning, Artificial Intelligence, Isolation Forest, Anomaly Detection, Fault Monitoring, ThingSpeak, Flask, Python, DHT11, INA219, MPU6050, Sensor Monitoring, Industrial Automation.
