"use client";
import React, { useEffect, useState } from "react";
import studioData from "../../../data/studioData.json";
import NavbarDetailPage from "@/components/NavbarDetailPage/NavbarDetailPage";
import FooterDetailPage from "@/components/FooterDetailPage/FooterDetailPage";
import { FaArrowLeft } from "react-icons/fa";
import { Accordion } from "flowbite";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegClock, FaStar } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import MenuCard from "@/components/MenuCard/MenuCard";

interface Studio {
  id: string;
  studioName: string;
  priceRange: string;
  address: string;
  availableHours: string;
  maximumParticipant: number;
  rating: string;
  imgSrc: string[];
  description: string;
  facilities: string[];
  instruments: string[];
}

interface MenuItem {
  menu_id: number;
  menu_name: string;
  price: number;
  duration: number;
  calories: number;
  level: string;
  description: string;
}

interface AccordionSectionState {
  [key: string]: boolean;
}

interface StudioRoom {
  roomName: string;
  price: number;
}

interface Studio extends Omit<Studio, "studioRooms"> {
  studioRooms: StudioRoom[];
}

const Page = () => {
  const [studio, setStudio] = useState<Studio | undefined>(undefined);
  // Menu Items
  const [menuItems, setMenuItems] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Redirect to the login page
    window.location.href = "/login";
  };

  const navigateToUserDashboard = () => {
    window.location.href = `/user-dashboard`;
  };

  const [openSections, setOpenSections] = useState<AccordionSectionState>({
    "accordion-arrow-icon-body-1": true,
    "accordion-arrow-icon-body-2": false,
    "accordion-arrow-icon-body-3": false,
  });

  const toggleAccordionSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  useEffect(() => {
    // This assumes that the URL path will be something like "/studio-detail/1"
    const path = window.location.pathname;
    const segments = path.split("/");
    const studioId = segments[segments.length - 1]; // Get the last segment which should be the ID

    const selectedStudio = studioData.find((s) => s.id === studioId);
    setStudio(selectedStudio);
    //Accordion

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/delight-cook/menu-items"
        );
        setMenuItems(response.data); // Make sure this is an array
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        setMenuItems([]); // Set an empty array if the fetch fails
      }
    };

    fetchData();
  }, []);

  //date Picker
  const [startDate, setStartDate] = useState(new Date());
  const [genre, setGenre] = useState("");
  const [theme, setTheme] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [participantError, setParticipantError] = useState("");
  const [sessionSchedule, setSessionSchedule] = useState("");
  const [studioType, setStudioType] = useState("");
  const [sessionDate, setSessionDate] = useState("");

  // States for calculated fees and errors
  const [totalFee, setTotalFee] = useState<number | null>(null);
  const [feePerParticipant, setFeePerParticipant] = useState<number | null>(
    null
  );
  const [calculateError, setCalculateError] = useState("");

  const handleDateChange = (date) => setStartDate(date);

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setGenre(event.target.value);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setTheme(event.target.value);

  const handleMaxParticipantsChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const input = e.target.value;
    setMaxParticipants(input);

    if (!input) {
      setParticipantError("");
      return;
    }

    const number = parseInt(input, 10);
    if (isNaN(number)) {
      setParticipantError("Please enter a valid number");
    } else if (studio && number > studio.maximumParticipant) {
      setParticipantError(
        `Exceeds maximum capacity of ${studio.maximumParticipant} participants`
      );
    } else {
      setParticipantError("");
    }
  };

  // Event handler for studio type selection
  const handleStudioTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStudioType(event.target.value);
  };

  // New calculate fees function
  const handleCalculateFees = () => {
    if (!studioType || maxParticipants === "") {
      setCalculateError(
        "Please select a studio type and enter the number of participants."
      );
      return;
    }

    const participantsNumber = parseInt(maxParticipants, 10);
    if (isNaN(participantsNumber) || participantsNumber <= 0) {
      setCalculateError("Please enter a valid number of participants.");
      return;
    }

    const selectedRoom = studio?.studioRooms.find(
      (r) => r.roomName === studioType
    );
    if (!selectedRoom) {
      setCalculateError("Please select a valid studio type.");
      return;
    }

    if (participantsNumber > studio?.maximumParticipant) {
      setCalculateError(
        `Number of participants exceeds the maximum allowed of ${studio?.maximumParticipant}.`
      );
      return;
    }

    // Find the price of the selected menu item
    const selectedMenuItem = menuItems.find(
      (item) => item.menu_id === savedMenuId
    );
    const menuItemPrice = selectedMenuItem ? selectedMenuItem.price : 0;
    const menuTotalCost = menuItemPrice * savedQuantity;

    // Calculate the total fee including the menu cost
    setTotalFee(selectedRoom.price + menuTotalCost);
    setFeePerParticipant(
      (selectedRoom.price + menuTotalCost) / participantsNumber
    );
    setCalculateError("");
  };

  const studioTypeOptions =
    studio?.studioRooms.map((room, index) => (
      <option key={index} value={room.roomName}>
        {room.roomName} - IDR {room.price.toLocaleString()}
      </option>
    )) || [];

  const sessionTimes = [
    "00:00 - 02:00",
    "02:00 - 04:00",
    "04:00 - 06:00",
    "06:00 - 08:00",
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00",
    "20:00 - 22:00",
    "22:00 - 24:00",
  ];

  const handleSessionScheduleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSessionSchedule(event.target.value);
  };

  //Modals here
  // Add this state to your component
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Add these functions to your component
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  //Increment and Decreament menuItem
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleSelectMenu = (menuId: number) => {
    setSelectedMenuId(menuId);
    setQuantity(1); // Reset quantity to 1 whenever a new menu is selected
  };

  const incrementQuantity = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((currentQuantity) =>
      currentQuantity > 1 ? currentQuantity - 1 : 1
    );
  };

  //Save Menu Items
  const [savedMenuId, setSavedMenuId] = useState<number | null>(null);
  const [savedQuantity, setSavedQuantity] = useState(0);

  const handleSaveMenuItems = () => {
    setSavedMenuId(selectedMenuId);
    setSavedQuantity(quantity);
    setIsModalOpen(false);
  };

  //handle submit here
  const handleSubmit = async () => {
    const formattedDate = startDate.toISOString().split("T")[0];
    const maxParticipantsInt = parseInt(maxParticipants, 10);
    const totalFeeInt = parseInt(totalFee, 10); // Make sure totalFee is an integer

    const sessionData = {
      studio_name: studio.studioName,
      session_date: formattedDate,
      session_time: sessionSchedule,
      genre: genre,
      theme: theme,
      max_participants: maxParticipantsInt,
      total_fee: totalFeeInt,
    };

    console.log(sessionData);

    try {
      // const config = {
      //   headers: {

      //     'Authorization': `Bearer ${token}`,

      //   }
      // };

      const token = localStorage.getItem("token"); // Ensure the key is correct

      if (!token) {
        console.error("Authentication token is not available.");
        return;
      } else {
        console.log(token);
      }

      // Make a POST request to create the session
      const sessionResponse = await axios.post(
        "http://localhost:8000/sessions",
        sessionData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        }
      );
      console.log("Session created:", sessionResponse.data);

      // If the session is created successfully, make a POST request to place the order
      // You would need to add the session ID to the orderData if required
      const orderResponse = await axios.post(
        "http://localhost:8000/place-order",
        {
          order_id: 0, // Assuming order_id should be set by the server, not the client
          customer_id: 3, // This should be the ID of the current user, not hardcoded
          menu_id: savedMenuId,
          menu_quantity: savedQuantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        }
      );
      if (orderResponse.status === 200) {
        console.log("Order placed:", orderResponse.data);
        window.location.href = "../../success";
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error data:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Error headers:", error.response?.headers);
      } else {
        console.error("Error:", error);
      }
    }
  };

  if (!studio) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Navbar */}
      {/* <NavbarDetailPage /> */}

      {/* CONTENT */}
      <main className="w-full px-4  ">
        <div className="flex jusify-start p-4 mb-4 gap-x-4 ">
          <button onClick={() => navigateToUserDashboard()}>
            <FaArrowLeft />
          </button>
          {/* breadcrumbs */}
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <a href="/user-dashboard">Home</a>
              </li>
              <li>
                <a className="font-bold underline underline-offset-4">
                  Studio Detail
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl">
            <img
              src={studio.imgSrc[0]}
              alt={studio.studioName}
              className="rounded-2xl object-cover h-full w-256"
            />
          </div>
          <div className="grid grid-rows-2 gap-2">
            <div className="rounded-2xl">
              <img
                src={studio.imgSrc[1]}
                alt={studio.studioName}
                className="rounded-2xl"
              />
            </div>
            <div className="rounded-2xl">
              <img
                src={studio.imgSrc[2]}
                alt={studio.studioName}
                className="rounded-2xl"
              />
            </div>
          </div>
          <div className="grid grid-rows-2">
            <div className="rounded-2xl">
              <img
                src={studio.imgSrc[3]}
                alt={studio.studioName}
                className="rounded-2xl"
              />
            </div>
            <div className="rounded-2xl">
              <img
                src={studio.imgSrc[4]}
                alt={studio.studioName}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Detail */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 mt-4 ">
            <div className="border-b-4 border-gray-200 mb-4">
              <h1 className="text-3xl font-bold p-8 ">{studio.studioName}</h1>
            </div>
            {/* Details Data */}

            <div id="accordion-arrow-icon" data-accordion="open">
              <h2 id="accordion-arrow-icon-heading-1">
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                  data-accordion-target="#accordion-arrow-icon-body-1"
                  aria-expanded="true"
                  aria-controls="accordion-arrow-icon-body-1"
                  onClick={() =>
                    toggleAccordionSection("accordion-arrow-icon-body-1")
                  }
                >
                  <span>Description</span>
                  <svg
                    data-accordion-icon
                    className="w-3 h-3 rotate-180 shrink-0"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div
                id="accordion-arrow-icon-body-1"
                aria-labelledby="accordion-arrow-icon-heading-1"
                className={
                  openSections["accordion-arrow-icon-body-1"] ? "" : "hidden"
                }
              >
                <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    {studio.description}
                  </p>
                  <ul className="list-none mt-4">
                    <li className="flex items-center gap-x-4 gap-y-2">
                      <FaLocationDot />
                      <span>{studio.address}</span>
                    </li>
                    <li className="flex items-center gap-x-4 gap-y-2">
                      <FaRegClock />
                      <span>{studio.availableHours}</span>
                    </li>
                    <li className="flex items-center gap-x-4 gap-y-2">
                      <FaStar />
                      <span>{studio.rating}</span>
                    </li>
                    <li className="flex items-center gap-x-4 gap-y-2">
                      <HiUserGroup />
                      <span>{studio.maximumParticipant}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <h2 id="accordion-arrow-icon-heading-2">
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                  data-accordion-target="#accordion-arrow-icon-body-2"
                  aria-expanded="false"
                  aria-controls="accordion-arrow-icon-body-2"
                  onClick={() =>
                    toggleAccordionSection("accordion-arrow-icon-body-2")
                  }
                >
                  <span>Facilities</span>
                  <svg
                    data-accordion-icon
                    className="w-3 h-3 rotate-180 shrink-0"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div
                id="accordion-arrow-icon-body-2"
                className="hidden"
                aria-labelledby="accordion-arrow-icon-heading-2"
                className={
                  openSections["accordion-arrow-icon-body-2"] ? "" : "hidden"
                }
              >
                <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    Our Main Facilities:
                    <ul className="list-disc pl-5">
                      {studio.facilities.map((facility, index) => (
                        <li key={index}>{facility}</li>
                      ))}
                    </ul>
                  </p>
                </div>
              </div>
              <h2 id="accordion-arrow-icon-heading-3">
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                  data-accordion-target="#accordion-arrow-icon-body-3"
                  aria-expanded="false"
                  aria-controls="accordion-arrow-icon-body-3"
                  onClick={() =>
                    toggleAccordionSection("accordion-arrow-icon-body-3")
                  }
                >
                  <span>Music Instruments</span>
                  <svg
                    data-accordion-icon
                    className="w-3 h-3 rotate-180 shrink-0"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div
                id="accordion-arrow-icon-body-3"
                className="hidden"
                aria-labelledby="accordion-arrow-icon-heading-3"
                className={
                  openSections["accordion-arrow-icon-body-3"] ? "" : "hidden"
                }
              >
                <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    Music instruments Provided:
                    <ul className="list-disc pl-5">
                      {studio.instruments.map((instrument, index) => (
                        <li key={index}>{instrument}</li>
                      ))}
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="col-span-1 mt-4 bg-white rounded-xl py-4 px-8">
            <h2 className="text-2xl font-bold text-center my-4">
              Checkout Order
            </h2>
            <h2 className="text-xl font-bold text-center my-4">
              Plan Your Music Session Now !
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-x-3">
                <div className="flex-1">
                  <label
                    htmlFor="date-picker"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Session Date
                  </label>
                  <DatePicker
                    id="date-picker"
                    selected={startDate}
                    onChange={handleDateChange}
                    className="rounded-xl p-2 w-full"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="session-schedule"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Session Schedule
                  </label>
                  <select
                    id="session-schedule"
                    value={sessionSchedule}
                    onChange={handleSessionScheduleChange}
                    className="rounded-xl p-2 w-full"
                  >
                    <option value="">Select Time Option</option>
                    {sessionTimes.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label
                  htmlFor="genre"
                  className="block text-sm font-medium text-gray-700"
                >
                  Genre
                </label>
                <input
                  id="genre"
                  type="text"
                  value={genre}
                  onChange={handleGenreChange}
                  placeholder="Genre"
                  className="rounded-xl p-2 w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="theme"
                  className="block text-sm font-medium text-gray-700"
                >
                  Theme
                </label>
                <input
                  id="theme"
                  type="text"
                  value={theme}
                  onChange={handleThemeChange}
                  placeholder="Theme"
                  className="rounded-xl p-2 w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="max-participants"
                  className="block text-sm font-medium text-gray-700"
                >
                  Max Participants
                </label>
                <input
                  id="max-participants"
                  type="number" // Set input type as number
                  value={maxParticipants}
                  onChange={handleMaxParticipantsChange}
                  placeholder="Max Participants"
                  className="rounded-xl p-2 w-full"
                />
                {participantError && (
                  <p className="text-xs text-red-600">{participantError}</p>
                )}
              </div>
              <div className="flex flex-row gap-x-3">
                <div className="flex-1">
                  <label
                    htmlFor="studio-type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Studio Type
                  </label>
                  <select
                    id="studio-type"
                    value={studioType}
                    onChange={handleStudioTypeChange}
                    className="rounded-xl p-2 w-full"
                  >
                    <option value="">Select Studio Type</option>
                    {studioTypeOptions}
                  </select>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="payment-method"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Payment Method
                  </label>
                  <select id="payment-method" className="rounded-xl p-2 w-full">
                    <option value="BCA">BCA</option>
                    <option value="Gopay">Gopay</option>
                    <option value="Shopeepay">Shopeepay</option>
                    <option value="Dana">Dana</option>
                  </select>
                </div>
              </div>
              <div>
                {/* New display area for calculated fees */}
                {totalFee != null && (
                  <div className="bg-[#f6f7f7] p-4 rounded-md my-2">
                    <p>Total Fee: IDR {totalFee.toLocaleString()}</p>
                    <p>
                      Fee per Participant: IDR{" "}
                      {feePerParticipant.toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="flex flex-row items-center gap-3 mb-4">
                  {/* Add Meal Kit Button */}
                  <button
                    onClick={openModal}
                    className="bg-[#FFBE00] rounded-xl p-2 flex-1"
                  >
                    Add a Meal Kit
                  </button>

                  {/* Box to display selected menu and quantity */}
                  <div className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                    {/* Placeholder content - replace with actual content */}
                    <p>
                      Selected Menu:{" "}
                      {menuItems.find((item) => item.menu_id === savedMenuId)
                        ?.menu_name || "None"}
                    </p>
                    <p>Quantity: {savedQuantity}</p>
                  </div>
                </div>

                {/* Modals Goes Here */}
                {isModalOpen && (
                  <div
                    id="mealKitModal"
                    className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
                  >
                    <div className="modal-box bg-white rounded-lg p-6 max-w-2xl mx-auto overflow-auto">
                      <button
                        onClick={closeModal}
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                      >
                        <IoMdClose />
                      </button>
                      <div className="flex gap-x-4 overflow-x-auto py-4">
                        {menuItems.map((menuItem) => (
                          // Here you should replace with your actual `MenuCard` component
                          // The following div is just a placeholder
                          <div
                            key={menuItem.menu_id}
                            className="menu-card rounded-xl shadow-lg bg-white p-4"
                          >
                            {/* Radio button */}
                            <input
                              type="radio"
                              id={`menu-${menuItem.menu_id}`}
                              name="menuCard"
                              checked={selectedMenuId === menuItem.menu_id}
                              onChange={() =>
                                handleSelectMenu(menuItem.menu_id)
                              }
                              className="mr-2"
                            />
                            <div className="relative h-32 w-64">
                              <img
                                src="../../assets/menu.jpg"
                                layout="fill"
                                objectFit="cover"
                                alt={menuItem.menu_name}
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="text-lg font-semibold">
                                {menuItem.menu_name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Price : IDR {menuItem.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Duration: {menuItem.duration} mins
                              </p>
                              <p className="text-sm text-gray-600">
                                Calories: {menuItem.calories}
                              </p>
                              <p className="text-sm text-gray-600">
                                Level : {menuItem.level}
                              </p>
                              <p className="text-sm text-gray-600">
                                Description : {menuItem.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {selectedMenuId && (
                        <div className="flex flex-col gap-y-2">
                          <div className="flex justify-center items-center gap-2 mt-4">
                            <button onClick={decrementQuantity} className="btn">
                              -
                            </button>
                            <span>{quantity}</span>
                            <button onClick={incrementQuantity} className="btn">
                              +
                            </button>
                          </div>
                          <div>
                            <div className="flex justify-center items-center mt-4">
                              <button
                                onClick={handleSaveMenuItems}
                                className="bg-[#FFBE00] rounded-xl p-2 w-full my-2"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Calculate and Order buttons */}
                <div className="flex flex-col gap-3">
                  {calculateError && (
                    <p className="text-xs text-red-600">{calculateError}</p>
                  )}
                  <button
                    onClick={handleCalculateFees}
                    className="bg-[#FFBE00] rounded-xl p-2 w-full my-2"
                  >
                    Calculate
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-[#FFBE00] rounded-xl p-2 w-full font-bold"
                  >
                    Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterDetailPage />
    </div>
  );
};

export default Page;
