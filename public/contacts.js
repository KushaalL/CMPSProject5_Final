const map = L.map('map').setView([41, -74], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const markers = [];
const addContact = async () => {
    const fName = document.querySelector("#fNameC").value;
    const lName = document.querySelector("#lNameC").value;
    const phone = document.querySelector("#phoneC").value;
    const email = document.querySelector("#emailC").value;
    const address = document.querySelector("#addressC").value;
    const contactPhone = document.querySelector("#contactPhoneC").value;
    const contactEmail = document.querySelector("#contactEmailC").value;
    const contactMail = document.querySelector("#contactMailC").value;

    const response = await axios.put('/create', {
        fName: fName,
        lName: lName,
        phone: phone,
        email: email,
        address: address,
        contactPhone: contactPhone,
        contactEmail: contactEmail,
        contactMail: contactMail});

    if(!response.error)
    {
        const contactTable = document.querySelector("#contacts");
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <section>
                    <a href="/contact/${response.data.id}">${fName} ${lName}</a>
                </section>
            </td>
            <td>${phone}</td>
            <td>${email}</td>
            <td>${response.data.formalAddress}</td>
        `;
        let s = ``;
        s+= `<td> <section>`;
        if(contactPhone)
            s+= `<input id="phone" type="checkbox" checked disabled>`;
        else
            s+= `<input id="phone" type="checkbox" disabled>`;

        s+= `<label for="phone">Phone</label></section><section>`;

        if(contactEmail)
            s+= `<input id="email" type="checkbox" checked disabled>`;
        else
            s+= `<input id="email" type="checkbox" disabled>`;
        s+= `<label for="Email">Email</label></section><section>`;

        if(contactMail)
            s+= `<input id="mail" type="checkbox" checked disabled>`;
        else
            s+= `<input id="mail" type="checkbox" disabled>`;
        s+= `<label for="mail">Mail</label></section></td>`;
        tr.innerHTML+=s;
        contactTable.appendChild(tr);
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