import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { lands, symbols, tombstoneList, wubrg } from "../constants";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor(
    private cookieService: CookieService,
  ) {
    if(!environment.production){
      (window as any).helpersService = this;
    }
  }


  cardType(card: any, face: number | undefined) {
    let cardType = 'nonland';
    if(face !== undefined ? card.card_faces[face].type_line.includes('Land') : card.type_line.includes('Land')) cardType = 'Land';
    if(face !== undefined ? card.card_faces[face].type_line.includes('Artifact') : card.type_line.includes('Artifact')) cardType = 'Artifact';
    return cardType
  }

  colorID(card: any, face: number | undefined): string[] {
    let colorID: string[] = [];
    switch (this.cardType(card,face)) {
      case 'Land':
        colorID = [...(face !== undefined ? card.card_faces[face].color_identity : card.color_identity) || []];
        let text = (face !== undefined || !card.oracle_text) ? card.card_faces[face || 0].oracle_text : card.oracle_text;
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
        colorID = (face !== undefined ? card.card_faces[face].colors : card.colors) || card.colors || [];
        break;
    }
    // dedup colorID
    colorID = Array.from(new Set(colorID));
    return colorID || []
  }

  splitColorID(card: any, face: number | undefined) {
    let colorID = [];
    if(face !== undefined) {
      colorID = this.getColorsFromCost(card.card_faces[face].mana_cost);
    } else {
      colorID = this.getColorsFromCost(card.mana_cost);
    }

    // dedup colorID
    colorID = Array.from(new Set(colorID));
    return colorID || []
  }

  getColorsFromCost(cost: string){
    let costArr = cost.split(/[{}/]+/);
    costArr = costArr.filter(x => x);
    costArr = costArr.filter(x => wubrg.includes(x));
    // dedup costArr
    costArr = [...new Set(costArr)];
    return costArr;
  }

  tombstoneFrame(card: any, face: number | undefined) {
    // test for the presence of /Dredge [0-9]/
    let dredge = new RegExp(/Dredge [0-9]/);
    // test oracletext for dredge

    return (tombstoneList.includes(card.name) && (card.layout !== 'split' || (face === 1 && card.card_faces[1].oracle_text.includes('Aftermath')))) || dredge.test(face !== undefined ? card.card_faces[face].oracle_text : card.oracle_text)
  }

  determineCardImage(card: any, face: number | undefined, imageIndex: number | null, selection: boolean = false) {
    let cardImage = '';
    let savedImage = this.cookieService.get(card.card_faces?.[face || 0]?.name || card.name);
    if(!selection && savedImage && savedImage !== 'null') {
      cardImage = savedImage;
    }else{
      if(imageIndex === null) {
        cardImage = (face !== undefined && card.card_faces[face].image_uris ? card.card_faces[face].image_uris.art_crop : card.image_uris.art_crop)
      }else{
        cardImage = card.arts[face || 0][imageIndex]?.art_crop;
      }
    }
    return cardImage
  }

  determineImageArtist(card: any, face: number | undefined, imageIndex: number | null, cardImage: string) {
    let imageArtist = '';
    let savedImage = this.cookieService.get(card.card_faces?.[face || 0]?.name || card.name);
    let currentIndex = card.arts[face || 0].findIndex((x: any) => x.art_crop === cardImage);
    if(currentIndex !== -1 && savedImage && savedImage !== 'null') {
      imageArtist = card.arts[face || 0][currentIndex].artist;
    }else{
      if(imageIndex === null) {
        imageArtist = (face !== undefined && card.card_faces[face].image_uris ? card.card_faces[face].artist : card.artist)
      }else{
        imageArtist = card.arts[face || 0][imageIndex]?.artist;
      }
    }
    return imageArtist;
  }
  
  formatText(card: any, face: number | undefined, text: string, flavorText: string) {
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
    let typeLine = face !== undefined ? card.card_faces[face].type_line : card.type_line;
    // if typeline includes any basic lands from the `lands` variable...
    if(lands.some(land => typeLine.includes(land))) {
      textBox = textBox.replace(/reminderText/g, 'reminderText basicLands');
    }
    let ftxt = flavorText || '';
    if(ftxt) {
      let ftxtArr = ftxt.split('\n');
      ftxtArr = ftxtArr.map(ft => `<p ${ft.indexOf('—') === 0 ? 'class=flavorAttribution' : ''}><i>${ft}</i></p>`);
      textBox = (textBox + (((face !== undefined || card.layout === 'adventure') ? card.card_faces[0].oracle_text : card.oracle_text) ? '<hr>' : '') + '<div class="flavorText">' + ftxtArr.join('') + '</div>');
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
    if(face !== undefined ? card.card_faces[face].type_line.includes('Saga') : card.type_line.includes('Saga')){
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
    if(card.type_line.includes('Class')){
      textBox = textBox.replace(/(<p>({.*:) (Level 2)<\/p>)<p>(.*)<\/p>(<p>({.*:) (Level 3)<\/p>)<p>(.*)<\/p>/g,
        `<div class="levelAbility"><div class="levelCost level2">$2</div><div class="levelText">$4</div></div>
<div class="levelAbility"><div class="levelCost level3">$6</div><div class="levelText">$8</div></div>`);
    }
    if(card.type_line.includes('Planeswalker')){
      textBox = textBox.replace(/<p>0: /g, '<p class="loyaltyAbility"><span class="textLoyalty">0</span>')
        .replace(/<p>\+([1-9X]): /g, '<p class="loyaltyAbility"><span class="textLoyaltyUp">+$1</span>')
        .replace(/<p>−([1-9X]): /g, '<p class="loyaltyAbility"><span class="textLoyaltyDown">-$1</span>')
        .replace(/<p>\+([0-9X]*): /g, '<p class="loyaltyAbility"><span class="textLoyaltyUp textLoyaltyBig">+$1</span>')
        .replace(/<p>−([0-9X]*): /g, '<p class="loyaltyAbility"><span class="textLoyaltyDown textLoyaltyBig">-$1</span>');
    }
    textBox = textBox
      .replace(/<p>Level up (.*)<\/p><p>LEVEL ([0-9]*-[0-9]*)<\/p><p>([0-9]*\/[0-9]*)<\/p>(<p>(.*)<\/p>)?<p>LEVEL ([0-9]\+*)<\/p><p>([0-9]*\/[0-9]*)<\/p>(<p>(.*)<\/p>)?/g,
        `<div class="levelAbility"><div class="levelReminder">Level up $1</div><div class="levelPT">${this.formatPT((face !== undefined ? card.card_faces[face].power : card.power) + '/' + (face !== undefined ? card.card_faces[face].toughness : card.toughness))}</div></div>
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
      costString += `<span class="symbol${cost.includes('/') ? ' hybrid' : ''}">`;
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

}
