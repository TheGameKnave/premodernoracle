<template>
  <div class="cardBorder">
    <div class="card">
      <template
        v-if="
          [
            'normal',
            'mutate',
            'prototype',
            'meld',
            'class',
            'case',
            'saga',
          ].includes(card.layout) ||
          (['transform', 'modal_dfc'].includes(card.layout) &&
            face !== undefined)
        "
      >
        <img
          :src="require(`@/assets/images/card_templates/${cardTemplate()}.jpg`)"
          class="cardTemplate"
          alt="Card Template"
        />
        <img
          v-if="colorID.length === 2 && !cardTemplate().includes('mcard')"
          :src="
            require(`@/assets/images/card_templates/${cardTemplate2()}.jpg`)
          "
          class="cardTemplate2"
          alt="Card Template"
        />
        <span v-if="tombstoneFrame()" class="cardTombstone">Q</span>
        <span v-if="face === 0" class="dfc dfcFront">▲</span>
        <span v-if="face === 1" class="dfc dfcBack">▼</span>
        <div ref="cardTitleElement" class="cardTitle">
          {{ face !== undefined ? card.card_faces[face].name : card.name }}
        </div>
        <div
          ref="cardManaCostElement"
          class="cardManaCost"
          v-html="
            parseSymbols(
              face !== undefined
                ? card.card_faces[face].mana_cost
                : card.mana_cost
            )
          "
        />
        <div
          :style="{
            backgroundImage:
              'url(' +
              (face !== undefined
                ? card.card_faces[face].image_uris.art_crop
                : card.image_uris.art_crop) +
              ')',
          }"
          class="cardImage"
        />
        <div ref="cardTypeElement" class="cardType">
          {{
            face !== undefined
              ? card.card_faces[face].type_line
              : card.type_line
          }}
        </div>
        <div class="cardExpansionWrapper">
          <i
            v-if="card.rarity === 'common'"
            :class="
              'cardExpansion ' + card.rarity + ' stroke ss ss-' + card.set
            "
          />
          <i
            v-if="card.rarity !== 'common'"
            :class="'cardExpansion fill ss ss-' + card.set"
          />
          <i
            ref="cardExpansionElement"
            :class="'cardExpansion ' + card.rarity + ' ss ss-' + card.set"
          />
        </div>
        <div
          ref="cardTextElement"
          :class="
            'cardText ' +
            ((face !== undefined && card.type_line.includes('Planeswalker')) ||
            card.type_line.includes('Planeswalker')
              ? 'planeswalkerText'
              : '')
          "
          v-html="
            findSymbols(
              formatText(
                face !== undefined
                  ? card.card_faces[face].oracle_text
                  : card.oracle_text,
                face !== undefined
                  ? card.card_faces[face].flavor_text
                  : card.flavor_text
              )
            )
          "
        />
        <div class="cardCopyright">©&nbsp;<span>∑</span></div>
        <div ref="cardArtistElement" class="cardArtist">
          <span class="magicSymbol">L</span>&nbsp;{{
            face !== undefined ? card.card_faces[face].artist : card.artist
          }}
        </div>
        <div class="cardDisclaimer">Playtest card—NOT FOR SALE</div>
        <div
          v-if="
            face !== undefined
              ? card.card_faces[face].loyalty ||
                card.card_faces[face].power ||
                card.card_faces[face].toughness
              : card.loyalty || card.power || card.toughness
          "
          ref="cardPowerToughnessElement"
          :class="
            'cardPowerToughness ' +
            ((face !== undefined && card.card_faces[face].loyalty) ||
            card.loyalty
              ? 'cardLoyalty'
              : '')
          "
          v-html="
            (face !== undefined
              ? card.card_faces[face].loyalty
              : card.loyalty) ||
            formatPT(
              (face !== undefined ? card.card_faces[face].power : card.power) +
                '/' +
                (face !== undefined
                  ? card.card_faces[face].toughness
                  : card.toughness)
            )
          "
        />
        <div
          v-if="
            face !== undefined ? card.card_faces[face].defense : card.defense
          "
          ref="cardPowerToughnessElement"
          class="cardDefense"
        >
          {{
            face !== undefined ? card.card_faces[face].defense : card.defense
          }}
        </div>
      </template>
      <template v-if="card.layout === 'split'">
        <splitCard :card="card" :face="0" />
        <splitCard :card="card" :face="1" />
      </template>
    </div>
  </div>
</template>

<script>
import splitCard from '@/components/splitCard.vue'
export default {
  name: 'Card',
  components: {
    splitCard,
  },
  props: {
    card: {
      type: Object,
      default: () => ({}), // Set an empty object as the default value for the card prop
    },
    face: {
      type: String,
      default: null, // Set null as the default value for the face prop
    },
  },
  data() {
    return {
      wubrg: ['W', 'U', 'B', 'R', 'G'],
      symbols: {
        T: '<span class="manaGeneric">o</span>T',
        Q: '<span class="manaGeneric">o</span>Q',
        E: '<span class="manaEnergy"></span>',
        S: '<span class="manaSnow">o</span>V',
        C: '<span class="manaGeneric">o</span><span class="manaColorless"></span>',
        W: '<span class="manaWhite">o</span>W',
        U: '<span class="manaBlue">o</span>U',
        B: '<span class="manaBlack">o</span>B',
        R: '<span class="manaRed">o</span>R',
        G: '<span class="manaGreen">o</span>G',
        'W/U':
          '<span class="manaWhite">O</span><span class="manaBlue">/</span>Pi',
        'U/W':
          '<span class="manaBlue">O</span><span class="manaWhite">/</span>Ip',
        'W/B':
          '<span class="manaWhite">O</span><span class="manaBlack">/</span>Ps',
        'B/W':
          '<span class="manaBlack">O</span><span class="manaWhite">/</span>Sp',
        'U/B':
          '<span class="manaBlue">O</span><span class="manaBlack">/</span>Is',
        'B/U':
          '<span class="manaBlack">O</span><span class="manaBlue">/</span>Si',
        'R/W':
          '<span class="manaRed">O</span><span class="manaWhite">/</span>Mp',
        'W/R':
          '<span class="manaWhite">O</span><span class="manaRed">/</span>Pm',
        'R/U':
          '<span class="manaRed">O</span><span class="manaBlue">/</span>Mi',
        'U/R':
          '<span class="manaBlue">O</span><span class="manaRed">/</span>Im',
        'R/B':
          '<span class="manaRed">O</span><span class="manaBlack">/</span>Ms',
        'B/R':
          '<span class="manaBlack">O</span><span class="manaRed">/</span>Sm',
        'U/G':
          '<span class="manaBlue">O</span><span class="manaGreen">/</span>If',
        'G/U':
          '<span class="manaGreen">O</span><span class="manaBlue">/</span>Fi',
        'G/W':
          '<span class="manaGreen">O</span><span class="manaWhite">/</span>Fp',
        'W/G':
          '<span class="manaWhite">O</span><span class="manaGreen">/</span>Pf',
        'G/B':
          '<span class="manaGreen">O</span><span class="manaBlack">/</span>Fs',
        'B/G':
          '<span class="manaBlack">O</span><span class="manaGreen">/</span>Sf',
        'G/R':
          '<span class="manaGreen">O</span><span class="manaRed">/</span>Fm',
        'R/G':
          '<span class="manaRed">O</span><span class="manaGreen">/</span>Mf',
        'W/P': '<span class="manaWhitePhy">O</span>Z',
        'U/P': '<span class="manaBluePhy">O</span>Z',
        'B/P': '<span class="manaBlackPhy">O</span>Z',
        'R/P': '<span class="manaRedPhy">O</span>Z',
        'G/P': '<span class="manaGreenPhy">O</span>Z',
        10: '<span class="manaGeneric">o</span>º',
        11: '<span class="manaGeneric">o</span>»',
        12: '<span class="manaGeneric">o</span>¼',
        13: '<span class="manaGeneric">o</span>½',
        14: '<span class="manaGeneric">o</span>¾',
        15: '<span class="manaGeneric">o</span>¿',
        16: '<span class="manaGeneric">o</span>À',
        17: '<span class="manaGeneric">o</span>Á',
        18: '<span class="manaGeneric">o</span>Â',
        19: '<span class="manaGeneric">o</span>Ã',
        20: '<span class="manaGeneric">o</span>Ä',
        X: '<span class="manaGeneric">o</span>X',
      },
    }
  },
  computed: {
    colorID() {
      let colorID =
        this.face !== undefined
          ? this.card.card_faces[this.face].colors ||
            this.card.card_faces[this.face].color_indicator
          : this.card.color_identity
      if (
        (!colorID || colorID.length === 0) &&
        (this.face !== undefined
          ? this.card.card_faces[this.face].type_line.includes('Land')
          : this.card.type_line.includes('Land'))
      ) {
        colorID = []
        let text =
          this.face !== undefined
            ? this.card.card_faces[this.face].oracle_text
            : this.card.oracle_text
        if (text.toLowerCase().includes('add one mana of any color'))
          colorID = ['W', 'U', 'B', 'R', 'G']
        if (text.includes('{W}')) colorID.push('W')
        if (text.includes('{U}')) colorID.push('U')
        if (text.includes('{B}')) colorID.push('B')
        if (text.includes('{R}')) colorID.push('R')
        if (text.includes('{G}')) colorID.push('G')
      }
      return colorID
    },
  },
  mounted() {
    this.adjustCardTitleSize()
    this.adjustCardTypeSize()
    this.adjustCardTextSize()
  },
  methods: {
    tombstoneFrame() {
      let oracleText =
        this.face !== undefined
          ? this.card.card_faces[this.face].oracle_text
          : this.card.oracle_text
      return (
        (this.card.frame_effects &&
          this.card.frame_effects.includes('tombstone')) ||
        (oracleText.includes('this card') &&
          oracleText.includes('your graveyard')) ||
        (oracleText.includes(this.card.name) &&
          oracleText.includes('your graveyard')) ||
        (oracleText.includes('return ' + this.card.name) &&
          oracleText.includes('your graveyard'))
      )
    },
    cardTemplate() {
      let colors =
        this.face !== undefined
          ? this.card.card_faces[this.face].colors
          : this.card.colors
      let typeLine =
        this.face !== undefined
          ? this.card.card_faces[this.face].type_line
          : this.card.type_line
      let manaCost =
        this.face !== undefined
          ? this.card.card_faces[this.face].mana_cost
          : this.card.mana_cost
      let returnString = ''
      if (colors.length > 1) {
        let costArr = manaCost.split(/[{}]+/)
        costArr = costArr.filter(x => x)
        let hybridArr = []
        for (let i = 0; i < costArr.length; i++) {
          if (costArr[i].includes('/')) {
            hybridArr.push(costArr.splice(i, 1)[0])
          }
          i++
        }
        // if hybridArr is not empty and all of its elemets are identical
        // AND if W, U, B, R, G are not in the costArr
        if (
          hybridArr.length > 0 &&
          hybridArr.every(x => x === hybridArr[0]) &&
          !this.wubrg.some(x => costArr.includes(x))
        ) {
          returnString += hybridArr[0][0].toLowerCase()
        } else {
          returnString += 'm'
        }
      } else if (colors.length === 1) {
        returnString += colors[0].toLowerCase()
      } else if (colors.length === 0) {
        if (typeLine.includes('Land')) {
          if (this.colorID.length > 2) {
            returnString += 'ml'
          } else if (this.colorID.length === 0) {
            returnString += 'cl'
          } else {
            returnString += this.colorID[0].toLowerCase() + 'l'
          }
        } else if (typeLine.includes('Artifact')) {
          returnString += 'a'
        } else {
          returnString += 'c'
        }
      }
      return returnString + 'card'
    },
    cardTemplate2() {
      let typeLine =
        this.face !== undefined
          ? this.card.card_faces[this.face].type_line
          : this.card.type_line
      let manaCost =
        this.face !== undefined
          ? this.card.card_faces[this.face].mana_cost
          : this.card.mana_cost
      let costArr = manaCost.split(/[{}]+/)
      costArr = costArr.filter(x => x)
      let hybridArr = []
      for (let i = 0; i < costArr.length; i++) {
        if (costArr[i].includes('/')) {
          hybridArr.push(costArr.splice(i, 1)[0])
        }
        i++
      }
      let returnString = ''
      if (this.colorID[1])
        returnString = (
          hybridArr[0] ? hybridArr[0][2] : this.colorID[1]
        ).toLowerCase()
      if (typeLine.includes('Land')) {
        returnString += 'l'
      }
      return returnString + 'card'
    },
    formatText(text, flavorText) {
      let textBox = text
      textBox =
        '<p>' +
        textBox
          .replace(/\n/g, '</p><p>')
          .replace(/\(/g, '<i>(')
          .replace(/\)/g, ')</i>') +
        '</p>'
      let ftxt = flavorText || ''
      if (ftxt) {
        ftxt =
          (this.card.oracle_text ? '<hr>' : '') + ftxt.replace(/\n/g, '<br>')
      }
      textBox = (textBox + '<p><i>' + ftxt + '</i></p>')
        .replace(/\b\*/g, '<i>') // Closing asterisk
        .replace(/\*\b/g, '</i>') // Opening asterisk
        .replace(/\b'/g, '\u2019') // Closing singles
        .replace(/'\b/g, '\u2018') // Opening singles
        .replace(/\b"/g, '\u201d') // Closing doubles
        .replace(/\."/g, '.\u201d') // Closing doubles
        .replace(/"$/g, '\u201d') // Closing doubles
        .replace(/"\b/g, '\u201c') // Opening doubles
        .replace(/"{/g, '\u201c{') // Opening doubles
        .replace(/^"/g, '\u201c') // Opening doubles
        .replace(/--/g, '\u2014') // em-dashes;
      if (this.card.type_line.includes('Planeswalker')) {
        textBox = textBox
          .replace(
            /<p>0: /g,
            '<p class="loyaltyAbility"><span class="textLoyalty">0</span>'
          )
          .replace(
            /<p>\+([1-9X]): /g,
            '<p class="loyaltyAbility"><span class="textLoyaltyUp">+$1</span>'
          )
          .replace(
            /<p>−([1-9X]): /g,
            '<p class="loyaltyAbility"><span class="textLoyaltyDown">-$1</span>'
          )
          .replace(
            /<p>\+([0-9X]*): /g,
            '<p class="loyaltyAbility"><span class="textLoyaltyUp textLoyaltyBig">+$1</span>'
          )
          .replace(
            /<p>−([0-9X]*): /g,
            '<p class="loyaltyAbility"><span class="textLoyaltyDown textLoyaltyBig">-$1</span>'
          )
      }
      return textBox
    },
    formatPT(string) {
      return string.replace(/\*/g, '<span class="smol">★</span>')
    },
    parseSymbols(costGroup) {
      let costString = '<span class="symbolGroup">'
      let costArr = costGroup.split(/[{}]+/)
      costArr = costArr.filter(x => x)
      costArr.forEach(cost => {
        costString += '<span class="symbol">'
        if (!isNaN(cost) && Number(cost) < 10)
          costString += '<span class="manaGeneric">o</span>' + cost
        else costString += this.symbols[cost] || cost
        costString += '</span>'
      })
      return costString + '</span>'
    },
    findSymbols(string) {
      let symbolBuffer = ''
      let readingGroup = false
      let readingSymbol = false
      let spacesCount = 0
      let composedString = ''

      for (let i = 0; i < string.length; i++) {
        if (!readingGroup) {
          if (string[i] === '{') {
            readingGroup = true
            readingSymbol = true
          } else {
            composedString += string[i]
          }
        }
        if (readingGroup) {
          if (!readingSymbol) {
            if (string[i] === '{') {
              readingSymbol = true
              spacesCount = 0
            } else if (string[i] === ' ') {
              spacesCount++
            } else {
              readingGroup = false
              composedString += this.parseSymbols(symbolBuffer)
              symbolBuffer = ''
              for (let j = 0; j < spacesCount; j++) composedString += ' '
              spacesCount = 0
              composedString += string[i]
            }
          }
          if (readingSymbol) {
            symbolBuffer += string[i]
            if (string[i] === '}') readingSymbol = false
          }
        }
      }
      return composedString
    },
    adjustCardTitleSize() {
      const cardTitleElement = this.$refs.cardTitleElement || null
      if (cardTitleElement) {
        const cardManaCostElement = this.$refs.cardManaCostElement || null
        let fontSize = parseInt(
          window.getComputedStyle(cardTitleElement).fontSize
        )

        while (
          cardTitleElement.clientWidth +
            (cardManaCostElement ? cardManaCostElement.clientWidth : 0) >
          580
        ) {
          fontSize -= 0.25
          cardTitleElement.style.fontSize = `${fontSize}px`
        }
      }
    },
    adjustCardTypeSize() {
      const cardTypeElement = this.$refs.cardTypeElement || null
      if (cardTypeElement) {
        const cardExpansionElement = this.$refs.cardExpansionElement || null
        let fontSize = parseInt(
          window.getComputedStyle(cardTypeElement).fontSize
        )

        while (
          cardTypeElement.clientWidth +
            (cardExpansionElement ? cardExpansionElement.clientWidth : 0) >
          570
        ) {
          fontSize -= 0.25
          cardTypeElement.style.fontSize = `${fontSize}px`
        }
      }
    },
    adjustArtistSize() {
      const cardArtistElement = this.$refs.cardArtistElement || null
      if (cardArtistElement) {
        const cardPowerToughnessElement =
          this.$refs.cardPowerToughnessElement || null
        let fontSize = parseInt(
          window.getComputedStyle(cardArtistElement).fontSize
        )

        while (
          cardArtistElement.clientWidth +
            (cardPowerToughnessElement
              ? cardPowerToughnessElement.clientWidth
              : 0) *
              2 >
          580
        ) {
          fontSize -= 0.25
          cardArtistElement.style.fontSize = `${fontSize}px`
        }
      }
    },
    adjustCardTextSize() {
      const cardTextElement = this.$refs.cardTextElement || null
      if (cardTextElement) {
        let fontSize = parseInt(
          window.getComputedStyle(cardTextElement).fontSize
        )
        let letterSpacing = 0

        while (cardTextElement.scrollHeight > 295 && fontSize > 18) {
          if (fontSize > 18) fontSize -= 0.25
          else letterSpacing -= 0.25
          cardTextElement.style.fontSize = `${fontSize}px`
          cardTextElement.style.letterSpacing = `${letterSpacing}px`
        }
        if (cardTextElement.clientHeight < 60) {
          cardTextElement.style.textAlign = 'center'
        }
        let leftoverSpace = 285 - cardTextElement.clientHeight
        cardTextElement.style.paddingTop = `${leftoverSpace / 3}px`
      }
    },
  },
}
</script>

<style>
@import 'https://cdn.jsdelivr.net/npm/keyrune@latest/css/keyrune.css';
/* Magic Title */
@font-face {
  font-family: 'Magic';
  font-style: normal;
  font-weight: 100;
  src: url('~@/assets/fonts/Goudy Mediaeval Regular.ttf');
}
/* magic text */
@font-face {
  font-family: 'Plantin';
  font-style: normal;
  font-weight: 100;
  src: url('~@/assets/fonts/PlantinMTProLight.ttf');
}
/* magic text italic */
@font-face {
  font-family: 'Plantin';
  font-style: italic;
  font-weight: 100;
  src: url('~@/assets/fonts/PlantinMTProLightIt.ttf');
}
/* magic symbols */
@font-face {
  font-family: 'Magic Symbols';
  font-style: normal;
  font-weight: 100;
  src: url('~@/assets/fonts/MagicSymbols2012 Z.ttf');
}
/* some updated symbols */
@font-face {
  font-family: 'Mana';
  font-style: normal;
  font-weight: 100;
  src: url('~@/assets/fonts/mana.ttf');
}
/* magic symbols 04 */
@font-face {
  font-family: 'Magic Symbols Old';
  font-style: normal;
  font-weight: 100;
  src: url('~@/assets/fonts/magis2004.ttf');
}
.magicSymbol {
  font-family: 'Magic Symbols';
}
.manaWhite {
  color: #faf6d8;
}
.manaWhitePhy {
  color: #e9e3b1;
}
.manaBlue {
  color: #c1d7e9;
}
.manaBluePhy {
  color: #8ebbd1;
}
.manaBlack {
  color: #bab1ab;
}
.manaBlackPhy {
  color: #9b8e8a;
}
.manaRed {
  color: #e49977;
}
.manaRedPhy {
  color: #de8166;
}
.manaGreen {
  color: #a3c095;
}
.manaGreenPhy {
  color: #80b092;
}
.manaGeneric {
  color: #cac5c0;
}
.manaSnow {
  color: #fff;
}
.manaEnergy {
  font-family: 'Mana';
}
.manaColorless {
  font-family: 'Mana';
  font-size: 0.78em;
  padding-left: 0.05em;
}
.cardBorder {
  display: inline-block;
  width: 744px;
  height: 1038px;
  overflow: hidden;
  margin: 10px;
  border-radius: 20px;
  background-color: #222;
  zoom: 0.5;
}
.card {
  position: relative;
  display: inline-block;
  background-color: #222;
  margin: 38px 36px;
  overflow: hidden;
  width: 672px;
  height: 962px;
}
.cardTemplate2 {
  position: absolute;
  left: 0;
  top: 0;
  -webkit-mask-image: linear-gradient(
    to left,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 40%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0) 60%
  );
}
.cardTitle,
.cardType,
.cardCopyright,
.cardArtist,
.cardDisclaimer,
.cardPowerToughness {
  text-shadow: 2px 2px 2px #000;
}
.cardManaCost,
.symbolGroup {
  text-shadow: none;
  font-family: 'Magic Symbols';
  font-style: normal;
}
.cardText,
.cardManaCost,
.cardType,
.cardArtist,
.cardDisclaimer,
.cardPowerToughness {
  font-family: 'Plantin';
}
.cardTitle,
.cardType,
.cardArtist {
  white-space: nowrap;
}
.cardTombstone {
  position: absolute;
  top: 10px;
  left: 15px;
  font-size: 35px;
  color: #999;
  font-family: 'Magic Symbols Old';
}
.dfc {
  color: #222;
  position: absolute;
  font-size: 35px;
  left: 5px;
  top: 2px;
  text-shadow: 2px 2px 0 #eee, -2px -2px 0 #eee, -2px 2px 0 #eee,
    2px -2px 0 #eee, 2px 1px 0 #eee, -2px -1px 0 #eee, -2px 1px 0 #eee,
    2px -1px 0 #eee, 1px 2px 0 #eee, -1px -2px 0 #eee, -1px 2px 0 #eee,
    1px -2px 0 #eee, 0 2px 0 #eee, 0 -2px 0 #eee, 2px 0 0 #eee, -2px 0 0 #eee;
}
.dfcBack {
  top: 6px;
}
.cardTombstone:before,
.cardTombstone:after {
  content: 'Q';
  position: absolute;
  left: 0;
}
.cardTitle {
  position: absolute;
  top: 8px;
  left: 45px;
  font-size: 40px;
  color: #eee;
  font-family: 'Magic';
  letter-spacing: 1px;
}
.cardManaCost {
  position: absolute;
  top: 5px;
  right: 30px;
  font-size: 42px;
}
.cardImage {
  top: 61px;
  left: 48px;
  position: absolute;
  width: 575px;
  height: 465px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center top;
}
.cardType {
  position: absolute;
  top: 535px;
  left: 45px;
  font-size: 33px;
  line-height: 50px;
  color: #eee;
}
.cardExpansionWrapper {
  position: absolute;
  top: 558px;
  right: 58px;
  font-size: 40px;
}
.cardExpansion {
  position: absolute;
  right: 50%;
  top: 50%;
  transform: translate(50%, -50%);
}
.stroke.ss-wth:after,
.stroke.ss-m10:after,
.stroke.ss-m11:after,
.stroke.ss-m12:after,
.stroke.ss-m13:after,
.stroke.ss-m14:after,
.stroke.ss-m15:after,
.stroke.ss-m19:after,
.stroke.ss-m20:after,
.stroke.ss-m21:after {
  content: '';
  position: absolute;
  z-index: -1;
  width: 70%;
  height: 45%;
  background: #eee;
  top: 50%;
  right: 50%;
  border-radius: 0.2em;
  transform: translate(50%, -50%);
}
.fill.ss-som:after,
.fill.ss-afr:after,
.fill.ss-mid:after,
.stroke.ss-mid:after,
.fill.ss-m10:after,
.fill.ss-m11:after,
.fill.ss-m12:after,
.fill.ss-m13:after,
.fill.ss-m14:after,
.fill.ss-m15:after,
.fill.ss-m19:after,
.fill.ss-m20:after,
.fill.ss-m21:after {
  content: '';
  position: absolute;
  z-index: -1;
  width: 75%;
  height: 45%;
  background: #222;
  top: 50%;
  right: 50%;
  border-radius: 0.2em;
  transform: translate(50%, -50%);
}
.cardExpansion.ss-arn {
  font-size: 2em;
}
.cardExpansion.ss-atq {
  font-size: 1.2em;
}
.cardExpansion.ss-all {
  font-size: 1.75em;
}
.cardExpansion.ss-wth {
  font-size: 1.3em;
}
.cardExpansion.ss-exo {
  font-size: 1.625em;
}
.cardExpansion.ss-usg {
  font-size: 1.375em;
}
.cardExpansion.ss-vis {
  font-size: 0.9em;
}
.cardExpansion.ss-ulg {
  font-size: 1.5em;
}
.cardExpansion.ss-pls {
  font-size: 1.25em;
}
.cardExpansion.ss-pcy {
  font-size: 1.125em;
}
.cardExpansion.ss-plc {
  font-size: 1.16em;
}
.cardExpansion.ss-jud {
  font-size: 1.125em;
}
.cardExpansion.ss-lgn {
  font-size: 1.75em;
}
.cardExpansion.ss-mrd {
  font-size: 1.5em;
}
.cardExpansion.ss-gpt {
  font-size: 1.15em;
}
.cardExpansion.ss-som {
  font-size: 1.15em;
}
.cardExpansion.ss-fut {
  font-size: 1.3em;
}
.cardExpansion.ss-lrw {
  font-size: 1.1em;
}
.cardExpansion.ss-shm {
  font-size: 1.4em;
}
.cardExpansion.ss-nem {
  font-size: 1.75em;
}
.cardExpansion.ss-gtc {
  font-size: 1.25em;
}
.cardExpansion.ss-dgm {
  font-size: 1.175em;
}
.cardExpansion.ss-dka {
  font-size: 1.2em;
}
.cardExpansion.ss-emn {
  font-size: 1.3em;
}
.cardExpansion.ss-znr {
  font-size: 0.925em;
}
.cardExpansion.ss-vow {
  font-size: 1.175em;
}
.cardExpansion.ss-snc {
  font-size: 1.4em;
}
.cardExpansion.ss-grn {
  font-size: 1.2em;
}
.cardExpansion.ss-rna {
  font-size: 1.15em;
}
.cardExpansion.ss-bng {
  font-size: 1.25em;
}
.cardExpansion.ss-thb {
  font-size: 0.85em;
}
.cardExpansion.ss-kld {
  font-size: 1.15em;
}
.cardExpansion.ss-aer {
  font-size: 1.15em;
}
.cardExpansion.ss-soi {
  font-size: 1.15em;
}
.cardExpansion.ss-xln {
  font-size: 1.15em;
}
.cardExpansion.ss-rix {
  font-size: 1.15em;
}
.cardExpansion.ss-neo {
  font-size: 1.6em;
}
.cardExpansion.ss-j22 {
  font-size: 1.3em;
}
.cardExpansion.ss-stx {
  font-size: 1.15em;
}
.cardExpansion.ss-mh2 {
  font-size: 1.25em;
}
.cardExpansion.ss-mh1 {
  font-size: 1.25em;
}
.cardExpansion.ss-afr {
  font-size: 1.25em;
}
.cardExpansion.ss-mom {
  font-size: 1.2em;
}
.cardExpansion.ss-ltr {
  font-size: 1.2em;
}
.cardExpansion.ss-woe {
  font-size: 1.45em;
}
.cardExpansion.ss-lci {
  font-size: 1.25em;
}
.cardExpansion.ss-vow {
  font-size: 1.25em;
}
.cardExpansion.ss-mid {
  font-size: 1.2em;
}
.cardExpansion.ss-m10,
.cardExpansion.ss-m11,
.cardExpansion.ss-m12,
.cardExpansion.ss-m13,
.cardExpansion.ss-m14,
.cardExpansion.ss-m15 {
  font-size: 1.5em;
}
.cardExpansion.ss-m19,
.cardExpansion.ss-m20,
.cardExpansion.ss-m21 {
  font-size: 1.7em;
}
.cardExpansion:before {
  background-size: cover;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  paint-order: stroke fill;
}
.cardExpansion.fill,
.cardTombstone:after {
  text-shadow: 1.5px 1.5px 0 #222, -1.5px -1.5px 0 #222, -1.5px 1.5px 0 #222,
    1.5px -1.5px 0 #222, 1.5px 1px 0 #222, -1.5px -1px 0 #222, -1.5px 1px 0 #222,
    1.5px -1px 0 #222, 1px 1.5px 0 #222, -1px -1.5px 0 #222, -1px 1.5px 0 #222,
    1px -1.5px 0 #222, 0 1.5px 0 #222, 0 -1.5px 0 #222, 1.5px 0 0 #222,
    -1.5px 0 0 #222;
}
.cardExpansion.common.stroke {
  text-shadow: 2px 2px 0 #eee, -2px -2px 0 #eee, -2px 2px 0 #eee,
    2px -2px 0 #eee, 0 2px 0 #eee, 0 -2px 0 #eee, 2px 0 0 #eee, -2px 0 0 #eee,
    1px 2px 0 #eee, -1px -2px 0 #eee, -1px 2px 0 #eee, 1px -2px 0 #eee,
    2px 1px 0 #eee, -2px -1px 0 #eee, -2px 1px 0 #eee, 2px -1px 0 #eee;
}
.cardTombstone:before {
  text-shadow: 3px 3px 0 #eee, -3px -3px 0 #eee, -3px 3px 0 #eee,
    3px -3px 0 #eee, 0 3px 0 #eee, 0 -3px 0 #eee, 3px 0 0 #eee, -3px 0 0 #eee,
    2px 3px 0 #eee, -2px -3px 0 #eee, -2px 3px 0 #eee, 2px -3px 0 #eee,
    3px 2px 0 #eee, -3px -2px 0 #eee, -3px 2px 0 #eee, 3px -2px 0 #eee;
}
.cardExpansion.common:before {
  background-color: #222;
}
.cardExpansion.uncommon:before {
  background-image: radial-gradient(#ddd 0%, #666 100%);
}
.cardExpansion.rare:before {
  background-image: radial-gradient(#eda 0%, #984 100%);
}
.cardExpansion.mythic:before {
  background-image: radial-gradient(#e90 0%, #b32 100%);
}
.cardText {
  position: absolute;
  top: 585px;
  left: 60px;
  font-size: 33px;
  color: #000;
  width: 555px;
  max-height: 295px;
  /* overflow-x: scroll; */
}
.cardText.planeswalkerText p.loyaltyAbility {
  position: relative;
  padding-left: 25px;
}
.textLoyalty,
.textLoyaltyUp,
.textLoyaltyDown {
  position: absolute;
  right: calc(100% - 5px);
  z-index: 1;
  color: #eee;
  font-size: 28px;
  white-space: nowrap;
}
.textLoyalty:after,
.textLoyaltyUp:after,
.textLoyaltyDown:after {
  color: #000;
  content: ':';
  position: absolute;
  right: -12px;
  top: -3px;
}
.textLoyalty:before,
.textLoyaltyUp:before,
.textLoyaltyDown:before {
  content: '';
  position: absolute;
  z-index: -1;
  font-size: 1.8em;
  left: 0;
  color: #222;
  text-shadow: 2px 2px 0 #eee, -2px -2px 0 #eee, -2px 2px 0 #eee,
    2px -2px 0 #eee, 0 2px 0 #eee, 0 -2px 0 #eee, 2px 0 0 #eee, -2px 0 0 #eee;
  font-family: 'Mana';
}
.textLoyalty {
  right: calc(100% - 10px);
  padding: 0 0.7em;
}
.textLoyalty:before {
  content: '';
  top: -0.23em;
}
.textLoyalty:after {
  right: -0.25em;
}
.textLoyaltyUp {
  padding: 0 0.3em;
}
.textLoyaltyUp:before {
  content: '';
  top: -0.25em;
}
.textLoyaltyDown {
  padding: 0 0.45em;
}
.textLoyaltyDown:before {
  content: '';
  top: -0.2em;
}
.textLoyaltyBig:before {
  transform: scaleX(1.3);
  left: 0.18em;
}
.smol {
  font-size: 0.7em;
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
  padding: 0.3em 0;
  position: relative;
  overflow: hidden;
  min-height: 0.3rem;
}
hr:before {
  content: '';
  width: 100%;
  position: absolute;
  border: 0;
  height: 2px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.75),
    rgba(0, 0, 0, 0)
  );
}
.cardPowerToughness,
.cardDefense {
  position: absolute;
  bottom: 7px;
  right: 27px;
  font-size: 48px;
  letter-spacing: 1px;
  color: #eee;
}
.cardDefense {
  right: 40px;
  bottom: 30px;
  z-index: 2;
}
.cardDefense:after {
  content: '✦';
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%) rotate(-135deg);
  font-size: 125px;
  z-index: -1;
  color: #000;
  text-shadow: 2px 2px 0 #eee, -2px -2px 0 #eee, -2px 2px 0 #eee,
    2px -2px 0 #eee, 0 2px 0 #eee, 0 -2px 0 #eee, 2px 0 0 #eee, -2px 0 0 #eee;
}
.cardLoyalty {
  z-index: 1;
  right: 20px;
  bottom: 20px;
  width: 100px;
  text-align: center;
}
.cardLoyalty:after {
  content: '';
  font-family: 'Mana';
  position: absolute;
  bottom: -12px;
  right: 0;
  font-size: 100px;
  z-index: -1;
  color: #000;
  text-shadow: 2px 2px 0 #eee, -2px -2px 0 #eee, -2px 2px 0 #eee,
    2px -2px 0 #eee, 0 2px 0 #eee, 0 -2px 0 #eee, 2px 0 0 #eee, -2px 0 0 #eee;
}
.cardCopyright {
  position: absolute;
  bottom: 20px;
  left: 20px;
  font-size: 25px;
  color: #eee;
}
.cardCopyright span {
  font-size: 45px;
  font-family: 'Magic Symbols';
}
.cardArtist {
  position: absolute;
  bottom: 35px;
  left: 50%;
  transform: translate(-50%, 0);
  font-size: 30px;
  color: #eee;
}
.cardDisclaimer {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 18px;
  color: #eee;
}
</style>
