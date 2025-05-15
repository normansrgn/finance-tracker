// src/components/layout/Header.tsx
import React from "react";
import { FaUserAlt } from "react-icons/fa";

import "./header.scss"; // Импортируйте CSS файл для стилей

export default function Header() {
  return (
    <header className="header flex items-center justify-between bg-[#1A1C22] p-4">
      <h1 className="text-2xl text-[22px] font-bold">Панель управления</h1>
      <nav>
        <div className="header__nav flex gap-[15px] items-center p-[10px]">
          <div className="header__search">
            <input
              className="bg-[#282C35] p-[10px] rounded-[6px] outline-none"
              type="text"
              placeholder="Поиск.."
            />
          </div>
          <div className="header__user">
            <FaUserAlt size={20} />
          </div>
        </div>
      </nav>
    </header>
  );
}
