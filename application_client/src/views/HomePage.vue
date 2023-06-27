<template>
  <div class="home">
    <header class="hero">
      <h1 class="hero-title">Bienvenue sur CesiEats</h1>
      <p class="hero-subtitle">Profitez de la cuisine locale directement chez vous</p>
    </header>
    <section class="restaurants">
      <div v-for="restaurant in restaurants" :key="restaurant.restaurant" @click="exploreRestaurant(restaurant)">
        <div class="restaurant-card">
          <div class="restaurant-card-content">
            <h3 class="restaurant-card-title">{{ restaurant.restaurant }}</h3>
            <button class="restaurant-card-action">Explorer</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      restaurants: [],
    };
  },
  created() {
    this.getRestaurants();
  },
  methods: {
    async exploreRestaurant(restaurant) {
  await this.$store.dispatch('exploreRestaurant', restaurant.restaurant);
  this.$router.push({ name: 'CreateOrder', params: { restaurant: restaurant.restaurant } });
},


getRestaurants() {
  axios
    .get('http://localhost:3003/AfficherAM')
    .then(response => {
      const restaurantSet = new Set(response.data.map(menu => menu.restaurant));
      this.restaurants = Array.from(restaurantSet).map(restaurant => ({
        _id: restaurant,
        restaurant,
      }));
    })
    .catch(error => {
      console.error(error);
    });
},

  },
};
</script>

<style scoped>
.home {
  font-family: Arial, sans-serif;
  color: #333;
}

.hero {
  background-color: #f2f2f2;
  padding: 50px 0;
  text-align: center;
}

.hero-title {
  font-size: 2.5em;
  margin-bottom: 0.5em;
}

.hero-subtitle {
  font-size: 1.5em;
  color: #666;
}

.restaurants {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 50px 0;
}

.restaurant-card {
  width: 200px;
  height: 200px;
  margin: 20px;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.restaurant-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
}

.restaurant-card-content {
  text-align: center;
}

.restaurant-card-title {
  margin-bottom: 1em;
}

.restaurant-card-action {
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.restaurant-card-action:hover {
  background-color: #666;
}
</style>
