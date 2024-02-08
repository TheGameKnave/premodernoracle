import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { lands, symbols, tombstoneList, wubrg } from 'src/app/constants';
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
    if(content) { // initially setter gets called with undefined
        this.cardTitleRef = content;
    }
  }
  private cardTypeRef!: ElementRef;
  @ViewChild('cardTypeElement') set cardTypeElement (content: ElementRef) {
    if(content) { // initially setter gets called with undefined
        this.cardTypeRef = content;
    }
  }
  private cardExpansionRef!: ElementRef;
  @ViewChild('cardExpansionElement') set cardExpansionElement (content: ElementRef) {
    if(content) { // initially setter gets called with undefined
        this.cardExpansionRef = content;
    }
  }
  private cardArtistRef!: ElementRef;
  @ViewChild('cardArtistElement') set cardArtistElement (content: ElementRef) {
    if(content) { // initially setter gets called with undefined
        this.cardArtistRef = content;
    }
  }
  private cardTextRef!: ElementRef;
  @ViewChild('cardTextElement') set cardTextElement (content: ElementRef) {
    if(content) { // initially setter gets called with undefined
        this.cardTextRef = content;
    }
  }
  prod = environment.production;

  originalCard: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.adjustCardTitleSize();
    this.adjustCardTypeSize();
    this.adjustCardTextSize();
    this.adjustArtistSize();
  }

  cardType(){
    let cardType = 'nonland';
    if(this.face !== undefined ? this.card.card_faces[this.face].type_line.includes('Land') : this.card.type_line.includes('Land')) cardType = 'Land';
    if(this.face !== undefined ? this.card.card_faces[this.face].type_line.includes('Artifact') : this.card.type_line.includes('Artifact')) cardType = 'Artifact';
    return cardType
  }
  colorID(): string[] {
    let colorID: string[] = [];
    switch (this.cardType()) {
      case 'Land':
        colorID = (this.face !== undefined ? this.card.card_faces[this.face].color_identity : this.card.color_identity) || [];
        let text = this.face !== undefined ? this.card.card_faces[this.face].oracle_text : this.card.oracle_text;
        if(text.toLowerCase().includes('add one mana of any color')) colorID = ['W', 'U', 'B', 'R', 'G'];
        if(text.includes('{W}')) colorID.push('W');
        if(text.includes('{U}')) colorID.push('U');
        if(text.includes('{B}')) colorID.push('B');
        if(text.includes('{R}')) colorID.push('R');
        if(text.includes('{G}')) colorID.push('G');
        if(text.includes('Plains')) colorID.push('W');
        if(text.includes('Island')) colorID.push('U');
        if(text.includes('Swamp')) colorID.push('B');
        if(text.includes('Mountain')) colorID.push('R');
        if(text.includes('Forest')) colorID.push('G');
        break;
    
      case 'Artifact':
      default:
        colorID = (this.face !== undefined ? this.card.card_faces[this.face].colors : this.card.colors) || this.card.colors || [];
        break;
    }
    // dedup colorID
    colorID = Array.from(new Set(colorID));
    return colorID || []
  }
  tombstoneFrame() {
    // test for the presence of /Dredge [0-9]/
    let dredge = new RegExp(/Dredge [0-9]/);
    // test oracletext for dredge

    return tombstoneList.includes(this.card.name) || dredge.test(this.face !== undefined ? this.card.card_faces[this.face].oracle_text : this.card.oracle_text)
  }
  cardTemplate(base: string = 'card',face: number | undefined) {
    let returnString = '';
    let colors = this.colorID();
    let manaCost: string = face !== undefined ? this.card.card_faces[face].mana_cost : (this.card.layout === 'adventure' ? this.card.card_faces[0].mana_cost : this.card.mana_cost);
    let costArr = manaCost.split(/[{}]+/);
    costArr = costArr.filter(x => x);
    let hybridArr: string[] = [];
    costArr.forEach((cost,i) => {
      if(costArr[i].includes('/')) {
        hybridArr.push(costArr.splice(i, 1)[0]);
      }
    });
    switch (this.cardType()) {
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
  cardTemplate2(base: string = 'card',face: number | undefined) {
    let typeLine: string = face !== undefined ? this.card.card_faces[face].type_line : (this.card.layout === 'adventure' ? this.card.card_faces[0].type_line : this.card.type_line);
    let manaCost: string = face !== undefined ? this.card.card_faces[face].mana_cost : (this.card.layout === 'adventure' ? this.card.card_faces[0].mana_cost : this.card.mana_cost);
    let costArr = manaCost.split(/[{}]+/);
    costArr = costArr.filter(x => x);
    let hybridArr: string[] = [];
    costArr.forEach((cost,i) => {
      if(costArr[i].includes('/')) {
        hybridArr.push(costArr.splice(i, 1)[0]);
      }
    });
    let returnString = '';
    if(this.colorID()[1]) returnString = (hybridArr[0] ? hybridArr[0][2] : this.colorID()[1]).toLowerCase();
    if(this.cardType() === 'Land'){
      returnString += 'l';
    }
    if(this.cardType() === 'Artifact'){
      returnString += 'a';
    }
    return returnString + base
  }
  formatText(text: string, flavorText: string) {
    let textBox = text;
    textBox = '<p>' + textBox
      .replace(/\n/g, '</p><p>')
      .replace(/\(/g,'@@@<i class="reminderText">(')
      .replace(/\)/g,')</i>@@@') + '</p>';
    let reminderArr = textBox.split('@@@');
    reminderArr.forEach((reminder,i) => {
      if(reminder.includes('reminderText') && ((text ? text.length : 0) + (flavorText ? flavorText.length : 0)) > 220) {
        reminderArr[i] = reminderArr[i].replace(/reminderText/g, 'reminderText reminderTextLong');
      }
    });
    textBox = reminderArr.join('');
    let typeLine = this.face !== undefined ? this.card.card_faces[this.face].type_line : this.card.type_line;
    // if typeline includes any basic lands from the `lands` variable...
    if(lands.some(land => typeLine.includes(land))) {
      textBox = textBox.replace(/reminderText/g, 'reminderText basicLands');
    }
    let ftxt = flavorText || '';
    if(ftxt) {
      let ftxtArr = ftxt.split('\n');
      ftxtArr = ftxtArr.map(ft => `<p ${ft.indexOf('—') === 0 ? 'class=flavorAttribution' : ''}><i>${ft}</i></p>`);
      textBox = (textBox + (((this.face !== undefined || this.card.layout === 'adventure') ? this.card.card_faces[0].oracle_text : this.card.oracle_text) ? '<hr>' : '') + '<div class="flavorText">' + ftxtArr.join('') + '</div>');
    }
    textBox = textBox
      .replace(/\b\*/g, "<i>")       // Closing asterisk
      .replace(/\*\b/g, "</i>")      // Opening asterisk

      .replace(/\b'/g, "\u2019")     // Closing singles
      .replace(/'$/g, "\u2019")      // Closing singles
      .replace(/'</g, "\u2019<")     // Closing singles
      .replace(/' /g, "\u2019 ")     // Closing singles
      .replace(/\.'/g, "\u2019")     // Closing singles

      .replace(/'\b/g, "\u2018")     // Opening singles
      .replace(/'{/g, "\u2018{")     // Opening singles

      .replace(/\b"/g, "\u201d")     // Closing doubles
      .replace(/\."/g, ".\u201d")    // Closing doubles
      .replace(/,"/g, ",\u201d")    // Closing doubles
      .replace(/"$/g, "\u201d")      // Closing doubles
      .replace(/"</g, "\u201d<")     // Closing doubles

      .replace(/"\b/g, "\u201c")     // Opening doubles
      .replace(/"{/g, "\u201c{")     // Opening doubles
      .replace(/>"/g, ">\u201c")      // Opening doubles
      .replace(/^"/g, "\u201c")      // Opening doubles
      .replace(/--/g,  "\u2014")     // em-dashes;
      .replace(/dd {/g,  "dd&nbsp;{")// add mana nobreak;
      .replace(/=“/g, '="')           // fix closing double quotes
      .replace(/”>/g, '">')          // fix closing double quotes
    if(this.face !== undefined ? this.card.card_faces[this.face].type_line.includes('Saga') : this.card.type_line.includes('Saga')){
      let textArr = textBox.split('<p>');
      textArr = textArr.filter(x => x);
      textArr.forEach((textLine,i) => {
        textArr[i] = textLine
          .replace('</p>','')
          .replace(/([IV, ]*) — /,'$1@@@');
        let lineArr = textArr[i].split('@@@');
        if(lineArr.length > 1) {
          let chaptersArr = lineArr[0].split(', ');
          lineArr[0] = '<div class="chapterNumbers"><div class="chapterNumber">' + chaptersArr.join('</div><div class="chapterNumber">') + '</div></div>';
          lineArr[1] = '<div class="chapterAbility">' + lineArr[1] + '</div>';
          textArr[i] = (chaptersArr[0] !== 'I' ? '<hr>' : '') + '<div class="sagaChapter">' + lineArr.join('') + '</div>';
        }else{
          textArr[i] = '<p>' + textArr[i] + '</p>';
        }
      });
      textBox = textArr.join('');
    }
    if(this.card.type_line.includes('Class')){
      textBox = textBox.replace(/(<p>({.*:) (Level 2)<\/p>)<p>(.*)<\/p>(<p>({.*:) (Level 3)<\/p>)<p>(.*)<\/p>/g,
        `<div class="levelAbility"><div class="levelCost level2">$2</div><div class="levelText">$4</div></div>
<div class="levelAbility"><div class="levelCost level3">$6</div><div class="levelText">$8</div></div>`);
    }
    if(this.card.type_line.includes('Planeswalker')){
      textBox = textBox.replace(/<p>0: /g, '<p class="loyaltyAbility"><span class="textLoyalty">0</span>')
        .replace(/<p>\+([1-9X]): /g, '<p class="loyaltyAbility"><span class="textLoyaltyUp">+$1</span>')
        .replace(/<p>−([1-9X]): /g, '<p class="loyaltyAbility"><span class="textLoyaltyDown">-$1</span>')
        .replace(/<p>\+([0-9X]*): /g, '<p class="loyaltyAbility"><span class="textLoyaltyUp textLoyaltyBig">+$1</span>')
        .replace(/<p>−([0-9X]*): /g, '<p class="loyaltyAbility"><span class="textLoyaltyDown textLoyaltyBig">-$1</span>');
    }
    textBox = textBox
      .replace(/<p>Level up (.*)<\/p><p>LEVEL ([0-9]*-[0-9]*)<\/p><p>([0-9]*\/[0-9]*)<\/p>(<p>(.*)<\/p>)?<p>LEVEL ([0-9]\+*)<\/p><p>([0-9]*\/[0-9]*)<\/p>(<p>(.*)<\/p>)?/g,
        `<div class="levelAbility"><div class="levelReminder">Level up $1</div><div class="levelPT">${this.formatPT((this.face !== undefined ? this.card.card_faces[this.face].power : this.card.power) + '/' + (this.face !== undefined ? this.card.card_faces[this.face].toughness : this.card.toughness))}</div></div>
<div class="levelAbility"><div class="levelSpread">$2</div><div class="levelText">$5</div><div class="levelPT">$3</div></div>
<div class="levelAbility"><div class="levelSpread">$6</div><div class="levelText">$9</div><div class="levelPT">$7</div></div>`);
    textBox = '<div class=rulesText>' + textBox + '</div>';
    return textBox
  }
  formatPT(string: string) {
    return string.replace(/\*/g,'<span class="smol">★</span>')
  }
  parseSymbols(costGroup: string) {
    let costString = '<span class="symbolGroup">';
    let costArr: string[] = costGroup.split(/[{}]+/);
    costArr = costArr.filter(x => x);
    costArr.forEach(cost => {
      costString += '<span class="symbol">';
      if(!isNaN(Number(cost)) && Number(cost) < 10) costString += '<span class="manaGeneric">o</span>' + cost;
      else costString += symbols[cost] || cost;
      costString += '</span>';
    });
    return costString + '</span>';
  }
  findSymbols(string: string) {
    let symbolBuffer = '';
    let readingGroup = false;
    let readingSymbol = false;
    let spacesCount = 0;
    let composedString = '';

    for(let i = 0; i < string.length; i++) {
      if(!readingGroup) {
        if(string[i] === '{') {
          readingGroup = true;
          readingSymbol = true;
        }else{
          composedString += string[i];
        }
      }
      if(readingGroup) {
        if(!readingSymbol) {
          if(string[i] === '{') {
            readingSymbol = true;
            spacesCount = 0;
          }else if(string[i] === ' ') {
            spacesCount++;
          }else{
            readingGroup = false;
            composedString += this.parseSymbols(symbolBuffer);
            symbolBuffer = '';
            for(let j = 0; j < spacesCount; j++) composedString += ' ';
            spacesCount = 0;
            composedString += string[i];
          }
        }
        if(readingSymbol) {
          symbolBuffer += string[i];
          if(string[i] === '}') readingSymbol = false;
        }
      }
    }
    return composedString
  }
  adjustCardTitleSize() {
    const cardTitleElement = this.cardTitleRef.nativeElement || null;
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
    console.log(cardTypeElement)
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

      while (cardTextElement.scrollHeight > 280 && fontSize > 18) {
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
