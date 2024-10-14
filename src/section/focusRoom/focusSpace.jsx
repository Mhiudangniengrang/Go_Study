import React, { useEffect, useRef, useState } from "react";
import {
  SoundOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  PlayCircleOutlined,
  MutedOutlined,
  FieldTimeOutlined,
  PictureOutlined,
  PauseOutlined,
  CaretRightOutlined,
  BorderOutlined,
} from "@ant-design/icons";
import FocusTimer from "./focusTimer";
import { Button, notification } from "antd";

function FocusSpace() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState("");
  const [showMusicMenu, setShowMusicMenu] = useState(false);
  const [showBackgroundMenu, setShowBackgroundMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [backgroundClass, setBackgroundClass] = useState(""); // Track the class for fading effect

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

  const adjustFocusTime = (amount) => {
    const newFocusTime = Math.max(5, focusTime + amount); // Minimum 5 minutes
    setFocusTime(newFocusTime);
    if (isFocusSession) {
      setCurrentTime(newFocusTime * 60); // Update the current time if in focus session
    }
  };
  const startBreakTime = () => {
    setIsFocusSession(false);
    setCurrentTime(breakTime * 60); // Đặt thời gian nghỉ
    setIsTimerRunning(true); // Khởi động lại timer cho thời gian nghỉ
    setNotificationShown(false); // Reset lại trạng thái thông báo để thông báo khác có thể xuất hiện
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
  const [selectedBackground, setSelectedBackground] = useState(
    "/src/section/assets/music/Background1.1 - Made with Clipchamp.mp4"
  );

  const musicOptions = [
    {
      name: "lofi-orchestra",
      src: "/src/section/assets/music/lofi-orchestra-162306.mp3",
    },
    {
      name: "lofi-song-jinsei",
      src: "/src/section/assets/music/lofi-song-jinsei-by-lofium-236730.mp3",
    },
    {
      name: "lofi-song-room",
      src: "/src/section/assets/music/lofi-song-room-by-lofium-242714.mp3",
    },
    {
      name: "playa-del-sol-latin",
      src: "/src/section/assets/music/playa-del-sol-latin-lofi-160149.mp3",
    },
    {
      name: "satisfying-lofi-for-focus",
      src: "/src/section/assets/music/satisfying-lofi-for-focus-study-amp-working-242103.mp3",
    },
  ];

  const backgroundOptions = [
    {
      name: "Background 1",
      src: "/src/section/assets/music/Background1.1 - Made with Clipchamp.mp4",
    },
    {
      name: "Background 2",
      src: "/src/section/assets/music/Background2.2 - Made with Clipchamp.mp4",
    },
  ];

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const toggleMusicMenu = () => {
    setShowMusicMenu(!showMusicMenu);
    if (!showMusicMenu) {
      setShowBackgroundMenu(false);
    }
  };

  const toggleBackgroundMenu = () => {
    setShowBackgroundMenu(!showBackgroundMenu);
    if (!showBackgroundMenu) {
      setShowMusicMenu(false);
    }
  };

  const selectMusic = (src) => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.volume = volume;
      audioRef.current.play();
      setSelectedMusic(src);
      setIsPlaying(true);
      videoRef.current.muted = true;
      setIsMuted(true);
      setShowMusicMenu(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeVolume = (e, musicSrc) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current && selectedMusic === musicSrc) {
      audioRef.current.volume = newVolume;
    }
  };

  const renderVolumeControl = (music) => (
    <div className="flex items-center mt-2">
      {selectedMusic === music.src &&
      audioRef.current &&
      !audioRef.current.muted ? (
        <SoundOutlined className="mr-2" />
      ) : (
        <MutedOutlined className="mr-2" />
      )}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={selectedMusic === music.src ? volume : 0.5}
        onChange={(e) => changeVolume(e, music.src)}
        style={{
          width: "100%",
          height: "4px",
          appearance: "none",
          backgroundColor: "#ddd",
          borderRadius: "2px",
          outline: "none",
        }}
        className="slider"
      />
    </div>
  );
  const selectBackground = (src) => {
    // Add fading out class
    setBackgroundClass("video-fade");

    // Wait for the fade out effect to complete before changing the video source
    setTimeout(() => {
      setSelectedBackground(src); // Change the background
      setBackgroundClass(""); // Remove the fading out class after transition
    }, 1000); // Time matches with the CSS transition duration
  };
  return (
    <>
      <div ref={containerRef} className="relative h-screen w-screen">
        <video
          ref={videoRef}
          className={`pointer-events-none absolute top-0 left-0 w-full h-full object-cover ${backgroundClass}`}
          src={selectedBackground}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="auto"
        ></video>

        <audio ref={audioRef} loop></audio>
        <div className="relative z-10">
          <button
            className="text-white p-2 mt-8 bg-black bg-opacity-70 rounded-lg text-sm ml-3"
            onClick={toggleShowTimer}
          >
            <FieldTimeOutlined className="text-center mr-1" />
            Personal timer
          </button>

          {showTimer && isTimerRunning && (
            <div className="absolute mt-2 bg-black bg-opacity-60 p-4 rounded-lg w-80 text-white z-20 ml-3">
              <h3 className="text-sm font-semibold mb-2 flex">
                Personal Timer
              </h3>
              <div className="flex justify-between">
                <div className="text-xl font-mono mb-2">
                  {formatTime(currentTime)}
                </div>
                <div className="flex space-x-5">
                  {/* Pause/Play button */}
                  <button onClick={pauseTimer} className="text-white text-xl">
                    {isPaused ? <CaretRightOutlined /> : <PauseOutlined />}
                  </button>
                  {/* Stop button */}
                  <button onClick={stopTimer} className="text-white text-xl">
                    <BorderOutlined />
                  </button>
                </div>
              </div>
            </div>
          )}

          {showTimer && !isTimerRunning && (
            <div className="absolute mt-2 bg-black bg-opacity-60 p-6 rounded-lg w-80 text-white z-20">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <FieldTimeOutlined className="text-center mr-1" />
                Personal Timer
              </h2>
              <div className="mb-4">
                <label className="text-sm font-medium">Focus time (min)</label>
                <div className="flex items-center justify-between mt-1">
                  <button
                    className="text-3xl px-2 focus:outline-none hover:bg-gray-700 rounded"
                    onClick={() => adjustFocusTime(-5)}
                  >
                    –
                  </button>
                  <span className="text-3xl font-mono">{`${focusTime}:00`}</span>
                  <button
                    className="text-3xl px-2 focus:outline-none hover:bg-gray-700 rounded"
                    onClick={() => adjustFocusTime(5)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium">Break time (min)</label>
                <div className="flex items-center justify-between mt-1">
                  <button
                    className="text-3xl px-2 focus:outline-none hover:bg-gray-700 rounded"
                    onClick={() => adjustBreakTime(-5)}
                  >
                    –
                  </button>
                  <span className="text-3xl font-mono">{`${breakTime}:00`}</span>
                  <button
                    className="text-3xl px-2 focus:outline-none hover:bg-gray-700 rounded"
                    onClick={() => adjustBreakTime(5)}
                  >
                    +
                  </button>
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

              <button
                onClick={startTimer}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition duration-200"
              >
                Start Timer
              </button>
            </div>
          )}

          <button
            onClick={toggleMute}
            className="absolute bottom-1 right-52 bg-black bg-opacity-70 text-white p-2 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-opacity duration-200"
          >
            {isMuted ? (
              <MutedOutlined style={{ fontSize: "24px" }} />
            ) : (
              <SoundOutlined style={{ fontSize: "24px" }} />
            )}
          </button>
          <button
            onClick={toggleMusicMenu}
            className="absolute bottom-1 right-40 bg-black bg-opacity-70 text-white p-2 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-opacity duration-200"
          >
            <PlayCircleOutlined style={{ fontSize: "24px" }} />
          </button>
          <button
            onClick={toggleBackgroundMenu}
            className="absolute bottom-1 right-28 bg-black bg-opacity-70 text-white p-2 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-opacity duration-200"
          >
            <PictureOutlined style={{ fontSize: "24px" }} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="absolute bottom-1 right-16 bg-black bg-opacity-70 text-white p-2 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-opacity duration-200"
          >
            {isFullscreen ? (
              <FullscreenExitOutlined style={{ fontSize: "24px" }} />
            ) : (
              <FullscreenOutlined style={{ fontSize: "24px" }} />
            )}
          </button>
          <div className="absolute mt-[20.5rem] right-4 text-white text-2xl font-bold p-4 rounded-md text-center mx-5">
            “You are never too old to set another
            <br />
            goal or to dream a new dream.”
            <br />
            <div className="text-right text-sm mt-2">Malala Yousafzai</div>
          </div>

          {showMusicMenu && (
            <div className="absolute top-17 right-10 bg-black bg-opacity-70 text-white p-4 rounded-lg">
              <h3 className="mb-2">Select a Song</h3>
              {musicOptions.map((music, index) => (
                <div key={index} className="mb-4">
                  <button
                    onClick={() => selectMusic(music.src)}
                    className="block w-full text-left hover:bg-opacity-90"
                  >
                    {music.name}
                  </button>
                  {renderVolumeControl(music)}
                </div>
              ))}
            </div>
          )}
          {showBackgroundMenu && (
            <div className="absolute top-17 right-0 bg-black bg-opacity-70 text-white p-4 rounded-lg">
              <h3 className="mb-2">Select a Background</h3>
              {backgroundOptions.map((bg, index) => (
                <button
                  key={index}
                  onClick={() => selectBackground(bg.src)}
                  className="block w-full text-left p-2 hover:bg-opacity-90"
                >
                  {bg.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* <FocusTimer /> */}
    </>
  );
}

export default FocusSpace;
