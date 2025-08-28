const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();



let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
// Filter the users array for any user with the same username
let userswithsamename = users.filter((user) => {
    return user.username === username;
});
// Return true if any user with the same username is found, otherwise false
if (userswithsamename.length > 0) {
    return true;
} else {
    return false;
}
}

const authenticated = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
// Filter the users array for any user with the same username and password
let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
});
// Return true if any valid user is found, otherwise false
if (validusers.length > 0) {
    return true;
} else {
    return false;
}

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  
  const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticated(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send(`El usuario ${username} ha iniciado sesion 
        correctamente`);
    } else {
        return res.status(208).json({ message: "Inicio de sesión no válido. Comprueba el nombre de usuario y la contraseña." });
    }

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review or modifier this same
regd_users.put("/author/reviews/:isbn", (req, res) => {
    
    const isbn = req.params.isbn;
    let book = books[isbn];
    //const review = req.body.review;
    if (book){
      let author = req.body.author;
      let title = req.body.title;
      let reviews = req.body.reviews;
      const username = req.session?.authorization?.username ;
      if (author){book["author"]=author;}
      if (title){book["title"]=title;}
      if (reviews){book["reviews"]=reviews;}
      
      books[isbn]=book;
       
      res.send(`El libro con el isbn ${isbn} fue actualizado por el usuario
       ${username}`);
  
      }else{res.send("inhabilitado para conseguir el libro"); }

    });

    regd_users.delete("/author/reviews/:isbn", (req, res) => {
        const isbn = req.params.isbn;      
        let book = books[isbn];      
        if (book) {
            const username = req.session?.authorization?.username;      
          // Elimina todas las reseñas de solamente ese usuario en sesion
          delete book.reviews[username];      
          books[isbn] = book;
          //console.log("Sesión:", req.session);
          //console.log("Username:", username);          
          res.send(`La reseña del libro con el ISBN ${isbn} fue eliminada por ${username}`);
        } else {
          res.send(`Inhabilitado para eliminar reseña de ese libro`);
        }
      });
      
    
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
