<template>
  <div class="adventure">
    <img
      :src="require(`@/assets/images/card_templates/${cardTemplate()}.jpg`)"
      class="adventureTemplate"
      alt="Card Template"
    >
    <img
      v-if="colorID.length === 2 && !cardTemplate().includes('msplit')"
      :src="require(`@/assets/images/card_templates/${cardTemplate2()}.jpg`)"
      class="adventureTemplate2"
      alt="Card Template"
    >
    <div
      ref="adventureTitleElement"
      class="adventureTitle"
    >{{ face !== undefined ? card.card_faces[face].name : card.name }}</div>
    <div
      class="adventureManaCost"
      v-html="parseSymbols(face !== undefined ? card.card_faces[face].mana_cost : card.mana_cost)"
    />
    <div
      ref="adventureTypeElement"
      class="adventureType"
    >
      {{ face !== undefined ? card.card_faces[face].type_line : card.type_line }}
    </div>
    <div 
      ref="adventureTextElement"
      :class="'adventureText ' + (((face !== undefined && card.type_line.includes('Planeswalker')) || card.type_line.includes('Planeswalker')) ? 'planeswalkerText' : '')"
      v-html="findSymbols(formatText(face !== undefined ? card.card_faces[face].oracle_text : card.oracle_text, face !== undefined ? card.card_faces[face].flavor_text : card.flavor_text))"/>
  </div>
</template>

<script>
  export default {
    name: 'adventure',
    props: {
      card: {},
      face: null
    },
    data() {
      return {
        wubrg: ['W', 'U', 'B', 'R', 'G'],
        symbols: {
          'T': '<span class="manaGeneric">o</span>T',
          'Q': '<span class="manaGeneric">o</span>Q',
          'E': '<span class="manaEnergy"></span>',
          'S': '<span class="manaSnow">o</span>V',
          'C': '<span class="manaGeneric">o</span><span class="manaColorless"></span>',
          'W': '<span class="manaWhite">o</span>W',
          'U': '<span class="manaBlue">o</span>U',
          'B': '<span class="manaBlack">o</span>B',
          'R': '<span class="manaRed">o</span>R',
          'G': '<span class="manaGreen">o</span>G',
          'W/U': '<span class="manaWhite">O</span><span class="manaBlue">/</span>Pi',
          'U/W': '<span class="manaBlue">O</span><span class="manaWhite">/</span>Ip',
          'W/B': '<span class="manaWhite">O</span><span class="manaBlack">/</span>Ps',
          'B/W': '<span class="manaBlack">O</span><span class="manaWhite">/</span>Sp',
          'U/B': '<span class="manaBlue">O</span><span class="manaBlack">/</span>Is',
          'B/U': '<span class="manaBlack">O</span><span class="manaBlue">/</span>Si',
          'R/W': '<span class="manaRed">O</span><span class="manaWhite">/</span>Mp',
          'W/R': '<span class="manaWhite">O</span><span class="manaRed">/</span>Pm',
          'R/U': '<span class="manaRed">O</span><span class="manaBlue">/</span>Mi',
          'U/R': '<span class="manaBlue">O</span><span class="manaRed">/</span>Im',
          'R/B': '<span class="manaRed">O</span><span class="manaBlack">/</span>Ms',
          'B/R': '<span class="manaBlack">O</span><span class="manaRed">/</span>Sm',
          'U/G': '<span class="manaBlue">O</span><span class="manaGreen">/</span>If',
          'G/U': '<span class="manaGreen">O</span><span class="manaBlue">/</span>Fi',
          'G/W': '<span class="manaGreen">O</span><span class="manaWhite">/</span>Fp',
          'W/G': '<span class="manaWhite">O</span><span class="manaGreen">/</span>Pf',
          'G/B': '<span class="manaGreen">O</span><span class="manaBlack">/</span>Fs',
          'B/G': '<span class="manaBlack">O</span><span class="manaGreen">/</span>Sf',
          'W/P': '<span class="manaWhitePhy">O</span>Z',
          'U/P': '<span class="manaBluePhy">O</span>Z',
          'B/P': '<span class="manaBlackPhy">O</span>Z',
          'R/P': '<span class="manaRedPhy">O</span>Z',
          'G/P': '<span class="manaGreenPhy">O</span>Z',
          '10': '<span class="manaGeneric">o</span>º',
          '11': '<span class="manaGeneric">o</span>»',
          '12': '<span class="manaGeneric">o</span>¼',
          '13': '<span class="manaGeneric">o</span>½',
          '14': '<span class="manaGeneric">o</span>¾',
          '15': '<span class="manaGeneric">o</span>¿',
          '16': '<span class="manaGeneric">o</span>À',
          '17': '<span class="manaGeneric">o</span>Á',
          '18': '<span class="manaGeneric">o</span>Â',
          '19': '<span class="manaGeneric">o</span>Ã',
          '20': '<span class="manaGeneric">o</span>Ä',
          'X': '<span class="manaGeneric">o</span>X',
        }
      }
    },
    computed: {
      cardType(){
        let cardType = 'nonland';
        if(this.face !== undefined ? this.card.card_faces[this.face].type_line.includes('Land') : this.card.type_line.includes('Land')) cardType = 'Land';
        if(this.face !== undefined ? this.card.card_faces[this.face].type_line.includes('Artifact') : this.card.type_line.includes('Artifact')) cardType = 'Artifact';
        return cardType
      },
      colorID() {
        let colorID = [];
        switch (this.cardType) {
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
    },
    mounted() {
      this.adjustCardTitleSize();
      this.adjustCardTypeSize();
      this.adjustCardTextSize();
    },
    methods: {
      getColorsFromCost(cost){
        let costArr = cost.split(/[{}]+/);
        costArr = costArr.filter(x => x);
        costArr = costArr.filter(x => this.wubrg.includes(x));
        // dedup costArr
        costArr = [...new Set(costArr)];
        return costArr;
      },
      cardTemplate() {
        let colors = this.face !== undefined ? this.getColorsFromCost(this.card.card_faces[this.face].mana_cost) : this.card.colors;
        let typeLine = this.face !== undefined ? this.card.card_faces[this.face].type_line : this.card.type_line;
        let manaCost = this.face !== undefined ? this.card.card_faces[this.face].mana_cost : this.card.mana_cost;
        let returnString = '';
        if(colors.length > 1) {
          let costArr = manaCost.split(/[{}]+/);
          costArr = costArr.filter(x => x);
          let hybridArr = [];
          costArr.forEach((cost,i) => {
            if(costArr[i].includes('/')) {
              hybridArr.push(costArr.splice(i, 1)[0]);
            }
          });
          // if hybridArr is not empty and all of its elemets are identical
          // AND if W, U, B, R, G are not in the costArr
          if(hybridArr.length > 0 && hybridArr.every(x => x === hybridArr[0]) && !this.wubrg.some(x => costArr.includes(x))) {
            returnString += hybridArr[0][0].toLowerCase();
          }else{
            returnString += 'm';
          }
        } else if(colors.length === 1) {
          returnString += colors[0].toLowerCase();
        } else if(colors.length === 0) {
          if(typeLine.includes('Land')){
            if(this.colorID.length > 2) {
              returnString += 'ml';
            }else if(this.colorID.length === 0) {
              returnString += 'cl';
            }else{
              returnString += this.colorID[0].toLowerCase() + 'l';
            }
          }else if(typeLine.includes('Artifact')) { 
            returnString += 'a';
          }else{
            returnString += 'c';
          }
        }
        return returnString + 'adventure'
      },
      cardTemplate2() {
        let typeLine = this.face !== undefined ? this.card.card_faces[this.face].type_line : this.card.type_line;
        let manaCost = this.face !== undefined ? this.card.card_faces[this.face].mana_cost : this.card.mana_cost;
        let costArr = manaCost.split(/[{}]+/);
        costArr = costArr.filter(x => x);
        let hybridArr = [];
        costArr.forEach((cost,i) => {
          if(costArr[i].includes('/')) {
            hybridArr.push(costArr.splice(i, 1)[0]);
          }
        });
        let returnString = '';
        if(this.colorID[1]) returnString = (hybridArr[0] ? hybridArr[0][2] : this.colorID[1]).toLowerCase();
        if(typeLine.includes('Land')){
          returnString += 'l';
        }
        return returnString + 'adventure'
      },
      formatText(text, flavorText) {
        let textBox = text;
        textBox = '<p>' + textBox
          .replace(/\n/g, '</p><p>')
          .replace(/\(/g,'<i>(')
          .replace(/\)/g,')</i>') + '</p>';
        let ftxt = flavorText || '';
        if(ftxt) {
          ftxt = (this.card.oracle_text ? '<hr>' : '') + ftxt.replace(/\n/g, '<br>');
        }
        textBox = (textBox + '<p><i>' + ftxt + '</i></p>')
          .replace(/\b\*/g, "<i>")       // Closing asterisk
          .replace(/\*\b/g, "</i>")      // Opening asterisk
          .replace(/\b'/g, "\u2019")     // Closing singles
          .replace(/'\b/g, "\u2018")     // Opening singles
          .replace(/\b"/g, "\u201d")     // Closing doubles
          .replace(/\."/g, ".\u201d")     // Closing doubles
          .replace(/"$/g, "\u201d")      // Closing doubles
          .replace(/"\b/g, "\u201c")     // Opening doubles
          .replace(/"{/g, "\u201c{")     // Opening doubles
          .replace(/^"/g, "\u201c")      // Opening doubles
          .replace(/--/g,  "\u2014")     // em-dashes;

        return textBox
      },
      formatPT(string){
        return string.replace(/\*/g,'<span class="smol">★</span>')
      },
      parseSymbols(costGroup) {
        let costString = '<span class="symbolGroup">';
        let costArr = costGroup.split(/[{}]+/);
        costArr = costArr.filter(x => x);
        costArr.forEach(cost => {
          costString += '<span class="symbol">';
          if(!isNaN(cost) && Number(cost) < 10) costString += '<span class="manaGeneric">o</span>' + cost;
          else costString += this.symbols[cost] || cost;
          costString += '</span>';
        });
        return costString + '</span>';
      },
      findSymbols(string) {
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
      },
      adjustCardTitleSize() {
        const adventureTitleElement = this.$refs.adventureTitleElement || null;
        if(adventureTitleElement){
          let fontSize = parseInt(window.getComputedStyle(adventureTitleElement).fontSize);
  
          //count the number of mana symbols in mana_cost
          const countInstancesOfCharacter = (inputString, character) => inputString.split(character).length - 1;
          let manaCount = countInstancesOfCharacter(this.card.card_faces[this.face].mana_cost || '', '{');
          while (adventureTitleElement.clientWidth + (manaCount * 33) >  245) {
            fontSize -= 0.25;
            adventureTitleElement.style.fontSize = `${fontSize}px`;
          }
        }
      },
      adjustCardTypeSize() {
        const adventureTypeElement = this.$refs.adventureTypeElement || null;
        if(adventureTypeElement){
          let fontSize = parseInt(window.getComputedStyle(adventureTypeElement).fontSize);
  
          while (adventureTypeElement.clientWidth > 245) {
            fontSize -= 0.25;
            adventureTypeElement.style.fontSize = `${fontSize}px`;
          }
        }
      },
      adjustCardTextSize() {
        const adventureTextElement = this.$refs.adventureTextElement || null;
        if(adventureTextElement){
          let fontSize = parseInt(window.getComputedStyle(adventureTextElement).fontSize);
          let letterSpacing = 0;

          while (adventureTextElement.scrollHeight > 185 && fontSize > 14) {
            if(fontSize > 14) fontSize -= 0.25;
            else letterSpacing -= 0.25;
            adventureTextElement.style.fontSize = `${fontSize}px`;
            adventureTextElement.style.letterSpacing = `${letterSpacing}px`;
          }
          if(adventureTextElement.clientHeight < 60) {
            adventureTextElement.style.textAlign = 'center';
          }
          let leftoverSpace = 95 - adventureTextElement.clientHeight;
          adventureTextElement.style.paddingTop = `${leftoverSpace/3}px`;
        }
      },
    }
  }
</script>

<style>
  .magicSymbol {
    font-family: "Magic Symbols";
  }
  .manaWhite { color: #FAF6D8; }
  .manaWhitePhy { color: #E9E3B1; }
  .manaBlue { color: #C1D7E9; }
  .manaBluePhy { color: #8EBBD1; }
  .manaBlack { color: #BAB1AB; }
  .manaBlackPhy { color: #9B8E8A; }
  .manaRed { color: #E49977; }
  .manaRedPhy { color: #DE8166; }
  .manaGreen { color: #A3C095; }
  .manaGreenPhy { color: #80B092; }
  .manaGeneric { color: #CAC5C0; }
  .manaSnow { color: #fff; }
  .manaEnergy { font-family: 'Mana';}
  .manaColorless { font-family: 'Mana'; font-size: .78em; padding-left: .05em; }

  .adventure {
    position: absolute;
    display: inline-block;
    left: 35px;
    top: 580px;
    width: 280px;
    height: 305px;
  }
  .adventureTemplate {
    box-shadow:
     2px 2px 0 #222,
     -2px -2px 0 #222,
     2px -2px 0 #222,
     -2px 2px 0 #222,
     8px 8px 5px #0006;
  }
  .adventureTemplate, .adventureTemplate2 {
    width: 100%;
    height: 100%;
  }
  .adventureTemplate2 {
    position: absolute;
    left: 0;
    top: 0;
    -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0) 60%);
    mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0) 60%);
  }
  .adventureTitle, .adventureType, .adventureCopyright, .adventureArtist, .adventureDisclaimer, .adventurePowerToughness {
    text-shadow: 2px 2px 2px #000;
  }
  .adventureManaCost, .symbolGroup {
    text-shadow: none;
    font-family: "Magic Symbols";
    font-style: normal;
  }
  .adventureText, .adventureManaCost, .adventureType {
    font-family: "Plantin";
  }
  .adventureTitle, .adventureType {
    white-space: nowrap;
  }
  .adventureTitle {
    position: absolute;
    top:7px;
    left: 10px;
    font-size: 30px;
    line-height: 40px;
    color: #eee;
    font-family: "Magic";
    letter-spacing: 0.07em;
  }
  .adventureManaCost {
    position: absolute;
    top: 4px;
    right: 14px;
    font-size: 33px;
  }
  .adventureType {
    position: absolute;
    top: 57px;
    left: 10px;
    font-size: 26px;
    color: #eee;
  }
  .adventureText {
    position: absolute;
    top: 100px;
    left: 15px;
    font-size: 38px;
    line-height: 1.075em;
    color: #222;
    width: 245px;
    max-height: 185px;
  }
  .adventureText i {
    display: none;
  }
  .smol {
    font-size: .7em;
    position: relative;
    top: -8px;
  }
  .adventureText p {
    margin: 0.25em 0;
  }
  hr {
    border: 0;
    margin-block-end: 0;
    margin-block-start: 0;
    padding: .3em 0;
    position: relative;
    overflow: hidden;
    min-height: .3rem;
  }
  hr:before {
    content: "";
    width: 100%;
    position: absolute;
    border: 0;
    height: 2px;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
  }
</style>