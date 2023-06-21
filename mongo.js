const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

if (process.argv.length > 2) {
    mongoose.set('strictQuery',false)
    mongoose.connect(url)

    const contactSchema = new mongoose.Schema({
        name: String,
        number: String,
      })
      
      const Contact = mongoose.model('Contact', contactSchema)

      if (process.argv.length === 3) {
        console.log('phonebook:')
        Contact
            .find({})
            .then (result => {
            result.forEach(contact => {
                console.log(contact.name, contact.number)
            })
            mongoose.connection.close()
        })
      }
      else {
        const name = process.argv[3]
        const number = process.argv[4]

        const contact = new Contact({
            name: name,
            number: number,
          })
          
          contact.save().then(result => {
            console.log(`added ${name} ${number} to phonebook`)
            mongoose.connection.close()
          })
      }
}
else {
    console.log('give password as argument')
    process.exit(1)
}



