import UserRepository from "../repositories/users.repository.js";
import UserModel from '../dao/mongo/user.model.js';
import addUser from "../services/UserService.js";
import User from '../dao/mongo/user.model.js';
class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    toggleUserRole = async (userId) => {
        try {
            const user = await this.userRepository.toggleUserRole(userId);

            if (!user) {
                this.handleError("cambiar el rol del usuario", new Error("Usuario no encontrado"));
            }

            return user;
        } catch (error) {
            this.handleError("cambiar el rol del usuario", error);
        }
    };

    handleError = (action, error) => {
        console.error(`Error al ${action}:`, error);
        throw new Error(`Error al ${action}`);
    }

    addUser = async (user) => {
        try {
            const newUser = await this.userRepository.addUser(user);
            if (!newUser) {
                return "Usuario no registrado";
            }
            return newUser;

        } catch (error) {
            console.log("Error al agregar usuario: ", error);
            return error;
        }
    }

    getUsers = async () => {
        try {
            const users = await this.userRepository.getUsers();
            if (!users) {
                return "No hay usuarios";
            }
            return users;

        } catch (error) {
            console.log("Error al obtener usuarios: ", error);
            return error;
        }
    }

    getUserById = async (id) => {
        try {
            const user = await this.userRepository.getUserById(id);
            if (!user) {
                return "Usuario no encontrado";
            }
            return user;

        } catch (error) {
            console.log("Error al obtener usuario por id: ", error);
            return error;
        }
    }

    getUserByEmail = async (email) => {
        try {
            const user = await this.userRepository.getUserByEmail(email);
            if (!user) {
                return "Usuario no encontrado";
            }
            return user;

        } catch (error) {
            console.log("Error al obtener usuario por email: ", error);
        }
    }

    updateUser = async (id, user) => {
        try {
            const updatedUser = await this.userRepository.updateUser(id, user);
            if (!updatedUser) {
                return "No se pudo actualizar el usuario";
            }
            return updatedUser;

        } catch (error) {
            console.log("Error al actualizar usuario: ", error);
            return error;
        }
    }

    deleteUser = async (id) => {
        try {
            const deletedUser = await this.userRepository.deleteUser(id);
            if (!deletedUser) {
                return "Usuario no eliminado";
            }
            return deletedUser;

        } catch (error) {
            console.log("Error al eliminar usuario: ", error);
            return error;
        }
    }

    validateUser = async (email, password) => {
        try {
            const user = await this.userRepository.validateUser(email, password);
            if (!user) {
                return "Usuario no encontrado";
            }
            return user;

        } catch (error) {
            console.log("Error al validar usuario: ", error);
            return error;
        }
    }

    findUser = async (email) => {
        try {
            const user = await this.userRepository.findUser(email);
            if (!user) {
                return "Usuario no encontrado";
            }
            return user;
        } catch (error) {
            console.error("Error al encontrar el usuario: ", error);
            return error;
        }
    }

    findEmail = async (param) => {
        try {
            const email = await this.userRepository.findEmail(param);
            if (!email) {
                return null;
            }
            return email

        } catch (error) {
            console.error("No se pudo encontrar el usuario: ", error);
            return error;
        }
    }

    canCreateProduct = (user) => {
        return user.role === 'premium';
    };

}

export default UserService;