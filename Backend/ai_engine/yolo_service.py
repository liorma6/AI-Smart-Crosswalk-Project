import os
import json
import time
from ultralytics import YOLO
import cv2

def run_analysis():
    # Signal that the AI process has started successfully
    print(json.dumps({"status": "AI Engine starting..."}), flush=True)
    
    # Initialize the YOLOv8 model (Nano version for speed)
    model = YOLO('yolov8n.pt') 
    
    # Define absolute paths for input and output directories
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_dir = os.path.join(base_dir, 'test_images')
    output_dir = os.path.join(base_dir, 'output_images')

    # Track processed files to avoid redundant analysis 
    analyzed_files = set()

    while True:
        # Scan for new image files that haven't been processed yet
        files = [f for f in os.listdir(input_dir) 
                 if f.lower().endswith(('.jpg', '.jpeg', '.png', '.jfif')) 
                 and f not in analyzed_files]
        
        for file_name in files:
            img_path = os.path.join(input_dir, file_name)
            img = cv2.imread(img_path) # Load the image using OpenCV
            if img is None: # If the image fails to load, skip processing and move to the next file
                continue

            # we save a temporary standard JPG to ensure compatibility.
            temp_jpg_path = os.path.join(input_dir, "temp_processing.jpg")
            cv2.imwrite(temp_jpg_path, img)

            # Perform object detection
            results = model(temp_jpg_path)
            
            people_found = 0 # Counter for detected people
            cars_found = 0 # Counter for detected cars
            
            # Extract bounding boxes and filter by class and confidence
            for box in results[0].boxes:
                conf = float(box.conf[0]) # Confidence score for the detection, between 0 and 1
                cls = int(box.cls) 
                label = model.names[cls]
                
                # Apply logic: High confidence (70%+) for cars, standard (50%+) for people
                if label == 'car' and conf >= 0.70:
                    cars_found += 1
                elif label == 'person' and conf >= 0.50:
                    people_found += 1

            # Danger assessment logic (Simplified: Person + Car = Danger)
            # We simply check if our filtered lists contain at least one of each
            is_dangerous = people_found > 0 and cars_found > 0

            # 4. Visual Feedback
            annotated_frame = results[0].plot() # YOLO's built-in drawing tool
            
            # Status text changes based on the presence of both objects
            if is_dangerous:
                status_text = "DANGER: Person and Car Detected!"
                color = (0, 0, 255) # Red for danger
            else:
                status_text = "Safe: Monitoring..."
                color = (0, 255, 0) # Green for safe
            
            # Draw status label on the processed image
            cv2.putText(annotated_frame, status_text, (20, 40), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
            
            # Save the analyzed image to the output folder
            out_path = os.path.join(output_dir, f"analyzed_{file_name}.jpg")
            cv2.imwrite(out_path, annotated_frame)
            
            # Output results as JSON for the Node.js backend
            result_json = {
                "event": "ANALYSIS_COMPLETE",
                "file": file_name,
                "is_dangerous": is_dangerous,
                "person_found": people_found > 0,
                "car_found_high_conf": cars_found > 0,
                "timestamp": time.time()
            }
            print(json.dumps(result_json), flush=True)
            
            # Mark file as processed to prevent infinite loops
            analyzed_files.add(file_name)
            
            # Cleanup temporary processing file
            if os.path.exists(temp_jpg_path):
                os.remove(temp_jpg_path)
        
        # Wait 2 seconds before the next scan
        time.sleep(2)

if __name__ == "__main__":
    run_analysis()