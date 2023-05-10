const map = L.map('map').setView([41, -74], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const markers = [];

const updateContact = async () => {
    console.log("updating contact");
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

    const response = await axios.put('/update', {
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

    const message = document.querySelector("#message");

    if(response.data.error)
    {
        const p = document.createElement('p');
        p.setAttribute('class',"alert alert-warning")
        p.innerText = response.data.error;
        message.appendChild(p);
    }
    else if(message.childNodes.length>0)
        message.removeChild(message.firstChild);

    if(message.childNodes.length>1)
        message.removeChild(message.firstChild);

    if(!response.data.error)
    {
        window.location = "/";
    }
}
const addContact = async () => {
    console.log("adding contact");
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

    const response = await axios.put('/create', {
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

    const message = document.querySelector("#message");

    if(response.data.error)
    {
        const p = document.createElement('p');
        p.setAttribute('class',"alert alert-warning")
        p.innerText = response.data.error;
        message.appendChild(p);
    }
    else if(message.childNodes.length>0)
        message.removeChild(message.firstChild);

    if(message.childNodes.length>1)
        message.removeChild(message.firstChild);

    if(!response.data.error)
    {
        window.location = "/";
    }
}

const loadPlaces = async () => {
    const response = await axios.get('/contacts');
    console.log("response",response.data);
    console.log("lat",response.data.contacts[0].lat);
    for(let i=0;i<response.data.contacts.length;i++)
    {
        const marker = L.marker([response.data.contacts[i].lat, response.data.contacts[i].lng]).addTo(map)
            .bindPopup(`<b>${response.data.contacts[i].first} ${response.data.contacts[i].last}</b><br/>${response.data.contacts[i].address}`);
        markers.push(marker);
    }
}

const on_row_click = (lat, lng) => {
    console.log(lat, lng)
    map.flyTo([lat, lng]);
}

/*
const loadContacts = async () => {
    const response = await axios.get('/contacts');
    const contactTable = document.querySelector("#contacts");
    while(contactTable.firstChild)
        contactTable.removeChild(contactTable.firstChild);
    const contacts = response.data.contacts;
    for(let i = 0;i<contacts.length;i++)
    {
        const address = contacts[i].address.split(",");
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <section>
                    ${contacts[i].first} ${contacts[i].last}
                </section>
            </td>
            <td>${contacts[i].phone}</td>
            <td>${contacts[i].email}</td>
            <td>
                <section>${address[0]} ${address[1]}</section>
                <section>
                    <span>${address[2]}</span>
                    <span>, </span>
                    <span>${address[3]}</span>
                    <span>${address[4]}</span>
                </section>
                <section>${address[5]}</section>
            </td>
        `;
        let ed = ""
        ed += `<td>
                    <a href="/contacts/${contacts[i].id}/edit" class="btn btn-primary">Edit</a>
                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModalLabel${contacts[i].id}">Delete</button>

                    <div class="modal fade" id="deleteModalLabel${contacts[i].id}" tabindex="-1" aria-labelledby="deleteModalLabel${contacts[i].id}" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="deleteModalLabel${contacts[i].id}">Delete Contact</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <p> Are you sure you want to delete ${contacts[i].first} ${contacts[i].last}?</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="deleteContact(${contacts[i].id})"> Yes!</button>
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"> Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
               </td>`;

        let s = ``;
        s+= `<td> <section>`;
        if(contacts[i].contact_by_phone === "on")
            s+= `<input id="phone" type="checkbox" checked disabled>`;
        else
            s+= `<input id="phone" type="checkbox" disabled>`;

        s+= `<label for="phone">Phone</label></section><section>`;

        if(contacts[i].contact_by_email === "on")
            s+= `<input id="email" type="checkbox" checked disabled>`;
        else
            s+= `<input id="email" type="checkbox" disabled>`;
        s+= `<label for="Email">Email</label></section><section>`;

        if(contacts[i].contact_by_mail === "on")
            s+= `<input id="mail" type="checkbox" checked disabled>`;
        else
            s+= `<input id="mail" type="checkbox" disabled>`;
        s+= `<label for="mail">Mail</label></section></td>`;
        tr.innerHTML+=s+ed;

        tr.dataset.lat = contacts[i].lat;
        tr.dataset.lng = contacts[i].lng;
        tr.onclick = on_row_click;
        contactTable.appendChild(tr);
    }
}
 */