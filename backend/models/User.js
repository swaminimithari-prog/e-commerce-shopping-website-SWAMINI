const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },
    // isAdmin is what the auth middleware, JWT payload, and all controllers
    // actually check. Kept in sync with `role` via a pre-save hook below so
    // both fields stay consistent.
    isAdmin: {
      type: Boolean,
      default: false
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    phone: {
      type: String
    }
  },
  { timestamps: true }
);

// Hash password before saving
// Mongoose 9 no longer passes a next() callback to pre middleware —
// async functions (or functions returning a promise) are used instead.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Keep isAdmin and role in sync, whichever one gets set
userSchema.pre('save', function () {
  if (this.isModified('role') && !this.isModified('isAdmin')) {
    this.isAdmin = this.role === 'admin';
  } else if (this.isModified('isAdmin') && !this.isModified('role')) {
    this.role = this.isAdmin ? 'admin' : 'customer';
  }
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);