import { parseHTML } from "./helpers";
import { getFromLocalStorage } from "./localstorage";

export class Book {
  constructor({
    isbn,
    title,
    subTitle,
    author,
    rating,
    copies,
    cover,
    publishYear,
    isReserved = false,
    addBookToCollection,
    removeBookFromCollection,
  }) {
    this.isbn = isbn;
    this.title = title;
    this.subTitle = subTitle;
    this.author = author;
    this.rating = rating;
    this.copies = copies;
    this.cover = cover;
    this.publishYear = publishYear;
    this.isReserved = isReserved;
    this.addBookToCollection = addBookToCollection;
    this.removeBookFromCollection = removeBookFromCollection;
  }

  checkout(formEvent) {
    formEvent.preventDefault();

    if (!this.isReserved && this.copies > 0) {
      const formData = new FormData(formEvent.target);
      const collection = formData.get("collection");
      if (collection === "Choose a collection") {
        const errorMessage = document.createElement("p");
        errorMessage.className =
          "absolute flex items center  -top-8 left-0 right-0 text-red-500 text-sm";
        errorMessage.innerText =
          "Collection must be selected before reserving!";
        const errorIcon = document.createElement("span");
        errorIcon.className =
          "fa-solid fa-circle-exclamation ml-auto text-base";
        errorMessage.appendChild(errorIcon);
        errorMessage.setAttribute("id", `error-${this.isbn}`);
        document.getElementById(`form-${this.isbn}`).appendChild(errorMessage);
      } else {
        const errorMessage = document.getElementById(`error-${this.isbn}`);
        if (errorMessage) {
          errorMessage.remove();
        }
        formEvent.target.reset();
        this.copies--;
        this.isReserved = true;
        this.addBookToCollection(this, collection);
      }
    }
  }

  returnBook(formEvent) {
    formEvent.preventDefault();
    this.copies++;
    this.removeBookFromCollection(this);
  }

  render() {
    const formHTML = parseHTML(`<form id=form-${
      this.isbn
    } class="relative flex flex-col space-y-2 mt-6">
                  <select
                  name="collection"
                    class="block p-2 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option selected>Choose a collection</option>
                    ${getFromLocalStorage("collections")
                      .map((collection) => {
                        return `<option value=${collection.name}>${collection.name}</option>`;
                      })
                      .join("\n")}
                  </select>
                  <button
                  class="bg-purple-700 text-white text-lg py-2 w-full rounded-md"
                >
                  Reserve
                  </button>

                </form>`).children[0];

    formHTML.addEventListener("submit", (e) => this.checkout(e));

    const bookHTML =
      parseHTML(`<div  id=${`book-${this.isbn}`} class="relative bg-white shadow flex gap-4 px-4 py-6 rounded-md">
              <div class="flex flex-col justify-between shrink-0">
              <div data-id="book-cover" class="relative">
                <img
                  class="h-36 rounded-md"
                  src=${this.cover}
                />
              </div>
                  <div class="flex">
                      ${getRatingStars(Math.round(this.rating))}
                  </div>

              </div>

              <div
                class=" last:flex-1 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <h2 class="truncate text-lg">
                    ${this.title}${this.subTitle ? `: ${this.subTitle}` : ""}
                  </h2>
                  <h3 class="truncate text-sm">${this.author.join(",")}</h3>
                  <time class="text-gray-400 text-sm">2016</time>
                  <p data-copies>Copies: ${this.copies}</p>
                </div>
                <div id="form-swap"></div>
                </div>
              </div>
            </div>`);
    bookHTML.getElementById("form-swap").replaceWith(formHTML);
    if (this.isReserved) {
      formHTML.querySelector("select").setAttribute("disabled", "true");
      formHTML.querySelector("button").classList.remove("bg-purple-700");
      formHTML.querySelector("button").classList.add("bg-slate-300");
      const bookCover = bookHTML.querySelector('[data-id="book-cover"]');
      const checkedOutElement = document.createElement("div");
      checkedOutElement.className =
        "absolute grid place-content-center top-0 right-0 -translate-y-1/2  w-8 h-8 bg-green-700 text-white rounded-full";
      const icon = document.createElement("i");
      icon.className = "fa fa-check";
      checkedOutElement.append(icon);
      bookCover.append(checkedOutElement);
    }
    return bookHTML;
  }

  renderCollectionView() {
    const formHTML = parseHTML(`<form  class="flex flex-col space-y-2 mt-4">
                  <button
                  class=" bg-purple-700 text-white text-lg py-2 w-full rounded-md"
                >
                  Return
                  </button>
                </form>`).children[0];
    formHTML.addEventListener("submit", (e) => this.returnBook(e));
    const bookHTML =
      parseHTML(`<div  id=${`book-${this.isbn}`} class="flex gap-4 bg-white px-4 py-6 rounded-md">
              <div class="flex flex-col gap-2 justify-between shrink-0">
                <img
                  class="h-36 rounded-md"
                  src=${this.cover}
                />
                   <div class="flex">
                      ${getRatingStars(Math.round(this.rating))}
                  </div>
              </div>

              <div
                class="flex-1 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <h2 class="truncate text-lg">
                    ${this.title}${this.subTitle ? `: ${this.subTitle}` : ""}
                  </h2>
                  <h3 class="truncate text-sm">${this.author.join(",")}</h3>
                  <time class="text-gray-400 text-sm">2016</time>
                </div>
                <div id="form-swap"></div>
                </div>
              </div>
            </div>`);
    bookHTML.getElementById("form-swap").replaceWith(formHTML);
    return bookHTML;
  }
}

function getRatingStars(rating) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    const img = document.createElement("img");
    img.classList.add(["w-6", "h-6"]);
    if (i < rating) {
      stars.push(`<img class="w-6 h-6" src="/icons/star-filled.svg" />`);
    } else {
      stars.push(`<img class="w-6 h-6" src="/icons/star.svg" />`);
    }
  }
  return stars.join("\n");
}
