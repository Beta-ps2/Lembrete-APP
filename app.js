// IMPLEMENTAR O SERVICE WORKER
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('sw.js').then((registration) => {
//             console.log('Service Worker registrado com sucesso: ', registration.scope);
//         }, (err) => {
//             console.log('Registro do Service Worker falhou: ', err);
//         });
//     });
// }

// PERMISSÃO PARA NOTIFICAÇÃO
if ("Notification" in window) {
    Notification.requestPermission().then(function(permission) {
      if (permission === "granted") {
        console.log("Permissão para notificações foi concedida.");
      } else {
        console.log("Permissão para notificações foi negada pelo usuário.");
      }
    });
}

function checkAndNotifyTodayReminders() {
    // Obter a data de hoje no formato "YYYY-MM-DD"
    const today = new Date().toISOString().split('T')[0]; // Obtém "YYYY-MM-DD" da data atual
    console.log(today)

    // Buscar lembretes do localStorage
    const reminders = getRemindersFromLocalStorage();
    

    // Iterar sobre os lembretes e verificar se a data é igual a hoje
    reminders.forEach((reminder) => {
        if (reminder.date === today) {
            // Encontramos um lembrete com data igual à de hoje
            const notificationMessage = `Lembrete para hoje: ${reminder.task}`;
            console.log(reminder.task);
            alert(notificationMessage); // Aqui pode-se utilizar uma notificação mais sofisticada em vez de um alert

            if (!("Notification" in window)) {
                console.error("Este navegador não suporta notificações desktop");
                alert("Este navegador não suporta notificações desktop")
                return;
            }

            // Poderíamos também adicionar lógica para destacar visualmente o lembrete na interface
            // Por exemplo, mudar a cor de fundo do item na lista de lembretes

            // Como exemplo simples, podemos logar no console também
            console.log(notificationMessage);
        }
    });
}




// BOTÃO PARA LIMPAR O CAMPOS 
const clear_btn = document.getElementById('clear-fields-btn');

clear_btn.addEventListener("click", () => {

    document.getElementById('task').value = '';
    document.getElementById('date').value = '';
    document.getElementById('local').value = '';

});

// Variável para controlar o modo de edição
let editingMode = false;
let editIndex = -1;

// COMPORTAMENTO PARA O BOTÃO 'ADICIONAR LEMBRETE'
const add_btn = document.getElementById('add-btn');

add_btn.addEventListener("click", () => {
    // VARIÁVEIS DE VERIFICAÇÃO DOS CAMPOS
    const task = document.getElementById('task').value;
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;

    if (task.trim() === '' || date.trim() === '') {
        alert('Preencha todos os campos obrigatórios: lembrete e data.');
        return;
    }

    if (editingMode) {
        // Modo de edição
        alterReminder(editIndex, task, date, category, document.getElementById('local').value);
        alert('Lembrete alterado com sucesso!');
        // Reinicia o estado de edição
        editingMode = false;
        editIndex = -1;
    } else {
        // Modo de adição
        addReminder(task, date, category, document.getElementById('local').value);
        alert('Lembrete adicionado com sucesso!');
    }

    // Limpa os campos após adicionar ou alterar
    document.getElementById('task').value = '';
    document.getElementById('date').value = '';
    document.getElementById('local').value = '';

    loadReminders();
});

// FUNÇÃO AUXILIAR PARA OBTER LEMBRETES DO LOCALSTORAGE
function getRemindersFromLocalStorage() {
    const remindersJSON = localStorage.getItem('reminders');
    return remindersJSON ? JSON.parse(remindersJSON) : [];
}

// FUNÇÃO PARA ADICIONAR UM NOVO LEMBRETE
function addReminder(task, date, category, local) {
    const reminders = getRemindersFromLocalStorage();
    const newReminder = { task, date, category, local };
    reminders.push(newReminder);
    localStorage.setItem('reminders', JSON.stringify(reminders));

    checkAndNotifyTodayReminders()
}

// FUNÇÃO PARA ALTERAR UM LEMBRETE EXISTENTE
function alterReminder(index, task, date, category, local) {
    const reminders = getRemindersFromLocalStorage();
    reminders[index] = { task, date, category, local };
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

// FUNÇÃO PARA CARREGAR OS LEMBRETES DO LOCALSTORAGE
function loadReminders() {
    const reminders = getRemindersFromLocalStorage();
    const list = document.getElementById('reminder-list');
    list.innerHTML = ''; // Limpa a lista antes de adicionar os novos itens

    reminders.forEach((reminder, index) => {
        const li = document.createElement('li');
        li.textContent = `${reminder.task} - ${reminder.date} - ${reminder.category} - ${reminder.local}`;
        
        // Cria o botão de exclusão
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'X';
        
        // Adiciona evento de clique para remover o lembrete
        deleteButton.addEventListener('click', () => {
            reminders.splice(index, 1);
            localStorage.setItem('reminders', JSON.stringify(reminders));
            list.removeChild(li); 
        });

        // Adiciona evento de clique para selecionar o lembrete para edição
        li.addEventListener('click', () => {
            editingMode = true;
            editIndex = index;
            document.getElementById('task').value = reminder.task;
            document.getElementById('date').value = reminder.date;
            document.getElementById('category').value = reminder.category;
            document.getElementById('local').value = reminder.local;
        });

        // Adiciona a lista e o botão
        li.appendChild(deleteButton); 
        list.appendChild(li); 
    });
}

// CHAMA A FUNÇÃO PARA CARREGAR OS LEMBRETES AO CARREGAR A PÁGINA
document.addEventListener('DOMContentLoaded', loadReminders);


checkAndNotifyTodayReminders();
setInterval(checkAndNotifyTodayReminders, 60000); // 60000 milissegundos = 1 minuto

