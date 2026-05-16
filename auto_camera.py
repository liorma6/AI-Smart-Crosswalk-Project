import os
import time
from pathlib import Path

import requests


HF_ANALYZE_URL = "https://liorma8-ai-crosswalk-engine.hf.space/analyze"
WATCH_DIR = Path("Backend/ai_engine/test_images")
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".jfif", ".webp", ".avif"}


def send_frame(image_path):
    print(f"New frame detected: {image_path.name}, sending to AI...")

    with image_path.open("rb") as image_file:
        files = {
            "file": (image_path.name, image_file, "application/octet-stream"),
        }
        response = requests.post(HF_ANALYZE_URL, files=files, timeout=60)

    print(f"Response status: {response.status_code}")

    try:
        print("Response JSON:")
        print(response.json())
    except requests.JSONDecodeError:
        print("Response was not valid JSON:")
        print(response.text)


def main():
    if not WATCH_DIR.exists():
        print(f"Watch directory does not exist: {WATCH_DIR}")
        return

    processed_files = set()
    print(f"Watching for new images in: {WATCH_DIR.resolve()}")

    while True:
        for filename in os.listdir(WATCH_DIR):
            image_path = WATCH_DIR / filename

            if not image_path.is_file():
                continue

            if image_path.suffix.lower() not in IMAGE_EXTENSIONS:
                continue

            if filename in processed_files:
                continue

            try:
                send_frame(image_path)
            except requests.RequestException as error:
                print(f"Failed to send {filename}: {error}")
            except OSError as error:
                print(f"Failed to read {filename}: {error}")
            finally:
                processed_files.add(filename)

        time.sleep(1)


if __name__ == "__main__":
    main()
