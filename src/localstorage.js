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

// export function addBookToCollection(book, collectionName) {
//   const nextBooks = getBooksFromLocalStorage().map((b) => {
//     if (b.isbn === book.isbn) {
//       return { ...book, isReserved: true };
//     }
//     return b;
//   });
//   setItemToLocalStorage("books", nextBooks);
//   let collection;
//   const nextCollections = getCollectionsFromLocalStorage().map((c) => {
//     if (c.name === collectionName) {
//       collection = { ...c, books: [...c.books, book.isbn] };
//       return collection;
//     }
//   });
//   setItemToLocalStorage("collections", nextCollections);
//   updateCollection(collection.id, collection.books.length);
// }

// function updateCollection(collectionId, numberOfBooks) {
//   const collectionEL = document.getElementById(collectionId);
//   const quanitity = collectionEL.querySelector("#quantity");
//   if (quanitity) {
//     quanitity.innerText = numberOfBooks;
//   } else {
//     const quanitity = document.createElement("div");
//     quanitity.className =
//       "absolute grid place-content-center h-8 w-8 right-1 bg-slate-600 text-white rounded-full";
//     quanitity.innerText = numberOfBooks;
//     collectionEL.appendChild(quanitity);
//   }
// }
