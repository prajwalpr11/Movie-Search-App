import { LightningElement, wire } from 'lwc';
// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/MovieChannel__c';

const DELAY = 300;

export default class MovieSearch extends LightningElement {
    selectedType = "";
    isloading = false;
    selectedSearch = "";
    selectedPage = "1";
    delayTimeout;
    searchResult = [];
    selectedMovie = "";
    @wire(MessageContext)
    messageContext;

    get typeOptions(){
        return [
            { label: 'None', value: ""},
            { label: 'Movie', value: 'movie' },
            { label: 'Series', value: 'series' },
            { label: 'Episode', value: 'episode' },
        ];
    }

    handleChange(event){
        let{name,value} = event.target;
        this.isloading = true;
        if(name === 'type'){
            this.selectedType = value;
        }else if(name === 'search'){
            this.selectedSearch = value;
        }else if(name = 'pageNumber'){
            this.selectedPage = value;
        }

        clearTimeout(this.delayTimeout)
        this.delayTimeout = setTimeout(()=>{ 
                this.searchMovie();
            },DELAY);
    }

    async searchMovie(){
        const url = `https://www.omdbapi.com/?s=${this.selectedSearch}&type=${this.selectedType}&page=${this.selectedPage}&apikey=7e2c57b3`;
        const response = await fetch(url);
        const  data = await response.json();
        console.log("Movie is ",data);
        this.isloading = false;
        if(data.Response === 'True'){
            this.searchResult = data.Search;
        }


    }

    movieSelectedHandler(event){
        this.selectedMovie = event.detail;

        const payload = { movieId: this.selectedMovie };

        publish(this.messageContext, MOVIE_CHANNEL, payload);
    }

    get getDisplaySearchResult(){
        return this.searchResult.length > 0 ? true:false;
    }

}
