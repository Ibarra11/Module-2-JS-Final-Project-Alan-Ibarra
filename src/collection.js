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
    btn.className = `flex justiofy text-base p-2  w-full text-left  rounded cursor-pointer ${
      isActive ? "bg-purple-100 text-purple-900" : ""
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
      quanitity.className = `absolute grid place-content-center h-8 w-8 right-1 bg-purple-400 text-white rounded ${
        isActive ? "bg-white text-purple-500" : ""
      }`;
      quanitity.innerText = this.books.length;
      collectionItem.append(quanitity);
    }

    return collectionItem;
  }
}
