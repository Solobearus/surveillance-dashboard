import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Camera } from "../types";

export const useHLSStream = (
  selectedCamera: string | null,
  cameras: Camera[] | undefined
) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (selectedCamera && videoRef.current) {
      const camera = cameras?.find((c) => c.id === selectedCamera);
      if (camera && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(camera.streamUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          videoRef.current?.play();
        });

        return () => {
          hls.destroy();
        };
      }
    }
  }, [selectedCamera, cameras]);

  return videoRef;
};
