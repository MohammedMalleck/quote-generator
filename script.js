async function getAndDisplayQuote(){
  const response = await fetch('https://api.quotable.io/quotes/random');
  const quoteArray = await response.json();
  const quoteObject = quoteArray[0];
  renderHTML(quoteObject.content,quoteObject.author);
};
getAndDisplayQuote();

function renderHTML(quote,authorName){
  const quoteTextEl = document.querySelector('.text span');
  const authorNameEl = document.querySelector('.author-name');

  quoteTextEl.innerHTML = quote;
  authorNameEl.innerHTML = authorName;
};

document.querySelector('.new-quote-button').addEventListener('click',()=>{
  document.querySelector('.text span').innerHTML = 'Loading';
  document.querySelector('.author-name').innerHTML = 'Loading';
  getAndDisplayQuote();
});