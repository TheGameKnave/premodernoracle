import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { findIndex } from 'rxjs';
import { CardFormattingOptions } from 'src/app/app.component';
import { lands, symbols, tombstoneList, wubrg } from 'src/app/constants';
import { HelpersService } from 'src/app/services/helpers.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit, AfterViewInit {
  @Input() card: any = {};
  @Input() cardFormattingOptions: CardFormattingOptions = {};
  @Input() face?: number;
  private cardTitleRef!: ElementRef;
  @ViewChild('cardTitleElement') set cardTitleElement (content: ElementRef) {
    if(content) this.cardTitleRef = content;
  }
  private cardManaCostRef!: ElementRef;
  @ViewChild('cardManaCostElement') set cardManaCostElement (content: ElementRef) {
    if(content) this.cardManaCostRef = content;
  }
  private cardTypeRef!: ElementRef;
  @ViewChild('cardTypeElement') set cardTypeElement (content: ElementRef) {
    if(content) this.cardTypeRef = content;
  }
  private cardExpansionRef!: ElementRef;
  @ViewChild('cardExpansionElement') set cardExpansionElement (content: ElementRef) {
    if(content) this.cardExpansionRef = content;
  }
  private cardArtistRef!: ElementRef;
  @ViewChild('cardArtistElement') set cardArtistElement (content: ElementRef) {
    if(content) this.cardArtistRef = content;
  }
  private cardTextRef!: ElementRef;
  @ViewChild('cardTextElement') set cardTextElement (content: ElementRef) {
    if(content) this.cardTextRef = content;
  }
  prod = environment.production;
  imageIndex: number | null = null;
  cardImage: string = '';
  imageArtist: string = '';
  cardType = this.helpers.cardType.bind(this.helpers);
  colorID = this.helpers.colorID.bind(this.helpers);
  tombstoneFrame = this.helpers.tombstoneFrame.bind(this.helpers);
  formatPT = this.helpers.formatPT.bind(this.helpers);
  parseSymbols = this.helpers.parseSymbols.bind(this.helpers);
  findSymbols = this.helpers.findSymbols.bind(this.helpers);
  formatText = this.helpers.formatText.bind(this.helpers);

  originalCard: boolean = false;

  constructor(
    private helpers: HelpersService,
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    this.cardImage = this.helpers.determineCardImage(this.card, this.face, this.imageIndex);
    this.imageIndex = this.card.arts[this.face || 0].findIndex((x: any) => x.art_crop === this.cardImage);
    this.imageArtist = this.helpers.determineImageArtist(this.card, this.face, this.imageIndex, this.cardImage);
  }

  ngAfterViewInit(): void {
    this.adjustCardTitleSize();
    this.adjustCardTypeSize();
    this.adjustCardTextSize();
    this.adjustArtistSize();
  }


  cardTemplate(card: any, face: number | undefined, base: string = 'card') {
    let returnString = '';
    let colors = this.colorID(card,face);
    let manaCost: string = face !== undefined ? card.card_faces[face].mana_cost : (card.layout === 'adventure' ? card.card_faces[0].mana_cost : card.mana_cost);
    let costArr = manaCost.split(/[{}]+/);
    costArr = costArr.filter(x => x);
    let hybridArr: string[] = [];
    costArr.forEach((cost,i) => {
      if(costArr[i].includes('/')) {
        hybridArr.push(costArr.splice(i, 1)[0]);
      }
    });
    switch (this.cardType(card,face)) {
      case 'Land':
        if(colors.length > 2) {
          returnString += 'lm';
        }else if(colors.length === 0) {
          returnString += 'lc';
        }else{
          returnString += 'l' + colors[0].toLowerCase();
        }
        break;
      case 'Artifact':
        if(colors.length > 2) {
          returnString += 'am';
        }else if(colors.length === 0) {
          returnString += 'a';
        }else{
          returnString += 'a' + colors[0].toLowerCase();
        }
        break;
    
      default:
        // if card text or the current face's text includes 'Devoid'
        let devoid = (card.oracle_text?.includes('Devoid') || card.card_faces?.[face || 0]?.oracle_text?.includes('Devoid'));
        if(devoid){
          if(colors.length > 2) {
            returnString += 'cm';
          }else if(colors.length > 0) {
            returnString += 'c' + colors[0].toLowerCase();
          }else if(colors.length === 0) {
            returnString += 'c';
          }
        }else if(colors.length > 1) {
          // if hybridArr is not empty and all of its elemets are identical
          // AND if W, U, B, R, G are not in the costArr
          if(hybridArr.length > 0 && hybridArr.every(x => x === hybridArr[0]) && !wubrg.some(x => costArr.includes(x))) {
            returnString += hybridArr[0][0].toLowerCase();
          }else if(colors.length === 2 && !card.card_faces?.[face || 0]?.mana_cost && !card.mana_cost){
            returnString += colors[0].toLowerCase();
          }else{
            returnString += 'm';
            if(colors.length === 2 && (!hybridArr.length || colors.some(val => wubrg.includes(val)))) {
              returnString += colors[0].toLowerCase();
            }
          }
        } else if(colors.length === 1) {
          returnString += colors[0].toLowerCase();
        } else if(colors.length === 0) {
          returnString += 'c';
        }
        break;
    }
    return base + '_' + returnString
  }
  cardTemplate2(card: any,face: number | undefined, base: string = 'card') {
    let typeLine: string = face !== undefined ? card.card_faces[face].type_line : (card.layout === 'adventure' ? card.card_faces[0].type_line : card.type_line);
    let manaCost: string = face !== undefined ? card.card_faces[face].mana_cost : (card.layout === 'adventure' ? card.card_faces[0].mana_cost : card.mana_cost);
    let costArr = manaCost.split(/[{}]+/);
    costArr = costArr.filter(x => x);
    let hybridArr: string[] = [];
    costArr.forEach((cost,i) => {
      if(costArr[i].includes('/')) {
        hybridArr.push(costArr.splice(i, 1)[0]);
      }
    });
    let returnString = '';
    // if card text or the current face's text includes 'Devoid'
    let devoid = (card.oracle_text?.includes('Devoid') || card.card_faces?.[face || 0]?.oracle_text?.includes('Devoid'));
    if(devoid){
      let colors = this.colorID(card,face);
      if(colors.length > 2) {
        returnString += 'cm';
      }else if(colors.length > 0) {
        returnString += 'c' + colors[1].toLowerCase();
      }else if(colors.length === 0) {
        returnString += 'c';
      }
    }else if(this.cardType(card,face) === 'Land'){
      returnString += 'l';
    }else if(this.cardType(card,face) === 'Artifact'){
      returnString += 'a';
    }else if(this.colorID(card,face)[1]){
      if((!hybridArr.length || costArr.some(val => wubrg.includes(val))) && (card.mana_cost || card.card_faces?.[face || 0]?.mana_cost) && this.cardType(card,face) !== 'Artifact' && this.cardType(card,face) !== 'Land'){
        returnString += 'm'
      }
      returnString += (hybridArr[0] ? hybridArr[0][2] : this.colorID(card,face)[1]).toLowerCase();
    }
    return base + '_' + returnString
  }

  adjustCardTitleSize() {
    const cardTitleElement = this.cardTitleRef?.nativeElement || null;
    const cardManaCostElement = this.cardManaCostRef?.nativeElement || null;
    setTimeout(() => {
      if(cardTitleElement){
        let fontSize = parseInt(window.getComputedStyle(cardTitleElement).fontSize);
        //count the number of mana symbols in mana_cost
        while (cardTitleElement.clientWidth + cardManaCostElement?.clientWidth + 15 > 600) {
          fontSize -= 0.25;
          cardTitleElement.style.fontSize = `${fontSize}px`;
        }
      }
    }, 500);
  }
  
  adjustCardTypeSize() {
    const cardTypeElement = this.cardTypeRef?.nativeElement || null;
    if(cardTypeElement){
      const cardExpansionElement = this.cardExpansionRef.nativeElement || null;
      let fontSize = parseInt(window.getComputedStyle(cardTypeElement).fontSize);

      while (cardTypeElement.clientWidth + (cardExpansionElement ? cardExpansionElement.clientWidth : 0) > 565) {
        fontSize -= 0.25;
        cardTypeElement.style.fontSize = `${fontSize}px`;
      }
    }
  }

  adjustArtistSize() {
    // wait for the redraw to get the new imageArtist
    setTimeout(() => {
      const cardArtistElement = this.cardArtistRef?.nativeElement || null;
      let fontSize = 27; // big so it can be reduced. this might be smarter-assigned to a const
      if(cardArtistElement) {  
        while (cardArtistElement.clientWidth > 380) {
          fontSize -= 0.25;
          console.log(fontSize)
          cardArtistElement.style.fontSize = `${fontSize}px`;
        }
        cardArtistElement.style.fontSize = `${fontSize}px`;
      }
    }, 0);
  }

  adjustCardTextSize() {
    const cardTextElement = this.cardTextRef?.nativeElement || null;
    if(cardTextElement){
      let fontSize = parseInt(window.getComputedStyle(cardTextElement).fontSize);
      let letterSpacing = 0;

      while (cardTextElement.scrollHeight > 275 && fontSize > 16) {
        if(fontSize > 18) fontSize -= 0.25;
        else letterSpacing -= 0.25;
        cardTextElement.style.fontSize = `${fontSize}px`;
        if(letterSpacing) cardTextElement.style.letterSpacing = `${letterSpacing}px`;
      }
      
      if(cardTextElement.scrollHeight < 90) {
        cardTextElement.style.textAlign = 'center';
      }
      let leftoverSpace = 275 - cardTextElement.scrollHeight;
      cardTextElement.style.paddingTop = `${leftoverSpace/2.5}px`;
    }
  }
  advanceImage(direction: number = 1) {
    if(this.card.arts[this.face || 0].length === 1) return;
    // find the index of the current image url from within card.arts[i].art_crop
    this.imageIndex = (this.imageIndex || 0) < this.card.arts?.[this.face || 0].length - direction ? (this.imageIndex || 0) + direction : 0;
    // if imageIndex is out of bounds, set it to the last image in the array or the first image in the array
    if(this.imageIndex >= this.card.arts?.[this.face || 0].length) this.imageIndex = 0;
    if(this.imageIndex < 0) this.imageIndex = this.card.arts?.[this.face || 0].length - 1;
    this.cardImage = this.helpers.determineCardImage(this.card, this.face, this.imageIndex, true);
    this.imageArtist = this.helpers.determineImageArtist(this.card, this.face, this.imageIndex, this.cardImage);
    this.adjustArtistSize();
    this.cookieService.set(this.card.card_faces?.[this.face || 0].name || this.card.name, this.cardImage, 365, '/');
  }

}
