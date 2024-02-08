import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import UserService from "../services/UserService.js";

const LocalStrategy = local.Strategy;
const userService = new UserService();

const initializePassport = () => {

    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
        console.log("Registro de usuario:", req.body);

        try {
            const { name, surname, email, role } = req.body;
            console.log(`User data: ${name}, ${surname}, ${email}, ${role}`);

            let user = await userService.findEmail({ email: username });
            console.log(`User en passport.use /register: ${user}`);

            if (user) {
                console.log("El usuario ya existe");
                return done(null, false, { message: "El usuario ya existe" });
            }

            const hashedPassword = await createHash(password);
            console.log("Hashed password:", hashedPassword);

            const newUser = { name, surname, email, password: hashedPassword, role };
            console.log("Nuevo usuario:", newUser);

            let result = await userService.addUser(newUser);
            return done(null, result);

        } catch (error) {
            console.log("Error al registrar usuario:", error);
            return done("Error al obtener el usuario", error);
        }
    }))


    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {

        try {
            const user = await userService.getUserById(id);
            return done(null, user);

        } catch (error) {
            return done(error);
        }
    })

    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {

        try {
            const user = await userService.findEmail({ email: username });
            console.log("User found:", user);

            if (!user) {
                return done(null, false, { message: "Usuario no encontrado" });
            }

            const isValid = await isValidPassword(user, password);
            console.log("Validacion de contraseña:", isValid);

            if (!isValid) {
                return done(null, false, { message: "Contraseña inválida" });
            }
            console.log("Usuario autenticado:", user);
            return done(null, user);

        } catch (error) {
            console.error("Error inicio de sesion:", error);
            return done(error);
        }
    }))

    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.78a2a972db102172",
        clientSecret: "b6325b44b1541d0218b518ad41175fcc92590cf6",
        callbackURL: "http://localhost:8080/api/users/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {

        try {
            const email = profile.emails[0].value;
            let name = profile.displayName;

            if (email && email.length > 0) {
                let user = await userService.findEmail({ email: email });
                console.log(`Usuario en github: ${user}`);

                if (!user) {

                    let newUser = {
                        name: name,
                        email: email,
                        password: "",
                        role: "admin"
                    }

                    let newUserJson = JSON.stringify(newUser);
                    let result = await userService.addUser(newUser);
                    return done(null, result);

                } else {
                    return done(null, user);
                }

            } else {
                return done(null, false, { message: "User not found in GitHub" });
            }

        } catch (error) {
            return done(error);
        }
    }))
}

export default initializePassport;