var form = {
    id: '',
    name: '',
    description: '',
    location: '',
    photo: null
}

const table = document.getElementById('TableBody');

function fetchData() {
    fetch(`http://localhost:3000/supermarkets`, { method: 'get' })
        .then(res => res.json())
        .then(data => {
            data.forEach(superMarket => {
                console.log(superMarket);
                let row = document.createElement('tr');
                row.setAttribute('style', 'cursor: pointer;');
                row.setAttribute('id', superMarket['_id']);
                row.setAttribute('onclick', 'handleSuperMarketClick(event)');
                table.appendChild(row);
                let photo = document.createElement('img');
                photo.setAttribute('src', `https://catwalksm.s3.amazonaws.com/${superMarket['_id']}`); // TODO
                photo.setAttribute('width', '100');
                photo.setAttribute('heigth', '100');
                row.appendChild(photo);
                let name = document.createElement('td');
                name.innerHTML = superMarket['name'];
                row.appendChild(name);
                let description = document.createElement('td');
                description.innerHTML = superMarket['description'];
                row.appendChild(description);
                let location = document.createElement('td');
                location.innerHTML = superMarket['location'];
                row.appendChild(location);
                let deleteButton = document.createElement('button');
                deleteButton.setAttribute('onclick', 'deleteSuperMarket(event)');
                deleteButton.setAttribute('style', 'margin-top: 5px;');
                deleteButton.setAttribute('id', superMarket['_id']);
                deleteButton.innerHTML = "X";
                row.appendChild(deleteButton);
            });
        })
        .catch(console.error);
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function handleFieldChange(value, field) {
    if (field === 'photo') {
        let file = value.target.files[0];
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                let binaryData = e.target.result;
                //Converting Binary Data to base 64
                let base64String = window.btoa(binaryData);
                form['photo'] = base64String;
            };
        })(file);
        // Read in the image file as a data URL.
        reader.readAsBinaryString(file);
    } else {
        form[field] = value;
    }

    if (form['name'] === '' || form['location'] === '' || form['description'] === '') {
        form['id'] = '';
    }
}

function saveSuperMarket() {
    if (form['name'] === '' || form['location'] === '' || form['description'] === '') {
        alert('Fields name, location and description are mandatory!');
        return;
    } else if (form['id'] === '') {
        fetch(`http://localhost:3000/supermarket`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: form['name'],
                description: form['description'],
                location: form['location'],
                photo: form['photo']
            })
        })
            .then(res => res.json())
            .then(response => {
                window.location.reload();
            })
            .catch(console.error);
    } else {
        fetch(`http://localhost:3000/supermarket`, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id: form['id'],
                name: form['name'],
                description: form['description'],
                location: form['location'],
                photo: form['photo']
            })
        })
            .then(res => res.json())
            .then(response => {
                window.location.reload();
            })
            .catch(console.error);
    }
}

function handleSuperMarketClick(value) {
    const id = value.path[1].id;

    form['id'] = id;

    fetch(`http://localhost:3000/supermarket/${id}`, { method: 'get' })
        .then(res => res.json())
        .then(superMarket => {
            document.getElementById('name').value = superMarket['name'];
            document.getElementById('description').value = superMarket['description'];
            document.getElementById('location').value = superMarket['location'];

            form['name'] = superMarket['name'];
            form['description'] = superMarket['description'];
            form['location'] = superMarket['location'];
        })
        .catch(console.error);
}

function deleteSuperMarket(value) {
    const id = value.path[1].id;

    fetch(`http://localhost:3000/supermarket`, {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            _id: id
        })
    })
        .then(res => {
            window.location.reload();
        })
        .catch(console.error);
}
