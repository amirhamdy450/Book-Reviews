const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
 
 if (Object.values(users).some(user => user.username === username && user.password === password))
  {
    return true;
  }
  else{
    return false;
  }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password=req.body.password;

  if (username == null || password == null){
    res.status(401).send("Please enter your email & password !");

  }

  else if (authenticatedUser(username,password)) {
  
 
let accessToken = jwt.sign({
  data: username
}, 'access', { expiresIn: 60 * 60 });
req.session.authorization = {
  accessToken
}
return res.status(200).json({ message: "Logged in successfully!" });
}

else {
  res.status(404).send("NOT FOUND !");
}



});

regd_users.put("/auth/review/:isbn", (req, res) => {

  //Write your code here

  const isbn = req.params.isbn;

  const review = req.query.review;

  const username = req.session.username;

  if (!isbn) {

    return res.status(400).json({ message: "ISBN is required" });

  }

   if (!review) {

    return res.status(400).json({ message: "Review is required" });

  }

   if (!username) {

    return res.status(401).json({ message: "User is not logged in" });

  }

  const book = books.find((item) => item.isbn === isbn);

  if (!book) {

    return res.status(404).json({ message: "Book not found" });

  }

  const userReview = book.reviews[username];

  if (userReview) {

    book.reviews[username] = review;

    return res.status(200).json({ message: "Review modified successfully" });

  } else {

    book.reviews[username] = review;

    return res.status(201).json({ books});

  }

});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
