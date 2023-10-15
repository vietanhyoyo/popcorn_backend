const mongoose = require('mongoose')

async function connect() {
  try {
    // await mongoose.connect('mongodb://localhost:27017/popcorndatabase') /// url connetion
     await mongoose.connect('mongodb+srv://admin:Admin12345678@clusterpop.m5ffkim.mongodb.net/popcorndb?retryWrites=true&w=majority') 
    console.log('Connect successfully')
  } catch (error) {
    console.log('Connect failure!!!')
  }
}

module.exports = { connect }

//old
// await mongoose.connect('mongodb://localhost:27017/edu_database');
// await mongoose.connect('mongodb+srv://admin:admin@cluster0.lmuhsrg.mongodb.net/edu_school?retryWrites=true&w=majority');
/**User name: tennv
 * Passwork: tennv123456
 * Kết nối tới compass: mongodb+srv://tennv:tennv123456@cluster0.vglkl.mongodb.net/test
 */
