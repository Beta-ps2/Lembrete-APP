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

// BOTÃO PARA LIMPAR O CAMPOS 
const clear_btn = document.getElementById('clear-fields-btn');

clear_btn.addEventListener("click", () => {

    document.getElementById('task').value = '';
    document.getElementById('date').value = '';
    document.getElementById('lat').value = '';
    document.getElementById('long').value = '';

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
    const latitude = document.getElementById('lat').value;
    const longitude = document.getElementById('long').value;

    if (task.trim() === '' || date.trim() === '') {
        alert('Preencha todos os campos obrigatórios: lembrete e data.');
        return;
    }

    if (editingMode) {
        // Modo de edição
        alterReminder(editIndex, task, date, category, latitude, longitude);
        alert('Lembrete alterado com sucesso!');
        // Reinicia o estado de edição
        editingMode = false;
        editIndex = -1;
    } else {
        // Modo de adição
        addReminder(task, date, category, latitude, longitude);
        alert('Lembrete adicionado com sucesso!');
    }

    // Limpa os campos após adicionar ou alterar
    document.getElementById('task').value = '';
    document.getElementById('date').value = '';
    document.getElementById('lat').value = '';
    document.getElementById('long').value = '';

    loadReminders();
});

// FUNÇÃO AUXILIAR PARA OBTER LEMBRETES DO LOCALSTORAGE
function getRemindersFromLocalStorage() {
    const remindersJSON = localStorage.getItem('reminders');
    return remindersJSON ? JSON.parse(remindersJSON) : [];
}

// FUNÇÃO PARA ADICIONAR UM NOVO LEMBRETE
function addReminder(task, date, category, latitude, longitude) {
    const reminders = getRemindersFromLocalStorage();
    const newReminder = { task, date, category, latitude, longitude };
    reminders.push(newReminder);
    localStorage.setItem('reminders', JSON.stringify(reminders));

    loadReminders()
}

// FUNÇÃO PARA ALTERAR UM LEMBRETE EXISTENTE
function alterReminder(index, task, date, category, latitude, longitude) {
    const reminders = getRemindersFromLocalStorage();
    reminders[index] = { task, date, category, latitude, longitude };
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

// FUNÇÃO PARA CARREGAR OS LEMBRETES DO LOCALSTORAGE
function loadReminders() {
    const reminders = getRemindersFromLocalStorage();
    const list = document.getElementById('reminder-list');
    list.innerHTML = ''; // Limpa a lista antes de adicionar os novos itens

    reminders.forEach((reminder, index) => {
        const li = document.createElement('li');
        li.textContent = `${reminder.task} - ${reminder.date} - ${reminder.category} - ${reminder.latitude } - ${reminder.longitude}`;
        
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
            document.getElementById('lat').value = reminder.latitude;
            document.getElementById('long').value = reminder.longitude;
        });

        // Adiciona a lista e o botão
        li.appendChild(deleteButton); 
        list.appendChild(li); 
    });
}

add_btn.addEventListener('click', function() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.log('Geolocalização não é suportada pelo seu navegador.');
    }
});

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude);
}

function error() {
    console.log('Não foi possível obter a localização.');
}

function checkAndNotifyTodayReminders() {
    // Obter a data de hoje no formato "YYYY-MM-DD"
    const today = new Date().toISOString().split('T')[0];

    // Buscar lembretes do localStorage
    const reminders = getRemindersFromLocalStorage();

    // Exemplo de log para verificar se a função está sendo chamada corretamente
    console.log('Verificando lembretes para hoje...');

    // Iterar sobre os lembretes e verificar se a data é igual a hoje
    reminders.forEach((reminder) => {
        if (reminder.date === today) {
            // Caso encontrar um lembrete com a data igual à de hoje
            const notificationMessage = `Lembrete para hoje: ${reminder.task}`;

            console.log(reminder.task);

            alert(notificationMessage);
        }
    });
}


checkAndNotifyTodayReminders();

// CHAMA A FUNÇÃO PARA CARREGAR OS LEMBRETES AO CARREGAR A PÁGINA
document.addEventListener('DOMContentLoaded', loadReminders);
