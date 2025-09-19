require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/admin');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const username = 'adminrifat'; // Change as needed
  const password = 'Rifat061'; // Change as needed

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) {
    console.log('Admin user already exists.');
    mongoose.connection.close();
    return;
  }

  const admin = new Admin({
    username,
    password: hashedPassword
  });
  await admin.save();
  console.log('Admin user created!');
  mongoose.connection.close();
}

createAdmin().catch(err => {
  console.error('Error:', err);
  mongoose.connection.close();
});
