import React from 'react';
import { Link } from 'react-router-dom';

import './scss/Main.scss';
import './scss/buttonBox.scss';
import './scss/headlines.scss';

class Page_Main extends React.Component {
  private genRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private generateLetters() {
    var word: string = "Werewolf";

    var letters = [];

    for(let i = 0; i < word.length; i++) {
      var thisClasses: string = '';
      if(this.genRandomNumber(1, 5) < 3) {
        thisClasses = 'animate';

        thisClasses += ' anim' + this.genRandomNumber(1,3).toString();
        thisClasses += ' delay' + this.genRandomNumber(1,7).toString();
      }

      letters.push(
        <span className={thisClasses} key={i}>{word[i]}</span>
      );
    }

    return letters;
  }

  render() {
    return (
      <div id="mainPage">
        <div className="headlines">
          <span className="headline no1">
            {this.generateLetters()}
          </span>
          <span className="headline no2">- für den Browser -</span>
        </div>
        <div className="buttonBox">
          <ul>
            <li><Link to="/howToPlay">Regeln</Link></li>
            <li><Link to="/play">Spielen</Link></li>
            <li><Link to="/about">Über</Link></li>
          </ul>
        </div>

        <span className="imprintButton"><Link to="imprint">Impressum</Link></span>

      </div>

    );
  }
}

export default Page_Main;
