import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { lands, symbols, tombstoneList, wubrg } from 'src/app/constants';
import { HelpersService } from 'src/app/services/helpers.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit, AfterViewInit {
  @Input() card: any = {};
  @Input() face?: number;
  private cardTitleRef!: ElementRef;
  @ViewChild('cardTitleElement') set cardTitleElement (content: ElementRef) {
    if(content) this.cardTitleRef = content;
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
  ) { }

  ngOnInit(): void {
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
          returnString += 'ml';
        }else if(colors.length === 0) {
          returnString += 'cl';
        }else{
          returnString += colors[0].toLowerCase() + 'l';
        }
        break;
      case 'Artifact':
        if(colors.length > 2) {
          returnString += 'ma';
        }else if(colors.length === 0) {
          returnString += 'a';
        }else{
          returnString += colors[0].toLowerCase() + 'a';
        }
        break;
    
      default:
        if(colors.length > 1) {
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
          returnString += 'c';
        }
        break;
    }
    return returnString + base
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
    if(this.colorID(card,face)[1]) returnString = (hybridArr[0] ? hybridArr[0][2] : this.colorID(card,face)[1]).toLowerCase();
    if(this.cardType(card,face) === 'Land'){
      returnString += 'l';
    }
    if(this.cardType(card,face) === 'Artifact'){
      returnString += 'a';
    }
    return returnString + base
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
      const cardExpansionElement = this.cardExpansionRef.nativeElement || null;
      let fontSize = parseInt(window.getComputedStyle(cardTypeElement).fontSize);

      while (cardTypeElement.clientWidth + (cardExpansionElement ? cardExpansionElement.clientWidth : 0) > 570) {
        fontSize -= 0.25;
        cardTypeElement.style.fontSize = `${fontSize}px`;
      }
    }
  }

  adjustArtistSize() {
    const cardArtistElement = this.cardArtistRef?.nativeElement || null;
    if(cardArtistElement){
      let fontSize = parseInt(window.getComputedStyle(cardArtistElement).fontSize);

      while (cardArtistElement.clientWidth > 380) {
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

      while (cardTextElement.scrollHeight > 275 && fontSize > 18) {
        if(fontSize > 18) fontSize -= 0.25;
        else letterSpacing -= 0.25;
        cardTextElement.style.fontSize = `${fontSize}px`;
        if(letterSpacing) cardTextElement.style.letterSpacing = `${letterSpacing}px`;
      }
      
      if(cardTextElement.scrollHeight < 70) {
        cardTextElement.style.textAlign = 'center';
      }
      let leftoverSpace = 285 - cardTextElement.scrollHeight;
      cardTextElement.style.paddingTop = `${leftoverSpace/2.5}px`;
    }
  }

}
