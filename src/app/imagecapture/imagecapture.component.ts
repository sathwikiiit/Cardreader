import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import Tesseract from 'tesseract.js';
import { parseAndStructureLicenseInfo } from './parser';

@Component({
  selector: 'app-imagecapture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './imagecapture.component.html',
  styleUrls: ['./imagecapture.component.css']
})
export class ImagecaptureComponent {
  selectedImage: any;
  extractedimage:any=undefined;
  licenseInfo:any;
  errorMessage: string | undefined;

  async onImageSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const reader = new FileReader();

      reader.onload = async () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = async () => {
          try {
            const processedImageDataUrl = this.preprocessImage(img);
            this.extractedimage=processedImageDataUrl
            const result = await Tesseract.recognize(processedImageDataUrl, 'eng');
            this.licenseInfo = parseAndStructureLicenseInfo(result.data.text);
            console.log(this.licenseInfo,result.data.text);
          } catch (error) {
            console.error('Error during OCR:', error);
            this.errorMessage = 'Error occurred during OCR. Please try again.';
          }
        };
      };

      reader.readAsDataURL(file);
    }
  }

  preprocessImage(img: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
  
    // Step 1: Remove watermark by increasing contrast of text
    for (let i = 0; i < data.length; i += 4) {
      // Convert to grayscale first
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      
      // Apply contrast enhancement
      const threshold = 128;
      const contrast = 1.8; // Adjust this value to control contrast
      const factor = (259 * (contrast * 255 + 1)) / (255 * (259 - contrast));
      
      const newValue = factor * (avg - threshold) + threshold;
      
      // Apply sharpening
      data[i] = Math.max(0, Math.min(255, newValue));
      data[i + 1] = Math.max(0, Math.min(255, newValue));
      data[i + 2] = Math.max(0, Math.min(255, newValue));
    }
  
    // Step 2: Apply adaptive thresholding
    const processedData = new Uint8ClampedArray(data.length);
    const blockSize = 15; // Size of the neighborhood
    const C = 5; // Constant subtracted from mean
  
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        let sum = 0;
        let count = 0;
  
        // Calculate local mean
        for (let dy = -blockSize; dy <= blockSize; dy++) {
          for (let dx = -blockSize; dx <= blockSize; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < canvas.width && ny >= 0 && ny < canvas.height) {
              const idx = (ny * canvas.width + nx) * 4;
              sum += data[idx];
              count++;
            }
          }
        }
  
        const idx = (y * canvas.width + x) * 4;
        const mean = sum / count;
        const threshold = mean - C;
  
        // Apply threshold
        const value = data[idx] > threshold ? 255 : 0;
        processedData[idx] = processedData[idx + 1] = processedData[idx + 2] = value;
        processedData[idx + 3] = 255;
      }
    }
  
    // Create new ImageData and put it back to canvas
    const processedImageData = new ImageData(processedData, canvas.width, canvas.height);
    ctx.putImageData(processedImageData, 0, 0);
  
    return canvas.toDataURL();
  }
}