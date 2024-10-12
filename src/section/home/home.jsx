import React, { useEffect, useState } from "react";
import {
  Image,
  Calendar,
  theme,
  Button,
  Dropdown,
  Space,
  notification,
  Avatar,
} from "antd";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import gao from "../assets/account/gao.png";
import home from "../assets/account/home.png";
import dayjs from "dayjs";
import {
  DownOutlined,
  EditOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import useTask from "../../hooks/useTask";
import Cookies from "js-cookie";
import useAuthen from "../../hooks/useAuthen";
import useAttendance from "../../hooks/useAttendance";
import useUserHome from "../../hooks/useUserHome";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { infoUser, fetchUserInfo } = useAuthen();
  const { userHome, fetchGetUserHome } = useUserHome();
  const { fetchPostAttendance } = useAttendance();
  const [isPresent, setIsPresent] = useState(true);

  const { token } = theme.useToken();
  const { taskToday, fetchGetTaskToday } = useTask();
  const userId = Cookies.get("userId");

  useEffect(() => {
    fetchGetTaskToday(userId);
    fetchUserInfo(userId);
    fetchGetUserHome(userId);
  }, [fetchGetTaskToday, fetchUserInfo, userId]);

  const wrapperStyle = {
    width: 350,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const calculateTimeActive = () => {
    const days = ["M", "T", "W", "Th", "F", "S"];
    const timeActive = Array(6).fill(0);

    if (userHome && userHome.attendances) {
      userHome.attendances.forEach((attendance) => {
        const dayIndex = dayjs(attendance.date).day() - 1;
        if (dayIndex >= 0 && dayIndex < 6) {
          // Assuming attendance has a duration or start and end time to calculate hours
          timeActive[dayIndex] += attendance.hours || 1; // Example increment
        }
      });
    }

    return timeActive;
  };

  const data = {
    labels: ["M", "T", "W", "Th", "F", "S"],
    datasets: [
      {
        label: "Time Active",
        data: calculateTimeActive(),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const onPanelChange = (value) => {
    setSelectedDate(value.toDate());
  };

  const today = new Date();

  const isToday =
    selectedDate.toDateString() === today.toDateString() ? "0" : "";

  const formatDate = (date) => {
    return dayjs(date).format("Do MMM, YYYY");
  };

  const users = [
    { rank: 1, name: "Daniil Medvedev", hours: "7.800h", icon: "⏲️" },
    { rank: 2, name: "Alexander Zverev", hours: "7.075h", icon: "⏲️" },
    { rank: 3, name: "Novak Djokovic", hours: "6.770h", icon: "⏲️" },
    { rank: 4, name: "Rafael Nadal", hours: "6.525h", icon: "⏲️" },
  ];

  const onClick = ({ key }) => {
    notification.info(`Click on item ${key}`);
  };

  const items = [
    {
      label: "1st menu item",
      key: "1",
    },
    {
      label: "2nd menu item",
      key: "2",
    },
    {
      label: "3rd menu item",
      key: "3",
    },
  ];

  const activities = [
    { initials: "EK", color: "bg-blue-500" },
    { initials: "JH", color: "bg-purple-500" },
    { initials: "AF", color: "bg-blue-400" },
    { initials: "RP", color: "bg-teal-500" },
    { initials: "JK", color: "bg-red-400" },
  ];

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/user/calendar/task");
  };

  const currentDay = dayjs().format("YYYY-MM-DD");

  const hasCheckedInToday = () => {
    if (userHome && userHome.attendances) {
      return userHome.attendances.some((attendance) => {
        // Check if the date matches and if the user is marked as present
        return (
          dayjs(attendance.date).isSame(dayjs(currentDay), "day") &&
          attendance.isPresent
        );
      });
    }
    return false;
  };

  const handleAttendance = () => {
    if (hasCheckedInToday()) {
      notification.info({
        message: "Attendance",
        description: "You have already checked in today.",
        duration: 2,
      });
    } else {
      fetchPostAttendance(userId);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6 mb-5">
      <div className="flex justify-between w-full max-w-6xl">
        <div className="flex-col">
          <div className="p-4 flex mx-auto bg-[#BFDDFF] rounded-lg shadow-lg relative space-x-5 h-[15rem]">
            <Image
              width={250}
              src={infoUser.profileImage || "https://via.placeholder.com/240"}
              alt="Profile"
              style={{
                borderRadius: "10px",
                objectFit: "cover",
                height: "100%",
              }}
            />
            <div className="text-blue-900">
              <h2 className="text-lg">Hi, {infoUser.fullName}</h2>
              <h1 className="text-4xl font-extrabold">Welcome to Go! Study</h1>
              <p className="mt-2">
                Online learning not only opens the door to knowledge but also
                gives you the freedom to explore, create and develop yourself
                every day. Each lesson is a building block for your own future.
              </p>
            </div>
          </div>

          <div className="flex space-x-5">
            <div
              style={wrapperStyle}
              className="mt-5 rounded-lg shadow-lg relative p-5 py-10 h-[18rem]"
            >
              <h3 className="text-xl font-bold mb-2">Time Active</h3>
              <Bar data={data} options={options} />
            </div>
            <div className="bg-gradient-to-t from-[#C8E2FF] to-white p-4 rounded-lg shadow-md text-center w-[13rem] h-[18rem] mt-5">
              <div className="flex justify-center">
                <img src={home} alt="Upgrade Icon" />
              </div>
              <h3 className="font-bold text-lg">
                Upgrade to <span className="text-orange-500">PRO</span> for more
                features.
              </h3>
              <Link to="/user/pricing">
                <Button
                  size="large"
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-full"
                >
                  Upgrade
                </Button>
              </Link>
            </div>
            {/* Days Card */}
            <div className="flex flex-col">
              {isPresent && (
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-5 w-[15rem] h-[5rem] mt-4">
                  <span className="text-gray-400 text-2xl">🔥</span>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">
                      {userHome.totalAttendace}
                    </span>
                    <span className="ml-1">Days</span>
                  </div>
                  <span className="text-green-500 text-2xl">✔️</span>
                </div>
              )}
              {/* Additional Feature Cards */}
              <div className="flex space-x-6 mt-4">
                <div className="bg-white p-4 rounded-lg shadow-md text-center w-60 transform rotate-6">
                  <div className="flex justify-center">
                    <img
                      src="https://img.freepik.com/premium-vector/calendar-date-circled-hand-man_165488-4933.jpg"
                      alt="Calendar Icon"
                      className="mb-4 h-20"
                    />
                  </div>
                  <h3 className="font-bold text-lg">Upcoming QBR</h3>
                  <p className="text-blue-600">{formatDate(today)}</p>
                  <button className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-full">
                    Send RSVP
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-5 my-5">
            <div className="w-[22rem]">
              <div className="flex justify-between">
                <h2 className="text-orange-500 font-bold mb-4">Top Ranking</h2>
                <Dropdown menu={{ items, onClick }}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space className="text-[#5F647E]">
                      View
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </div>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.rank}
                    className="bg-[#EEE6E2] p-3 rounded-lg flex justify-between items-center shadow-md"
                  >
                    <div className="flex items-center">
                      <span className="font-bold text-lg text-orange-500">
                        #{user.rank}
                      </span>
                      <span className="ml-2 font-bold">{user.name}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-orange-500">
                      <span>{user.hours}</span>
                      <span>{user.icon}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[29rem]">
              <div className="bg-[#034EA1] text-white p-3 rounded-t-lg flex items-center">
                <EditOutlined className="mr-2" />
                <div className="text-center">
                  <h1>Task today</h1>
                </div>
              </div>
              <div className="bg-gray-100">
                {taskToday.length > 0 ? (
                  taskToday.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border-b border-gray-300"
                    >
                      <div className="flex items-center">
                        <FileTextOutlined className="mr-3" />
                        <span>{item.description}</span>
                      </div>
                      <span
                        className={
                          item.status ? "text-green-500" : "text-red-500"
                        }
                      >
                        {item.status ? "Hoàn thành" : "Chưa hoàn thành"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">
                    No tasks for today
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={wrapperStyle} className="h-80 ml-6 flex flex-col">
          <div onClick={handleClick}>
            <Calendar fullscreen={false} onPanelChange={onPanelChange} />
          </div>

          <div className="flex justify-end">
            <Button className="mt-4" type="primary" onClick={handleAttendance}>
              Attendance
            </Button>
          </div>
          <div className="">
            <div className="flex justify-between">
              <h2 className="font-bold text-lg">Blog</h2>
              <a href="#" className="text-[#1D7D81] font-bold">
                View All
              </a>
            </div>
            <div className="flex space-x-4">
              <div className="bg-[#F5F5F5] p-5 rounded shadow-md w-60">
                <h3 className="text-sm font-bold">{userHome.fullName}</h3>
                <div className="flex items-center text-gray-500">
                  <span>
                    {userHome.blogPost
                      ? dayjs(userHome.blogPost.createdAt).format(
                          "MMM D, YYYY h:mm A"
                        )
                      : "No blog post"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center  w-[6.6rem] h-20">
                {userHome.blogPost && userHome.blogPost.image && (
                  <img
                    src={userHome.blogPost.image}
                    alt="Blog"
                    className="mt-2 rounded"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="my-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Friend</h2>
              <a href="#" className="text-teal-600 font-bold">
                View All
              </a>
            </div>
            <div className="space-y-3">
              {userHome.listFriend && userHome.listFriend.length > 0 ? (
                userHome.listFriend.map((friend, index) => {
                  const participant = friend.recipient || friend.requester;
                  if (!participant) return null;
                  return (
                    <div
                      key={index}
                      className="bg-[#EEE6E2] p-4 rounded flex items-center shadow-md"
                    >
                      <Avatar
                        src={
                          participant.profileImage ||
                          "https://via.placeholder.com/240"
                        }
                        alt={participant.fullName || "Unknown"}
                        className="rounded-full"
                        size="large"
                      />
                      <div className="ml-4">
                        <span className="font-bold">
                          {participant.fullName || "Unknown"}
                        </span>
                        <p className="text-gray-500">
                          {participant.email || "No email"}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500">No friends found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
