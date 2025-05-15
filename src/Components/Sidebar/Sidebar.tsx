import React from "react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="siddebar">
      <aside className="w-64 p-4 bg-[#1A1C22] pt-[30px] pl-[33px] sticky top-0 h-screen">
        <h2 className="text-xl font-bold mb-4">Меню</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="block p-2 hover:bg-gray-200 rounded">
                Главная
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block p-2 hover:bg-gray-200 rounded"
              >
                О нас
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block p-2 hover:bg-gray-200 rounded"
              >
                Контакты
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
}
