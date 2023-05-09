require('dotenv').config();
const Database = require('dbcmps369');

class ContactDB {
    constructor() {
        this.db = new Database();
    }
    async initialize() {
        await this.db.connect();

        await this.db.schema('Contacts',[
            {name: 'id', type: 'INTEGER'},
            {name: 'first', type: 'TEXT'},
            {name: 'last', type: 'TEXT'},
            {name: 'phone', type: 'TEXT'},
            {name: 'email', type: 'TEXT'},
            {name: 'address', type: 'TEXT'},
            {name: 'contact_by_phone', type: 'TEXT'},
            {name: 'contact_by_email', type: 'TEXT'},
            {name: 'contact_by_mail', type: 'TEXT'},
            {name: 'lat', type: 'NUMERIC' },
            {name: 'lng', type: 'NUMERIC' },
        ],'id');

        await this.db.schema('Users',[
            {name: 'id', type: 'INTEGER'},
            {name: 'first', type: 'TEXT'},
            {name: 'last', type: 'TEXT'},
            {name: 'username', type: 'TEXT'},
            {name: 'password', type: 'TEXT'},
        ],'id')

        /*const user = await this.findUserByName('cmps369');
        console.log('User: '+user);
        if (user===undefined) {
            console.log('No user of cmps369 in database\nCreating user');
            const u = {first: 'Scott',last: 'Frees'};
            const bcrypt = require('bcryptjs');
            const salt = bcrypt.genSaltSync(10);
            const hashPass = bcrypt.hashSync('rcnj', salt);
            //await this.createUser(u, 'cmps369', hashPass);
        }*/
    }

    async createContact(info)
    {
        return await this.db.create('Contacts',[
            {column: 'first', value: info.first},
            {column: 'last', value: info.last},
            {column: 'phone', value: info.phone},
            {column: 'email', value: info.email},
            {column: 'address', value: info.address},
            {column: 'contact_by_phone', value: info.contact_by_phone},
            {column: 'contact_by_email', value: info.contact_by_email},
            {column: 'contact_by_mail', value: info.contact_by_mail},
            {column: 'lat', value: info.lat},
            {column: 'lng', value: info.lng}
        ]);
    }

    async updateContact(info,id)
    {
        return await this.db.update('Contacts', [
            {column: 'first', value: info.first},
            {column: 'last', value: info.last},
            {column: 'phone', value: info.phone},
            {column: 'email', value: info.email},
            {column: 'address', value: info.address},
            {column: 'contact_by_phone', value: info.contact_by_phone},
            {column: 'contact_by_email', value: info.contact_by_email},
            {column: 'contact_by_mail', value: info.contact_by_mail},
            {column: 'lat', value: info.lat},
            {column: 'lng', value: info.lng}
        ], [{column: 'id', value: id}]);
    }

    async deleteContact(id)
    {
        return await this.db.delete('Contacts',[{column: 'id', value: id}]);
    }
    async createUser(name,username,password)
    {
        return  await this.db.create('Users',[
            {column: 'first', value: name.first},
            {column: 'last', value: name.last},
            {column: 'username', value: username},
            {column: 'password', value: password}
        ]);
    }
    async findUserByName(name)
    {
        const user = await this.db.read('Users', [{column: 'username', value: name}]);
        console.log("length: "+user.length);
        if(user.length > 0)
            return user[0];
        else
            return undefined;
    }
    async findUserById(id)
    {
        const user = await this.db.read('Users', [{column: 'id', value: id}]);
        if(user.length > 0)
            return user[0];
        else
            return undefined;
    }
    async getAllContacts()
    {
        return await this.db.read('Contacts', []);
    }
    async getContact(id)
    {
        return await this.db.read('Contacts',[{column: 'id', value: id}]);
    }

}

module.exports = ContactDB;