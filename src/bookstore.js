import { Collection } from "./collection";
import { Pagination } from "./pagination";
import {
  collectionList,
  booksGrid,
  searchInput,
  homeBtn,
  deleteCollectionBtn,
  createCollection,
  collectionError,
} from "./domElements";
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
      itemsPerPage: 12,
      onPageChange: this.renderBooksGrid.bind(this),
    });
  }
  init() {
    const bookstore = this;
    createCollection.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const collectionInput = formData.get("collection");
      // make sure that it is not an empty string
      if (
        collectionInput.trim().length !== 0 &&
        !this.collections.find(
          (collection) => collection.name === collectionInput.toUpperCase()
        )
      ) {
        this.createCollection(collectionInput);
        e.target.reset();
        if (collectionError.classList.contains("block")) {
          collectionError.classList.remove("block");
          collectionError.classList.add("hidden");
        }
      } else {
        collectionError.classList.remove("hidden");
        collectionError.classList.add("block");
      }
    });

    homeBtn.addEventListener("click", function () {
      bookstore.updateDisplayedBooks("bookstore");
      this.classList.add("bg-purple-100", "text-purple-900");
    });

    searchInput.addEventListener("input", (e) => {
      this.updateDisplayedBooksBySearch(e.target.value);
    });

    deleteCollectionBtn.addEventListener("click", () => {
      this.deleteCollection();
    });
    if (this.currentCollection !== "bookstore") {
      deleteCollectionBtn.classList.remove("hidden");
      deleteCollectionBtn.classList.add("block");
    }
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
        b.collection = collectionName;
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

  deleteCollection() {
    const collectionBooks = this.collections.find(
      (collection) => collection.name === this.currentCollection
    ).books;
    const nextBooks = this.books.map((book) => {
      if (collectionBooks.includes(book.isbn)) {
        book.isReserved = false;
      }
      return book;
    });
    this.books = nextBooks;
    setItemToLocalStorage("books", nextBooks);
    const nextCollections = this.collections.filter(
      (collection) => collection.name !== this.currentCollection
    );
    setItemToLocalStorage("collections", nextCollections);
    this.collections = nextCollections;
    this.currentCollection = "bookstore";
    this.updateDisplayedBooks(this.currentCollection);
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
    this.renderBooksGrid();
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

    const deleteCollectionBtn = document.getElementById("delete-collection");
    if (collection !== "bookstore") {
      deleteCollectionBtn.classList.remove("hidden");
      deleteCollectionBtn.classList.add("block");
    } else {
      deleteCollectionBtn.classList.remove("block");
      deleteCollectionBtn.classList.add("hidden");
    }
    searchInput.value = "";
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
        .classList.add("bg-purple-100", "text-purple-900");
    } else {
      document
        .querySelector('[data-update-collection="bookstore"]')
        .classList.remove("bg-purple-100", "text-purple-900");
    }
    this.renderBooksGrid();
    this.renderCollectionList();
    this.pagination.render();
  }
}
