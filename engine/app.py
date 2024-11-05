from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import pytesseract
import re
import io
import requests
import torch
from datetime import datetime
import torch.nn.functional as F
from pymongo import MongoClient
from flask_pymongo import PyMongo 
import torch.nn as nn
from torchvision import models, transforms
from fuzzywuzzy import fuzz
import cv2
import numpy as np
import json
import os
from dotenv import load_dotenv

# Initialize the Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Load .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# MongoDB Configuration
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

# Load sample database from JSON file
with open('sample_db.json', 'r') as f:
    sample_db = json.load(f)


# Load the class names for document classification
class_names = ['admit', 'college_id', 'result']  # 3 classes

# Set device for PyTorch model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load the EfficientNet model and adjust the classifier layer
model = models.efficientnet_b0(pretrained=True)
num_ftrs = model.classifier[1].in_features
model.classifier[1] = nn.Linear(num_ftrs, len(class_names))  # Modify output layer to match the number of classes
model.load_state_dict(torch.load('document_classifier.pth'))  # Ensure the model file is in the models directory
model = model.to(device)
model.eval()  # Set model to evaluation mode

# Constants for signature overlaying
SIGNATURE_POSITION = [300, 500]
SIGNATURE_SIZE = (200, 200)  # Desired size for the signature (width, height)

# Helper function to download image from IPFS link
def download_image_from_ipfs(ipfs_link):
    ipfs_gateway = "https://ipfs.io/ipfs/"
    ipfs_hash = ipfs_link.split("ipfs://")[-1]
    download_url = ipfs_gateway + ipfs_hash
    response = requests.get(download_url)
    if response.status_code == 200:
        return Image.open(io.BytesIO(response.content))
    else:
        raise Exception("Failed to download image from IPFS")

# Function to overlay a signature on an image
def overlay_signature(background_image, signature_path, position):
    signature = cv2.imread(signature_path, cv2.IMREAD_UNCHANGED)

    if signature is None:
        raise FileNotFoundError(f"Signature image at path {signature_path} could not be loaded.")
    
    # Resize the signature image
    signature = cv2.resize(signature, SIGNATURE_SIZE, interpolation=cv2.INTER_AREA)

    signature_height, signature_width = signature.shape[:2]
    x, y = position

    if (y < 0) or (x < 0) or (y + signature_height > background_image.shape[0]) or (x + signature_width > background_image.shape[1]):
        raise ValueError("Signature image does not fit in the background image at the specified position.")

    if signature.shape[2] == 4:  # Check if the signature has an alpha channel
        b, g, r, a = cv2.split(signature)
        overlay = cv2.merge((b, g, r))
        mask = a
        
        for c in range(0, 3):
            background_image[y:y + signature_height, x:x + signature_width, c] = \
                (overlay[..., c] * (mask / 255.0) + 
                 background_image[y:y + signature_height, x:x + signature_width, c] * (1.0 - mask / 255.0))
    else: 
        background_image[y:y + signature_height, x:x + signature_width] = signature

    success, buffer = cv2.imencode('.jpg', background_image)
    if not success:
        raise Exception("Failed to encode image")

    return buffer.tobytes()

# Function to upload an image to IPFS
def upload_to_ipfs(image_data):
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    headers = {
        "pinata_api_key": '04b26ee360171f03ae2b',
        "pinata_secret_api_key": '250fe3ce90862d18f94ced6c065a6bec5a956d528aef8ab9d737a9b3f0ca8065'
    }
    files = {
        'file': ('image.jpg', io.BytesIO(image_data), 'image/jpeg')
    }
    response = requests.post(url, files=files, headers=headers)
    if response.status_code == 200:
        ipfs_hash = response.json()["IpfsHash"]
        return ipfs_hash
    else:
        raise Exception("Failed to upload to IPFS: " + response.text)

@app.route('/p', methods=['POST'])
def process_image_ipfs():
    print("Route /process-ipfs was hit")
    data = request.get_json()
    
    if not data or 'ipfs_link' not in data:
        return jsonify({"error": "No IPFS link provided"}), 400

    ipfs_link = data['ipfs_link']
    
    try:
        # Convert IPFS link to image
        image = download_image_from_ipfs(ipfs_link)
        return process_image(image)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Function to process the image with OCR and fuzzy matching
def process_image(image):
    # Perform OCR on the image using pytesseract
    extracted_text = pytesseract.image_to_string(image).lower()

    print(extracted_text)

    
    # Define regular expression patterns for extracting fields from text
    name_pattern = r'name\s*:\s*[_\W]*([a-z\s]+)'
    roll_number_pattern = r'roll\s*no\s*:\s*(\d{8})'
    result_pattern = r'result\s*:\s*(\w+)'
    cpi_pattern = r'cpi\s*:\s*([\d.]+)'
    
    # Extract fields using regex patterns defined above
    name = re.search(name_pattern, extracted_text).group(1).strip() if re.search(name_pattern, extracted_text) else "not found"
    roll_number = re.search(roll_number_pattern, extracted_text).group(1).strip() if re.search(roll_number_pattern, extracted_text) else "not found"
    result = re.search(result_pattern, extracted_text).group(1).strip() if re.search(result_pattern, extracted_text) else "not found"
    cpi = re.search(cpi_pattern, extracted_text).group(1).strip() if re.search(cpi_pattern, extracted_text) else "not found"

    # Construct extracted data dictionary
    extracted_data = {"Name": name, "Roll Number": roll_number, "Result": result, "CPI": cpi}

    print(extracted_data)

    # Check against the sample database for matches based on roll number
    db_entry = next((entry for entry in sample_db if entry["Roll Number"] == roll_number), None)

    if db_entry:
        # Fuzzy matching of extracted fields with database entries
        name_match_score = fuzz.partial_ratio(name, db_entry["Name"])
        result_match_score = fuzz.partial_ratio(result, db_entry["Result"])
        cpi_match_score = fuzz.partial_ratio(cpi, db_entry["CPI"])

        fuzzy_results = {
            "Name Match Score": name_match_score,
            "Result Match Score": result_match_score,
            "CPI Match Score": cpi_match_score
        }

        print(fuzzy_results)

        if any(score < 85 for score in fuzzy_results.values()):
            return jsonify({"Match Result": 0}), 200  # Not a match
        
        return jsonify({"Match Result": 1}), 200  # Match found
    
    return jsonify({"error": "Roll Number not found in database"}), 404

# Function to classify a document using a pre-trained model
def classify_document(image):
    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    img_tensor = preprocess(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(img_tensor)
        probs = F.softmax(output, dim=1)
        
        max_prob, pred_idx = torch.max(probs, dim=1)

    if max_prob.item() < 0.80: 
        return 'Other'  
        
    return class_names[pred_idx.item()]  

@app.route('/c/<auth_id>', methods=['GET', 'POST'])  # Updated route to include auth_id as a parameter
def classify_ipfs(auth_id):  # Added auth_id as a parameter to the function
    if request.method == 'POST':
        # Handle the POST request
        data = request.get_json()
        
        if not data or 'ipfs_link' not in data:
            return jsonify({"error": "No IPFS link provided"}), 400

        ipfs_link = data['ipfs_link']
        
        try:
            # Convert IPFS link to image and classify it using the model.
            image = download_image_from_ipfs(ipfs_link)
            predicted_class = classify_document(image)

            if predicted_class:
                # Prepare the document to be inserted
                document = {
                    "authid": auth_id,  # Use the auth_id from the route parameter
                    "ipfs_hash": ipfs_link,
                    "upload_time": datetime.utcnow(),  # Use current time
                    "doctype": predicted_class,  # Store the predicted class
                    "verify_flag": False  # Set verify_flag to False
                }

                mongo.db.userDocuments.insert_one(document)  # Replace with your actual collection name
            
            return jsonify({"predicted_document_type": predicted_class}), 200
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    elif request.method == 'GET':
        # Handle the GET request
        try:
            documents = list(mongo.db.userDocuments.find({"authid": auth_id}))  # Replace with your actual collection name
            
            # Convert ObjectId to string if needed
            for doc in documents:
                doc['_id'] = str(doc['_id'])

            return jsonify(documents), 200
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route('/o', methods=['POST'])
def overlay_signature_endpoint():
    
   data = request.json
   
   background_ipfs_link = data['ipfs_link']
   signature_path = 'sign2.png' 

   try:
       # Download the background image from IPFS.
       background_image_np_array=download_image_from_ipfs(background_ipfs_link)
       
       # Convert PIL Image to OpenCV format.
       background_image_cv=cv2.cvtColor(np.array(background_image_np_array), cv2.COLOR_RGB2BGR)

       # Overlay the signature on the downloaded background image.
       image_data=overlay_signature(background_image_cv ,signature_path ,SIGNATURE_POSITION)
       
       # Upload the final image to IPFS.
       ipfs_hash=upload_to_ipfs(image_data)

       result = mongo.db.userDocuments.update_one(
            {"ipfs_hash": background_ipfs_link},
            {"$set": {"ipfs_hash": ipfs_hash, "verify_flag": True}}
        )
       
       return jsonify({"ipfs_hash":ipfs_hash})
   
   except Exception as e:
       return jsonify({"status":"error","message":str(e)})

if __name__ == '__main__':
   app.run(debug=True)