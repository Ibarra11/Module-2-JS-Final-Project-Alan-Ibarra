import { Collection } from "./collection";
import { Book } from "./book";
import books from "../data.json";
export function getFromLocalStorage(item) {
  const value = localStorage.getItem(item);
  if (item) {
    return JSON.parse(value);
  }
}

export function setItemToLocalStorage(item, value) {
  localStorage.setItem(
    item,
    typeof value !== "string" ? JSON.stringify(value) : value
  );
}

export function getCurrentCollectionFromLocalStorage() {
  const currentCollection = localStorage.getItem("currentCollection");
  if (currentCollection) {
    return currentCollection;
  }
  localStorage.setItem("currentCollection", "bookstore");
  return "bookstore";
}

export function getCollectionsFromLocalStorage(bookstore) {
  const localStorageCollections = getFromLocalStorage("collections");
  if (localStorageCollections) {
    return localStorageCollections.map(({ name, books, id }) => {
      return new Collection({
        name,
        books,
        id,
        updateDisplayedBooks: bookstore.updateDisplayedBooks.bind(bookstore),
      });
    });
  }

  const newCollections = [
    new Collection({
      name: "GENERAL",
      updateDisplayedBooks: bookstore.updateDisplayedBooks.bind(bookstore),
    }),
  ];
  setItemToLocalStorage("collections", newCollections);
  return newCollections;
}

export function getBooksFromLocalStorage(bookstore) {
  const localStorageBooks = getFromLocalStorage("books");
  if (localStorageBooks) {
    return localStorageBooks.map(
      (book) =>
        new Book({
          ...book,
          addBookToCollection: bookstore.addBookToCollection.bind(bookstore),
          removeBookFromCollection:
            bookstore.removeBookFromCollection.bind(bookstore),
        })
    );
  }
  const newBooks = books.map(
    (book) =>
      new Book({
        ...book,
        addBookToCollection: bookstore.addBookToCollection.bind(bookstore),
        removeBookFromCollection:
          bookstore.removeBookFromCollection.bind(bookstore),
      })
  );
  setItemToLocalStorage("books", newBooks);
  return newBooks;
}
