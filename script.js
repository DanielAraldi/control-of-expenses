const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    // Se o ID que foi clicado for diferente dos outros IDs ele é removido e é criado um novo array de transações
    transactions = transactions.filter(transaction =>
        transaction.id !== ID)
    updateLocalStorage()
    init()
}

const addTransactionIntoDOM = ({ amount, name, data, id }) => {
    const operator = amount < 0 ? '-' : '+'
    const CSSClass = amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(amount).toFixed(2) // Retorna qualquer número sem nenhum símbolo.
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
        ${name} <span class="data">${data}</span> <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${id})">X</button>
        
    `
    transactionsUl.prepend(li) // Adicionada como primeiro filho (prepend())
}

// Soma os valores do array
const getTotal = transactionAmounts => transactionAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

// Soma as receitas
const getIncome = transactionAmounts => transactionAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

// Soma as despesas
const getExpenses = transactionAmounts => Math.abs(transactionAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

const updateBalanceValeus = () => {
    const transactionAmounts = transactions.map(({ amount }) => amount)
    const total = getTotal(transactionAmounts)
    const income = getIncome(transactionAmounts)
    const expense = getExpenses(transactionAmounts)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

// Muda o estado da página após cada adição de despesa
const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValeus()
}

init()

// Armazenando os dados no LocalStorage
updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

// Criando IDs aleatórios
const generateID = () => Math.round(Math.random() * 10000)

// Data de criação de transação
const gererateData = () => {
    const data = new Date()

    const year = data.getFullYear()
    let mouth = data.getMonth()
    const day = data.getDate()
    const hours = data.getHours()
    const minutes = data.getMinutes()
    const seconds = data.getSeconds()

    return day + "/" + (mouth + 1) + "/" + year + " | " + hours + ":" + minutes + ":" + seconds
}

// Adicionando os dados no array de transações
const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        data: gererateData(),
        amount: Number(transactionAmount)
    })
}

const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault() // Faz com que o form não seja enviado e a página seja recarregada novamente

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

    // Se os inputs não forem preenchidos
    if (isSomeInputEmpty) {
        alert('Por favor, preencha tanto o nome quando o valor da transação!')
        return
    }

    addToTransactionsArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInputs()
}

form.addEventListener('submit', handleFormSubmit)