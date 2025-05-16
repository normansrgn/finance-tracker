"use client";
import { useState, useEffect, useRef } from "react";
import { FaWallet } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { Container, Col, Row, Form, Modal, Button } from "react-bootstrap";
import { FaRegCreditCard } from "react-icons/fa6";
import { BanknoteArrowUp } from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components with proper error handling
try {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    BarElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
} catch (error) {
  console.error("ChartJS registration error:", error);
}

// Utility function to get current month
const getCurrentMonth = () => {
  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];
  return months[new Date().getMonth()] || "Май";
};

// Initialize chart data from localStorage or use default
const initializeChartData = () => {
  try {
    const savedData = localStorage.getItem("chartData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (
        parsedData.labels &&
        Array.isArray(parsedData.labels) &&
        parsedData.datasets &&
        Array.isArray(parsedData.datasets) &&
        parsedData.datasets.length === 2 &&
        parsedData.datasets[0].data.length === parsedData.labels.length &&
        parsedData.datasets[1].data.length === parsedData.labels.length
      ) {
        return parsedData;
      }
    }
  } catch (error) {
    console.error("Error parsing chartData from localStorage:", error);
  }
  const labels = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];
  return {
    labels,
    datasets: [
      {
        label: "Доход",
        data: new Array(labels.length).fill(0),
        borderColor: "#6359E9",
        backgroundColor: "rgba(99, 89, 233, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#6359E9",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#6359E9",
      },
      {
        label: "Траты",
        data: new Array(labels.length).fill(0),
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#FF6384",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#FF6384",
      },
    ],
  };
};

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

// Predefined expense categories with colors
const expenseCategories = [
  { name: "Еда", color: "#FF6384" },
  { name: "Транспорт", color: "#36A2EB" },
  { name: "Развлечения", color: "#FFCE56" },
  { name: "Счета", color: "#4BC0C0" },
  { name: "Покупки", color: "#9966FF" },
  { name: "Другое", color: "#FF9F40" },
];

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [balance, setBalance] = useState(() => {
    try {
      return Number(localStorage.getItem("balance")) || 0;
    } catch (error) {
      console.error("Error reading balance from localStorage:", error);
      return 0;
    }
  });
  const [income, setIncome] = useState(() => {
    try {
      return Number(localStorage.getItem("income")) || 0;
    } catch (error) {
      console.error("Error reading income from localStorage:", error);
      return 0;
    }
  });
  const [expenses, setExpenses] = useState(() => {
    try {
      return Number(localStorage.getItem("expenses")) || 0;
    } catch (error) {
      console.error("Error reading expenses from localStorage:", error);
      return 0;
    }
  });
  const [chartData, setChartData] = useState(initializeChartData());
  const [expenseDetails, setExpenseDetails] = useState(
    initializeExpenseDetails()
  );

  // Modal states
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  // Form states
  const [balanceAmount, setBalanceAmount] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [incomeDescription, setIncomeDescription] = useState("");
  const [expenseCategory, setExpenseCategory] = useState(
    expenseCategories[0].name
  );

  // Refs for plus icons to get their positions
  const balancePlusRef = useRef(null);
  const incomePlusRef = useRef(null);
  const expensePlusRef = useRef(null);

  // Save to localStorage whenever balance, income, expenses, chartData, or expenseDetails changes
  useEffect(() => {
    try {
      localStorage.setItem("balance", balance.toString());
      localStorage.setItem("income", income.toString());
      localStorage.setItem("expenses", expenses.toString());
      localStorage.setItem("chartData", JSON.stringify(chartData));
      localStorage.setItem("expenseDetails", JSON.stringify(expenseDetails));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [balance, income, expenses, chartData, expenseDetails]);

  // Aggregate expenses by category for the current month
  const getCategoryAnalytics = () => {
    const currentMonth = getCurrentMonth();
    const monthDetails = expenseDetails[currentMonth] || [];
    const categorySums = {};
    expenseCategories.forEach((cat) => {
      categorySums[cat.name] = 0;
    });
    monthDetails.forEach((detail) => {
      categorySums[detail.category] =
        (categorySums[detail.category] || 0) + detail.amount;
    });
    return categorySums;
  };

  const categoryAnalytics = getCategoryAnalytics();

  // Filter data based on selected month
  const getFilteredData = () => {
    if (selectedMonth === "all") {
      return chartData;
    }
    const monthIndex = chartData.labels.indexOf(selectedMonth);
    if (monthIndex === -1) {
      return chartData;
    }

    // Aggregate expenses by category for the selected month
    const monthDetails = expenseDetails[selectedMonth] || [];
    const categorySums = {};
    expenseCategories.forEach((cat) => {
      categorySums[cat.name] = 0;
    });
    monthDetails.forEach((detail) => {
      categorySums[detail.category] =
        (categorySums[detail.category] || 0) + detail.amount;
    });

    // Create datasets: one for income
    const datasets = [
      {
        label: "Доход",
        data: [chartData.datasets[0].data[monthIndex] || 0],
        backgroundColor: "#6359E9",
        borderColor: "#6359E9",
        borderWidth: 1,
      },
      ...expenseCategories.map((category) => ({
        label: category.name,
        data: [categorySums[category.name] || 0],
        backgroundColor: category.color,
        borderColor: category.color,
        borderWidth: 1,
      })),
    ];

    return {
      labels: ["Доход", ...expenseCategories.map((cat) => cat.name)],
      datasets,
    };
  };

  const filteredData = getFilteredData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#FFFFFF",
          font: { size: 14 },
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
            const datasetLabel = context.dataset.label || "";
            const value = context.parsed.y || context.parsed;
            let label = `${datasetLabel}: ${value.toLocaleString("ru-RU")} ₽`;

            if (datasetLabel !== "Доход" && selectedMonth !== "all") {
              const month = selectedMonth;
              const details =
                expenseDetails[month]?.filter(
                  (detail) => detail.category === datasetLabel
                ) || [];
              if (details.length > 0) {
                label += `\nПодробности:\n${details
                  .map(
                    (detail) =>
                      `- ${detail.amount.toLocaleString("ru-RU")} ₽${
                        detail.description ? ` (${detail.description})` : ""
                      }`
                  )
                  .join("\n")}`;
              }
            } else if (datasetLabel === "Траты" && selectedMonth === "all") {
              const month = chartData.labels[context.dataIndex];
              const details = expenseDetails[month] || [];
              if (details.length > 0) {
                label += `\nКатегории:\n${details
                  .map(
                    (detail) =>
                      `- ${detail.category}: ${detail.amount.toLocaleString(
                        "ru-RU"
                      )} ₽${
                        detail.description ? ` (${detail.description})` : ""
                      }`
                  )
                  .join("\n")}`;
              }
            }
            return label.split("\n");
          },
        },
      },
      title: {
        display: true,
        text:
          selectedMonth !== "all"
            ? `Доходы и Траты за ${selectedMonth}`
            : "Доходы и Траты за год",
        color: "#FFFFFF",
        font: { size: 18, weight: "bold" },
        padding: { bottom: 20 },
      },
    },
    scales:
      selectedMonth === "all"
        ? {
            x: {
              grid: { display: false },
              ticks: { color: "#A6A6A6" },
            },
            y: {
              grid: { color: "#282C35" },
              ticks: {
                color: "#A6A6A6",
                callback: (value) => `${value.toLocaleString("ru-RU")} ₽`,
              },
              title: {
                display: true,
                text: "Сумма (₽)",
                color: "#FFFFFF",
                font: { size: 14 },
              },
            },
          }
        : {
            x: {
              grid: { display: false },
              ticks: { color: "#A6A6A6" },
            },
            y: {
              grid: { color: "#282C35" },
              ticks: {
                color: "#A6A6A6",
                callback: (value) => `${value.toLocaleString("ru-RU")} ₽`,
              },
              title: {
                display: true,
                text: "Сумма (₽)",
                color: "#FFFFFF",
                font: { size: 14 },
              },
            },
          },
  };

  // Handle plus icon clicks to set modal position
  const handlePlusClick = (ref, setShow) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setModalPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX - 150,
      });
      setShow(true);
    }
  };

  // Handle form submissions
  const handleBalanceSubmit = () => {
    const amount = parseFloat(balanceAmount);
    if (!isNaN(amount)) {
      setBalance((prev) => prev + amount);
      setBalanceAmount("");
      setShowBalanceModal(false);
    }
  };

  const handleIncomeSubmit = () => {
    const amount = parseFloat(incomeAmount);
    if (!isNaN(amount)) {
      const currentMonth = getCurrentMonth();
      const monthIndex = chartData.labels.indexOf(currentMonth);
      if (monthIndex === -1) {
        console.error("Current month not found in chart labels");
        return;
      }

      setChartData((prev) => {
        const newData = { ...prev };
        newData.datasets[0].data[monthIndex] =
          (newData.datasets[0].data[monthIndex] || 0) + amount;
        return newData;
      });

      setIncome((prev) => prev + amount);
      setBalance((prev) => prev + amount);
      setIncomeAmount("");
      setIncomeDescription("");
      setShowIncomeModal(false);
    }
  };

  const handleExpenseSubmit = () => {
    const amount = parseFloat(expenseAmount);
    if (!isNaN(amount)) {
      const currentMonth = getCurrentMonth();
      const monthIndex = chartData.labels.indexOf(currentMonth);
      if (monthIndex === -1) {
        console.error("Current month not found in chart labels");
        return;
      }

      setChartData((prev) => {
        const newData = { ...prev };
        newData.datasets[1].data[monthIndex] =
          (newData.datasets[1].data[monthIndex] || 0) + amount;
        return newData;
      });

      setExpenseDetails((prev) => {
        const newDetails = { ...prev };
        if (!newDetails[currentMonth]) {
          newDetails[currentMonth] = [];
        }
        newDetails[currentMonth].push({
          amount,
          category: expenseCategory,
          description: expenseDescription,
        });
        return newDetails;
      });

      setExpenses((prev) => prev + amount);
      setBalance((prev) => prev - amount);
      setExpenseAmount("");
      setExpenseDescription("");
      setExpenseCategory(expenseCategories[0].name);
      setShowExpenseModal(false);
    }
  };

  return (
    <Container className="pt-[16px] text-white">
      <style jsx global>{`
        .custom-modal .modal-content {
          background-color: #1a1c22;
          border-radius: 12px;
          border: 1px solid #6359e9;
          box-shadow: 0 4px 20px rgba(99, 89, 233, 0.3);
          width: 300px;
          animation: slideIn 0.3s ease-out;
        }
        .custom-modal .modal-header {
          border-bottom: 1px solid #282c35;
          padding: 12px 16px;
        }
        .custom-modal .modal-title {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }
        .custom-modal .modal-body {
          padding: 16px;
        }
        .custom-modal .modal-footer {
          border-top: 1px solid #282c35;
          padding: 12px 16px;
          justify-content: space-between;
        }
        .custom-modal .btn-primary {
          background-color: #6359e9;
          border-color: #6359e9;
          font-size: 14px;
          padding: 6px 16px;
          transition: background-color 0.2s;
        }
        .custom-modal .btn-primary:hover {
          background-color: #4b46b3;
          border-color: #4b46b3;
        }
        .custom-modal .btn-secondary {
          background-color: #282c35;
          border-color: #282c35;
          color: #a6a6a6;
          font-size: 14px;
          padding: 6px 16px;
          transition: background-color 0.2s;
        }
        .custom-modal .btn-secondary:hover {
          background-color: #3a3f4a;
          border-color: #3a3f4a;
        }
        .custom-modal .form-control,
        .custom-modal .form-select {
          background-color: #282c35;
          border: 1px solid #6359e9;
          color: #ffffff;
          font-size: 14px;
          padding: 8px;
          border-radius: 8px;
        }
        .custom-modal .form-control:focus,
        .custom-modal .form-select:focus {
          background-color: #282c35;
          border-color: #8b84ff;
          box-shadow: 0 0 0 0.2rem rgba(99, 89, 233, 0.25);
          color: #ffffff;
        }
        .custom-modal .form-label {
          color: #a6a6a6;
          font-size: 13px;
          margin-bottom: 6px;
        }
        .custom-modal .close {
          color: #a6a6a6;
          opacity: 0.8;
          font-size: 18px;
        }
        .custom-modal .close:hover {
          opacity: 1;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .analytics__category-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .analytics__category-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
      `}</style>

      <div className="home__title pl-[24px]">
        <h1 className="text-[25px] font-bold">
          Добро пожаловать, пользователь!
        </h1>
        <p className="text-[17px] text-[#A6A6A6] font-medium">
          Вот что происходит с вашими финансами сегодня.
        </p>
      </div>

      <div className="home__balanceBlocks mt-[22px] px-[24px]">
        <Row>
          <Col md={3} className="mb-[16px]">
            <div className="home__balance p-[15px] flex justify-around gap-[10px] items-center bg-[#1A1C22] rounded-lg">
              <div className="page__icon p-[10px] bg-[#282C35] rounded-[8px]">
                <FaWallet size={18} color="#6359E9" />
              </div>
              <div className="home__balance-summ flex flex-col items-start text-white text-lg font-semibold">
                <div className="home__balance-title font-normal text-[11px] text-[#9E9E9E]">
                  Баланс
                </div>
                <span>{balance.toLocaleString("ru-RU")} ₽</span>
              </div>
              <GoPlus
                ref={balancePlusRef}
                className="cursor-pointer"
                color="#6359E9"
                onClick={() =>
                  handlePlusClick(balancePlusRef, setShowBalanceModal)
                }
              />
            </div>
          </Col>
          <Col md={3} className="mb-[16px]">
            <div className="home__balance p-[15px] flex justify-around gap-[10px] items-center bg-[#1A1C22] rounded-lg">
              <div className="page__icon p-[10px] bg-[#282C35] rounded-[8px]">
                <BanknoteArrowUp size={18} color="#6359E9" />
              </div>
              <div className="home__balance-summ flex flex-col items-start text-white text-lg font-semibold">
                <div className="home__balance-title font-normal text-[11px] text-[#9E9E9E]">
                  Доход
                </div>
                <span>{income.toLocaleString("ru-RU")} ₽</span>
              </div>
              <GoPlus
                ref={incomePlusRef}
                className="cursor-pointer"
                color="#6359E9"
                onClick={() =>
                  handlePlusClick(incomePlusRef, setShowIncomeModal)
                }
              />
            </div>
          </Col>
          <Col md={3} className="mb-[16px]">
            <div className="home__balance p-[15px] flex justify-around gap-[10px] items-center bg-[#1A1C22] rounded-lg">
              <div className="page__icon p-[10px] bg-[#282C35] rounded-[8px]">
                <FaRegCreditCard size={18} color="#6359E9" />
              </div>
              <div className="home__balance-summ flex flex-col items-start text-white text-lg font-semibold">
                <div className="home__balance-title font-normal text-[11px] text-[#9E9E9E]">
                  Траты
                </div>
                <span>{expenses.toLocaleString("ru-RU")} ₽</span>
              </div>
              <GoPlus
                ref={expensePlusRef}
                className="cursor-pointer"
                color="#6359E9"
                onClick={() =>
                  handlePlusClick(expensePlusRef, setShowExpenseModal)
                }
              />
            </div>
          </Col>
        </Row>
      </div>

      <div className="home__chart mt-[12px] px-[24px]">
        <Row>
          <Col md={9}>
            <div className="bg-[#1A1C22] p-[20px] rounded-lg">
              <Form.Group className="mb-[20px] w-[200px]">
                <Form.Label className="text-white text-[14px] font-medium">
                  Выберите месяц
                </Form.Label>
                <Form.Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-[#282C35] text-white border-[#6359E9] focus:border-[#6359E9] focus:ring-[#6359E9]"
                >
                  <option value="all">Все месяцы</option>
                  {chartData.labels.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <div className="w-full" style={{ height: "400px" }}>
                {selectedMonth === "all" ? (
                  <Line data={filteredData} options={chartOptions} />
                ) : (
                  <Bar data={filteredData} options={chartOptions} />
                )}
              </div>
            </div>
          </Col>
          <Col md="">
            <div className="home__balance p-[15px] flex flex-col gap-[10px] bg-[#1A1C22] rounded-lg">
              <div className="home__balance-title font-normal text-[11px] text-[#9E9E9E]">
                Аналитика за {getCurrentMonth()}
              </div>
              <div className="analytics__categories">
                {expenseCategories.map((category) => (
                  <div key={category.name} className="analytics__category-item">
                    <div
                      className="analytics__category-color"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-white text-[14px]">
                      {category.name}:{" "}
                      {(categoryAnalytics[category.name] || 0).toLocaleString(
                        "ru-RU"
                      )}{" "}
                      ₽
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Balance Modal */}
      <Modal
        show={showBalanceModal}
        onHide={() => setShowBalanceModal(false)}
        className="custom-modal"
        style={{
          position: "absolute",
          top: `${modalPosition.top}px`,
          left: `${modalPosition.left}px`,
          transform: "translateX(-50%)",
        }}
        dialogClassName="modal-dialog"
        backdrop={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Добавить к балансу</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Сумма (₽)</Form.Label>
            <Form.Control
              type="number"
              value={balanceAmount}
              onChange={(e) => setBalanceAmount(e.target.value)}
              placeholder="Введите сумму"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowBalanceModal(false)}
          >
            Отмена
          </Button>
          <Button variant="primary" onClick={handleBalanceSubmit}>
            Добавить
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Income Modal */}
      <Modal
        show={showIncomeModal}
        onHide={() => setShowIncomeModal(false)}
        className="custom-modal"
        style={{
          position: "absolute",
          top: `${modalPosition.top}px`,
          left: `${modalPosition.left}px`,
          transform: "translateX(-50%)",
        }}
        dialogClassName="modal-dialog"
        backdrop={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Добавить доход</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Сумма (₽)</Form.Label>
            <Form.Control
              type="number"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              placeholder="Введите сумму"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Описание (необязательно)</Form.Label>
            <Form.Control
              type="text"
              value={incomeDescription}
              onChange={(e) => setIncomeDescription(e.target.value)}
              placeholder="Источник дохода"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowIncomeModal(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleIncomeSubmit}>
            Добавить
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Expense Modal */}
      <Modal
        show={showExpenseModal}
        onHide={() => setShowExpenseModal(false)}
        className="custom-modal"
        style={{
          position: "absolute",
          top: `${modalPosition.top}px`,
          left: `${modalPosition.left}px`,
          transform: "translateX(-50%)",
        }}
        dialogClassName="modal-dialog"
        backdrop={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Добавить расход</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Сумма (₽)</Form.Label>
            <Form.Control
              type="number"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder="Введите сумму"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Категория</Form.Label>
            <Form.Select
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
            >
              {expenseCategories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Описание (необязательно)</Form.Label>
            <Form.Control
              type="text"
              value={expenseDescription}
              onChange={(e) => setExpenseDescription(e.target.value)}
              placeholder="На что потрачено"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowExpenseModal(false)}
          >
            Отмена
          </Button>
          <Button variant="primary" onClick={handleExpenseSubmit}>
            Добавить
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
