Stanley Kelder
10313540

#Drinkgedrag Congo en Spectrum

##Overzicht
Deze visualisatie geeft inzicht in de aankopen gedaan per tablet in de kamers van de studieverenigingen Congo en Spectrum. De nested circles geven een beeld van de ondelinge verhoudingen. De line graph geeft een beeld van de aankopen per datum en de barchart geeft een beeld van de verschillen per dag van de week.
![alt text](https://github.com/stanleykelder/Project/blob/master/doc/barchart.png)

##Design

###Overzicht
Mijn enige html-file is index.html. Deze staat in de root, zodat mijn pagina te bezichtigen is via github pages. Mijn Javascript files staan in een aparte js map, de CSS file staat in een CSS map en de twee JSONs staan in de map data. 

###In detail
####Styling
files: styling.css

Alle styling staat in 1 CSS file, met comments waar de styling voor is. Dit vond ik het meest overzichtelijk.

####Top bar
files: index.html

In de top bar staat rechts mijn naam. Links staat een 'Welkom!'-button met informatie over gebruik van de visualisatie on hover. in het midden staat een button voor Congo en een button voor Spectrum met wat informatie over de verening bij hover. Ook staat hier wat informatie over wat er uit de visualisatie te halen is. Deze top-bar is volledig gemaakt in html.

####Data
files: circle.json, payments,json, loadData.js

in payments.json staat alle data. Circle.json heb ik handmatig gemaakt om makkelijk in te kunnen laden in de cirkelvisualisatie. In loadData.js wordt alle data ingeladen en in de juiste vorm gezet. Ook wordt hier de cirkelvisualisatie getekend, zodat dit altijd pas gebeurt na het inladen van alle data.

####Cirkels
files: cirles.js circle.json

De data van deze visualisatie komt uit circle.json. De visualisatie zelf is geinspireerd op Mike Bostock's 'Zoomable Circle Packing' (released under the GNU General Public License, version 3). 

De cirkelvisualisatie heeft zowel een hover als een klik. Bij de hover wordt de rand van de cirkel waarover wordt gehoverd zwart gemaakt, en is er in een tooltip te zien wat de naam is van de cirkel. Bij een klik wordt er ingezoomd naar de cirkel waarop wordt geklikt. Daarnaast wordt bij een klik een lijndiagram getekend met de data die horen bij de cirkel waarop is geklikt. Wordt er geklikt op een witte cirkel, dan wordt ook een staafdiagram weergegeven met de data die bij desbetreffende cirkel hoort. De witte cirkels zijn de diepste cirkels en staan voor een specifiek product.

####Lijndiagram
files: linechart.js

De lijndiagram wordt gemaakt wanneer er op een cirkel wordt geklikt. Het tekenen van de lijndiagram bestaat uit 2 delen: het tekenen van de assen en het tekenen van de lijnen. De assen moeten 1 keer getekend worden en de domeinen van de assen worden bepaald circles.js en doorgegeven aan drawAxes in linechart.js. De lijnen worden apart getekend omdat het aantal lijnen afhankelijk is van de cirkel waarop wordt geklikt. 

####Staafdiagram
files: barchart.js

De staafdiagram wordt gemaakt als er op een witte cirkel wordt geklikt. Daarbij heeft de barchart een listener voor de dropdown. In deze dropdown kan gekozen worden tussen de maximale, gemiddelde of totale waarde per dag. Als deze verandert wordt de staafdiagram opnieuw getekend.   

###Overig
####Kleurkeuze
De kleuren van Congo en Spectrum zijn respectievelijk groen en blauw. Daarom heb ik ook gekozen om de visualisaties in deze kleuren te houden. Ik heb ervoor gekozen om verder alleen maar grijstinten te gebruiken. Dit vond ik het mooist overkomnen.

####Intuitief
Ik heb geprobeerd het gebruik van de visualisatie zo intuitief mogelijk te laten zijn. Zo verandert bijvoorbeeld de cursor altijd in een pointer als je kan klikken, en verandert hij anders niet in een pointer. Onder de welkom knop heb ik verder uitleg gegeven hoe de visualisatie in elkaar zit en onder de knoppen van de studieverenigingen een korte uitleg over wat voor verenigingen het zijn, met link naar hun website en enkele grappige dingen die je uit de visualisatie kan halen.

####W3 template
Voor de algemene css, de opmaak van de pagina, heb ik een template gebruikt van W3schools. Onderaan de pagina heb ik een vermelding hiervan laten staan. Ik heb dit in eerste instantie gebruikt zodat de grafieken niet zouden overlappen bij het inzoomen, maar dat ben ik op een gegeven moment uit het oog verloren en toen was deze functionaliteit verloren. Omdat ik het toen toch al allemaal in deze template had gemaakt, en ik het er verder mooi uit vind zien, heb ik besloten dit wel te behouden.

###Tussentijdse veranderingen en beslissingen
In eerste instantie wilde ik in de staafdiagram een visualisatie maken van de gebruikers die dingen kochten. Ik zou dan op verschillende dingen vergelijken, bijvoorbeeld op de verhouding tussen mannen en vrouwen, of op leeftijd. Ik heb uiteindelijk besloten dit niet te doen omdat het mij te veel tijd zou kosten. 

###Het perfecte product
Als ik nog meer tijd zou hebben, dan zou ik het allemaal natuurlijk nog veel mooier kunnen maken. Ten eerste zou ik dan natuurlijk wel de staafdiagram maken met vergelijkingen tussen gebruikers. Ik zou sowieso meer opties willen om te vergelijken. Staven van Congo en Spectrum per dag naast elkaar bijvoorbeeld, zodat er vergeleken kan worden wat de vershillen zijn. 

Het perfecte product zou verder niet een JSON inlezen maar gekoppeld zijn aan een MongoDB database. Op deze manier zou de informatie ook nog eens live ge-update kunnen worden. De eerste week heb ik naar mogelijkheden hiervoor gekeken, maar heb ik besloten dat dit te veel tijd zou kosten om uit te zoeken.

Verder kan de css ook nog beter. Op telefoons zijn de hoverbuttons niet te zien, en op een laptop is de visualisatie niet goed scalable. 

En nog een puntje dat gedaan zou moeten worden. Er worden nu bepaalde data overgeslagen omdat die niet voorkomen in de dataset. Hier wordt tussen geinterpoleerd in de lijndiagram maar dat geeft een verkeerd beeld. Deze ontbrekende data zouden moeten worden toegevoegd met 0 waardes aan de dataset.

Als laatste, en tevens het eerste wat ik zou implementeren: de dropdown moet verdwijnen als de staafdiagram niet in beeld is. Nu staat de dropdown er altijd, terwijl hij alleen nut heeft als de staafdiagram er is, dat is vervelend.

Ik heb al gehoord dat de verenigingen de visualisaties wel interessant vinden. Misschien ga ik deze punten dus nog wel verwerken in de toekomst zodat mijn visualisaties gebruit kunnen worden door de verenigingen!

