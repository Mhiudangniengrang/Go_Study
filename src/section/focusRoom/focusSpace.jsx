import React, { useRef, useState } from "react";
import {
  SoundOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  PlayCircleOutlined,
  MutedOutlined,
  PauseOutlined,
  PictureOutlined, // Icon for changing background
} from "@ant-design/icons";

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
  const [selectedBackground, setSelectedBackground] = useState(
    "/src/section/assets/music/Background1.1 - Made with Clipchamp.mp4"
  );

  const musicOptions = [
    {
      name: "Song 1",
      src: "/src/section/assets/music/lofi-orchestra-162306.mp3",
    },
    {
      name: "Song 2",
      src: "/src/section/assets/music/lofi-song-jinsei-by-lofium-236730.mp3",
    },
    {
      name: "Song 3",
      src: "/src/section/assets/music/lofi-song-room-by-lofium-242714.mp3",
    },
    {
      name: "Song 4",
      src: "/src/section/assets/music/playa-del-sol-latin-lofi-160149.mp3",
    },
    {
      name: "Song 5",
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
  };

  const toggleBackgroundMenu = () => {
    setShowBackgroundMenu(!showBackgroundMenu);
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

  const selectBackground = (src) => {
    setSelectedBackground(src);
    setShowBackgroundMenu(false); 
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

  return (
    <div ref={containerRef} className="relative h-screen w-screen">
      <video
        ref={videoRef}
        className="pointer-events-none absolute top-0 left-0 w-full h-full object-cover"
        src={selectedBackground}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="auto"
      ></video>
      <audio ref={audioRef} loop></audio>
      <div className="relative z-10">
        <h1 className="text-white text-3xl p-4">Focus Space</h1>
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-52 bg-black bg-opacity-70 text-white p-2 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-opacity duration-200"
        >
          {isMuted ? (
            <MutedOutlined style={{ fontSize: "24px" }} />
          ) : (
            <SoundOutlined style={{ fontSize: "24px" }} />
          )}
        </button>
        <button
          onClick={toggleMusicMenu}
          className="absolute bottom-4 right-40 bg-black bg-opacity-70 text-white p-2 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-opacity duration-200"
        >
          <PlayCircleOutlined style={{ fontSize: "24px" }} />
        </button>
        <button
          onClick={toggleBackgroundMenu}
          className="absolute bottom-4 right-28 bg-black bg-opacity-70 text-white p-2 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-opacity duration-200"
        >
          <PictureOutlined style={{ fontSize: "24px" }} />
        </button>
        <button
          onClick={toggleFullscreen}
          className="absolute bottom-4 right-16 bg-black bg-opacity-70 text-white p-2 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-opacity duration-200"
        >
          {isFullscreen ? (
            <FullscreenExitOutlined style={{ fontSize: "24px" }} />
          ) : (
            <FullscreenOutlined style={{ fontSize: "24px" }} />
          )}
        </button>
        {showMusicMenu && (
          <div className="absolute top-16 right-10 bg-black bg-opacity-70 text-white p-4 rounded-lg">
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
          <div className="absolute top-16 right-60 bg-black bg-opacity-70 text-white p-4 rounded-lg">
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
  );
}

export default FocusSpace;
