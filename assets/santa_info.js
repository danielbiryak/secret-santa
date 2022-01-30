window.addEventListener('load', () => {
    let url = document.URL
    url = url.replace('/santa','/api/santa')
    fetch(url)
        .then(result => {
            return result.json()
        })
        .then(data => {
            let lastname = data.wish[0].lastname
            let name = data.wish[0].name
            let wish = data.wish[0].wish

            let result_string = '<ul class="list-group list-group-numbered">'
            for(let temp_str of wish.split('\r\n')){
                result_string += `<li class="list-group-item">${temp_str}</li>`
            }
            result_string += '</ul>'
            document.querySelector('#wish-list').innerHTML = 'His wishes:<br>' + result_string
            document.querySelector('#wisher-full-name').innerHTML = `Receiver full name: <b>${lastname} ${name}</b>`
        })
})


