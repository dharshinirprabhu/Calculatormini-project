
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState([]);

  const operators = ["+", "-", "*", "/"];

  const calculate = (exp) => {
    try {
      if (!exp || /[+\-*/.]$/.test(exp)) return null;
      if (!/^[0-9+\-*/.() ]+$/.test(exp)) return null;

      const result = Function(`"use strict"; return (${exp})`)();

      if (!Number.isFinite(result)) return "Error";

      return String(Number(result.toPrecision(12)));
    } catch {
      return null;
    }
  };

  const handleClick = (value) => {
    if (value === "AC") {
      setDisplay("0");
      setExpression("");
      return;
    }

    if (value === "DEL") {
      setExpression((prev) => prev.slice(0, -1));
      setDisplay((prev) => prev.length <= 1 ? "0" : prev.slice(0, -1));
      return;
    }

    if (value === "=") {
      const result = calculate(expression);

      if (result !== null) {
        if (result !== "Error") {
          setHistory((prev) => [
            { expression, result },
            ...prev.slice(0, 4),
          ]);
        }

        setDisplay(result);
        setExpression(result === "Error" ? "" : result);
      }
      return;
    }

    if (value === "%") {
      const result = calculate(expression);
      if (result !== null && result !== "Error") {
        const answer = String(Number(result) / 100);
        setExpression(answer);
        setDisplay(answer);
      }
      return;
    }

    setExpression((prev) => {
      let next = prev;

      if (operators.includes(value)) {
        if (!next && value !== "-") return next;

        if (operators.includes(next.slice(-1))) {
          next = next.slice(0, -1);
        }
      }

      if (value === ".") {
        const currentNumber = next.split(/[+\-*/]/).pop();
        if (currentNumber.includes(".")) return next;
      }

      next += value;
      return next;
    });

    setDisplay((prev) => {
      if (operators.includes(value)) return prev + value;
      if (value === "." && prev.includes(".")) return prev;
      return prev === "0" ? value : prev + value;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (/^[0-9.]$/.test(e.key)) handleClick(e.key);
      else if (operators.includes(e.key)) handleClick(e.key);
      else if (e.key === "Enter" || e.key === "=") handleClick("=");
      else if (e.key === "Backspace") handleClick("DEL");
      else if (e.key === "Escape") handleClick("AC");
      else if (e.key === "%") handleClick("%");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const buttons = [
    ["AC", "DEL", "%", "/"],
    ["7", "8", "90", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["00", "0", ".", "="],
  ];

  return (
    <div className="app-container">
      <div className="calculator">

        <div className="calculator-header">
          <div>
            <h1>Calculator</h1>
            <p>Simple. Smart. Precise.</p>
          </div>
          <div className="calculator-icon">⌗</div>
        </div>

        <div className="display-section">
          <span className="display-label">RESULT</span>
          <div className="expression">{expression || "0"}</div>
          <div className="display-value">{display}</div>
        </div>

        <div className="keypad">
          {buttons.flat().map((btn, index) => (
            <button
              key={index}
              className={`key
                ${["AC", "DEL", "%"].includes(btn) ? "utility" : ""}
                ${operators.includes(btn) || btn === "=" ? "operator" : ""}
                ${btn === "=" ? "equals" : ""}
              `}
              onClick={() => handleClick(btn)}
            >
              {btn === "DEL" ? "⌫" : btn}
            </button>
          ))}
        </div>

        <div className="calculator-footer">
          <span>⌨ Keyboard supported</span>
          <span>Made with React</span>
        </div>
      </div>

      <div className="history-panel">
        <div className="history-header">
          <h2>History</h2>
          <button
            className="clear-history"
            onClick={() => setHistory([])}
          >
            Clear all
          </button>
        </div>

        {history.length === 0 ? (
          <div className="empty-history">
            <div className="history-symbol">↺</div>
            <p>No calculations yet</p>
            <span>Your recent calculations will appear here.</span>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item, index) => (
              <div className="history-item" key={index}>
                <span>{item.expression}</span>
                <strong>= {item.result}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
