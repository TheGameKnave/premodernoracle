
<template>
  <div>
    <textarea
      v-model="cardNames"
      placeholder="Enter card names, one per line"
    />
    <button @click="fetchCards">Submit</button>

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
          <card 
            v-if="card.name" 
            :key="key" 
            :card="card"/>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
  import Card from '@/components/card.vue';
  export default {
    components: {
      Card
    },
    data() {
      return {
        cardNames: '', // Initialize the data property for the textarea value
        cardData: [],
        missingCards: [],
      }
    },
    computed: {},
    methods: {
      // method to fetch cards based on form contents
      async fetchCards() {
        let cardList = this.cardNames.split(/\r?\n/)
        // remove any leading numbers and spaces, and any trailing spaces
        cardList = cardList
          .map(card => card.replace(/^\d+|\s+$/g, '').trim())
          .filter(card => card)
        // dedup the list
        cardList = cardList.filter(
          (card, index) => cardList.indexOf(card) === index
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
          });
      },
    },
  }
</script>


<style scoped>
  .cards {
    display: flex;
    flex-wrap: wrap;
  }
</style>