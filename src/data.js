import fs from "node:fs";

const API =
  "https://openlibrary.org/search.json?subject=JavaScript&TypeScript&CSS&HTML";

const data = await (await fetch(API)).json();
const books = data.docs.map((book) => ({
  isbn: book.isbn[0],
  title: book.title,
  subTitle: book.subtitle,
  author: book.author_name,
  rating: book.ratings_average ?? 0,
  copies: book.isbn.length,
  cover: `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`,
  publishYear: book.first_publish_year,
}));

fs.writeFileSync("./data.json", JSON.stringify(books));
