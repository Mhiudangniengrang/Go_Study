import React, { useState, useEffect } from "react";
import { notification, Button } from "antd"; // Import notification và Button từ antd

function FocusTimer() {
  const [focusTime, setFocusTime] = useState(1); // Default 50 minutes focus time
  const [breakTime, setBreakTime] = useState(1); // Default 10 minutes break time
  const [isLoop, setIsLoop] = useState(false); // Loop toggle
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimer, setShowTimer] = useState(false); // Tracks visibility of the timer
  const [currentTime, setCurrentTime] = useState(focusTime * 60); // Time left in seconds
  const [isFocusSession, setIsFocusSession] = useState(true); // Tracks if in focus or break session
  const [isPaused, setIsPaused] = useState(false); // Tracks if the timer is paused
  const [notificationShown, setNotificationShown] = useState(false); // Cờ để theo dõi thông báo

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !isPaused) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(interval); // Dừng hẳn bộ đếm khi thời gian kết thúc
            if (isFocusSession && !notificationShown) {
              // Khi hết thời gian focus và chưa hiển thị thông báo
              openNotification();
              setNotificationShown(true); // Đánh dấu rằng đã hiển thị thông báo
            }
            return 0; // Đảm bảo currentTime không giảm xuống dưới 0
          }
        });
      }, 1000);
    } else if (!isTimerRunning && currentTime !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [
    isTimerRunning,
    isPaused,
    isLoop,
    currentTime,
    isFocusSession,
    focusTime,
    breakTime,
    notificationShown,
  ]);

  const openNotification = () => {
    notification.open({
      message: "Focus Session Ended",
      description:
        "Your focus session has ended. Do you want to start your break time?",
      btn: (
        <Button
          type="primary"
          onClick={() => {
            startBreakTime();
            notification.destroy(); // Đóng thông báo sau khi người dùng nhấn nút
          }}
        >
          Start Break
        </Button>
      ),
      onClose: () => {
        stopTimer(); // Dừng hẳn timer khi người dùng không bắt đầu thời gian nghỉ
      },
    });
  };

  const startBreakTime = () => {
    setIsFocusSession(false);
    setCurrentTime(breakTime * 60); // Đặt thời gian nghỉ
    setIsTimerRunning(true); // Khởi động lại timer cho thời gian nghỉ
    setNotificationShown(false); // Reset lại trạng thái thông báo để thông báo khác có thể xuất hiện
  };

  const adjustFocusTime = (amount) => {
    const newFocusTime = Math.max(5, focusTime + amount); // Minimum 5 minutes
    setFocusTime(newFocusTime);
    if (isFocusSession) {
      setCurrentTime(newFocusTime * 60); // Update the current time if in focus session
    }
  };

  const adjustBreakTime = (amount) => {
    const newBreakTime = Math.max(5, breakTime + amount); // Minimum 5 minutes
    setBreakTime(newBreakTime);
    if (!isFocusSession) {
      setCurrentTime(newBreakTime * 60); // Update the current time if in break session
    }
  };

  const toggleLoop = () => {
    setIsLoop(!isLoop);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    setIsPaused(false); // Reset pause when timer starts
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setCurrentTime(focusTime * 60); // Reset to default focus time
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const toggleShowTimer = () => {
    setShowTimer(!showTimer); // Toggle the visibility of the timer
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  };

  return (
    <div>
      <Button
        onClick={toggleShowTimer}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-200 mb-4"
      >
        Personal Timer
      </Button>

      {/* Time setting will only show when the timer is not running */}
      {showTimer && !isTimerRunning && (
        <div className="bg-black bg-opacity-60 p-6 rounded-lg w-80 text-white">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <i className="mr-2">🎵</i> Personal Timer
          </h2>

          <div className="mb-4">
            <label className="text-sm font-medium">Focus time (min)</label>
            <div className="flex items-center justify-between mt-1">
              <Button
                className="text-3xl px-2 focus:outline-none hover:bg-gray-700 rounded"
                onClick={() => adjustFocusTime(-5)}
              >
                –
              </Button>
              <span className="text-3xl font-mono">{`${focusTime}:00`}</span>
              <Button
                className="text-3xl px-2 focus:outline-none hover:bg-gray-700 rounded"
                onClick={() => adjustFocusTime(5)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium">Break time (min)</label>
            <div className="flex items-center justify-between mt-1">
              <Button
                className="text-3xl px-2 focus:outline-none hover:bg-gray-700 rounded"
                onClick={() => adjustBreakTime(-5)}
              >
                –
              </Button>
              <span className="text-3xl font-mono">{`${breakTime}:00`}</span>
              <Button
                className="text-3xl px-2 focus:outline-none hover:bg-gray-700 rounded"
                onClick={() => adjustBreakTime(5)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="text-sm">Loop automatically</label>
            <input
              type="checkbox"
              checked={isLoop}
              onChange={toggleLoop}
              className="w-5 h-5 rounded focus:outline-none"
            />
          </div>

          <Button
            onClick={isTimerRunning ? stopTimer : startTimer}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            {isTimerRunning ? "Stop Timer" : "Start Timer"}
          </Button>
        </div>
      )}

      {/* Timer Display */}
      {showTimer && isTimerRunning && (
        <div className="mt-4 text-center">
          <div className="bg-gray-900 text-white py-4 px-6 rounded-lg inline-block">
            <h3 className="text-xl font-semibold mb-2">Personal Timer</h3>
            <div className="text-5xl font-mono mb-2">
              {formatTime(currentTime)}
            </div>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={pauseTimer}
                className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-full"
              >
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button
                onClick={stopTimer}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full"
              >
                Stop
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FocusTimer;
