const fs = require('fs');
const chalk = require('chalk');
const validator = require('validator');
// membuat kondisi sychronus menggunakan try, asychronus gunakan callback

// membuat folder data jika belum ada
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

// membuat file contacts.json jika belum ada
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf8');
}

const loadContact = () => {
    //  membaca file kemudian mengubah menjadi string
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf8');

    // dari string ke json menjadi array object
    const contacts = JSON.parse(fileBuffer);
    return contacts;
}

const simpanContact = (nama, email, noHP) => {
    const contact = { nama, email, noHP };
    const contacts = loadContact();

    // cek duplikat
    const duplikat = contacts.find((contact) => contact.nama === nama);
    if (duplikat) {
        console.log(
            chalk.red.inverse.bold('Contact sudah terdaftar, gunakan nama lain!')
        );
        return false;
    }

    // cek email
    if (email) {
        if (!validator.isEmail(email)) {
            console.log(
                chalk.red.inverse.bold('Email tidak valid!')
            );
            return false;
        }
    }

    // cek no hp
    if (!validator.isMobilePhone(noHP, 'id-ID')) {
        console.log(chalk.red.inverse.bold('No HP tidak valid!')
        );
        return false;
    }

    // menambahkan contact baru ke dalamn array kosong
    contacts.push(contact);

    // mengubah array objek JavaScript kembali menjadi string JSON dan menulisnya ke file contacts.json
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts, null, 2), 'utf8');
    console.log(chalk.green.inverse.bold('Terimakasih telah memasukkan data.'));
}

// list contacts
const listContacts = () => {
    const contacts = loadContact();
    console.log(chalk.cyan.inverse.italic('Daftar Kontak : '));

    contacts.forEach((contact, i) => {
        console.log(`${i + 1}. ${contact.nama} - ${contact.noHP}`);
    })
}

// detail contact
const detailContacts = (nama) => {
    const contacts = loadContact();

    const contact = contacts.find(
        (contact) => contact.nama.toLowerCase() === nama.toLowerCase());

    if (!contact) {
        console.log(chalk.red.inverse.bold(`${nama} tidak ditemukan!`));
        return false;
    }

    console.log(chalk.cyan.inverse.italic(contact.nama));
    console.log(contact.noHP);
    if (contact.email) {
        console.log(contact.email);
    }
}

// delete contact
const deleteContact = (nama) => {
    const contacts = loadContact();
    const newContacts = contacts.filter(
        (contact) => contact.nama.toLowerCase() !== nama.toLowerCase()
    );

    if (contacts.length === newContacts.length) {
        console.log(chalk.red.inverse.bold(`${nama} tidak ditemukan!`));
        return false;
    }

    fs.writeFileSync('data/contacts.json', JSON.stringify(newContacts, null, 2), 'utf8');
    console.log(chalk.green.inverse.bold(`data contact ${nama} berhasil dihapus!`));
}

module.exports = { simpanContact, listContacts, detailContacts, deleteContact };

