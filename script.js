
/*
====================================================
INDUSTRIAL IoT DASHBOARD
Frontend API and Chart Management
====================================================
*/

const API_URL = "/api/dashboard";

const REFRESH_INTERVAL = 10000;

let charts = {};


// --------------------------------------------------
// 1. FORMAT VALUES
// --------------------------------------------------

function formatValue(value, decimals = 2) {

    if (value === null || value === undefined) {
        return "--";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "--";
    }

    return number.toFixed(decimals);
}


// --------------------------------------------------
// 2. UPDATE SENSOR CARDS
// --------------------------------------------------

function updateSensorCards(machine) {

    document.getElementById("temperature").textContent =
        formatValue(machine.temperature);

    document.getElementById("humidity").textContent =
        formatValue(machine.humidity);

    document.getElementById("voltage").textContent =
        formatValue(machine.voltage);

    document.getElementById("current").textContent =
        formatValue(machine.current);

    document.getElementById("power").textContent =
        formatValue(machine.power);

    document.getElementById("vibration").textContent =
        formatValue(machine.vibration);

}


// --------------------------------------------------
// 3. UPDATE MACHINE HEALTH
// --------------------------------------------------

function updateMachineHealth(machine) {

    const health =
        document.getElementById("machineHealth");

    const message =
        document.getElementById("aiMessage");

    const indicator =
        document.getElementById("healthIndicator");

    const aiStatus =
        document.getElementById("aiStatus");

    const score =
        document.getElementById("anomalyScore");

    const model =
        document.getElementById("aiModel");

    model.textContent = machine.model || "Isolation Forest";

    aiStatus.textContent =
        machine.ai_status || "--";

    score.textContent =
        formatValue(machine.anomaly_score, 5);

    health.textContent =
        machine.machine_health || "UNKNOWN";

    message.textContent =
        machine.recommended_action || "No information available";

    indicator.className = "health-indicator";

    if (machine.ai_status === "NORMAL") {

        indicator.classList.add("normal");

        indicator.textContent = "✓";

    } else if (machine.ai_status === "ANOMALY") {

        indicator.classList.add("anomaly");

        indicator.textContent = "!";

    } else {

        indicator.textContent = "?";

    }

}


// --------------------------------------------------
// 4. UPDATE CONNECTION STATUS
// --------------------------------------------------

function updateConnectionStatus(isOnline) {

    const element =
        document.getElementById("connectionStatus");

    if (isOnline) {

        element.textContent = "AI DATA AVAILABLE";

        element.className = "status-badge online";

    } else {

        element.textContent = "DATA UNAVAILABLE";

        element.className = "status-badge offline";

    }

}


// --------------------------------------------------
// 5. UPDATE STATISTICS
// --------------------------------------------------

function updateStatistics(statistics) {

    document.getElementById("totalReadings").textContent =
        statistics.total_readings ?? 0;

    document.getElementById("normalReadings").textContent =
        statistics.normal_readings ?? 0;

    document.getElementById("totalAnomalies").textContent =
        statistics.total_anomalies ?? 0;

    document.getElementById("anomalyPercentage").textContent =
        `${statistics.anomaly_percentage ?? 0}%`;

}


// --------------------------------------------------
// 6. CREATE CHART
// --------------------------------------------------

function createChart(canvasId, label, color, labels, values) {

    const canvas = document.getElementById(canvasId);

    if (!canvas) return;

    if (charts[canvasId]) {

        charts[canvasId].data.labels = labels;

        charts[canvasId].data.datasets[0].data = values;

        charts[canvasId].update();

        return;

    }

    charts[canvasId] = new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{

                label: label,

                data: values,

                borderColor: color,

                backgroundColor: color + "22",

                fill: true,

                tension: 0.3,

                pointRadius: 2

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {
                intersect: false,
                mode: "index"
            },

            plugins: {

                legend: {
                    display: true
                }

            },

            scales: {

                y: {
                    beginAtZero: false
                }

            }

        }

    });

}


// --------------------------------------------------
// 7. UPDATE ALL SENSOR GRAPHS
// --------------------------------------------------

function updateCharts(history) {

    if (!Array.isArray(history)) return;

    const labels = history.map(item => {

        if (!item.time) return "--";

        const date = new Date(item.time);

        return Number.isNaN(date.getTime())
            ? "--"
            : date.toLocaleTimeString();

    });

    createChart(
        "temperatureChart",
        "Temperature (°C)",
        "#e45d5d",
        labels,
        history.map(item => item.temperature)
    );

    createChart(
        "currentChart",
        "Current (mA)",
        "#2563eb",
        labels,
        history.map(item => item.current)
    );

    createChart(
        "vibrationChart",
        "Vibration",
        "#8b5cf6",
        labels,
        history.map(item => item.vibration)
    );

    createChart(
        "humidityChart",
        "Humidity (%)",
        "#16a36a",
        labels,
        history.map(item => item.humidity)
    );

}


// --------------------------------------------------
// 8. UPDATE FAULT HISTORY TABLE
// --------------------------------------------------

function updateFaultTable(faults) {

    const table =
        document.getElementById("faultTable");

    table.replaceChildren();

    if (!Array.isArray(faults) || faults.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 6;

        cell.textContent = "No anomaly records available.";

        row.appendChild(cell);

        table.appendChild(row);

        return;

    }

    faults.forEach(fault => {

        const row = document.createElement("tr");

        const values = [

            fault.time,

            formatValue(fault.temperature),

            formatValue(fault.current),

            formatValue(fault.vibration),

            formatValue(fault.score, 5)

        ];

        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value ?? "--";

            row.appendChild(cell);

        });

        const statusCell = document.createElement("td");

        const tag = document.createElement("span");

        tag.className = "anomaly-tag";

        tag.textContent = fault.status || "ANOMALY";

        statusCell.appendChild(tag);

        row.appendChild(statusCell);

        table.appendChild(row);

    });

}


// --------------------------------------------------
// 9. FETCH DASHBOARD DATA
// --------------------------------------------------

async function refreshDashboard() {

    const refreshButton =
        document.getElementById("refreshButton");

    refreshButton.disabled = true;

    try {

        const response = await fetch(API_URL, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Dashboard API request failed");
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "API error");
        }

        updateConnectionStatus(true);

        const machine = data.machine || {};

        if (machine.available) {

            updateSensorCards(machine);

            updateMachineHealth(machine);

            document.getElementById("lastUpdated").textContent =
                "AI analysis: " +
                (machine.analysis_time || "Available");

        } else {

            document.getElementById("machineHealth").textContent =
                "WAITING FOR AI DATA";

            document.getElementById("aiMessage").textContent =
                machine.message || "No AI report available.";

            document.getElementById("healthIndicator").textContent =
                "?";

        }

        updateStatistics(data.statistics || {});

        updateCharts(data.history || []);

        updateFaultTable(data.faults || []);

    } catch (error) {

        console.error("Dashboard error:", error);

        updateConnectionStatus(false);

        document.getElementById("lastUpdated").textContent =
            "Unable to retrieve dashboard data.";

    } finally {

        refreshButton.disabled = false;

    }

}


// --------------------------------------------------
// 10. BUTTON AND AUTOMATIC REFRESH
// --------------------------------------------------

document
    .getElementById("refreshButton")
    .addEventListener("click", refreshDashboard);

refreshDashboard();

setInterval(
    refreshDashboard,
    REFRESH_INTERVAL
);
