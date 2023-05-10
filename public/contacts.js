const map = L.map('map').setView([41, -74], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const markers = [];

const addContact = async () => {
    const title = document.querySelector("#titleF").value;
    const first = document.querySelector("#firstF").value;
    const last = document.querySelector("#lastF").value;
    const phone = document.querySelector("#phoneF").value;
    const email = document.querySelector("#emailF").value;
    const street = document.querySelector("#streetF").value;
    const city = document.querySelector("#cityF").value;
    const state = document.querySelector("#stateF").value;
    const country = document.querySelector("#countryF").value;
    const zipcode = document.querySelector("#zipcodeF").value;

    let contactPhone = document.querySelector("#contactPhoneF").checked;

    if(contactPhone)
        contactPhone = "on";
    else
        contactPhone = "off";
    let contactEmail = document.querySelector("#contactEmailF").checked;
    if(contactEmail)
        contactEmail = "on";
    else
        contactEmail = "off";
    let contactMail = document.querySelector("#contactMailF").checked;
    if(contactMail)
        contactMail = "on";
    else
        contactMail = "off";

    console.log(title, first, last, phone, email, street, city, state, country, zipcode, contactPhone, contactEmail, contactMail);

    const message = document.querySelector("#message");
    while(message.firstChild)
        message.removeChild(message.firstChild);
    if((title==="" || first==="" || last==="" || phone==="" || email==="" || street==="" || city==="" || state==="" || country==="" || zipcode===""||title==="Choose Title")) {
        const p = document.createElement('p');
        p.setAttribute('class',"alert alert-warning")
        p.innerText = "Please fill out all fields";
        message.appendChild(p);
        return;
    }

    const response = await axios.put('/create', {
        title: title,
        first: first,
        last: last,
        phone: phone,
        email: email,
        street: street,
        city: city,
        state: state,
        country: country,
        zipcode: zipcode,
        contactPhone: contactPhone,
        contactEmail: contactEmail,
        contactMail: contactMail});

    if(response.data.error)
    {
        const p = document.createElement('p');
        p.setAttribute('class',"alert alert-warning")
        p.innerText = response.data.error;
        message.appendChild(p);
    }

    if(!response.data.error)
        window.location = "/";
}

const loadPlaces = async () => {
    const response = await axios.get('/contacts');

    for(let i=0;i<response.data.contacts.length;i++)
    {
        const marker = L.marker([response.data.contacts[i].lat, response.data.contacts[i].lng]).addTo(map)
            .bindPopup(`<b>${response.data.contacts[i].first} ${response.data.contacts[i].last}</b><br/>${response.data.contacts[i].address}`);
        markers.push(marker);
    }
}

const on_row_click = (lat, lng) => {
    map.flyTo([lat, lng]);
}