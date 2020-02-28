class User {
  firstname: string;

  lastname: string;

  age: number;

  gender: UserGender;

  country = 'France';

  constructor(firstname: string, lastname: string, gender = UserGender.Other) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.gender = gender;
  }

  get name(): string {
    return `${this.firstname} ${this.lastname}`;
  }
}
let user: User;
user = new User('Jean', 'Bon');
console.log(user.name); // => Jean Bon
console.log(user.gender);// => Other
console.log(user.country); // => France
