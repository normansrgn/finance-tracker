import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "../Sidebar/Sidebar"; // Importing navLinks from your Sidebar

export default function BurgerMenu() {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setOpen(!isOpen);

  return (
    <>
      <div className="header__burger">
        {/* Burger Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden z-50 p-2 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:none"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <div className="w-6 h-6 relative">
            <span
              className={`absolute left-0 w-6 h-0.5 bg-gray-300 rounded-full transition-all duration-300 ${
                isOpen ? "top-3 rotate-45" : "top-1"
              }`}
            ></span>
            <span
              className={`absolute left-0 w-6 h-0.5 bg-gray-300 rounded-full transition-all duration-300 ${
                isOpen ? "opacity-0" : "top-3"
              }`}
            ></span>
            <span
              className={`absolute left-0 w-6 h-0.5 bg-gray-300 rounded-full transition-all duration-300 ${
                isOpen ? "top-3 -rotate-45" : "top-5"
              }`}
            ></span>
          </div>
        </button>

        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-40 lg:hidden ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleMenu}
        ></div>

        {/* Sidebar Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-[260px] bg-[#1A1C22] z-50 transform transition-transform duration-300 lg:hidden pt-[38px] px-4 shadow-2xl ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="block rounded" aria-label="Go to homepage">
            <div className="flex items-center gap-[10px]">
              <svg
                width="40"
                height="40"
                viewBox="0 0 27 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="My Application Logo"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M21.6016 5.17785H10.0906V0.294373L26.4851 0.294373V16.6889H21.6016V5.17785Z"
                  fill="#FFC01E"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.6101 14.8951C11.8643 14.3968 10.9876 14.1309 10.0907 14.1309V9.24741C11.9535 9.24741 13.7744 9.79977 15.3232 10.8346C16.872 11.8695 18.0791 13.3404 18.792 15.0614C19.5048 16.7823 19.6913 18.676 19.3279 20.5029C18.9645 22.3299 18.0675 24.008 16.7504 25.3252C15.4332 26.6423 13.7551 27.5393 11.9281 27.9027C10.1012 28.2661 8.20751 28.0796 6.48657 27.3668C4.76563 26.6539 3.29472 25.4468 2.25984 23.898C1.22496 22.3492 0.672604 20.5283 0.672607 18.6655L5.55609 18.6655C5.55608 19.5624 5.82204 20.4391 6.32031 21.1849C6.81858 21.9306 7.5268 22.5118 8.3554 22.855C9.184 23.1982 10.0958 23.288 10.9754 23.1131C11.855 22.9381 12.663 22.5062 13.2972 21.872C13.9314 21.2379 14.3633 20.4299 14.5383 19.5502C14.7132 18.6706 14.6234 17.7588 14.2802 16.9302C13.937 16.1016 13.3558 15.3934 12.6101 14.8951Z"
                  fill="#1FCB4F"
                />
              </svg>
              <h1 className="text-[34px] font-bold text-white">Penta</h1>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="mt-[40px]">
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex p-[10px] rounded-[9px] text-[17px] items-center gap-[10px] transition-all duration-300 ${
                        isActive
                          ? "bg-[#282C35] text-[#1FCB4F]"
                          : "text-[#A0A3B1] hover:bg-[#282C35] hover:text-[#1FCB4F]"
                      }`}
                      onClick={toggleMenu}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
