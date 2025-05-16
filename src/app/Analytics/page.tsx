"use client";
import { useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
try {
  ChartJS.register(ArcElement, Tooltip, Legend);
} catch (error) {
  console.error("ChartJS registration error:", error);
}

// Predefined expense categories with colors
const expenseCategories = [
  { name: "Еда", color: "#FF6384" },
  { name: "Транспорт", color: "#36A2EB" },
  { name: "Развлечения", color: "#FFCE56" },
  { name: "Счета", color: "#4BC0C0" },
  { name: "Покупки", color: "#9966FF" },
  { name: "Другое", color: "#FF9F40" },
];

// Initialize expense details from localStorage or use default
const initializeExpenseDetails = () => {
  try {
    const savedData = localStorage.getItem("expenseDetails");
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error("Error parsing expenseDetails from localStorage:", error);
  }
  return {};
};

export default function Analytics() {
  const [expenseDetails] = useState(initializeExpenseDetails());
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  // Aggregate expenses by category
  const getChartData = () => {
    const categorySums = {};
    expenseCategories.forEach((cat) => {
      categorySums[cat.name] = 0;
    });

    // Sum expenses for each category
    Object.keys(expenseDetails).forEach((month) => {
      if (selectedPeriod === "all" || month === selectedPeriod) {
        expenseDetails[month].forEach((detail) => {
          categorySums[detail.category] =
            (categorySums[detail.category] || 0) + detail.amount;
        });
      }
    });

    // Prepare chart data
    const labels = expenseCategories.map((cat) => cat.name);
    const data = expenseCategories.map((cat) => categorySums[cat.name] || 0);
    const backgroundColors = expenseCategories.map((cat) => cat.color);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: "#1A1C22",
          borderWidth: 2,
        },
      ],
    };
  };

  const chartData = getChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#FFFFFF",
          font: { size: 14 },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "#282C35",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF",
        borderColor: "#6359E9",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value.toLocaleString("ru-RU")} ₽ (${percentage}%)`;
          },
        },
      },
      title: {
        display: true,
        text: "Распределение расходов по категориям",
        color: "#FFFFFF",
        font: { size: 18, weight: "bold" },
        padding: { bottom: 20 },
      },
    },
  };

  return (
    <Container className="pt-[16px] text-white">
      <style jsx global>{`
        .analytics__title {
          padding-left: 24px;
        }
        .analytics__chart {
          background-color: #1a1c22;
          padding: 20px;
          border-radius: 12px;
          margin-top: 12px;
          margin-left: 24px;
          margin-right: 24px;
        }
        .form-select {
          background-color: #282c35;
          border: 1px solid #6359e9;
          color: #ffffff;
          font-size: 14px;
          padding: 8px;
          border-radius: 8px;
        }
        .form-select:focus {
          background-color: #282c35;
          border-color: #8b84ff;
          box-shadow: 0 0 0 0.2rem rgba(99, 89, 233, 0.25);
          color: #ffffff;
        }
        .form-label {
          color: #ffffff;
          font-size: 14px;
          font-weight: medium;
        }
      `}</style>

      <div className="analytics__title">
        <h1 className="text-[25px] font-bold">Аналитика расходов</h1>
        <p className="text-[17px] text-[#A6A6A6] font-medium">
          Узнайте, на что вы тратите больше всего.
        </p>
      </div>

      <div className="analytics__chart">
        <Form.Group className="mb-[20px] w-[200px]">
          <Form.Label>Выберите период</Form.Label>
          <Form.Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-[#282C35] text-white border-[#6359E9] focus:border-[#6359E9] focus:ring-[#6359E9]"
          >
            <option value="all">Все время</option>
            {Object.keys(expenseDetails).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <div style={{ height: "400px" }}>
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
    </Container>
  );
}