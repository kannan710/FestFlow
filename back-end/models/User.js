import mongoose from "mongoose"
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    collegeId: { type: mongoose.Schema.Types.Mixed, default: null },
    phoneNo: { type: mongoose.Schema.Types.Mixed, default: null },
    role: { type: String, required: true, enum: ["student", "admin"], default: "student" },
}, {
    timestamps: true
})

// Hash password before saving
UserSchema.pre("save", async function () {
    if(!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
})

// Compare Password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const model = mongoose.model("User", UserSchema)

export default model
