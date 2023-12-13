export class Pagination {
  constructor({ items, itemsPerPage, currentPage = 1, onPageChange }) {
    this.items = items;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = currentPage;
    this.onPageChange = onPageChange;
  }

  nextPage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    if (startIndex + this.itemsPerPage < this.items.length) {
      this.currentPage++;
      this.onPageChange();
      return true;
    }
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.onPageChange();
      return true;
    }
  }
  getCurrentItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const items = this.items.slice(startIndex, endIndex);
    return items;
  }

  updateItems(newItems) {
    this.items = newItems;
  }

  render() {
    const paginationContainer = document.getElementById("pagination");
    if (this.items.length > 0) {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;

      const paragraph = document.createElement("p");
      paragraph.innerText = paragraph.innerText = `Showing ${
        startIndex + 1
      } to ${Math.min(startIndex + this.itemsPerPage, this.items.length)} of ${
        this.items.length
      } books.`;
      const btn = document.createElement("button");
      btn.className = "border border-gray-700 py-1 px-4 text-lg";
      const nextBtn = document.createElement("button");
      const prevBtn = document.createElement("button");
      nextBtn.className = "py-2 w-24 text-lg bg-gray-200 rounded";
      prevBtn.className = "py-2 w-24 text-lg bg-gray-200 rounded";
      nextBtn.innerText = "Next";
      prevBtn.innerText = "Prev";
      prevBtn.addEventListener("click", () => {
        if (this.prevPage()) {
          const startIndex = (this.currentPage - 1) * this.itemsPerPage;
          paragraph.innerText = paragraph.innerText = `Showing ${
            startIndex + 1
          } to ${Math.min(
            startIndex + this.itemsPerPage,
            this.items.length
          )} of ${this.items.length} books.`;
        }
      });
      nextBtn.addEventListener("click", () => {
        if (this.nextPage()) {
          const startIndex = (this.currentPage - 1) * this.itemsPerPage;
          paragraph.innerText = paragraph.innerText = `Showing ${
            startIndex + 1
          } to ${Math.min(
            startIndex + this.itemsPerPage,
            this.items.length
          )} of ${this.items.length} books.`;
        }
      });
      const btnContainer = document.createElement("div");
      btnContainer.className = "flex gap-2";
      btnContainer.append(...[prevBtn, nextBtn]);
      paginationContainer.innerHTML = "";
      paginationContainer.append(paragraph);
      paginationContainer.append(btnContainer);
    } else {
      paginationContainer.innerHTML = "";
    }
  }
}
