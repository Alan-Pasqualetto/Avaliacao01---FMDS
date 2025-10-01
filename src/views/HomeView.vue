<template>
  <div class="container">
    <h1>Catálogo de Equipamentos</h1>

    <!-- Formulário -->
    <div class="input-row">
      <input v-model="newEquipamento.nome" placeholder="Nome" required />
      <input v-model="newEquipamento.categoria" placeholder="Categoria" required />
      <input v-model="newEquipamento.patrimonio" placeholder="Patrimônio" required />
      <select v-model="newEquipamento.status" required>
        <option value="" disabled>Selecione status</option>
        <option value="disponível">Disponível</option>
        <option value="emprestado">Emprestado</option>
      </select>

      <button @click="editingId === null ? addEquipamento() : saveEdit()">
        {{ editingId === null ? 'Adicionar' : 'Salvar' }}
      </button>

      <button v-if="editingId !== null" class="small" @click="cancelEdit()">Cancelar</button>
      <router-link to="/cards" class="small">Ver Cards</router-link>
    </div>

    <!-- Filtros -->
    <div class="input-row">
      <input v-model="filtroCategoria" placeholder="Filtrar por categoria" />
      <select v-model="filtroStatus">
        <option value="">Todos</option>
        <option value="disponível">Disponível</option>
        <option value="emprestado">Emprestado</option>
      </select>
    </div>

    <!-- Lista -->
    <p v-if="equipamentos.length === 0">Nenhum equipamento cadastrado.</p>
    
    <ul v-else class="list">
      <li v-for="e in equipamentosFiltrados" :key="e.id" class="item">
        <span :class="e.status">
          {{ e.id }} - {{ e.nome }} - {{ e.categoria }} - {{ e.patrimonio }} - {{ e.status }}
        </span>
        <button class="small" @click="editEquipamento(e)">Editar</button>
        <button class="small danger" @click="removeEquipamento(e)">Remover</button>
      </li>
    </ul>

    <!-- Contadores -->
    <div class="summary">
      Total: {{ total }} | Disponíveis: {{ totalDisponiveis }} | Emprestados: {{ totalEmprestados }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Estado principal
const equipamentos = ref([])

// Formulário
const newEquipamento = ref({
  id: '',
  nome: '',
  categoria: '',
  patrimonio: '',
  status: ''
})

// Edição
const editingId = ref(null)
let nextId = 1

// Filtros
const filtroCategoria = ref('')
const filtroStatus = ref('')

// Persistência
const save = () => localStorage.setItem('equipamentos', JSON.stringify(equipamentos.value))

const load = () => {
  const raw = localStorage.getItem('equipamentos')
  if (raw) {
    try {
      const arr = JSON.parse(raw)
      equipamentos.value = Array.isArray(arr) ? arr : []
      const maxId = equipamentos.value.reduce((m, e) => Math.max(m, Number(e.id) || 0), 0)
      nextId = maxId + 1
    } catch {
      equipamentos.value = []
      nextId = 1
    }
  } else {
    equipamentos.value = []
    nextId = 1
  }

  // Tentar carregar edição a partir da query (se houver)
  loadEditFromQuery()
}

const loadEditFromQuery = () => {
  const editIdRaw = route.query.editId
  if (editIdRaw) {
    const id = parseInt(editIdRaw, 10)
    if (!Number.isNaN(id)) {
      const eq = equipamentos.value.find(e => Number(e.id) === id)
      if (eq) {
        editingId.value = Number(eq.id)
        newEquipamento.value = { ...eq }
      }
    }
  }
}

// Inicializa ao montar
onMounted(load)

// Observa mudanças no query param editId (se o usuario clicar editar em outra página e for redirecionado)
watch(() => route.query.editId, () => {
  // Recarrega dados (caso algo tenha mudado) e tenta aplicar a edição
  const raw = localStorage.getItem('equipamentos')
  if (raw) {
    try {
      equipamentos.value = JSON.parse(raw)
    } catch { equipamentos.value = [] }
  }
  loadEditFromQuery()
})

// CRUD
const addEquipamento = () => {
  const { nome, categoria, patrimonio, status } = newEquipamento.value
  if (!nome || !categoria || !patrimonio || !status) {
    alert('Preencha todos os campos antes de adicionar.')
    return
  }

  equipamentos.value.push({
    ...newEquipamento.value,
    id: nextId++
  })

  newEquipamento.value = { id: '', nome: '', categoria: '', patrimonio: '', status: '' }
  save()
}

const editEquipamento = (e) => {
  editingId.value = Number(e.id)
  newEquipamento.value = { ...e }
  // Atualiza a URL para deixar claro qual id está em edição
  router.replace({ query: { editId: e.id } })
}

const saveEdit = () => {
  const index = equipamentos.value.findIndex(e => Number(e.id) === Number(editingId.value))
  if (index !== -1) {
    equipamentos.value[index] = { ...newEquipamento.value, id: editingId.value }
    editingId.value = null
    newEquipamento.value = { id: '', nome: '', categoria: '', patrimonio: '', status: '' }
    save()
    // Limpa query editId da URL
    router.replace({ path: route.path, query: {} })
  }
}

const cancelEdit = () => {
  editingId.value = null
  newEquipamento.value = { id: '', nome: '', categoria: '', patrimonio: '', status: '' }
  router.replace({ path: route.path, query: {} })
}

const removeEquipamento = (e) => {
  if (window.confirm('Deseja realmente remover este equipamento?')) {
    equipamentos.value = equipamentos.value.filter(eq => Number(eq.id) !== Number(e.id))
    save()
    // se ele estava sendo editado, cancela edição e limpa query
    if (editingId.value === Number(e.id)) {
      cancelEdit()
    }
  }
}

// Computeds
const total = computed(() => equipamentos.value.length)
const totalDisponiveis = computed(() => equipamentos.value.filter(e => e.status === 'disponível').length)
const totalEmprestados = computed(() => equipamentos.value.filter(e => e.status === 'emprestado').length)

const equipamentosFiltrados = computed(() => {
  return equipamentos.value.filter(e =>
    (filtroCategoria.value === '' || (e.categoria || '').toLowerCase().includes(filtroCategoria.value.toLowerCase())) &&
    (filtroStatus.value === '' || e.status === filtroStatus.value)
  )
})
</script>

<style scoped>
.container { max-width: 900px;  margin: 0 auto;  padding: 16px; }
.input-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; align-items: center; }
input, select, button { padding: 6px; }
.small { font-size: 0.85rem; padding: 6px 8px; text-decoration: none; border: 1px solid #ccc; background: #fff; border-radius: 4px; cursor: pointer; }
button { cursor: pointer; border-radius: 4px; border: 1px solid #999; background: #eee; }
.small:hover, button:hover { opacity: 0.95; }
.danger { background-color: #f44336; color: white; border: none; }
.list { list-style: none; padding: 0; }
.item { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.disponível { color: green; font-weight: bold; }
.emprestado { color: red; font-weight: bold; }
.summary { 
  margin-top: 16px; 
  font-weight: 600; 
  background: #f5f5f5; 
  padding: 10px 14px; 
  border-radius: 6px; 
  text-align: right; 
  color: #333; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
a.router-link-active { font-weight: 700; }
</style>
