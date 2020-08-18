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

const addTransactionIntoDOM = transaction => {
    const operator = transaction.amount < 0 ? '-' : '+'
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.amount).toFixed(2) // Retorna qualquer número sem nenhum símbolo.
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
        ${transaction.name} <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
            x
        </button>
    `
    transactionsUl.prepend(li) // Adicionada como primeiro filho (prepend())
}

const updateBalanceValeus = () => {
    const transactionAmounts = transactions
        .map(transaction => transaction.amount)
    // Soma os valores do array
    const total = transactionAmounts
        .reduce((accumulator, transaction) => accumulator + transaction, 0)
        .toFixed(2)
    // Soma as receitas
    const income = transactionAmounts
        .filter(value => value > 0)
        .reduce((accumulator, value) => accumulator + value, 0)
        .toFixed(2)
    // Soma as despesas
    const expense = Math.abs(transactionAmounts
        .filter(value => value < 0)
        .reduce((accumulator, value) => accumulator + value, 0))
        .toFixed(2)

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

form.addEventListener('submit', event => {
    event.preventDefault() // Faz com que o form não seja enviado

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()

    // Se os inputs não forem preenchidos
    if (transactionName === '' || transactionAmount === '') {
        alert('Por favor, preencha tanto o nome quando o valor da transação!')
        return
    }

    const transaction = {
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    }

    // Adicionando os dados no array de transações
    transactions.push(transaction)
    init()
    updateLocalStorage()

    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
})