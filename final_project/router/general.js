const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

  let users = [];  
  //Write your code here
  if(!req.body.username){
    return res.status(400).send({error: 'Username is required'});
  }
  if(!req.body.password){
    return res.status(400).send({error: 'Password is required'});
  }
  const username = req.body.username
  let filtered_users = Object.values(users).filter(user => user.username === username)

  if (filtered_users[0]) return res.status(404).send({error: 'Username already exists'});

  users.push(req.body)

  return res.status(201).json( {message: "user successfully created"});
  

  
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    // Example of making an external request using Axios
    const response = await axios.get('https://api.example.com/data'); 
    
    // Processing data from the external API along with the books
    const combinedData = {
      externalData: response.data,
      books: books
    };

    // Sending back the combined data
    return res.status(200).json(combinedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    
    // Search for the book locally in the dataset
    const book = Object.values(books).find(book => book.isbn === isbn);

    if (!book) {
      return res.status(404).send({ error: 'Book with ISBN not found' });
    }

    // Example external API call using Axios (replace with actual API)
    const externalApiUrl = `https://api.example.com/books/${isbn}`;
    const response = await axios.get(externalApiUrl);
    
    // Combine local book data with external API data
    const combinedData = {
      ...book,
      externalData: response.data
    };

    return res.status(200).json(combinedData);

  } catch (error) {
    console.error('Error fetching external data:', error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    
    // Search for books by the author in the local dataset
    let authors = Object.values(books).filter(book => book.author === author);

    if (!authors.length) {
      return res.status(404).send({ error: 'Author not found' });
    }

    // Example external API call using Axios (replace with actual API)
    const externalApiUrl = `https://api.example.com/author/${author}`;
    const response = await axios.get(externalApiUrl);
    
    // Combine local author data with external API data
    const combinedData = {
      localBooks: authors,
      externalData: response.data
    };

    return res.status(200).json(combinedData);

  } catch (error) {
    console.error('Error fetching external data:', error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
});
// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    
    // Search for the book locally by title
    const titles = Object.values(books).filter(book => book.title === title);

  

  
    const response = await axios.get(`https://api.example.com/title/${title}`);
    
    // Combine local book data with external API data
    const combinedData = {
      localBook: titles[0],
      externalData: response.data
    };

    return res.status(200).json(combinedData);

  } catch (error) {
    console.error('Error fetching external data:', error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let isbns = Object.values(books).filter(book => book.ibsn === isbn)

  if (!isbns[0]) return res.status(404).send({error: 'Review for book with this isbn not found'});
  return res.status(200).send(isbns[0]);
});

module.exports.general = public_users;
