// src/components/layout/Header.tsx
"use client";
import React from "react";
import { FaUserAlt } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

import "./header.scss"; 

export default function Header() {
  const pathname = usePathname();
  const isActive = pathname === "/Profile";

  const pageTitles: { [key: string]: string } = {
    "/": "Панель управления",
    "/About": "Переводы",
    "/Contact": "Аналитика",
    "/Profile": "Профиль",
  };

  const title = pageTitles[pathname] || "Панель управления";

  return (
    <header className="header flex items-center justify-between bg-[#1A1C22] p-4">
      <h1 className="text-2xl text-[22px] font-bold">{title}</h1>
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
            <Link href="/Profile">
              <FaUserAlt
                className={`cursor-pointer hover:text-[#1FCB4F] ease-in-out duration-300 ${
                  isActive ? "text-[#1FCB4F]" : "text-[#A0A3B1]"
                }  hover:text-[#1FCB4F]`}
                size={20}
              />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
