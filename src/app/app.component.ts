import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImagecaptureComponent } from "./imagecapture/imagecapture.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImagecaptureComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Cardreader';
}
