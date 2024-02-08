export default class UserDTO {

    constructor(user) {
        this.name = user.name || "";
        this.surname = user.surname || "";
        this.email = user.email || "";
        this.age = user.age || "";
        this.password = user.password || "";
        this.cart = user.cart || [];
        this.role = user.role || "user";
    }

    toSafeObject() {

        return {
            name: this.name,
            surname: this.surname,
            email: this.email,
            age: this.age,
            cart: this.cart,
            role: this.role,
            password: "********"
        };
    }
}