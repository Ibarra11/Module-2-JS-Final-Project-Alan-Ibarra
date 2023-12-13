import books from "../data.json";
import { Book } from "./book";
import { Collection } from "./collection";
import { Pagination } from "./pagination";
import { collectionList, booksGrid } from "./domElements";

export class BookStore {
  constructor() {
    this.collections = [
      new Collection({
        name: "GENERAL",
        updateDisplayedBooks: this.updateDisplayedBooks.bind(this),
      }),
    ];
    this.books = books.map(
      (book) =>
        new Book({
          ...book,
          collections: this.collections,
          addBookToCollection: this.addBookToCollection,
          removeBookFromCollection: this.removeBookFromCollection.bind(this),
        })
    );
    // this will change between the collections.  If null that means no collection is set and show the available books.
    this.currentCollection = "bookstore";
    this.pagination = new Pagination({
      items: this.books,
      itemsPerPage: 10,
      onPageChange: this.renderBooksGrid.bind(this),
    });
  }

  addBookToCollection(book, collectionName) {
    const collection = this.collections.find(
      (collection) => collection.name === collectionName
    );
    collection.addBook(book);
  }

  removeBookFromCollection(book) {
    const collection = this.collections.find(
      (collection) => collection.name === this.currentCollection
    );
    collection.books = collection.books.filter(
      (cBook) => cBook.isbn !== book.isbn
    );
    this.updateDisplayedBooks(this.currentCollection);
    this.renderCollectionList();
    this.pagination.render();
  }

  createCollection(name) {
    const collection = new Collection({
      name,
      updateDisplayedBooks: this.updateDisplayedBooks.bind(this),
    });
    this.collections.push(collection);
    this.updateDisplayedBooks(this.currentCollection);
  }

  updateDisplayedBooksBySearch(search) {
    const books =
      this.currentCollection === "bookstore"
        ? this.books
        : this.collections.find((c) => c.name === this.currentCollection).books;
    const newBooks = books.filter((book) =>
      book.title.toLowerCase().includes(search.toLowerCase())
    );
    this.pagination.updateItems(newBooks);
    this.pagination.currentPage = 1;
    this.renderBooksGrid();
    this.pagination.render();
  }

  updateDisplayedBooks(collection) {
    this.currentCollection = collection;
    const newItems =
      this.currentCollection === "bookstore"
        ? this.books
        : this.collections.find((c) => c.name === collection).books;

    this.pagination.updateItems(newItems);
    this.pagination.currentPage = 1;
    this.renderBooksGrid();
    this.pagination.render();
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
      frag.appendChild(collection.render());
    });
    collectionList.replaceChildren(frag);
  }
  render() {
    this.renderBooksGrid();
    this.renderCollectionList();
    this.pagination.render();
  }
}
