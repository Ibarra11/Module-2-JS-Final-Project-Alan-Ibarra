import { BookStore } from "./bookstore";
import { createCollectionForm } from "./domElements";

const bookstore = new BookStore();

bookstore.render();

createCollectionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const collection = formData.get("collection");
  // make sure that it is not an empty string
  if (collection.trim().length !== 0) {
    bookstore.createCollection(collection);
    e.target.reset();
    bookstore.render();
  }
});

document
  .querySelector('[data-update-collection="bookstore"]')
  .addEventListener("click", () => {
    bookstore.updateDisplayedBooks("bookstore");
  });

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const search = formData.get("search");
  bookstore.updateDisplayedBooksBySearch(search);
  e.target.reset();
});
