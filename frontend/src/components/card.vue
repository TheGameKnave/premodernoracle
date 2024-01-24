<template>
  <div class="cardBorder">
    <div class="card">
      <template
        v-if="!card.layout !== 'split'"
      >
        <img
          :src="require(`@/assets/images/card_templates/${cardTemplate()}.jpg`)"
          class="cardTemplate"
          alt="Card Template"
        >
        <img
          v-if="card.color_identity.length === 2 && !cardTemplate().includes('mcard')"
          :src="require(`@/assets/images/card_templates/${cardTemplate2()}.jpg`)"
          class="cardTemplate2"
          alt="Card Template"
        >
        <div class="cardTitle">{{ card.name }}</div>
        <div class="cardManaCost">{{ card.mana_cost }}</div>
        <div 
          :style="{ backgroundImage: 'url(' + card.image_uris.art_crop + ')' }" 
          class="cardImage"/>
        <div class="cardType">{{ card.type_line }}</div>
        <i :class="'cardExpansion stroke ss ss-' + card.set"/>
        <i v-if="card.rarity !== 'common'" :class="'cardExpansion fill ss ss-' + card.set"/>
        <i :class="'cardExpansion ' + card.rarity + ' ss ss-' + card.set"/>
        <div 
          class="cardText" 
          v-html="formatText(card.oracle_text, card.flavor_text)"/>
        <div class="cardArtist"><span class="magicSymbol">L</span>{{ card.artist }}</div>
        <div class="cardDisclaimer">Playtest card—NOT FOR SALE!</div>
        <template v-if="card.power || card.toughness">
          <div 
            class="cardPowerToughness" 
            v-html="formatPT(card.power + '/' + card.toughness)"/>
        </template>
      </template>
      <template v-else>
        <img
          :src="card.card_faces[0].image_uris.art_crop"
          alt="Card image"
        >
        <img
          :src="card.card_faces[1].image_uris.art_crop"
          alt="Card image"
        >
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Card',
    props: {
      card: {},
    },
    methods: {
      cardTemplate() {
        let returnString = '';
        if(this.card.colors.length > 1) {
          let costArr = this.card.mana_cost.split(/[{}]+/);
          costArr = costArr.filter(x => x);
          let hybridArr = [];
          for(let i = 0; i < costArr.length; i++) {
            if(costArr[i].includes('/')) {
              hybridArr.push(costArr.splice(i, 1)[0]);
            }
            i++;
          }
          let wubrg = ['W', 'U', 'B', 'R', 'G'];
          // if hybridArr is not empty and all of its elemets are identical
          // AND if W, U, B, R, G are not in the costArr
          if(hybridArr.length > 0 && hybridArr.every(x => x === hybridArr[0]) && !wubrg.some(x => costArr.includes(x))) {
            returnString += hybridArr[0][0].toLowerCase();
          }else{
            returnString += 'm';
          }
        } else if(this.card.colors.length === 1) {
          returnString += this.card.colors[0].toLowerCase();
        } else if(this.card.colors.length === 0) {
          if(this.card.type_line.includes('Land')){
            if(this.card.color_identity.length > 2) {
              returnString += 'ml';
            }else if(this.card.color_identity.length === 0) {
              returnString += 'cl';
            }else{
              returnString += this.card.color_identity[0].toLowerCase() + 'l';
            }
          }else {
            returnString += 'a';
          }
        }
        return returnString + 'card'
      },
      cardTemplate2() {
        let costArr = this.card.mana_cost.split(/[{}]+/);
        costArr = costArr.filter(x => x);
        let hybridArr = [];
        for(let i = 0; i < costArr.length; i++) {
          if(costArr[i].includes('/')) {
            hybridArr.push(costArr.splice(i, 1)[0]);
          }
          i++;
        }
        let returnString = (hybridArr[0] ? hybridArr[0][2] : this.card.color_identity[1]).toLowerCase();
        if(this.card.type_line.includes('Land')){
          returnString += 'l';
        }
        return returnString + 'card'
      },
      formatText(text, flavorText) {
        let textBox = '<p>' + text.replace(/\n/g, '</p><p>').replace(/\(/g,'<i>(').replace(/\)/g,'<i>)') + '</p>';
        if (flavorText) {
          textBox = textBox + '<hr><p><i>' + flavorText.replace(/\n/g, '<br>') + '</i></p>';
        }
        return textBox
      },
      formatPT(string){
        return string.replace(/\*/g,'<span class="smol">★</span>')
      },
    }
  }
</script>

<style>
  @import "https://cdn.jsdelivr.net/npm/keyrune@latest/css/keyrune.css";
  /* Magic Title */
  @font-face {
    font-family: "Magic";
    font-style: normal;
    font-weight: 100;
    src: url("~@/assets/fonts/Goudy Medieval Alternate.ttf");
  }
  /* magic text */
  @font-face {
    font-family: "Plantin";
    font-style: normal;
    font-weight: 100;
    src: url("~@/assets/fonts/Plantin.otf");
  }
  /* magic text italic */
  @font-face {
    font-family: "Plantin";
    font-style: italic;
    font-weight: 100;
    src: url("~@/assets/fonts/Plantin-Italic.otf");
  }
  /* magic symbols */
  @font-face {
    font-family: "Magic Symbols";
    font-style: normal;
    font-weight: 100;
    src: url("~@/assets/fonts/MagicSymbols2008.ttf");
  }
  .magicSymbol {
    font-family: "Magic Symbols";
  }
    
  .cardBorder {
    display: inline-block;
    width: 744px;
    height: 1038px;
    margin: 10px;
    border-radius: 20px;
    background-color: black;
    zoom: 0.5;
  }
  .card {
    position: relative;
    display: inline-block;
    background-color: black;
    margin: 38px 36px;
    overflow: hidden;
  }
  .cardTemplate2 {
    position: absolute;
    left: 0;
    top: 0;
    -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0) 60%);
  }
  .cardTitle, .cardType, .cardArtist, .cardDisclaimer, .cardPowerToughness {
    text-shadow: 2px 2px 2px #000;
  }
  .cardManaCost, .symbolGroup {
    text-shadow: none;
  }
  .cardText, .cardManaCost, .cardType, .cardArtist, .cardDisclaimer, .cardPowerToughness {
    font-family: "Plantin";
  }
  .cardTitle {
    position: absolute;
    top: 8px;
    left: 45px;
    font-size: 42px;
    color: white;
    font-family: "Magic";
    letter-spacing: 2.4px;
  }
  .cardManaCost {
    position: absolute;
    top: 8px;
    right: 45px;
    font-size: 35px;
    color: white;
  }
  .cardImage {
    top: 61px;
    left: 48px;
    position: absolute;
    width: 575px;
    height: 465px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .cardType {
    position: absolute;
    top: 535px;
    left: 45px;
    font-size: 34px;
    color: white;
  }
  .cardExpansion {
    position: absolute;
    top: 538px;
    right: 45px;
    font-size: 40px;
  }
  .cardExpansion:before{
    background-size: cover;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    paint-order: stroke fill;
  }
  .cardExpansion.fill {
    text-shadow: 
    2px 2px 0 black, 
    -2px -2px 0 black, 
    -2px 2px 0 black, 
    2px -2px 0 black,
    2px 1px 0 black, 
    -2px -1px 0 black, 
    -2px 1px 0 black, 
    2px -1px 0 black,
    1px 2px 0 black, 
    -1px -2px 0 black, 
    -1px 2px 0 black, 
    1px -2px 0 black,
    0 2px 0 black,
    0 -2px 0 black,
    2px 0 0 black,
    -2px 0 0 black;
  }
  .cardExpansion.stroke {
    text-shadow: 
      4px 4px 1px white, 
      -4px -4px 1px white, 
      -4px 4px 1px white, 
      4px -4px 1px white,
      0 4px 1px white,
      0 -4px 1px white,
      4px 0 1px white,
      -4px 0 1px white,
      2px 2px 1px white, 
      -2px -4px 1px white, 
      -2px 4px 1px white, 
      2px -4px 1px white,
      4px 2px 1px white, 
      -4px -2px 1px white, 
      -4px 2px 1px white, 
      4px -2px 1px white;
  }
  .cardExpansion.common:before {
    background-color: black;
  }
  .cardExpansion.uncommon:before {
    background-image: radial-gradient(#ccc 0%, #333 100%);
  }
  .cardExpansion.rare:before {
    background-image: radial-gradient(#dc8 0%, #984 100%);
  }
  .cardExpansion.mythic:before {
    background-image: radial-gradient(#e90 0%, #b32 100%);
  }
  .cardText {
    position: absolute;
    top: 585px;
    left: 60px;
    font-size: 32px;
    color: black;
    width: 555px;
    max-height: 285px;
    overflow-x: scroll;
    line-height: 32px;
  }
  .smol {
    font-size: .7em;
    position: relative;
    top: -8px;
  }
  .cardText p {
    margin: 10px 0;
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
  .cardPowerToughness{
    position: absolute;
    bottom: 15px;
    right: 27px;
    font-size: 48px;
    color: white;
  }
  .cardArtist{
    position: absolute;
    bottom: 35px;
    left: 45px;
    font-size: 30px;
    color: white;
  }
  .cardDisclaimer{
    position: absolute;
    bottom: 15px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 20px;
    color: white;
  }
</style>