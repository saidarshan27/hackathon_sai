const mainContainer = document.querySelector("#mainContainer");
const loadingDiv = document.querySelector(".loading-div");
const searchContainer = document.querySelector(".seach-container");
const searchBar = document.querySelector(".search-box");


const row = document.createElement("div");
row.classList.add("row");

let allBooks;
searchBar.addEventListener("keyup", function () {
  const searchValue = searchBar.value.toLowerCase();

  if (searchValue === '') {
    row.innerHTML = "";
    getAllBooks();
    return;
  }
  let foundBooks = [];

  // search by book name
  allBooks.forEach(book => {
    if (book.name.toLowerCase().includes(searchValue)) {
      foundBooks.push(book);
    }
  });

  if (foundBooks.length > 0) {
    row.innerHTML = "";
    foundBooks.forEach(foundBook => {
      const col = generateBookHTML(foundBook);
      row.innerHTML += col;
    });

    return;
  }

  // search by ISBN
  allBooks.forEach(book => {
    if (book.isbn.includes(searchValue)) {
      foundBooks.push(book);
    }
  });

  if (foundBooks.length === 0) {
    row.innerHTML = "";
    row.append("book not found");
    return;
  }

  row.innerHTML = "";
  foundBooks.forEach(foundBook => {
    const col = generateBookHTML(foundBook);
    row.innerHTML += col;
  });
})

async function getAllBooks() {
  try {
    const response = await fetch('https://www.anapioficeandfire.com/api/books?pageSize=12');
    const data = await response.json();
  
    allBooks = data;


    allBooks.forEach(book => {
      const col = generateBookHTML(book);
      
      row.innerHTML += col;
    });
    
    loadingDiv.remove();

    searchContainer.classList.remove("d-none");
    mainContainer.append(row);
  } catch (error) {
    document.body.append("sorry website not working");
  }
};


getAllBooks();


function generateBookHTML(book) {
  const publishedDate = book.released;

  let localDateString = new Date(publishedDate).toLocaleDateString('en-GB');

  const html = `
      <div class="col-12 col-sm-6">
        <div class="card">
        <div class="card-body">
          <h6 class="card-title">${book.name}</h6>
          <p class="card-subtitle mb-2 text-muted">By - ${book.authors.join(',')}</p>
          <p class="card-subtitle mb-2 text-muted">ISBN - ${book.isbn}</p>
          <p class="card-subtitle mb-2 text-muted">Pages - ${book.numberOfPages} pages</p>
          <p class="card-subtitle mb-2 text-muted">Published by - ${book.publisher}</p>
          <p class="card-subtitle mb-2 text-muted">Published on - ${localDateString}</p>
        </div>
      </div>
    </div>
    `;
  
  return html;
}