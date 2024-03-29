import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'mongoose-unique-validator';

const roles = {
  values: ['Admin', 'User'],
  message: '{VALUE} is not an available Rol'
}

const UserSchema = new Schema({
  name: { type: String, required: [true, 'Name required'] },
  password: { type: String, required: [true, 'Password required'] },
  email: { type: String, unique: true, required: [true, 'Email required'] },
  avatar: { type: String, default: 'av-1.png', required: false },
  account: {
    type: String,
    required: [true, 'Account required'],
    default: 'User',
    enum: roles
  }
});

UserSchema.plugin(validator, { message: '{PATH} must be unique' });

UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
}

UserSchema.method('checkPassword', function (password: string = ''): boolean {
  if (bcrypt.compareSync(password, this.password)) { return true }
  else { return false }
});

export interface USER extends Document {
  name: string;
  password: string;
  email: string;
  avatar?: string;
  account: string;
  checkPassword(password: string): boolean;
}

export const User = model<USER>('User', UserSchema);