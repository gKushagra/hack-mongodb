const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const UserSchema = new Schema({
    id: String,
    email: String,
    hash: String,
});

UserSchema.methods.newUser = function (email, password) {
    this.id = uuid();
    this.email = email;
    this.hash = bcrypt.hashSync(password, 10);
    console.log(this.id, this.email, this.hash);
};

UserSchema.methods.updateHash = function (password) {
    this.hash = bcrypt.hashSync(password, 10);
}

UserSchema.methods.verifyUser = function (password, hash) {
    return bcrypt.compareSync(password, hash);
};

mongoose.model("User", UserSchema);

const ResetSchema = new Schema({
    userId: String,
    resetToken: String,
    tokenCreatedOn: Date,
    userEmail: String,
});

ResetSchema.methods.addResetRequest = function (email, id) {
    this.userId = id;
    this.userEmail = email;
    this.resetToken = uuid();
    this.tokenCreatedOn = new Date();

    return this.resetToken;
};

mongoose.model("Reset", ResetSchema);