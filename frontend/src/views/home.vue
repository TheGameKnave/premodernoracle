<template>
  <div>
    <form>
      <textarea
        v-model="cardNames"
        placeholder="Enter card names, one per line"
      />
      <button 
        type="button" 
        @click="fetchCards">Submit
      </button>
    </form>

    <template v-if="Object.keys(cardData).length">
      <h2>Cards</h2>
      <div 
        v-if="cardData.length === 0" 
        class="error">No cards found</div>
      <div 
        v-if="missingCards.length > 0" 
        class="error">
        Missing cards: {{ missingCards.join(', ') }}
      </div>
      <div class="cards">
        <template v-for="(card, key) in cardData">
          <template
            v-if="card.name && !['transform','modal_dfc'].includes(card.layout)" 
          >
            <card 
              :key="key" 
              :card="card"
            />
          </template>
          <template v-if="['transform','modal_dfc'].includes(card.layout)">
            <card 
              v-for="(face, index) in card.card_faces" 
              :key="index" 
              :card="card" 
              :face="index"/>
          </template>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import card from '@/components/card.vue'
export default {
  components: {
    card,
  },
  data() {
    return {
      cardNames: '', // Initialize the data property for the textarea value
      cardData: [],
      missingCards: [],
    }
  },
  computed: {},
  mounted() {
    // Access and adjust the size of the element after the component has been mounted
    this.adjustTextboxSize()
  },
  methods: {
    adjustTextboxSize() {
      let textarea = document.getElementsByTagName('textarea')[0]
      if (textarea) {
        textarea.addEventListener('input', () => {
          textarea.style.height = 'auto'
          textarea.style.height = textarea.scrollHeight + 'px'
        })

        // Initialize the textarea height
        textarea.style.height = textarea.scrollHeight + 'px'
      }
    },
    // method to fetch cards based on form contents
    async fetchCards() {
      let cardList = this.cardNames.split(/\r?\n/)
      // remove any leading numbers and spaces, and any trailing spaces
      cardList = cardList
        .map(card => card.replace(/^\d+|\s+$/g, '').trim())
        .filter(card => card)
      // dedup the list
      cardList = cardList.filter(
        (card, index) =>
          cardList.indexOf(card) === index &&
          !card.toLowerCase().includes('sideboard')
      )
      this.cardNames = cardList.join('\n')
      fetch('/api/cards', {
        method: 'POST', // Update the method to 'POST'
        headers: {
          'Content-Type': 'application/json', // Set the content type header if sending JSON payload
        },
        body: JSON.stringify({ cardList: cardList }), // Include your payload data here
      })
        .then(response => response.json())
        .then(cards => {
          this.cardData = cards
          this.missingCards = Object.entries(cards)
            .filter(([key, value]) => !Object.keys(value).length)
            .map(([key, value]) => key)
        })
        .catch(error => {
          console.error('Fetch error:', error)
        })
    },
  },
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
  src: url("~@/assets/fonts/PlantinMTProLight.ttf");
}
/* magic text italic */
@font-face {
  font-family: "Plantin";
  font-style: italic;
  font-weight: 100;
  src: url("~@/assets/fonts/PlantinMTProLightIt.ttf");
}
/* magic symbols */
@font-face {
  font-family: "Magic Symbols";
  font-style: normal;
  font-weight: 100;
  src: url("~@/assets/fonts/MagicSymbols2012 Z.ttf");
}
/* some updated symbols */
@font-face {
  font-family: "Mana";
  font-style: normal;
  font-weight: 100;
  src: url("~@/assets/fonts/mana.ttf");
}
/* magic symbols 04 */
@font-face {
  font-family: "Magic Symbols Old";
  font-style: normal;
  font-weight: 100;
  src: url("~@/assets/fonts/magis2004.ttf");
}
textarea,
h2 {
  font-family: 'Magic';
  letter-spacing: 0.05em;
}
form {
  display: flex;
}
textarea {
  flex-grow: 1;
  height: auto;
  max-height: 50vh;
  font-size: 18px;
}
button,
.error {
  font-family: 'Plantin';
}
.cards {
  display: flex;
  flex-wrap: wrap;
}
</style>
