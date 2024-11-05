# Docuville.ai Intern Technical Assessment - Card Reader

This repository contains my solution for the Docuville.ai Software Engineer Internship technical assessment. The task involved creating a card reader application capable of extracting key information (name, document number, expiration date) from an image of a passport or driver's license using Angular and Tesseract.js. I choose to work on Telangana state License as sample doc and made for this. 

## Features

* **Image Upload:**  Allows users to upload an image of a passport or driver's license.
* **OCR with Tesseract.js:**  Utilizes Tesseract.js to perform Optical Character Recognition (OCR) on the uploaded image, extracting text data.
* **Data Extraction & Validation:** Parses the extracted text to identify and display the cardholder's name, document number, and expiration date.
* **User-Friendly Interface:**  Provides a clean and intuitive user interface built with Angular.

## Technologies Used

* **Frontend:** Angular, TypeScript, HTML, CSS
* **OCR Engine:**  Tesseract.js 
##Scope
It needs changes based on use case for now. It is a simpler version. We can create a separate and use server side programming as python to further improve it. We can use tensorflow models.

## Installation & Running Locally

1. **Clone the repository:** 
   ```bash
   git clone https://github.com/your-username/docuville-card-reader.git
   cd Cardreader
   ng serve
   ```
   for production use ```ng build``` instead
