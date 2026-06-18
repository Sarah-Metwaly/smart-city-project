import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface LiveStreamProps {
  streamUrl: string;
}

export default function LiveStream({ streamUrl }: LiveStreamProps) {
  // Define ref type for HTML5 video element
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    let hls: Hls | null = null;

    // Case 1: Browser supports hls.js (Chrome, Firefox, Edge)
    if (Hls.isSupported()) {
      hls = new Hls({
        liveSyncDurationCount: 1,      // Read from the latest live edge immediately
        liveMaxLatencyDurationCount: 3, // Reduce delay to lowest possible threshold
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(err => console.log("Auto-play blocked:", err));
      });

    // Case 2: Browser natively supports HLS without libraries (Safari on iOS/Mac)
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      
      const handleMetadataLoaded = () => {
        video.play().catch(err => console.log("Auto-play blocked:", err));
      };

      video.addEventListener('loadedmetadata', handleMetadataLoaded);
      
      // Cleanup listener for native HLS player
      return () => {
        video.removeEventListener('loadedmetadata', handleMetadataLoaded);
      };
    }

    // Cleanup and destroy Hls instance on component unmount or URL change
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl]); // Trigger re-run whenever streamUrl updates dynamically

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted 
        controls={false} 
        playsInline
      />
      
      {/* Live status pulsing indicator badge */}
      <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse z-20">
        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
        LIVE
      </div>
    </div>
  );
}