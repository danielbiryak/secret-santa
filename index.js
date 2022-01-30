const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const urlencodedParser = express.urlencoded({extended: false});
const dataBase = require('./model/dbHelpers')
const mainAlgorithm = require('./shuffle_algo')
app.use(express.static(__dirname + '/assets'))

let user_ids = []
let user_full_names = []
let user_socket_ids = []
let shuffled_users = []

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/registration.html')
})

app.get('/api/santa/:id', (req, res) => {
    let santa_id = req.params.id
    dataBase.findPairById(santa_id)
        .then(pair => {
            console.log(pair)
            dataBase.findWishesByIds([pair[0].retriever])
                .then(wish => res.status(200).json({
                    wish: wish
                }))
        })
})
app.get('/santa/:id', (req, res) => {
    res.sendFile(__dirname + '/views/santa.html')
})

app.post('/', urlencodedParser, (req, res) => {
    let name = req.body.name
    let lastname = req.body.lastname
    user_full_names.push(lastname + ' ' + name)
    let wish_text = req.body.wish
    if(wish_text.split('\r\n').length > 10)
       return res.status(500).sendFile(__dirname + '/views/error_validation.html')

    dataBase.addToWishes(name,lastname, wish_text)
        .then( wish_id => {
            user_ids.push(wish_id)
            res.sendFile(__dirname + '/views/room.html')
        })
        .catch(() => {
            res.status(500).json({message: 'Failed to add user'})
        })
})

app.post('/shuffle', (req, res) => {
    let shuffled_list = mainAlgorithm.shuffle(user_ids)
    shuffled_users = []
    for(let i = 0; i < user_ids.length; i++) {
        shuffled_users.push({sender: user_ids[i], retriever: shuffled_list[i]})
    }

    dataBase.addToShuffle(shuffled_users)
        .then(() => res.status(200).json(shuffled_users))
        .catch(() => res.status(500).json({message: 'failed to add to shuffle_result'}))
})

io.on('connection', (socket) => {
    user_socket_ids.push(socket.id)
    console.log(socket.id)
    console.log('User connected!')
    console.log('List of users: ' + user_socket_ids)
    io.emit('change count', {
        user_ids: user_ids,
        user_socket_ids: user_socket_ids,
        user_full_names: user_full_names
    })

    socket.on('get user', () => {
        dataBase.findPairsByIds(user_ids)
            .then(pairs => {
                dataBase.findWishesByIds(user_ids)
                    .then(wishes => {
                        io.emit('put user info', {
                            wishes: wishes,
                            pairs: pairs,
                            socket_ids: user_socket_ids
                        })
                        user_ids = []
                        user_socket_ids = []
                    })
                    .catch(onError => console.log(onError))
            })
            .catch(error => console.log(error))
    })

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} Got disconnected!`)
        user_ids.splice(user_socket_ids.indexOf(socket.id),1)
        user_socket_ids.splice(user_socket_ids.indexOf(socket.id),1)

        io.emit('change count', {
            user_ids: user_ids,
            user_socket_ids: user_socket_ids
        })
    })
})

server.listen(3000, () => {
    console.log('Server is started')
})