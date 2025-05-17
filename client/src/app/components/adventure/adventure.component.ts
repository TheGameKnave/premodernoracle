import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { wubrg } from 'src/app/constants';
import { HelpersService } from 'src/app/services/helpers.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-adventure',
  templateUrl: './adventure.component.html',
})
export class AdventureComponent implements OnInit, AfterViewInit {
  @Input() card: any = {};
  face: number = 1;
  private adventureTitleRef!: ElementRef;
  @ViewChild('adventureTitleElement') set adventureTitleElement (content: ElementRef) {
    if(content) this.adventureTitleRef = content;
  }
  private adventureTypeRef!: ElementRef;
  @ViewChild('adventureTypeElement') set adventureTypeElement (content: ElementRef) {
    if(content) this.adventureTypeRef = content;
  }
  private adventureTextRef!: ElementRef;
  @ViewChild('adventureTextElement') set adventureTextElement (content: ElementRef) {
    if(content) this.adventureTextRef = content;
  }

  colorID = this.helpers.colorID.bind(this.helpers);
  parseSymbols = this.helpers.parseSymbols.bind(this.helpers);
  findSymbols = this.helpers.findSymbols.bind(this.helpers);
  formatText = this.helpers.formatText.bind(this.helpers);

  constructor(
    private helpers: HelpersService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.adjustCardTitleSize();
    this.adjustCardTypeSize();
    this.adjustCardTextSize();
  }

  cardTemplate(card: any, face: number | undefined) {
    let colors: string = this.helpers.getColorsFromCost(card.card_faces[face || 1].mana_cost).join('');
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
        if(this.helpers.colorID(card,face).length > 2) {
          returnString += 'ml';
        }else if(this.helpers.colorID(card,face).length === 0) {
          returnString += 'cl';
        }else{
          returnString += this.helpers.colorID(card,face)[0].toLowerCase() + 'l';
        }
      }else if(typeLine.includes('Artifact')) { 
        returnString += 'a';
      }else{
        returnString += 'c';
      }
    }
    return returnString + 'adventure'
  }

  cardTemplate2(card: any, face: number | undefined) {
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
    if(this.helpers.colorID(card,face)[1]) returnString = (hybridArr[0] ? hybridArr[0][2] : this.helpers.colorID(card,face)[1]).toLowerCase();
    if(typeLine.includes('Land')){
      returnString += 'l';
    }
    return returnString + 'adventure'
  }


  adjustCardTitleSize() {
    const adventureTitleElement = this.adventureTitleRef.nativeElement || null;
    if(adventureTitleElement){
      let fontSize = parseInt(window.getComputedStyle(adventureTitleElement).fontSize);

      //count the number of mana symbols in mana_cost
      const countInstancesOfCharacter = (inputString: string, character: string) => inputString.split(character).length - 1;
      let manaCount = countInstancesOfCharacter(this.card.card_faces[this.face].mana_cost || '', '{');
      while (adventureTitleElement.clientWidth + (manaCount * 33) >  245) {
        fontSize -= 0.25;
        adventureTitleElement.style.fontSize = `${fontSize}px`;
      }
    }
  }

  adjustCardTypeSize() {
    const adventureTypeElement = this.adventureTypeRef.nativeElement || null;
    if(adventureTypeElement){
      let fontSize = parseInt(window.getComputedStyle(adventureTypeElement).fontSize);

      while (adventureTypeElement.clientWidth > 245) {
        fontSize -= 0.25;
        adventureTypeElement.style.fontSize = `${fontSize}px`;
      }
    }
  }

  adjustCardTextSize() {
    const adventureTextElement = this.adventureTextRef.nativeElement || null;
    if(adventureTextElement){
      let fontSize = parseInt(window.getComputedStyle(adventureTextElement).fontSize);
      let letterSpacing = 0;

      while (adventureTextElement.scrollHeight > 185 && fontSize > 14) {
        if(fontSize > 14) fontSize -= 0.25;
        else letterSpacing -= 0.25;
        adventureTextElement.style.fontSize = `${fontSize}px`;
        adventureTextElement.style.letterSpacing = `${letterSpacing}px`;
      }
      if(adventureTextElement.clientHeight < 80) {
        adventureTextElement.style.textAlign = 'center';
      }
      let leftoverSpace = 95 - adventureTextElement.clientHeight;
      adventureTextElement.style.paddingTop = `${leftoverSpace/3}px`;
    }
  }
}
