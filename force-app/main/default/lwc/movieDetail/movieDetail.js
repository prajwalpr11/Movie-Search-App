import { LightningElement,wire } from 'lwc';
// Import message service features required for subscribing and the message channel
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/MovieChannel__c';

export default class MovieDetail extends LightningElement {
    subscription = null;
    loadComponent = false;
    movieDetails = {};

    @wire(MessageContext)
    messageContext;


    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                MOVIE_CHANNEL,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    handleMessage(message) {
        let movieId = message.movieId;
        console.log("movieId",movieId);
        this.fetchMovieDetail(movieId);
    }


    async fetchMovieDetail(movieId){
        let url = `https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=7e2c57b3`;
        const res = await fetch(url);
        const data = await res.json();
        console.log('movieDetails',data);
        if(data.Response === 'True'){
            this.loadComponent = true;
            this.movieDetails = data;
        }
    }
}