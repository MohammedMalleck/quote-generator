getAndDisplayQuote();

async function getAndDisplayQuote(){
  const response = await fetch('https://api.quotable.io/quotes/random');
  const quoteArray = await response.json();
  const quoteObject = quoteArray[0];
  renderHTML(quoteObject.content,quoteObject.author);
};

function renderHTML(quoteString,authorName){
  const quoteWords = quoteString.split(' ');
  const lastWord = quoteWords[quoteWords.length - 1];

  const quoteTextEl = document.querySelector('.text span');
  const authorNameEl = document.querySelector('.author-name');

  const modifiedQuoteStirng = quoteString.replace(lastWord,`<span class="last-word">${lastWord}<i id="end-quotation" class="fa-solid fa-quote-right"></i>
  </span>`);

  quoteTextEl.innerHTML = modifiedQuoteStirng;
  authorNameEl.innerHTML = authorName;
};

document.querySelector('.new-quote-button').addEventListener('click',()=>{
  document.querySelector('.text span').innerHTML = 'Loading<i id="end-quotation" class="fa-solid fa-quote-right"></i>';
  document.querySelector('.author-name').innerHTML = 'Loading';
  getAndDisplayQuote();
});


class SpeakButton{
  #element;
  #playing;
  #paused;

  constructor(element){
    this.#element = element;
  }

  addEvent(){
    this.#element.addEventListener('click',()=>{
      const playBtn = document.querySelector('.toolbar > button:nth-child(1)');
      const speech = new SpeechSynthesisUtterance();
      this.addEndEvent(speech);
      const synth = window.speechSynthesis;
    
      if(this.#playing) {
        synth.pause();
        this.#paused = true;
        this.#playing = false;
        playBtn.classList.toggle('active');
        return;
      }else if(!this.#playing && this.#paused){
        synth.resume();
        this.#paused = false;
        this.#playing = true;
        playBtn.classList.toggle('active');
        return;
      } 

      playBtn.classList.toggle('active');
      this.#playing = true;
    
      const textContent = document.querySelector('.text span').textContent;
      const voices  = synth.getVoices();

      speech.text = textContent;
      speech.voice = voices[0];
      console.log(speech.voice)
      synth.speak(speech);
    });
  };

  addEndEvent(speech){
    speech.addEventListener('end',()=>{
      const playBtn = document.querySelector('.toolbar > button:nth-child(1)');
      playBtn.classList.remove('active');

      this.#playing = false;
      this.#paused = false;
    });
  };

};

new SpeakButton(document.querySelector('.toolbar > button:nth-child(1)')).addEvent();

class CopyBtn{
  #timeout = false;
  #button;

  constructor(button){
    this.#button = button;
  }

  addEvent(){
    this.#button.addEventListener('click',()=>{

      if(this.#timeout){
        clearTimeout(this.#timeout);
        this.#timeout = false;
      }else{
        this.#button.classList.add('active');
      };
    
      this.#timeout = setTimeout(()=>{
        this.#button.classList.remove('active');
        this.#timeout = false;
      },1000);
    
      const quote = document.querySelector('.text span').textContent;
      const authorName = document.querySelector('.author-name').textContent;
      const string = `"${quote}" - ${authorName}`;
      navigator.clipboard.writeText(string);      
    });
  };
};

new CopyBtn(document.querySelector('.toolbar > button:nth-child(2)')).addEvent();

document.querySelector('.toolbar > button:nth-child(3)').addEventListener('click',()=>{
  const shareBtn = document.querySelector('.toolbar > button:nth-child(3)');
  shareBtn.classList.toggle('active');
});

document.querySelector('.js-twitter-icon').addEventListener('click',()=>{
  const quote = document.querySelector('.text span').textContent;
  const authorName = document.querySelector('.author-name').textContent;
  const string = `"${quote}" - ${authorName}`;

  window.open(`https://twitter.com/intent/tweet?text=${string}` , "Tweet Window" , "width=600 , height=300" );
});

