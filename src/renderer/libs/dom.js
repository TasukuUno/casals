export const $ = (query) => {
  return document.querySelector(query);
};

export const $$ = (query) => {
  return [].slice.call(document.querySelectorAll(query));
};
