// Comprehensive European airports dataset
// Fields: iata, name, city, country, countryCode
const europeanAirports = [
  // United Kingdom
  { iata: "LHR", name: "Heathrow Airport", city: "London", country: "United Kingdom", countryCode: "GB" },
  { iata: "LGW", name: "Gatwick Airport", city: "London", country: "United Kingdom", countryCode: "GB" },
  { iata: "STN", name: "Stansted Airport", city: "London", country: "United Kingdom", countryCode: "GB" },
  { iata: "LTN", name: "Luton Airport", city: "London", country: "United Kingdom", countryCode: "GB" },
  { iata: "LCY", name: "City Airport", city: "London", country: "United Kingdom", countryCode: "GB" },
  { iata: "SEN", name: "Southend Airport", city: "London", country: "United Kingdom", countryCode: "GB" },
  { iata: "MAN", name: "Manchester Airport", city: "Manchester", country: "United Kingdom", countryCode: "GB" },
  { iata: "BHX", name: "Birmingham Airport", city: "Birmingham", country: "United Kingdom", countryCode: "GB" },
  { iata: "EDI", name: "Edinburgh Airport", city: "Edinburgh", country: "United Kingdom", countryCode: "GB" },
  { iata: "GLA", name: "Glasgow Airport", city: "Glasgow", country: "United Kingdom", countryCode: "GB" },
  { iata: "BRS", name: "Bristol Airport", city: "Bristol", country: "United Kingdom", countryCode: "GB" },
  { iata: "LPL", name: "John Lennon Airport", city: "Liverpool", country: "United Kingdom", countryCode: "GB" },
  { iata: "NCL", name: "Newcastle Airport", city: "Newcastle", country: "United Kingdom", countryCode: "GB" },
  { iata: "BFS", name: "Belfast International Airport", city: "Belfast", country: "United Kingdom", countryCode: "GB" },
  { iata: "EMA", name: "East Midlands Airport", city: "Nottingham", country: "United Kingdom", countryCode: "GB" },
  { iata: "LBA", name: "Leeds Bradford Airport", city: "Leeds", country: "United Kingdom", countryCode: "GB" },
  { iata: "ABZ", name: "Aberdeen Airport", city: "Aberdeen", country: "United Kingdom", countryCode: "GB" },
  { iata: "CWL", name: "Cardiff Airport", city: "Cardiff", country: "United Kingdom", countryCode: "GB" },

  // Germany
  { iata: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany", countryCode: "DE" },
  { iata: "MUC", name: "Munich Airport", city: "Munich", country: "Germany", countryCode: "DE" },
  { iata: "BER", name: "Berlin Brandenburg Airport", city: "Berlin", country: "Germany", countryCode: "DE" },
  { iata: "DUS", name: "Dusseldorf Airport", city: "Dusseldorf", country: "Germany", countryCode: "DE" },
  { iata: "HAM", name: "Hamburg Airport", city: "Hamburg", country: "Germany", countryCode: "DE" },
  { iata: "CGN", name: "Cologne Bonn Airport", city: "Cologne", country: "Germany", countryCode: "DE" },
  { iata: "STR", name: "Stuttgart Airport", city: "Stuttgart", country: "Germany", countryCode: "DE" },
  { iata: "HAJ", name: "Hannover Airport", city: "Hannover", country: "Germany", countryCode: "DE" },
  { iata: "NUE", name: "Nuremberg Airport", city: "Nuremberg", country: "Germany", countryCode: "DE" },
  { iata: "LEJ", name: "Leipzig/Halle Airport", city: "Leipzig", country: "Germany", countryCode: "DE" },
  { iata: "BRE", name: "Bremen Airport", city: "Bremen", country: "Germany", countryCode: "DE" },
  { iata: "DTM", name: "Dortmund Airport", city: "Dortmund", country: "Germany", countryCode: "DE" },
  { iata: "DRS", name: "Dresden Airport", city: "Dresden", country: "Germany", countryCode: "DE" },

  // France
  { iata: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France", countryCode: "FR" },
  { iata: "ORY", name: "Orly Airport", city: "Paris", country: "France", countryCode: "FR" },
  { iata: "NCE", name: "Nice Cote d'Azur Airport", city: "Nice", country: "France", countryCode: "FR" },
  { iata: "LYS", name: "Lyon-Saint Exupery Airport", city: "Lyon", country: "France", countryCode: "FR" },
  { iata: "MRS", name: "Marseille Provence Airport", city: "Marseille", country: "France", countryCode: "FR" },
  { iata: "TLS", name: "Toulouse-Blagnac Airport", city: "Toulouse", country: "France", countryCode: "FR" },
  { iata: "BOD", name: "Bordeaux-Merignac Airport", city: "Bordeaux", country: "France", countryCode: "FR" },
  { iata: "NTE", name: "Nantes Atlantique Airport", city: "Nantes", country: "France", countryCode: "FR" },
  { iata: "SXB", name: "Strasbourg Airport", city: "Strasbourg", country: "France", countryCode: "FR" },
  { iata: "LIL", name: "Lille Airport", city: "Lille", country: "France", countryCode: "FR" },
  { iata: "MPL", name: "Montpellier Airport", city: "Montpellier", country: "France", countryCode: "FR" },
  { iata: "BIA", name: "Bastia-Poretta Airport", city: "Bastia", country: "France", countryCode: "FR" },
  { iata: "AJA", name: "Ajaccio Napoleon Bonaparte Airport", city: "Ajaccio", country: "France", countryCode: "FR" },

  // Spain
  { iata: "MAD", name: "Adolfo Suarez Madrid-Barajas Airport", city: "Madrid", country: "Spain", countryCode: "ES" },
  { iata: "BCN", name: "Barcelona-El Prat Airport", city: "Barcelona", country: "Spain", countryCode: "ES" },
  { iata: "PMI", name: "Palma de Mallorca Airport", city: "Palma de Mallorca", country: "Spain", countryCode: "ES" },
  { iata: "AGP", name: "Malaga-Costa del Sol Airport", city: "Malaga", country: "Spain", countryCode: "ES" },
  { iata: "ALC", name: "Alicante-Elche Airport", city: "Alicante", country: "Spain", countryCode: "ES" },
  { iata: "TFS", name: "Tenerife South Airport", city: "Tenerife", country: "Spain", countryCode: "ES" },
  { iata: "LPA", name: "Gran Canaria Airport", city: "Las Palmas", country: "Spain", countryCode: "ES" },
  { iata: "IBZ", name: "Ibiza Airport", city: "Ibiza", country: "Spain", countryCode: "ES" },
  { iata: "VLC", name: "Valencia Airport", city: "Valencia", country: "Spain", countryCode: "ES" },
  { iata: "SVQ", name: "Seville Airport", city: "Seville", country: "Spain", countryCode: "ES" },
  { iata: "BIO", name: "Bilbao Airport", city: "Bilbao", country: "Spain", countryCode: "ES" },
  { iata: "ACE", name: "Lanzarote Airport", city: "Lanzarote", country: "Spain", countryCode: "ES" },
  { iata: "FUE", name: "Fuerteventura Airport", city: "Fuerteventura", country: "Spain", countryCode: "ES" },
  { iata: "GRO", name: "Girona-Costa Brava Airport", city: "Girona", country: "Spain", countryCode: "ES" },

  // Italy
  { iata: "FCO", name: "Leonardo da Vinci-Fiumicino Airport", city: "Rome", country: "Italy", countryCode: "IT" },
  { iata: "CIA", name: "Rome Ciampino Airport", city: "Rome", country: "Italy", countryCode: "IT" },
  { iata: "MXP", name: "Milan Malpensa Airport", city: "Milan", country: "Italy", countryCode: "IT" },
  { iata: "LIN", name: "Milan Linate Airport", city: "Milan", country: "Italy", countryCode: "IT" },
  { iata: "BGY", name: "Milan Bergamo Airport", city: "Bergamo", country: "Italy", countryCode: "IT" },
  { iata: "VCE", name: "Venice Marco Polo Airport", city: "Venice", country: "Italy", countryCode: "IT" },
  { iata: "NAP", name: "Naples International Airport", city: "Naples", country: "Italy", countryCode: "IT" },
  { iata: "BLQ", name: "Bologna Guglielmo Marconi Airport", city: "Bologna", country: "Italy", countryCode: "IT" },
  { iata: "CTA", name: "Catania-Fontanarossa Airport", city: "Catania", country: "Italy", countryCode: "IT" },
  { iata: "PMO", name: "Palermo Falcone-Borsellino Airport", city: "Palermo", country: "Italy", countryCode: "IT" },
  { iata: "FLR", name: "Florence Airport", city: "Florence", country: "Italy", countryCode: "IT" },
  { iata: "PSA", name: "Pisa International Airport", city: "Pisa", country: "Italy", countryCode: "IT" },
  { iata: "TRN", name: "Turin Airport", city: "Turin", country: "Italy", countryCode: "IT" },
  { iata: "BRI", name: "Bari Karol Wojtyla Airport", city: "Bari", country: "Italy", countryCode: "IT" },
  { iata: "VRN", name: "Verona Villafranca Airport", city: "Verona", country: "Italy", countryCode: "IT" },
  { iata: "CAG", name: "Cagliari Elmas Airport", city: "Cagliari", country: "Italy", countryCode: "IT" },
  { iata: "OLB", name: "Olbia Costa Smeralda Airport", city: "Olbia", country: "Italy", countryCode: "IT" },

  // Netherlands
  { iata: "AMS", name: "Amsterdam Schiphol Airport", city: "Amsterdam", country: "Netherlands", countryCode: "NL" },
  { iata: "EIN", name: "Eindhoven Airport", city: "Eindhoven", country: "Netherlands", countryCode: "NL" },
  { iata: "RTM", name: "Rotterdam The Hague Airport", city: "Rotterdam", country: "Netherlands", countryCode: "NL" },

  // Belgium
  { iata: "BRU", name: "Brussels Airport", city: "Brussels", country: "Belgium", countryCode: "BE" },
  { iata: "CRL", name: "Brussels South Charleroi Airport", city: "Charleroi", country: "Belgium", countryCode: "BE" },
  { iata: "ANR", name: "Antwerp International Airport", city: "Antwerp", country: "Belgium", countryCode: "BE" },

  // Switzerland
  { iata: "ZRH", name: "Zurich Airport", city: "Zurich", country: "Switzerland", countryCode: "CH" },
  { iata: "GVA", name: "Geneva Airport", city: "Geneva", country: "Switzerland", countryCode: "CH" },
  { iata: "BSL", name: "EuroAirport Basel-Mulhouse", city: "Basel", country: "Switzerland", countryCode: "CH" },

  // Austria
  { iata: "VIE", name: "Vienna International Airport", city: "Vienna", country: "Austria", countryCode: "AT" },
  { iata: "SZG", name: "Salzburg Airport", city: "Salzburg", country: "Austria", countryCode: "AT" },
  { iata: "INN", name: "Innsbruck Airport", city: "Innsbruck", country: "Austria", countryCode: "AT" },
  { iata: "GRZ", name: "Graz Airport", city: "Graz", country: "Austria", countryCode: "AT" },

  // Portugal
  { iata: "LIS", name: "Lisbon Humberto Delgado Airport", city: "Lisbon", country: "Portugal", countryCode: "PT" },
  { iata: "OPO", name: "Porto Airport", city: "Porto", country: "Portugal", countryCode: "PT" },
  { iata: "FAO", name: "Faro Airport", city: "Faro", country: "Portugal", countryCode: "PT" },
  { iata: "FNC", name: "Madeira Airport", city: "Funchal", country: "Portugal", countryCode: "PT" },
  { iata: "PDL", name: "Ponta Delgada Airport", city: "Ponta Delgada", country: "Portugal", countryCode: "PT" },

  // Ireland
  { iata: "DUB", name: "Dublin Airport", city: "Dublin", country: "Ireland", countryCode: "IE" },
  { iata: "SNN", name: "Shannon Airport", city: "Shannon", country: "Ireland", countryCode: "IE" },
  { iata: "ORK", name: "Cork Airport", city: "Cork", country: "Ireland", countryCode: "IE" },
  { iata: "KNO", name: "Ireland West Knock Airport", city: "Knock", country: "Ireland", countryCode: "IE" },

  // Scandinavia - Denmark
  { iata: "CPH", name: "Copenhagen Airport", city: "Copenhagen", country: "Denmark", countryCode: "DK" },
  { iata: "BLL", name: "Billund Airport", city: "Billund", country: "Denmark", countryCode: "DK" },
  { iata: "AAL", name: "Aalborg Airport", city: "Aalborg", country: "Denmark", countryCode: "DK" },

  // Scandinavia - Sweden
  { iata: "ARN", name: "Stockholm Arlanda Airport", city: "Stockholm", country: "Sweden", countryCode: "SE" },
  { iata: "GOT", name: "Gothenburg Landvetter Airport", city: "Gothenburg", country: "Sweden", countryCode: "SE" },
  { iata: "MMX", name: "Malmo Airport", city: "Malmo", country: "Sweden", countryCode: "SE" },
  { iata: "NYO", name: "Stockholm Skavsta Airport", city: "Stockholm", country: "Sweden", countryCode: "SE" },

  // Scandinavia - Norway
  { iata: "OSL", name: "Oslo Gardermoen Airport", city: "Oslo", country: "Norway", countryCode: "NO" },
  { iata: "BGO", name: "Bergen Flesland Airport", city: "Bergen", country: "Norway", countryCode: "NO" },
  { iata: "TRD", name: "Trondheim Airport", city: "Trondheim", country: "Norway", countryCode: "NO" },
  { iata: "SVG", name: "Stavanger Sola Airport", city: "Stavanger", country: "Norway", countryCode: "NO" },
  { iata: "TOS", name: "Tromso Langnes Airport", city: "Tromso", country: "Norway", countryCode: "NO" },

  // Scandinavia - Finland
  { iata: "HEL", name: "Helsinki-Vantaa Airport", city: "Helsinki", country: "Finland", countryCode: "FI" },
  { iata: "TMP", name: "Tampere-Pirkkala Airport", city: "Tampere", country: "Finland", countryCode: "FI" },
  { iata: "TKU", name: "Turku Airport", city: "Turku", country: "Finland", countryCode: "FI" },
  { iata: "OUL", name: "Oulu Airport", city: "Oulu", country: "Finland", countryCode: "FI" },
  { iata: "RVN", name: "Rovaniemi Airport", city: "Rovaniemi", country: "Finland", countryCode: "FI" },

  // Iceland
  { iata: "KEF", name: "Keflavik International Airport", city: "Reykjavik", country: "Iceland", countryCode: "IS" },

  // Greece
  { iata: "ATH", name: "Athens International Airport", city: "Athens", country: "Greece", countryCode: "GR" },
  { iata: "SKG", name: "Thessaloniki Airport", city: "Thessaloniki", country: "Greece", countryCode: "GR" },
  { iata: "HER", name: "Heraklion Airport", city: "Heraklion", country: "Greece", countryCode: "GR" },
  { iata: "RHO", name: "Rhodes International Airport", city: "Rhodes", country: "Greece", countryCode: "GR" },
  { iata: "CFU", name: "Corfu International Airport", city: "Corfu", country: "Greece", countryCode: "GR" },
  { iata: "CHQ", name: "Chania International Airport", city: "Chania", country: "Greece", countryCode: "GR" },
  { iata: "KGS", name: "Kos Island Airport", city: "Kos", country: "Greece", countryCode: "GR" },
  { iata: "JMK", name: "Mykonos Airport", city: "Mykonos", country: "Greece", countryCode: "GR" },
  { iata: "JTR", name: "Santorini Airport", city: "Santorini", country: "Greece", countryCode: "GR" },
  { iata: "ZTH", name: "Zakynthos Airport", city: "Zakynthos", country: "Greece", countryCode: "GR" },
  { iata: "KVA", name: "Kavala Alexander the Great Airport", city: "Kavala", country: "Greece", countryCode: "GR" },

  // Turkey
  { iata: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey", countryCode: "TR" },
  { iata: "SAW", name: "Istanbul Sabiha Gokcen Airport", city: "Istanbul", country: "Turkey", countryCode: "TR" },
  { iata: "ESB", name: "Ankara Esenboga Airport", city: "Ankara", country: "Turkey", countryCode: "TR" },
  { iata: "AYT", name: "Antalya Airport", city: "Antalya", country: "Turkey", countryCode: "TR" },
  { iata: "ADB", name: "Izmir Adnan Menderes Airport", city: "Izmir", country: "Turkey", countryCode: "TR" },
  { iata: "DLM", name: "Dalaman Airport", city: "Dalaman", country: "Turkey", countryCode: "TR" },
  { iata: "BJV", name: "Milas-Bodrum Airport", city: "Bodrum", country: "Turkey", countryCode: "TR" },

  // Poland
  { iata: "WAW", name: "Warsaw Chopin Airport", city: "Warsaw", country: "Poland", countryCode: "PL" },
  { iata: "WMI", name: "Warsaw Modlin Airport", city: "Warsaw", country: "Poland", countryCode: "PL" },
  { iata: "KRK", name: "Krakow John Paul II Airport", city: "Krakow", country: "Poland", countryCode: "PL" },
  { iata: "GDN", name: "Gdansk Lech Walesa Airport", city: "Gdansk", country: "Poland", countryCode: "PL" },
  { iata: "WRO", name: "Wroclaw Airport", city: "Wroclaw", country: "Poland", countryCode: "PL" },
  { iata: "KTW", name: "Katowice Airport", city: "Katowice", country: "Poland", countryCode: "PL" },
  { iata: "POZ", name: "Poznan Lawica Airport", city: "Poznan", country: "Poland", countryCode: "PL" },
  { iata: "RZE", name: "Rzeszow-Jasionka Airport", city: "Rzeszow", country: "Poland", countryCode: "PL" },

  // Czech Republic
  { iata: "PRG", name: "Vaclav Havel Prague Airport", city: "Prague", country: "Czech Republic", countryCode: "CZ" },
  { iata: "BRQ", name: "Brno-Turany Airport", city: "Brno", country: "Czech Republic", countryCode: "CZ" },

  // Hungary
  { iata: "BUD", name: "Budapest Ferenc Liszt Airport", city: "Budapest", country: "Hungary", countryCode: "HU" },

  // Romania
  { iata: "OTP", name: "Bucharest Henri Coanda Airport", city: "Bucharest", country: "Romania", countryCode: "RO" },
  { iata: "CLJ", name: "Cluj-Napoca Airport", city: "Cluj-Napoca", country: "Romania", countryCode: "RO" },
  { iata: "TSR", name: "Timisoara Traian Vuia Airport", city: "Timisoara", country: "Romania", countryCode: "RO" },
  { iata: "IAS", name: "Iasi International Airport", city: "Iasi", country: "Romania", countryCode: "RO" },
  { iata: "SBZ", name: "Sibiu International Airport", city: "Sibiu", country: "Romania", countryCode: "RO" },

  // Bulgaria
  { iata: "SOF", name: "Sofia Airport", city: "Sofia", country: "Bulgaria", countryCode: "BG" },
  { iata: "BOJ", name: "Burgas Airport", city: "Burgas", country: "Bulgaria", countryCode: "BG" },
  { iata: "VAR", name: "Varna Airport", city: "Varna", country: "Bulgaria", countryCode: "BG" },
  { iata: "PDV", name: "Plovdiv Airport", city: "Plovdiv", country: "Bulgaria", countryCode: "BG" },

  // Croatia
  { iata: "ZAG", name: "Zagreb Franjo Tudman Airport", city: "Zagreb", country: "Croatia", countryCode: "HR" },
  { iata: "SPU", name: "Split Airport", city: "Split", country: "Croatia", countryCode: "HR" },
  { iata: "DBV", name: "Dubrovnik Airport", city: "Dubrovnik", country: "Croatia", countryCode: "HR" },
  { iata: "ZAD", name: "Zadar Airport", city: "Zadar", country: "Croatia", countryCode: "HR" },
  { iata: "PUY", name: "Pula Airport", city: "Pula", country: "Croatia", countryCode: "HR" },

  // Serbia
  { iata: "BEG", name: "Belgrade Nikola Tesla Airport", city: "Belgrade", country: "Serbia", countryCode: "RS" },
  { iata: "INI", name: "Nis Constantine the Great Airport", city: "Nis", country: "Serbia", countryCode: "RS" },

  // Slovenia
  { iata: "LJU", name: "Ljubljana Joze Pucnik Airport", city: "Ljubljana", country: "Slovenia", countryCode: "SI" },

  // Slovakia
  { iata: "BTS", name: "Bratislava M. R. Stefanik Airport", city: "Bratislava", country: "Slovakia", countryCode: "SK" },
  { iata: "KSC", name: "Kosice International Airport", city: "Kosice", country: "Slovakia", countryCode: "SK" },

  // Baltic States
  { iata: "RIX", name: "Riga International Airport", city: "Riga", country: "Latvia", countryCode: "LV" },
  { iata: "VNO", name: "Vilnius Airport", city: "Vilnius", country: "Lithuania", countryCode: "LT" },
  { iata: "KUN", name: "Kaunas Airport", city: "Kaunas", country: "Lithuania", countryCode: "LT" },
  { iata: "TLL", name: "Tallinn Airport", city: "Tallinn", country: "Estonia", countryCode: "EE" },

  // Cyprus
  { iata: "LCA", name: "Larnaca International Airport", city: "Larnaca", country: "Cyprus", countryCode: "CY" },
  { iata: "PFO", name: "Paphos International Airport", city: "Paphos", country: "Cyprus", countryCode: "CY" },

  // Malta
  { iata: "MLA", name: "Malta International Airport", city: "Valletta", country: "Malta", countryCode: "MT" },

  // Luxembourg
  { iata: "LUX", name: "Luxembourg Findel Airport", city: "Luxembourg", country: "Luxembourg", countryCode: "LU" },

  // Montenegro
  { iata: "TGD", name: "Podgorica Airport", city: "Podgorica", country: "Montenegro", countryCode: "ME" },
  { iata: "TIV", name: "Tivat Airport", city: "Tivat", country: "Montenegro", countryCode: "ME" },

  // North Macedonia
  { iata: "SKP", name: "Skopje Alexander the Great Airport", city: "Skopje", country: "North Macedonia", countryCode: "MK" },
  { iata: "OHD", name: "Ohrid St. Paul the Apostle Airport", city: "Ohrid", country: "North Macedonia", countryCode: "MK" },

  // Albania
  { iata: "TIA", name: "Tirana International Airport", city: "Tirana", country: "Albania", countryCode: "AL" },

  // Bosnia and Herzegovina
  { iata: "SJJ", name: "Sarajevo International Airport", city: "Sarajevo", country: "Bosnia and Herzegovina", countryCode: "BA" },

  // Kosovo
  { iata: "PRN", name: "Pristina International Airport", city: "Pristina", country: "Kosovo", countryCode: "XK" },

  // Moldova
  { iata: "KIV", name: "Chisinau International Airport", city: "Chisinau", country: "Moldova", countryCode: "MD" },

  // Ukraine
  { iata: "KBP", name: "Boryspil International Airport", city: "Kyiv", country: "Ukraine", countryCode: "UA" },
  { iata: "IEV", name: "Kyiv Zhuliany Airport", city: "Kyiv", country: "Ukraine", countryCode: "UA" },
  { iata: "LWO", name: "Lviv Danylo Halytskyi Airport", city: "Lviv", country: "Ukraine", countryCode: "UA" },
  { iata: "ODS", name: "Odesa International Airport", city: "Odesa", country: "Ukraine", countryCode: "UA" },
];

export default europeanAirports;
