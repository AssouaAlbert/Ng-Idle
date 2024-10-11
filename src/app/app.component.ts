import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'ng-idle';
  idleState = 'NOT_STARTED';
  countdown?: number | null = null;
  lastPing?: Date = new Date();

  constructor(private idle: Idle, cd: ChangeDetectorRef) {
    // set idle parameters
    idle.setIdle(5); // how long can they be inactive before considered idle, in seconds
    idle.setTimeout(3); // how long can they be idle before considered timed out, in seconds
    // provide sources that will "interrupt" aka provide events indicating the user is active
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // do something when the user becomes idle
    idle.onIdleStart.subscribe(() => {
      this.idleState = 'IDLE';
      console.log(this.idleState);
    });

    // do something when the user is no longer idle
    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'NOT_IDLE';
      console.log(`${this.idleState} ${new Date()}`);
      this.countdown = null;

      console.log(this.idleState);

      cd.detectChanges(); // how do i avoid this kludge?
    });

    // do something when the user has timed out
    idle.onTimeout.subscribe(() => {
      this.idleState = 'TIMED_OUT';
      console.log(this.idleState);
    });
    // do something as the timeout countdown does its thing
    idle.onTimeoutWarning.subscribe((seconds) => {
      this.countdown = seconds;
      console.log(this.idleState);
    });
  }
  reset() {
    // we'll call this method when we want to start/reset the idle process
    // reset any component state and be sure to call idle.watch()
    this.idle.watch();
    this.idleState = 'NOT_IDLE';
    this.countdown = null;
    this.lastPing = new Date();
  }

  ngOnInit(): void {
    // right when the component initializes, start reset state and start watching
    this.reset();
  }
}
