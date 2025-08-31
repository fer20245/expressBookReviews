const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
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
public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message:
                 "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({
            message: 
            "User already exists!.The user and passw are the same than the previous"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({
        message:"Unable to register user. No ha digitado usuario y/o password"});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Creating a promise method. The promise will 
    //get resolved when timer times out after 6 seconds.
let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      (res.send(books))
    },6000)})
//Console log before calling the promise
console.log("Before calling promise");

  });

  //***************************************************//
 // Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;  
    // Crear una promesa que se resuelve después de 6 segundos
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {resolve();}, 6000);});
    // Mensaje antes de llamar la promesa
    console.log("print the register after 6 seconds");
    // Ejecutar la promesa despues de 6 segundos
    myPromise.then(() => {
      if (books[isbn]) {
        res.send(books[isbn]);
        //return res.status(200).json(books[isbn]);
      } else {
        return res.status(404).json({ mensaje: 'Libro no encontrado con ese ISBN' });
      }
    });
  });  
// Get book details based on author

public_users.get('/author/:author',function (req, res) {
    //Write your code here
const authorName=req.params.author;//autorName nombre que captura de la URL
const matchingBooks = Object.values(books).filter(book=>book.author===
      authorName)

const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {resolve();}, 6000);});
      // Mensaje por consola antes de llamar la promesa
    console.log("print the register after 6 seconds");
      // Ejecutar la promesa despues de 6 segundos
    myPromise.then(() => {
    if (matchingBooks.length > 0){
      return res.status(200).json(matchingBooks);
    }else{
      return res.status(200).json({mensaje: 'Libro no encontrado con ese author'});
    }
  
});
});
//**********************************************************//
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    
  const titleName=req.params.title;
  const matchingBooks = Object.values(books).filter(book=>book.title===
      titleName)
  if (matchingBooks.length > 0){
      return res.status(200).json(matchingBooks);
  }else{
      return res.status(200).json({mensaje: 'Libro no encontrado con ese titulo'});
  
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
