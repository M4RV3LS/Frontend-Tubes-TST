"use client";

import React from "react";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    // Redirect to the login page
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  // Helper function to determine if the link is active
  // Helper function to determine if the link is active
  const isActive = (href: string) => {
    // Check if window is defined (so we're running in the browser and not in Node.js)

    return window.location.pathname === href;

    return false; // Default to false if not running in a browser
  };

  return (
    <div>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="https://flowbite.com/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="./assets/soundspace logo.png"
              className="h-16"
              alt="SoundSpace Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Sound Space
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              onClick={handleLogout}
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Logout
            </button>
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 mt-4 md:p-0 md:space-x-8 md:flex-row md:mt-0 md:bg-white dark:bg-gray-800">
              {[
                { href: "/user-dashboard", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/order-history", label: "Session History" },
                // Add more navigation items here if needed
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`block py-2 px-3 rounded md:p-2 sm:p-4 ${
                      isActive(link.href)
                        ? "bg-[#FFBE00] text-white rounded-lg" // Active color
                        : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 md:dark:hover:text-blue-500"
                    }`}
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
