import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import moment from 'moment';

export interface Sound {	
	name: string,
	fileName: string,
	src: string,
	type: string
}

@Component({
  selector: 'page-home',
  animations: [
  	trigger('soundMenuAnimation', [
		state('closed', style({
  			height: '0'
  		})),
  		state('open', style({
  			height: '15rem'
  		})),
  	])],
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
	private soundMenuState: string = "open";
	private audio: any = null;
	private audioSrc: string;
	private audioType: string;
	private alarmState: string = "waiting";
	private defaultSounds: Sound[] = [
		{ 
			name: 'pew',
			fileName: 'pew.mp3',
			src: '../../assets/pew.mp3',
      		type: 'file/mp3' 
		},
	    { 
			name: 'Birds Singing',
			fileName: 'birdssinging.mp3',
			src: '../../assets/birdssinging.mp3',
			type: 'file/mp3' 
		},
	    { 
			name: 'Thunder and Lightning',
			fileName: 'thunderlightning.mp3',
			src: '../../assets/thunderlightning.mp3',
			type: 'file/mp3' 
		},
		{ 
			name: 'Digital',
			fileName: 'digital.mp3',
			src: '../../assets/digital.mp3',
			type: 'file/mp3' 
		}
	];
	private selectedSound: Sound = this.defaultSounds[0];
 

	constructor(public navCtrl: NavController, 
		        private fb: FormBuilder,
		        private platform: Platform) {
		this.timeForm = this.fb.group({
			minimum: ['', Validators.required],
			maximum: ['', Validators.required]
		}); 
	}

	ngOnInit() {
		this.platform.ready().then(() => {
			this.platformIsCordova = this.platform.is('cordova');
		});

		this.audio = new Audio();
		this.audio.src = '../../assets/pew.mp3';
		this.audio.load();
	

		console.log(this.selectedSound);
	}



	setAlarm() {	
		this.endingSeconds = this.startingSeconds + this.generateFutureSeconds();
		this.alarmStarted = true;
		this.alarmButtonText = "Stop";
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

		switch(this.alarmState) {

			case 'waiting':
				console.log('waiting case');
				this.setAlarm();
				this.alarmState = "counting";
				this.alarmButtonText = "Stop";
				clearInterval(this.countingInterval);
				this.countingInterval = setInterval(() => {
					this.startingSeconds += 1;

					console.log(this.startingSeconds, this.endingSeconds, Math.ceil(this.endingSeconds - this.startingSeconds));

					if (this.startingSeconds >= this.endingSeconds) {
						console.log(`Alarm Alarm!`);
						this.alarmState = "resetting";
						this.alarmButtonText = "Start";
						this.audio.play();
						// this.audio.play();
						this.resetAlarm();
					}
				}, 1000);
				break;
			case 'counting':
				console.log(`counting case`);
				this.resetAlarm();	
				//this.audio.stop();
				this.alarmButtonText = "Start";	
				this.alarmState = "waiting";
				break;

			case 'stopping':
				console.log(`stopping case`);
				break;

			case 'resetting':
				console.log(`resetting`);
				this.resetAlarm();
				//this.audio.stop();  
				this.alarmButtonText = "Start";
				this.alarmState = "waiting";
				break;
		}

		// if (!this.alarmStarted) {
		// 	this.setAlarm();
		// 	clearInterval(this.countingInterval);
		// 	this.countingInterval = setInterval(() => {
		// 		this.startingSeconds += 1;

		// 		console.log(this.startingSeconds, this.endingSeconds, Math.ceil(this.endingSeconds - this.startingSeconds));

		// 		if (this.startingSeconds >= this.endingSeconds) {
		// 			console.log(`Alarm Alarm!`);
		// 			this.alarm.play();
		// 			this.alarmButtonText = "Stop";
		// 			// this.audio.play();
		// 			this.resetAlarm();
		// 		}
		// 	}, 1000);
		// } else {
		// 	this.resetAlarm();
		// 	this.alarmButtonText = "Start";
		// }
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


	toggleSoundSelectMenu() {
		// Something about animating the state
		this.soundMenuState === "closed" ? "open" : "closed";
	}

	setSelectedSound(sound) {
		this.selectedSound = {
			name: sound.name,
			fileName: sound.name,
			src: '../../assets/${sound.fileName}',
			type: sound.type 
		};

		// this.loadAudio
	}
	
	selectNativeFile() {
		// this.fileChooser.open().then(uri => {
		// 	console.log(`fileChooser uri`, uri);
		// })
		// .catch(error => {
		// 	console.log(`An error occured fetching native file`, error);
		// });
	}

	handleFileSelect(event) {
		console.log(`handleOnFileSelect`, event);
		const name = event.target.files[0].name; // truncate
		
		this.setSelectedSound({
			name,
			src: `../../assets/${name}`,
			type: event.target.files[0].type
		});
	}
}
