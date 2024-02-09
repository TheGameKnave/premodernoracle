import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('textarea') textRef: ElementRef = new ElementRef(null);
  loading = false;
  cardsTooMany = false;
  
  ngAfterViewInit() {            
    this.textRef.nativeElement.focus();
    this.adjustTextboxSize()
  }
  Object = Object;
  Array = Array;
  title = 'premodern-oracle';
  
  cardField: UntypedFormControl = new UntypedFormControl();
  cardFieldSub: Subscription | undefined;
  cardList: string[] = [];
  cardData: any[] = [];
  missingCards: string[] = [];

  constructor(
  ) {}
  ngOnInit() {
    this.cardFieldSub = this.cardField.valueChanges.subscribe((value: string) => {
      this.cardList = value.split(/\r?\n/)
      // remove any leading numbers and spaces, and any trailing spaces
      this.cardList = this.cardList
        .map(card => card.replace(/^\d+|\s+$/g, '').trim())
        .filter(card => card)
      // dedup the list
      this.cardList = this.cardList.filter(
        (card, index) =>
          this.cardList.indexOf(card) === index
          && !card.toLowerCase().includes('sideboard')
          && card !== 'Deck' && card !== 'Deck:'
      );
      this.cardsTooMany = this.cardList.length > 100;
    })
  }

  adjustTextboxSize() {
    let textarea = document.getElementsByTagName('textarea')[0];
    if (textarea) {
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      })

      // Initialize the textarea height
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }
  // method to fetch cards based on form contents
  async fetchCards() {
    this.loading = true;
    this.cardData = [];
    this.cardField.setValue(this.cardList.join('\n'));
    if(this.cardList.length <= 100){
      fetch('/api/cards', {
        method: 'POST', // Update the method to 'POST'
        headers: {
          'Content-Type': 'application/json', // Set the content type header if sending JSON payload
        },
        body: JSON.stringify({ cardList: this.cardList }), // Include your payload data here
      })
        .then(response => response.json())
        .then((cards: any[]) => {
          this.loading = false;
          this.cardData = cards;
          this.missingCards = Object.entries(cards)
            .filter(([key, value]) => key !== 'cardList' && !Object.keys(value).length)
            .map(([key, value]) => key)
        })
        .catch(error => {
          this.loading = false;
          console.error('Fetch error:', error)
        })
    }
  }
}

