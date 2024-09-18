import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { wubrg } from 'src/app/constants';
import { HelpersService } from 'src/app/services/helpers.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-split-card',
  templateUrl: './split-card.component.html',
})
export class SplitCardComponent implements OnInit, AfterViewInit {
  @Input() card: any = {};
  @Input() face?: number;

  private cardTitleRef!: ElementRef;
  @ViewChild('splitCardTitleElement') set splitCardTitleElement (content: ElementRef) {
    if(content) this.cardTitleRef = content;
  }
  private cardTypeRef!: ElementRef;
  @ViewChild('splitCardTypeElement') set splitCardTypeElement (content: ElementRef) {
    if(content) this.cardTypeRef = content;
  }
  private cardExpansionRef!: ElementRef;
  @ViewChild('splitCardExpansionElement') set splitCardExpansionElement (content: ElementRef) {
    if(content) this.cardExpansionRef = content;
  }
  private cardArtistRef!: ElementRef;
  @ViewChild('splitCardArtistElement') set splitCardArtistElement (content: ElementRef) {
    if(content) this.cardArtistRef = content;
  }
  private cardTextRef!: ElementRef;
  @ViewChild('splitCardTextElement') set splitCardTextElement (content: ElementRef) {
    if(content) this.cardTextRef = content;
  }

  prod = environment.production;
  imageIndex: number | null = null;
  cardImage: string = '';
  imageArtist: string = '';
  cardType = this.helpers.cardType.bind(this.helpers);
  splitColorID = this.helpers.splitColorID.bind(this.helpers);
  tombstoneFrame = this.helpers.tombstoneFrame.bind(this.helpers);
  formatPT = this.helpers.formatPT.bind(this.helpers);
  parseSymbols = this.helpers.parseSymbols.bind(this.helpers);
  findSymbols = this.helpers.findSymbols.bind(this.helpers);
  formatText = this.helpers.formatText.bind(this.helpers);

  constructor(
    private helpers: HelpersService,
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    this.cardImage = this.helpers.determineCardImage(this.card, this.face, this.imageIndex);
    this.imageIndex = this.card.arts[this.face || 0].findIndex((x: any) => x.art_crop === this.cardImage);
    this.imageArtist = this.helpers.determineImageArtist(this.card, this.face, this.imageIndex, this.cardImage);
  }

  ngAfterViewInit() {
    this.adjustCardTitleSize();
    this.adjustCardTypeSize();
    this.adjustCardTextSize();
    this.adjustArtistSize();
  }

  splitCardTemplate(card: any, face: number | undefined) {
    let colors: string = face !== undefined ? this.helpers.getColorsFromCost(card.card_faces[face].mana_cost) : card.colors;
    let typeLine: string = face !== undefined ? card.card_faces[face].type_line : card.type_line;
    let manaCost: string = face !== undefined ? card.card_faces[face].mana_cost : card.mana_cost;
    let returnString = '';
    if(colors.length > 1) {
      let costArr = manaCost.split(/[{}]+/);
      costArr = costArr.filter(x => x);
      let hybridArr: string[] = [];
      costArr.forEach((cost,i) => {
        if(costArr[i].includes('/')) {
          hybridArr.push(costArr.splice(i, 1)[0]);
        }
      });
      // if hybridArr is not empty and all of its elemets are identical
      // AND if W, U, B, R, G are not in the costArr
      if(hybridArr.length > 0 && hybridArr.every(x => x === hybridArr[0]) && !wubrg.some(x => costArr.includes(x))) {
        returnString += hybridArr[0][0].toLowerCase();
      }else{
        returnString += 'm';
      }
    } else if(colors.length === 1) {
      returnString += colors[0].toLowerCase();
    } else if(colors.length === 0) {
      if(typeLine.includes('Land')){
        if(this.splitColorID(card,face).length > 2) {
          returnString += 'ml';
        }else if(this.splitColorID(card,face).length === 0) {
          returnString += 'cl';
        }else{
          returnString += this.splitColorID(card,face)[0].toLowerCase() + 'l';
        }
      }else if(typeLine.includes('Artifact')) { 
        returnString += 'a';
      }else{
        returnString += 'c';
      }
    }
    return returnString + 'split'
  }
  splitCardTemplate2(card: any, face: number | undefined) {
    let typeLine: string = face !== undefined ? card.card_faces[face].type_line : card.type_line;
    let manaCost: string = face !== undefined ? card.card_faces[face].mana_cost : card.mana_cost;
    let costArr = manaCost.split(/[{}]+/);
    costArr = costArr.filter(x => x);
    let hybridArr: string[] = [];
    costArr.forEach((cost,i) => {
      if(costArr[i].includes('/')) {
        hybridArr.push(costArr.splice(i, 1)[0]);
      }
    });
    let returnString = '';
    if(this.splitColorID(card,face)[1]) returnString = (hybridArr[0] ? hybridArr[0][2] : this.splitColorID(card,face)[1]).toLowerCase();
    if(typeLine.includes('Land')){
      returnString += 'l';
    }
    return returnString + 'split'
  }

  adjustCardTitleSize() {
    const cardTitleElement = this.cardTitleRef?.nativeElement || null;
    if(cardTitleElement){
      let fontSize = parseInt(window.getComputedStyle(cardTitleElement).fontSize);

      //count the number of mana symbols in mana_cost
      const countInstancesOfCharacter = (inputString: string, character: string) => inputString.split(character).length - 1;
      let manaCount = countInstancesOfCharacter(this.card.card_faces ? this.card.card_faces[0].mana_cost : this.card.mana_cost || '', '{');
      while (cardTitleElement.clientWidth + (manaCount * 40) > 600) {
        fontSize -= 0.25;
        cardTitleElement.style.fontSize = `${fontSize}px`;
      }
    }
  }

  adjustCardTypeSize() {
    const cardTypeElement = this.cardTypeRef?.nativeElement || null;
    if(cardTypeElement){
      const cardExpansionElement = this.cardExpansionRef?.nativeElement || null;
      let fontSize = parseInt(window.getComputedStyle(cardTypeElement).fontSize);

      while (cardTypeElement.clientWidth + (cardExpansionElement ? cardExpansionElement.clientWidth : 0) > 580) {
        fontSize -= 0.25;
        cardTypeElement.style.fontSize = `${fontSize}px`;
      }
    }
  }

  adjustArtistSize() {
    const cardArtistElement = this.cardArtistRef?.nativeElement || null;
    if(cardArtistElement){
      let fontSize = parseInt(window.getComputedStyle(cardArtistElement).fontSize);

      while (cardArtistElement.clientWidth > 580) {
        fontSize -= 0.25;
        cardArtistElement.style.fontSize = `${fontSize}px`;
      }
    }
  }

  adjustCardTextSize() {
    const cardTextElement = this.cardTextRef?.nativeElement || null;
    if(cardTextElement){
      let fontSize = parseInt(window.getComputedStyle(cardTextElement).fontSize);
      let letterSpacing = 0;

      while (cardTextElement.scrollHeight > 220 && fontSize > 14) {
        if(fontSize > 14) fontSize -= 0.25;
        else letterSpacing -= 0.25;
        cardTextElement.style.fontSize = `${fontSize}px`;
        cardTextElement.style.letterSpacing = `${letterSpacing}px`;
      }
      if(cardTextElement.scrollHeight < 80) {
        cardTextElement.style.textAlign = 'center';
      }
      let leftoverSpace = 195 - cardTextElement.scrollHeight;
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
