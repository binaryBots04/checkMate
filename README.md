
# Check Mate

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Workflow](#workflow)
- [Installation](#installation)
- [Usage](#usage)
- [Future Plans](#future-plans)
- [License](#license)
- [Contributors](#contributors)


## Project Overview
*checkMate* is a document verification solution designed to automate the process of verifying documents such as academic results, admission cards, and college ID cards. By utilizing machine learning and blockchain technology, *checkMate* ensures secure, tamper-proof storage of verified documents, making the verification process faster and more efficient for users.

## Tech Stack
- **Frontend:** HTML5, React, CSS3
- **Backend:** Node.js, Flask, Python
- **Machine Learning:** PyTorch, OpenCV
- **Database:** MongoDB
- **Storage:** IPFS
- **Authentication:** Auth0

## Features
- User-friendly interface for document uploads.
- Automatic document type verification using AI/ML.
- Text extraction from documents using OCR.
- Secure storage of documents on IPFS with unique hashes.
- Dashboard for users to view document verification status.
- Manual verification request functionality.
- Future integration for companies to access verified documents via API.

## Workflow
1. **Document Upload:** Users upload a document and select its type from a dropdown menu (e.g., result, admit card, college ID card).
2. **Type Verification:** The AI/ML model checks if the uploaded document matches the selected type.
3. **Text Extraction:** If the type is correct, the model extracts text and features from the document.
4. **Database Comparison:** Extracted data is compared against a dummy database using the FuzzyWuzzy algorithm.
5. **Verification Stamp:** Verified documents receive a stamp and are stored in IPFS, generating a unique hash.
6. **Data Storage:** The hash and relevant user data are stored in a MongoDB database.
7. **User Dashboard:** Users can view their document verification statistics on a dashboard.
8. **Manual Verification Requests:** Users can request manual verification by sending an email to the Head of Department with the hash of the unverified document.

## Installation
Follow these steps to set up the project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/trulyaman25/checkMate.git
   ```

2. **Install React dependencies:**
   ```bash
   cd checkMate
   npm install
   ```

3. **Create a `.env` file:** Add the following configuration:
   ```plaintext
   // For MongoDB and Backend
   SERVER_PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.vygshnz.mongodb.net/checkMate

   // For Auth0 Authentication
   VITE_AUTH0_DOMAIN=<your_auth0_domain>
   VITE_AUTH0_CLIENT_ID=<your_auth0_client_id>

   // For IPFS Storage
   VITE_PINATA_API_KEY=<your_pinata_api_key>
   VITE_PINATA_SECRET_KEY=<your_pinata_secret_key>
   ```

4. **Set up the backend:**
   ```bash
   cd engine
   python -m venv .venv
   pip install -r requirements.txt
   ```

5. **Relocate to root directory:**
   ```
   cd ..
   ```

5. **Run the application:**
   ```bash
   npm run dev
   ```

## Usage
After successfully running the application, navigate to `http://localhost:5173` in your web browser. From there, you can upload documents, view verification statuses, and access your user dashboard.

## Future Plans
- Develop an API for companies to access verified documents of students by entering their Aadhaar card number.
- Improve the AI/ML model for better accuracy in document type verification.
- Enhance user interface and experience based on user feedback.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributors
- **Aman Kumar** - [GitHub](https://github.com/trulyaman25)
- **Ansh Shrivastav** - [GitHub](https://github.com/ansh-d23)
- **Sparsh Jaggi** - [GitHub](https://github.com/sparshjaggi07)
- **Aayush Gupta** - [GitHub](https://github.com/aayush2761)

## Images

  ![image](./src/assets/readme/1.png)
  ![image](./src/assets/readme/2.png)
  ![image](./src/assets/readme/3.png)
  ![image](./src/assets/readme/4.png)
  ![image](./src/assets/readme/5.png)
  ![image](./src/assets/readme/6.png)

---