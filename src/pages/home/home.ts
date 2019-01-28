import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

	private timeForm: FormGroup;
	private startingSeconds = Math.ceil((new Date().getTime()) / 1000);
	private endingSeconds: number = null;
	private minimumTime: number = null;
	private maximumTime: number = null;
	private minimumTimeToString: string = '';
	private maximumTimeToString: string = '';
	private randomFutureTimeInMinutes: number = Math.ceil( Math.random() * this.maximumTime);
	private minimumTimeBetweenAlarms = 60 * this.minimumTime;
	private countingInterval: any;
	private alarmStarted: boolean = true;
	private alarmButtonText: string = "Start";
	private platformIsCordova: boolean = false;

	constructor(public navCtrl: NavController, private fb: FormBuilder, private platform: Platform) {
		this.timeForm = this.fb.group({
			minimum: ['', Validators.required],
			maximum: ['', Validators.required]
		});
	}

	ngOnInit() {
		this.platform.ready().then(() => {
			this.platformIsCordova = this.platform.is('cordova');
		});
	}



	setAlarm() {	
		this.endingSeconds = this.startingSeconds + this.generateFutureSeconds();
		this.alarmStarted = true;
		this.alarmButtonText = "Spinner";
	}



	resetAlarm() {
		clearInterval(this.countingInterval);
		this.timeForm.reset();
		this.alarmStarted = false;
		this.randomFutureTimeInMinutes = null;
	}



	generateFutureSeconds() {
		let randomFutureTime = (Math.random() * this.maximumTime) * 60;

		while(randomFutureTime < this.minimumTime) {
			randomFutureTime = (Math.random() * this.maximumTime) * 60;
		}
	
		return randomFutureTime;
	}



	toggleAlarm() {
		console.log(`Alarm Started`);

		if (!this.alarmStarted) {
			this.setAlarm();
			clearInterval(this.countingInterval);
			this.countingInterval = setInterval(() => {
				this.startingSeconds += 1;

				console.log(this.startingSeconds, this.endingSeconds, Math.ceil(this.endingSeconds - this.startingSeconds));

				if (this.startingSeconds >= this.endingSeconds) {
					console.log(`Alarm Alarm!`);
					this.alarmButtonText = "Start";
					// this.audio.play();
					this.resetAlarm();
				}
			}, 1000);
		} else {
			this.resetAlarm();
			this.alarmButtonText = "Start";
		}
	}



	handleOnChange(event) {
		let date = new Date(null);
		let minimumSecondsToTime;
		let maximumSecondsToTime;

		switch(event.ngControl.name) {
			case 'minimum':
				minimumSecondsToTime = event.ngControl.value;
				date.setSeconds(minimumSecondsToTime);
				minimumSecondsToTime = date.toISOString().substr(11, 8);
				console.log(`minimum`, minimumSecondsToTime);
				this.minimumTime = event.ngControl.value;
				break;

			case 'maximum':
				maximumSecondsToTime = event.ngControl.value;
				date.setSeconds(maximumSecondsToTime);
				maximumSecondsToTime = date.toISOString().substr(11, 8);
				console.log(`maximum`, maximumSecondsToTime);
				this.maximumTime = event.ngControl.value;
				break;

			default:
				console.log(`default`);
				break;
		}
	}



	handleOnSubmit() {
		console.log(`handleOnSubmit`);
	}
}
