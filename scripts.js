const motivateButton = document.querySelector('#motivate-me');
const quoteDisplay = document.querySelector('#quote');
const quoteForm = document.querySelector('#quote-form');
const quoteLast = document.querySelector('#last-quote');
const getQuotesButton = document.querySelector('#get-quote');

async function getRandomQuote() {
    
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    quoteDisplay.innerHTML = `"${data.content}"<br>- ${data.author}`;
}

async function saveQuote(quote, author) {

    const response = await fetch('https://api.jsonbin.io/v3/b', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': '$2b$10$gYtLij80n5cFgo3h0p2qpO2oTI5zQ8Hee3WNKHaOg/bLxEmM3IUoG',
            'X-Access-Key':'$2b$10$Mi.FIWfyatzu0grGYGZr2uiMxaOSSsE7/cy5wSYqJFCcLbooouFTa',
            'X-Bin-Private': 'true'
        },
        body: JSON.stringify({
            quote: quote,
            author: author
        })
    });
   
    const data = await response.json();
    const id = data.metadata.id;
   
    localStorage.setItem('quoteId', id);
}


async function getSavedQuote() {
  
    const id = localStorage.getItem('quoteId');

    const response = await fetch(`https://api.jsonbin.io/v3/b/${id}`, {
        headers: {
            'X-Master-Key': '$2b$10$gYtLij80n5cFgo3h0p2qpO2oTI5zQ8Hee3WNKHaOg/bLxEmM3IUoG',
            'X-Access-Key': '$2b$10$Mi.FIWfyatzu0grGYGZr2uiMxaOSSsE7/cy5wSYqJFCcLbooouFTa'
        }
    });

    if (response.status === 404) {
        alert('No quote has been saved yet.');
        return;
    }

    const data = await response.json();
    console.log(data);
    const quote = data.record.quote;
    const author = data.record.author;

   
    quoteLast.innerHTML = `<p>"${quote}" - ${author}</p>`;
}

motivateButton.addEventListener('click', getRandomQuote);

quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const quote = quoteForm['quote-input'].value;
    const author = quoteForm['author-input'].value;

    saveQuote(quote, author);

    quoteForm.reset();
});

getQuotesButton.addEventListener('click', getSavedQuote);
