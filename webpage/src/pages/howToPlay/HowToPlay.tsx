import { React } from "react";
import { useNavigate } from "react-router-dom";

import { IonIcon } from "@ionic/react";

import './scss/HowToPlay.scss';

function back(navigate) {
  document.scrollingElement.scrollTo(0,0);

  setTimeout(() => {
    navigate("/");
  }, 200);
}


function Page_HowToPlay() {
  const iconType = "chevron-back-outline";
  const navigate = useNavigate();

  return (
    <div id="howToPlay">
      <IonIcon icon={iconType} className="back" onClick={ () => {back(navigate)} } />
      <h1>Wie wird gespielt?</h1>
      <main>
        <ul>
          <li style={{"--item-delay": 0 + 's' }}>
            <span>Ziel des Spiels</span>
            <p>Das Ziel des Spiels ist es für die Werwölfe, alle Dorfbewohner zu töten. Für die Dorfbewohner gilt es, alle Werwölfe ausfindig zu machen.</p>
          </li>
          <li style={{"--item-delay": 0.5 + 's' }}>
            <span>Ablauf</span>
            <p>Zu Beginn wird jede/r Spieler/in eine Rolle zugewiesen, die er/sie geheim halten muss. (für Auflistung der Rollen siehe unten)</p>
            <p>Eine Besonderheit hat die Rolle des Bürgermeisters oder der Bürgermeisterin. Diese Rolle wird einem/r Spieler/in zusätzlich zugeteillt.
     Der/die Bürgermeister/in hat bei der täglichen Abstimmung zwei Stimmen.(Dazu später mehr)</p>
            <p>Nach dem jede(r) Spieler/in Kenntnis von seiner/ihrer Karte genommen hat, beginnt die erste Spielrunde.</p>
            <p>Jede Spielrunde besteht aus zwei Phasen, dem Tag und der Nacht.</p>
          </li>
          <li style={{"--item-delay": 1 + 's' }}>
            <span>In der Nacht</span>
            <p>Alle Spieler/innen mit einer Fähigkeit können nun nacheinander ihre besonderen Spielzüge ausführen.</p>
            <p>Bsp.:<br />
              <span className="spacer">Als erstes kann der/die Dieb/in zwei Rollen belieber Spieler/innen (auch von sich selbst) tauschen.</span><br />
              <span className="spacer">Danach kann der Armor ein Pärchen bestimmen.</span><br />
              <span className="spacer">usw. bis alle Funktionsrollen ihren Zug machen konnten.</span>
            </p>
            <p>Danach endet die Nacht und der Tag beginnt.</p>
            <p>Nun scheiden alle, die in der Nacht getöt wurden aus.<br />
               Eventuelle rollenspezifische Ereignisse beim Tod dieser Rolle werden nun angewendet.
            </p>
          </li>
          <li style={{"--item-delay": 1.5 + 's' }}>
            <span>Am Tag</span>
            <p>Als erstes kann nun jede/r Spieler/in (auch die Werwölfe und alle, die keine Funktionsrolle haben) eine/n andere/n auf den Verdacht hin,
      dass diese/r ein Werwolf ist, anklagen.</p>
            <p>Ist dies erledigt, kann jede/r Spieler/in seine Stimme an eine/n der Angeklagten abgegen.<br />
               Der/die Angeklagte mit den meisten Stimmen wird getötet und scheidet somit ebenfalls aus.<br />
               Auch jetzt werden rollenspezifische Ereignisse beim Tod dieser Angeklagten Person durchgeführt.
            </p>
            <p>Danach beginnt die Nacht erneut, bis das Spielende eintritt.</p>
          </li>
          <li style={{"--item-delay": 2 + 's' }}>
            <span>Spielende</span>
            <p>Das Spiel endet, wenn mehr Werwölfe am Leben sind als Dorfbewohner/innen (+ Hexe). Dann haben die Werwölfe gewonnen.<br />
               Gibt es keine Werwölfe mehr, die am Leben sind, endet das Spiel ebenfalls. Nun gewinnen allerdings die Dorfbewohner bzw. alle, die keine Werwölfe sind.
            </p>
          </li>
        </ul>
      </main>
    </div>
  );
}

export default Page_HowToPlay;
