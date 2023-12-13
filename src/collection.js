export class Collection {
  constructor({ name, updateDisplayedBooks }) {
    this.name = name.toUpperCase();
    this.books = [];
    this.updateDisplayedBooks = updateDisplayedBooks;
    this.ref = null;
  }
  addBook(book) {
    this.books.push(book);
    if (this.ref) {
      const quanitity = this.ref.querySelector("#quantity");
      if (quanitity) {
        quanitity.innerText = this.books.length;
      } else {
        const quanitity = document.createElement("div");
        quanitity.className =
          "absolute grid place-content-center h-8 w-8 right-1 bg-slate-600 text-white rounded-full";
        quanitity.innerText = this.books.length;
        this.ref.appendChild(quanitity);
      }
    }
  }

  render() {
    const btn = document.createElement("button");
    btn.className = `block text-base p-2 w-full text-left border-slate-900 border-2 rounded cursor-pointer`;
    btn.innerText = this.name;
    btn.addEventListener("click", () => {
      this.updateDisplayedBooks(this.name);
    });
    const collectionItem = document.createElement("li");
    collectionItem.className = "relative flex items-center";
    collectionItem.append(btn);
    if (this.books.length > 0) {
      const quanitity = document.createElement("div");
      quanitity.className =
        "absolute grid place-content-center h-8 w-8 right-1 bg-slate-600 text-white rounded-full";
      quanitity.innerText = this.books.length;
      collectionItem.append(quanitity);
    }

    this.ref = collectionItem;

    return collectionItem;
  }
}
