import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, max: 100 },
    surname: { type: String, required: false, max: 100 },
    email: { type: String, required: true, max: 100 },
    age: { type: Number, required: false, max: 100 },
    password: { type: String, required: false, max: 100 },
    cart: [
        {
            type: [
                {
                    cart: {
                        type: mongoose.Schema.Types.ObjectId, ref: 'carts'
                    }
                }
            ]
        }
    ],
    role: { type: String, required: true, max: 100 },
    documents: [
        {
            name: { type: String, required: true },
            reference: { type: String, required: true }
        }
    ],
    last_connection: { type: Date, default: Date.now }
})

userSchema.statics.toggleUserRole = async function (userId) {
    try {
        const user = await this.findById(userId);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        user.role = user.role === 'user' ? 'premium' : 'user';

        await user.save();

        return user;
    } catch (error) {
        throw new Error(`Error al cambiar el rol del usuario: ${error.message}`);
    }
};

userSchema.methods.hasUploadedDocuments = function() {
    return this.documents.length === 3; 
};

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;