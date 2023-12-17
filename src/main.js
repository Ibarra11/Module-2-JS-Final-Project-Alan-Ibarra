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
  }
});
document
  .querySelector('[data-update-collection="bookstore"]')
  .addEventListener("click", function () {
    bookstore.updateDisplayedBooks("bookstore");
    this.classList.add("bg-purple-100", "text-purple-900");
  });
document.getElementById("search-input").addEventListener("input", (e) => {
  bookstore.updateDisplayedBooksBySearch(e.target.value);
});
