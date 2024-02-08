import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subscription, catchError, combineLatest, debounceTime, map, mergeAll, of, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { ApiService } from './services/web-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('textarea') textRef: ElementRef = new ElementRef(null);
  
  ngAfterViewInit() {            
    this.textRef.nativeElement.focus();
    this.adjustTextboxSize()
  }
  Object = Object;
  Array = Array;
  title = 'premodern-oracle';
  
  cardNames: string = 'Infernal Spawn of Infernal Spawn of Evil\nPhyrexian Dreadnought';
  cardData: any[] = [];
  missingCards: string[] = [];

  constructor(
    private apiService: ApiService,
  ) {}
  ngOnInit() {
    
  }

  adjustTextboxSize() {
    let textarea = document.getElementsByTagName('textarea')[0]
    if (textarea) {
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto'
        textarea.style.height = textarea.scrollHeight + 'px'
      })

      // Initialize the textarea height
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }
  // method to fetch cards based on form contents
  async fetchCards() {
    let cardList = this.cardNames.split(/\r?\n/)
    // remove any leading numbers and spaces, and any trailing spaces
    cardList = cardList
      .map(card => card.replace(/^\d+|\s+$/g, '').trim())
      .filter(card => card)
    // dedup the list
    cardList = cardList.filter(
      (card, index) =>
        cardList.indexOf(card) === index
        && !card.toLowerCase().includes('sideboard')
        && card !== 'Deck' && card !== 'Deck:'
    )
    this.cardNames = cardList.join('\n')
    fetch('/api/cards', {
      method: 'POST', // Update the method to 'POST'
      headers: {
        'Content-Type': 'application/json', // Set the content type header if sending JSON payload
      },
      body: JSON.stringify({ cardList: cardList }), // Include your payload data here
    })
      .then(response => response.json())
      .then((cards: any[]) => {
        this.cardData = cards;
        this.missingCards = Object.entries(cards)
          .filter(([key, value]) => key !== 'cardList' && !Object.keys(value).length)
          .map(([key, value]) => key)
      })
      .catch(error => {
        console.error('Fetch error:', error)
      })
  }
}

