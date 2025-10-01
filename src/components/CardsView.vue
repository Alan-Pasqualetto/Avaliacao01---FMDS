<!-- src/components/CardsView.vue -->
<template>
  <div class="cards-container">
    <div v-for="e in equipamentos" :key="e.id" class="card">
      <h3>{{ e.nome }}</h3>
      <p><strong>Categoria:</strong> {{ e.categoria }}</p>
      <p><strong>Patrimônio:</strong> {{ e.patrimonio }}</p>
      <p :class="e.status"><strong>Status:</strong> {{ e.status }}</p>

      <div class="actions">
        <button @click="$emit('editar', e)">Editar</button>
        <button class="danger" @click="$emit('remover', e)">Remover</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  equipamentos: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.card h3 {
  margin: 0 0 8px;
}

.disponível {
  color: green;
  font-weight: bold;
}

.emprestado {
  color: red;
  font-weight: bold;
}

.actions {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
}

button {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.danger {
  background: #f44336;
  color: white;
}
</style>
