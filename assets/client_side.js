const socket = io()
const users = document.querySelector('#all-users')
const shuffleButton = document.querySelector('#shuffle-button')
const shuffleButtonArea = document.querySelector('#shuffle-button-area')
const usersList = document.querySelector('#all-users-area')

let users_ids = []

socket.on('change count', (data) => {
    users_ids = data.user_ids
    if (users_ids.length >= 3) {
        shuffleButton.disabled = false
    }
    let result_string = ''
    for (let i = 0; i < data.user_ids.length; i++) {
        if (socket.id === data.user_socket_ids[i]) {
            result_string += '<li><b>' + data.user_ids[i] + ': ' + data.user_full_names[i] + '</b></li> <br>'
        } else {
            result_string += '<li>' + data.user_ids[i] + ': ' + data.user_full_names[i] + '</li> <br>'
        }
    }

    users.innerHTML = result_string
})

/**
 * Socket event that gets three lists:
 * list of information about wishes and (id, full name, wishes),
 *
 * and generated pairs for exchanging of wishes
 */
socket.on('put user info', (data) => {
    const socket_ids = data.socket_ids
    const user_id = users_ids[socket_ids.indexOf(socket.id)]
    let wisher_id = 0
    for (let temp_pair of data.pairs) {
        console.log(temp_pair)
        if (temp_pair.retriever === user_id) {
            wisher_id = temp_pair.sender
            break
        }
    }
    let result_object
    for (let temp_wish of data.wishes) {
        console.log(temp_wish)
        if (temp_wish.wish_id === wisher_id) {
            result_object = temp_wish
            break
        }
    }
    console.log(result_object)
    let wisher_result_html =
        'You\'ve received the wish from <b>' +
        result_object.lastname + ' ' + result_object.name +
        '</b><br> His wish:<br><ul class="list-group list-group-numbered">'

    for (let temp_wish of result_object.wish.split('\r\n'))
        wisher_result_html += `<li class="list-group-item">${temp_wish}</li>`
    wisher_result_html += '</ul>'

    usersList.innerHTML = wisher_result_html
    shuffleButtonArea.innerHTML =
        `<a target="_blank" href="/santa/${users_ids[data.socket_ids.indexOf(socket.id)]}">Go to page info about retriever of your wishes</a>`
})

shuffleButton.addEventListener('click', evt => {
    evt.preventDefault()
    postData('http://localhost:3000/shuffle')
        .then(() => {
            socket.emit('get user', {
                socket_id: socket.id
            })
        })
        .catch(error => console.log(error))
})

async function postData(url = '') {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({message: 'PostQuery'})
    })
    return await response.json()
}
