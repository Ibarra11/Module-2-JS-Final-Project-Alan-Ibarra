import { Collection } from "./collection";
import { Pagination } from "./pagination";
import { collectionList, booksGrid } from "./domElements";
import {
  setItemToLocalStorage,
  getCollectionsFromLocalStorage,
  getBooksFromLocalStorage,
  getCurrentCollectionFromLocalStorage,
} from "./localstorage";

export class BookStore {
  constructor() {
    this.books = getBooksFromLocalStorage(this);
    this.collections = getCollectionsFromLocalStorage(this);
    this.currentCollection = getCurrentCollectionFromLocalStorage();
    this.pagination = new Pagination({
      items:
        this.currentCollection === "bookstore"
          ? this.books
          : this.collections
              .find((c) => c.name === this.currentCollection)
              .books.map((isbn) => {
                return this.books.find((book) => book.isbn === isbn);
              }),
      itemsPerPage: 10,
      onPageChange: this.renderBooksGrid.bind(this),
    });
  }

  removeBookFromCollection(book) {
    const nextBooks = this.books.map((b) => {
      if (b.isbn === book.isbn) {
        b.isReserved = false;
      }
      return b;
    });
    setItemToLocalStorage("books", nextBooks);
    this.books = nextBooks;
    const nextCollections = this.collections.map((collection) => {
      if (collection.name === this.currentCollection) {
        collection.books = collection.books.filter(
          (isbn) => isbn !== book.isbn
        );
      }
      return collection;
    });
    setItemToLocalStorage("collections", nextCollections);
    this.collections = nextCollections;
    const currentBooks = this.pagination.items.filter(
      (b) => b.isbn !== book.isbn
    );
    this.pagination.updateItems(currentBooks);
    this.render();
  }

  addBookToCollection(book, collectionName) {
    const nextBooks = this.books.map((b) => {
      if (b.isbn === book.isbn) {
        b.isReserved = true;
      }
      return b;
    });
    setItemToLocalStorage("books", nextBooks);
    this.books = nextBooks;
    const nextCollections = this.collections.map((collection) => {
      if (collection.name === collectionName) {
        collection.books.push(book.isbn);
      }
      return collection;
    });
    setItemToLocalStorage("collections", nextCollections);
    this.collections = nextCollections;
    this.renderBooksGrid();
    this.renderCollectionList();
  }

  createCollection(name) {
    const collection = new Collection({
      name,
      updateDisplayedBooks: this.updateDisplayedBooks.bind(this),
    });
    this.collections.push(collection);
    this.updateDisplayedBooks(this.currentCollection);
    setItemToLocalStorage("collections", this.collections);
    this.renderCollectionList();
  }

  updateDisplayedBooksBySearch(search) {
    const books =
      this.currentCollection === "bookstore"
        ? this.books
        : this.collections
            .find((c) => c.name === this.currentCollection)
            .books.map((isbn) => {
              return this.books.find((book) => book.isbn === isbn);
            });
    const newBooks = books.filter((book) =>
      book.title.toLowerCase().includes(search.toLowerCase())
    );
    this.pagination.updateItems(newBooks);
    this.pagination.currentPage = 1;
    this.render();
  }

  updateDisplayedBooks(collection) {
    setItemToLocalStorage("currentCollection", collection);
    this.currentCollection = collection;

    const books =
      this.currentCollection === "bookstore"
        ? this.books
        : this.collections
            .find((c) => c.name === collection)
            .books.map((isbn) => {
              return this.books.find((book) => book.isbn === isbn);
            });

    this.pagination.updateItems(books);
    this.pagination.currentPage = 1;

    this.render();
  }

  renderBooksGrid() {
    const books = this.pagination.getCurrentItems();
    const frag = document.createDocumentFragment();
    books.forEach((book) => {
      frag.append(
        this.currentCollection === "bookstore"
          ? book.render()
          : book.renderCollectionView()
      );
    });
    booksGrid.replaceChildren(frag);
  }

  renderCollectionList() {
    const frag = document.createDocumentFragment();
    this.collections.forEach((collection) => {
      frag.appendChild(
        collection.render(this.currentCollection === collection.name)
      );
    });
    collectionList.replaceChildren(frag);
  }

  render() {
    if (this.currentCollection === "bookstore") {
      document
        .querySelector('[data-update-collection="bookstore"]')
        .classList.add("bg-slate-900");
    } else {
      document
        .querySelector('[data-update-collection="bookstore"]')
        .classList.remove("bg-slate-900");
    }
    this.renderBooksGrid();
    this.renderCollectionList();
    this.pagination.render();
  }
}
