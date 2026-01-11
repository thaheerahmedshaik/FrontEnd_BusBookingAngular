
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-face-capture-component',
  imports: [CommonModule],
  templateUrl: './face-capture-component.component.html',
  styleUrl: './face-capture-component.component.css'
})
export class FaceCaptureComponent implements OnInit, OnDestroy {
  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;

  stream!: MediaStream;
  capturedImage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.startCamera();
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.nativeElement.srcObject = this.stream;
    } catch (err) {
      console.error('Camera access denied:', err);
      alert("Please allow camera access!");
    }
  }

  capture() {
    const canvas = document.createElement('canvas');
    canvas.width = this.video.nativeElement.videoWidth;
    canvas.height = this.video.nativeElement.videoHeight;

    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(this.video.nativeElement, 0, 0, canvas.width, canvas.height);
      this.capturedImage = canvas.toDataURL('image/png');
    }
  }

  upload() {
    if (!this.capturedImage) return;

    const payload = {
      imageBase64: this.capturedImage
    };

    this.http.post('http://localhost:8080/api/face/verify', payload)
      .subscribe({
        next: res => {
          console.log("Face verified:", res);
          alert("Face verification complete!");
        },
        error: err => {
          console.error(err);
          alert("Face verification failed!");
        }
      });
  }

  ngOnDestroy() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
}