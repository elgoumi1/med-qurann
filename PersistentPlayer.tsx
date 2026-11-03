import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatAudioTime, PLAYBACK_SPEEDS } from '../utils/audioEngine';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  Clock,
  Maximize2,
  Minimize2,
  Sliders,
  AlertCircle,
  Loader2,
  Share2,
} from 'lucide-react';

export const PersistentPlayer: React.FC = () => {
  const {
    selectedReciter,
    selectedSurah,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    setVolume,
    playbackSpeed,
    setPlaybackSpeed,
    repeatMode,
    setRepeatMode,
    shuffle,
    setShuffle,
    playNextTrack,
    playPreviousTrack,
    audioUrl,
    setCurrentPage,
    language,
  } = useApp();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync play/pause with HTMLAudioElement
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback intercepted or audio source pending:', err);
          setIsPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioUrl]);

  // Set playback rate & volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [playbackSpeed, volume, isMuted]);

  // MediaSession API integration for native lock screen and hardware keys
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${selectedSurah.nameAr} - ${selectedSurah.nameEn}`,
        artist: selectedReciter.nameAr,
        album: 'Quran Reciters PRO',
        artwork: [
          { src: selectedReciter.photoUrl, sizes: '512x512', type: 'image/jpeg' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      navigator.mediaSession.setActionHandler('nexttrack', () => playNextTrack());
      navigator.mediaSession.setActionHandler('previoustrack', () => playPreviousTrack());
    }
  }, [selectedReciter, selectedSurah]);

  // Sleep Timer Handler
  useEffect(() => {
    if (!sleepTimerMinutes || !isPlaying) return;
    const timer = setTimeout(() => {
      setIsPlaying(false);
      setSleepTimerMinutes(null);
      alert(language === 'ar' ? 'انتهى مؤقت النوم، تم إيقاف التلاوة المباركة.' : 'Sleep timer completed.');
    }, sleepTimerMinutes * 60 * 1000);

    return () => clearTimeout(timer);
  }, [sleepTimerMinutes, isPlaying, language]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
      setHasError(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleAudioEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      playNextTrack();
    }
  };

  const handleAudioError = () => {
    console.warn('Audio streaming encountered error, attempting fallback source...');
    setHasError(true);
    setIsLoading(false);
    setIsPlaying(false);
  };

  const retryPlayback = () => {
    setHasError(false);
    setIsLoading(true);
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
    }
  };

  const toggleRepeat = () => {
    if (repeatMode === 'none') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('none');
  };

  return (
    <>
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        preload="metadata"
      />

      {/* Floating Bottom Audio Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#032018]/95 backdrop-blur-xl border-t border-amber-500/30 shadow-2xl transition-all">
        {/* Progress Bar (Full bleed on top edge) */}
        <div className="relative w-full h-1.5 bg-emerald-950 cursor-pointer group">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="Seek track"
          />
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-300 relative transition-all"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-amber-300 rounded-full shadow-lg border-2 border-emerald-950 scale-0 group-hover:scale-100 transition" />
          </div>
        </div>

        {/* Player Controls Container */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-4">
          {/* Left/Right: Reciter Image & Track Title */}
          <div className="flex items-center gap-3 min-w-0 max-w-[280px] sm:max-w-xs">
            <div
              onClick={() => setCurrentPage('live')}
              className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-emerald-600 shadow-md shrink-0 cursor-pointer hover:scale-105 transition"
              title="Open Live Quran Recitation"
            >
              <img
                src={selectedReciter.photoUrl}
                alt={selectedReciter.nameAr}
                className="w-full h-full object-cover rounded-full"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex flex-col">
              <span className="text-sm font-extrabold text-amber-200 truncate">
                سورة {selectedSurah.nameAr}
              </span>
              <span className="text-xs text-emerald-300/80 truncate">
                {selectedReciter.nameAr}
              </span>
            </div>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Shuffle button */}
              <button
                onClick={() => setShuffle(!shuffle)}
                className={`p-1.5 rounded-lg transition hidden sm:block ${
                  shuffle ? 'text-amber-400 bg-amber-500/20' : 'text-emerald-300/70 hover:text-white'
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              {/* Previous Surah */}
              <button
                onClick={playPreviousTrack}
                className="p-2 text-emerald-200 hover:text-amber-300 transition hover:scale-110 active:scale-95"
                title="Previous Surah"
                aria-label="Previous Surah"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Play / Pause button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-900/50 hover:scale-105 active:scale-95 transition"
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-amber-300" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                )}
              </button>

              {/* Next Surah */}
              <button
                onClick={playNextTrack}
                className="p-2 text-emerald-200 hover:text-amber-300 transition hover:scale-110 active:scale-95"
                title="Next Surah"
                aria-label="Next Surah"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              {/* Repeat button */}
              <button
                onClick={toggleRepeat}
                className={`p-1.5 rounded-lg transition hidden sm:block ${
                  repeatMode !== 'none'
                    ? 'text-amber-400 bg-amber-500/20'
                    : 'text-emerald-300/70 hover:text-white'
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </button>
            </div>

            {/* Time Stamp */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-300/80">
              <span>{formatAudioTime(currentTime)}</span>
              <span>/</span>
              <span>{formatAudioTime(duration)}</span>
            </div>
          </div>

          {/* Right: Volume, Speed, Sleep, Live Expand */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Speed Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/50 text-[11px] font-bold text-amber-300 hover:border-amber-400 transition"
              >
                {playbackSpeed}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-10 right-0 bg-[#021f19] border border-amber-500/30 rounded-xl p-1 shadow-xl z-50 flex flex-col gap-1 w-20">
                  {PLAYBACK_SPEEDS.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        setPlaybackSpeed(speed);
                        setShowSpeedMenu(false);
                      }}
                      className={`px-2 py-1 text-xs rounded text-center transition ${
                        playbackSpeed === speed
                          ? 'bg-amber-400 text-emerald-950 font-bold'
                          : 'text-emerald-100 hover:bg-emerald-800/40'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sleep Timer */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setShowSleepMenu(!showSleepMenu)}
                className={`p-2 rounded-lg transition ${
                  sleepTimerMinutes
                    ? 'text-amber-400 bg-amber-500/20'
                    : 'text-emerald-300/70 hover:text-white'
                }`}
                title="Sleep Timer"
              >
                <Clock className="w-4 h-4" />
              </button>
              {showSleepMenu && (
                <div className="absolute bottom-10 right-0 bg-[#021f19] border border-amber-500/30 rounded-xl p-2 shadow-xl z-50 flex flex-col gap-1 w-32 text-xs">
                  <span className="font-bold text-amber-300 pb-1 border-b border-emerald-800/50">
                    مؤقت النوم
                  </span>
                  {[15, 30, 45, 60].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setSleepTimerMinutes(m);
                        setShowSleepMenu(false);
                      }}
                      className="text-right px-2 py-1 rounded hover:bg-emerald-800/40 text-emerald-100"
                    >
                      {m} دقيقة
                    </button>
                  ))}
                  {sleepTimerMinutes && (
                    <button
                      onClick={() => {
                        setSleepTimerMinutes(null);
                        setShowSleepMenu(false);
                      }}
                      className="text-right px-2 py-1 rounded hover:bg-red-950/40 text-red-400 font-bold"
                    >
                      إلغاء المؤقت
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 text-emerald-300 hover:text-amber-300 transition"
                aria-label="Toggle mute"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 h-1 bg-emerald-950 rounded-lg cursor-pointer"
                aria-label="Volume slider"
              />
            </div>

            {/* Fullscreen / Live Experience Button */}
            <button
              onClick={() => setCurrentPage('live')}
              className="p-2 text-amber-300 hover:text-amber-100 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition"
              title="التلاوة الحية والتفاعلية"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audio Error Banner */}
        {hasError && (
          <div className="bg-red-950/90 text-red-200 text-xs px-4 py-1.5 flex items-center justify-between border-t border-red-500/30">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>تعذر تشغيل الصوت من الخادم الحالي، يرجى المحاولة مرة أخرى أو اختيار قارئ آخر.</span>
            </div>
            <button
              onClick={retryPlayback}
              className="px-2.5 py-0.5 rounded bg-red-800 text-white font-bold hover:bg-red-700"
            >
              إعادة المحاولة
            </button>
          </div>
        )}
      </div>
    </>
  );
};
