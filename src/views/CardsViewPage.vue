<template>
  <div class="container">
    <h1>Visualização em Cards</h1>

    <p v-if="equipamentos.length === 0">Nenhum equipamento cadastrado.</p>

    <CardsView
      v-else
      :equipamentos="equipamentos"
      @editar="editar"
      @remover="remover"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CardsView from '../components/CardsView.vue'

const router = useRouter()
const equipamentos = ref([])

const load = () => {
  const raw = localStorage.getItem('equipamentos')
  if (raw) {
    try {
      equipamentos.value = JSON.parse(raw)
    } catch {
      equipamentos.value = []
    }
  }
}

onMounted(load)

// 👉 redireciona para Home (rota "/") com query editId
const editar = (e) => {
  router.push({ path: '/', query: { editId: e.id } })
}

const remover = (e) => {
  if (confirm(`Deseja remover ${e.nome}?`)) {
    equipamentos.value = equipamentos.value.filter(eq => eq.id !== e.id)
    localStorage.setItem('equipamentos', JSON.stringify(equipamentos.value))
  }
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
}
</style>
