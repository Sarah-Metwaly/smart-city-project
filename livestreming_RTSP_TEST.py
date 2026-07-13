import subprocess
import time
import sys
import shlex

RTSP_URL = "rtsp://20.233.89.255:8554/camera"

# GStreamer captures and encodes the camera feed, outputs raw H264 to stdout
GSTREAMER_CMD = (
    "gst-launch-1.0 libcamerasrc ! videoconvert ! "
    "video/x-raw,format=I420,width=640,height=480,framerate=25/1 ! "
    "x264enc tune=zerolatency bitrate=1000 speed-preset=ultrafast key-int-max=30 ! "
    "video/x-h264,profile=baseline,stream-format=byte-stream ! "
    "h264parse config-interval=1 ! "
    "fdsink fd=1"
)

# ffmpeg reads the H264 from stdin and pushes it to MediaMTX via RTSP
FFMPEG_CMD = (
    f"ffmpeg -f h264 -i - -c:v copy -f rtsp -rtsp_transport tcp {RTSP_URL}"
)


def start_stream():
    print(f"[INFO] Starting stream to {RTSP_URL}", flush=True)

    gst_proc = subprocess.Popen(
        shlex.split(GSTREAMER_CMD),
        stdout=subprocess.PIPE
    )
    ffmpeg_proc = subprocess.Popen(
        shlex.split(FFMPEG_CMD),
        stdin=gst_proc.stdout
    )

    # Allow gst_proc to receive SIGPIPE if ffmpeg exits first
    gst_proc.stdout.close()

    return gst_proc, ffmpeg_proc


def main():
    while True:
        gst_proc, ffmpeg_proc = start_stream()

        # Wait for either process to exit
        ffmpeg_proc.wait()
        gst_proc.terminate()
        gst_proc.wait()

        print("[WARN] Stream stopped. Restarting in 5 seconds...", flush=True)
        time.sleep(5)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n[INFO] Stopped by user.")
        sys.exit(0)