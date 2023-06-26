<template>
  <div class="home">
    <header class="hero">
      <h1 class="hero-title">Bienvenue sur EatsCesi</h1>
      <p class="hero-subtitle">Profitez de la cuisine locale directement chez vous</p>
    </header>
    <section class="categories">
      <div v-for="category in categories" :key="category" class="category-card">
        <div class="category-card-content">
          <h3 class="category-card-title">{{ category }}</h3>
          <button class="category-card-action">Explorer</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: ['Pizza', 'Sushi', 'Burger', 'Cuisine mexicaine', 'Végétarien', 'Desserts']
    }
  }
}
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

.categories {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 50px 0;
}

.category-card {
  width: 200px;
  height: 200px;
  margin: 20px;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 5px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 5px 15px rgba(0,0,0,0.2);
}

.category-card-content {
  text-align: center;
}

.category-card-title {
  margin-bottom: 1em;
}

.category-card-action {
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card-action:hover {
  background-color: #666;
}
</style>
