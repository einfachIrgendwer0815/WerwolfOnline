import React from 'react';
import { Link } from 'react-router-dom';

import { withTranslation } from 'react-i18next';

import './scss/Main.scss';
import './scss/buttonBox.scss';
import './scss/headlines.scss';

class Page_Main extends React.Component {
  private genRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private generateLetters() {
    var word: string = this.props.t('pages.main.title');

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
          <span className="headline no2">- { this.props.t('pages.main.subtitle') } -</span>
        </div>
        <div className="buttonBox">
          <ul>
            <li><Link to="/howToPlay">{this.props.t('pages.main.buttonBox.howToPlay')}</Link></li>
            <li><Link to="/play">{this.props.t('pages.main.buttonBox.play')}</Link></li>
            <li><Link to="/about">{this.props.t('pages.main.buttonBox.about')}</Link></li>
          </ul>
        </div>

        <span className="imprintButton"><Link to="imprint">{this.props.t('pages.main.imprintButton')}</Link></span>

      </div>

    );
  }
}

export default withTranslation()(Page_Main);
