export const sanitize = (text) => {
  const div = document.createElement('div');
  div.innerHTML = text;
  text = div.innerText;
  return text;
};
