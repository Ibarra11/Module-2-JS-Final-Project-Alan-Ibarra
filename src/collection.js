export class Collection {
  constructor({
    name,
    books = [],
    id = crypto.randomUUID(),
    updateDisplayedBooks,
  }) {
    this.name = name.toUpperCase();
    this.books = books;
    this.id = id;
    this.updateDisplayedBooks = updateDisplayedBooks;
  }

  render(isActive) {
    const btn = document.createElement("button");
    btn.className = `block text-base p-2 w-full text-left border-slate-900 border-2 rounded cursor-pointer ${
      isActive ? "bg-slate-900" : ""
    }`;
    btn.innerText = this.name;
    btn.addEventListener("click", () => {
      this.updateDisplayedBooks(this.name);
    });
    const collectionItem = document.createElement("li");
    collectionItem.setAttribute("id", this.id);
    collectionItem.className = "relative flex items-center";
    collectionItem.append(btn);
    if (this.books.length > 0) {
      const quanitity = document.createElement("div");
      quanitity.className =
        "absolute grid place-content-center h-8 w-8 right-1 bg-slate-600 text-white rounded-full";
      quanitity.innerText = this.books.length;
      collectionItem.append(quanitity);
    }

    return collectionItem;
  }
}
