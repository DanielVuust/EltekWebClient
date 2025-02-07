import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignalRService } from './services/signal-r-service/signal-r.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  constructor(public signalRService: SignalRService){}
  ngOnInit(){
    this.signalRService.startConnection();
  }
  title = 'WebClient';
}
