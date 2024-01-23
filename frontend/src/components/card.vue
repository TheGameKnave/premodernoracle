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
        <div class="cardTitle">{{ card.name }}</div>
        <div class="cardManaCost">{{ card.mana_cost }}</div>
        <div 
          :style="{ backgroundImage: 'url(' + card.image_uris.art_crop + ')' }" 
          class="cardImage"/>
        <div class="cardType">{{ card.type_line }}</div>
        <div class="cardExpansion">{{ card.set }}</div>
        <div 
          class="cardText" 
          v-html="formatText(card.oracle_text, card.flavor_text)"/>
        <div class="cardArtist">{{ card.artist }}</div>
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
        if(this.card.color_identity.length > 1) {
          returnString += 'm';
        } else if(this.card.color_identity.length === 1) {
          returnString += this.card.color_identity[0].toLowerCase();
        } else if(this.card.color_identity.length === 0) {
          returnString += 'a';
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
    margin: 38px 36px
  }
  .cardTitle, .cardManaCost, .cardType, .cardArtist, .cardDisclaimer, .cardPowerToughness {
    text-shadow: 2px 2px 2px #000;
  }
  .cardTitle {
    position: absolute;
    top: 8px;
    left: 40px;
    font-size: 35px;
    color: white;
  }
  .cardManaCost {
    position: absolute;
    top: 8px;
    right: 40px;
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
    left: 40px;
    font-size: 34px;
    color: white;
  }
  .cardExpansion {
    position: absolute;
    top: 535px;
    right: 40px;
    font-size: 34px;
    color: white;
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
    height: 3px;
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
    left: 40px;
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