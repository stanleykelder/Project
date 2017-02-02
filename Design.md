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