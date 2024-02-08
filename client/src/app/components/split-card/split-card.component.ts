import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

  splitCardTemplate = this.helpers.splitCardTemplate.bind(this.helpers);
  splitCardTemplate2 = this.helpers.splitCardTemplate2.bind(this.helpers);
  cardType = this.helpers.cardType.bind(this.helpers);
  splitColorID = this.helpers.splitColorID.bind(this.helpers);
  tombstoneFrame = this.helpers.tombstoneFrame.bind(this.helpers);
  formatPT = this.helpers.formatPT.bind(this.helpers);
  parseSymbols = this.helpers.parseSymbols.bind(this.helpers);
  findSymbols = this.helpers.findSymbols.bind(this.helpers);
  formatText = this.helpers.formatText.bind(this.helpers);

  constructor(
    private helpers: HelpersService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.adjustCardTitleSize();
    this.adjustCardTypeSize();
    this.adjustCardTextSize();
    this.adjustArtistSize();
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
    console.log(cardTextElement);
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
      console.log(leftoverSpace);
      cardTextElement.style.paddingTop = `${leftoverSpace/2.5}px`;
    }
  }
}
