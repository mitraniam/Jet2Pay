// Global airports dataset
// Fields: iata, name, city, country, countryCode
const europeanAirports = [

  // ── EUROPE ──────────────────────────────────────────

  // United Kingdom
  { iata: "LHR", name: "Heathrow Airport", city: "London", country: "United Kingdom", countryCode: "GB" },
  { iata: "LGW", name: "Gatwick Airport", city: "London", country: "United Kingdom", countryCode: "GB" },
  { iata: "STN", name: "Stansted Airport", city: "London", country: "United Kingdom", countryCode: "GB" },
  { iata: "LTN", name: "Luton Airport", city: "London", country: "United Kingdom", countryCode: "GB" },
  { iata: "LCY", name: "City Airport", city: "London", country: "United Kingdom", countryCode: "GB" },
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

  // Netherlands
  { iata: "AMS", name: "Amsterdam Schiphol Airport", city: "Amsterdam", country: "Netherlands", countryCode: "NL" },
  { iata: "EIN", name: "Eindhoven Airport", city: "Eindhoven", country: "Netherlands", countryCode: "NL" },
  { iata: "RTM", name: "Rotterdam The Hague Airport", city: "Rotterdam", country: "Netherlands", countryCode: "NL" },

  // Belgium
  { iata: "BRU", name: "Brussels Airport", city: "Brussels", country: "Belgium", countryCode: "BE" },
  { iata: "CRL", name: "Brussels South Charleroi Airport", city: "Charleroi", country: "Belgium", countryCode: "BE" },

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

  // Ireland
  { iata: "DUB", name: "Dublin Airport", city: "Dublin", country: "Ireland", countryCode: "IE" },
  { iata: "SNN", name: "Shannon Airport", city: "Shannon", country: "Ireland", countryCode: "IE" },
  { iata: "ORK", name: "Cork Airport", city: "Cork", country: "Ireland", countryCode: "IE" },

  // Scandinavia
  { iata: "CPH", name: "Copenhagen Airport", city: "Copenhagen", country: "Denmark", countryCode: "DK" },
  { iata: "BLL", name: "Billund Airport", city: "Billund", country: "Denmark", countryCode: "DK" },
  { iata: "ARN", name: "Stockholm Arlanda Airport", city: "Stockholm", country: "Sweden", countryCode: "SE" },
  { iata: "GOT", name: "Gothenburg Landvetter Airport", city: "Gothenburg", country: "Sweden", countryCode: "SE" },
  { iata: "MMX", name: "Malmo Airport", city: "Malmo", country: "Sweden", countryCode: "SE" },
  { iata: "OSL", name: "Oslo Gardermoen Airport", city: "Oslo", country: "Norway", countryCode: "NO" },
  { iata: "BGO", name: "Bergen Flesland Airport", city: "Bergen", country: "Norway", countryCode: "NO" },
  { iata: "TRD", name: "Trondheim Airport", city: "Trondheim", country: "Norway", countryCode: "NO" },
  { iata: "SVG", name: "Stavanger Sola Airport", city: "Stavanger", country: "Norway", countryCode: "NO" },
  { iata: "HEL", name: "Helsinki-Vantaa Airport", city: "Helsinki", country: "Finland", countryCode: "FI" },
  { iata: "TMP", name: "Tampere-Pirkkala Airport", city: "Tampere", country: "Finland", countryCode: "FI" },
  { iata: "OUL", name: "Oulu Airport", city: "Oulu", country: "Finland", countryCode: "FI" },
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
  { iata: "KRK", name: "Krakow John Paul II Airport", city: "Krakow", country: "Poland", countryCode: "PL" },
  { iata: "GDN", name: "Gdansk Lech Walesa Airport", city: "Gdansk", country: "Poland", countryCode: "PL" },
  { iata: "WRO", name: "Wroclaw Airport", city: "Wroclaw", country: "Poland", countryCode: "PL" },
  { iata: "KTW", name: "Katowice Airport", city: "Katowice", country: "Poland", countryCode: "PL" },
  { iata: "POZ", name: "Poznan Lawica Airport", city: "Poznan", country: "Poland", countryCode: "PL" },

  // Czech Republic
  { iata: "PRG", name: "Vaclav Havel Prague Airport", city: "Prague", country: "Czech Republic", countryCode: "CZ" },

  // Hungary
  { iata: "BUD", name: "Budapest Ferenc Liszt Airport", city: "Budapest", country: "Hungary", countryCode: "HU" },

  // Romania
  { iata: "OTP", name: "Bucharest Henri Coanda Airport", city: "Bucharest", country: "Romania", countryCode: "RO" },
  { iata: "CLJ", name: "Cluj-Napoca Airport", city: "Cluj-Napoca", country: "Romania", countryCode: "RO" },
  { iata: "TSR", name: "Timisoara Traian Vuia Airport", city: "Timisoara", country: "Romania", countryCode: "RO" },
  { iata: "IAS", name: "Iasi International Airport", city: "Iasi", country: "Romania", countryCode: "RO" },

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

  // Serbia
  { iata: "BEG", name: "Belgrade Nikola Tesla Airport", city: "Belgrade", country: "Serbia", countryCode: "RS" },

  // Slovenia
  { iata: "LJU", name: "Ljubljana Joze Pucnik Airport", city: "Ljubljana", country: "Slovenia", countryCode: "SI" },

  // Slovakia
  { iata: "BTS", name: "Bratislava M. R. Stefanik Airport", city: "Bratislava", country: "Slovakia", countryCode: "SK" },

  // Baltic States
  { iata: "RIX", name: "Riga International Airport", city: "Riga", country: "Latvia", countryCode: "LV" },
  { iata: "VNO", name: "Vilnius Airport", city: "Vilnius", country: "Lithuania", countryCode: "LT" },
  { iata: "TLL", name: "Tallinn Airport", city: "Tallinn", country: "Estonia", countryCode: "EE" },

  // Cyprus / Malta / Luxembourg
  { iata: "LCA", name: "Larnaca International Airport", city: "Larnaca", country: "Cyprus", countryCode: "CY" },
  { iata: "PFO", name: "Paphos International Airport", city: "Paphos", country: "Cyprus", countryCode: "CY" },
  { iata: "MLA", name: "Malta International Airport", city: "Valletta", country: "Malta", countryCode: "MT" },
  { iata: "LUX", name: "Luxembourg Findel Airport", city: "Luxembourg", country: "Luxembourg", countryCode: "LU" },

  // Balkans
  { iata: "TGD", name: "Podgorica Airport", city: "Podgorica", country: "Montenegro", countryCode: "ME" },
  { iata: "TIV", name: "Tivat Airport", city: "Tivat", country: "Montenegro", countryCode: "ME" },
  { iata: "SKP", name: "Skopje Alexander the Great Airport", city: "Skopje", country: "North Macedonia", countryCode: "MK" },
  { iata: "TIA", name: "Tirana International Airport", city: "Tirana", country: "Albania", countryCode: "AL" },
  { iata: "SJJ", name: "Sarajevo International Airport", city: "Sarajevo", country: "Bosnia and Herzegovina", countryCode: "BA" },
  { iata: "PRN", name: "Pristina International Airport", city: "Pristina", country: "Kosovo", countryCode: "XK" },

  // Ukraine / Moldova
  { iata: "KBP", name: "Boryspil International Airport", city: "Kyiv", country: "Ukraine", countryCode: "UA" },
  { iata: "LWO", name: "Lviv Danylo Halytskyi Airport", city: "Lviv", country: "Ukraine", countryCode: "UA" },
  { iata: "KIV", name: "Chisinau International Airport", city: "Chisinau", country: "Moldova", countryCode: "MD" },

  // Russia
  { iata: "SVO", name: "Sheremetyevo International Airport", city: "Moscow", country: "Russia", countryCode: "RU" },
  { iata: "DME", name: "Domodedovo International Airport", city: "Moscow", country: "Russia", countryCode: "RU" },
  { iata: "VKO", name: "Vnukovo International Airport", city: "Moscow", country: "Russia", countryCode: "RU" },
  { iata: "LED", name: "Pulkovo Airport", city: "St. Petersburg", country: "Russia", countryCode: "RU" },

  // ── NORTH AMERICA ───────────────────────────────────

  // USA — Northeast
  { iata: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "United States", countryCode: "US" },
  { iata: "LGA", name: "LaGuardia Airport", city: "New York", country: "United States", countryCode: "US" },
  { iata: "EWR", name: "Newark Liberty International Airport", city: "Newark", country: "United States", countryCode: "US" },
  { iata: "BOS", name: "Logan International Airport", city: "Boston", country: "United States", countryCode: "US" },
  { iata: "PHL", name: "Philadelphia International Airport", city: "Philadelphia", country: "United States", countryCode: "US" },
  { iata: "IAD", name: "Dulles International Airport", city: "Washington D.C.", country: "United States", countryCode: "US" },
  { iata: "DCA", name: "Ronald Reagan Washington National Airport", city: "Washington D.C.", country: "United States", countryCode: "US" },
  { iata: "BWI", name: "Baltimore/Washington International Airport", city: "Baltimore", country: "United States", countryCode: "US" },
  { iata: "BDL", name: "Bradley International Airport", city: "Hartford", country: "United States", countryCode: "US" },

  // USA — Southeast
  { iata: "ATL", name: "Hartsfield-Jackson Atlanta International Airport", city: "Atlanta", country: "United States", countryCode: "US" },
  { iata: "MIA", name: "Miami International Airport", city: "Miami", country: "United States", countryCode: "US" },
  { iata: "FLL", name: "Fort Lauderdale-Hollywood International Airport", city: "Fort Lauderdale", country: "United States", countryCode: "US" },
  { iata: "MCO", name: "Orlando International Airport", city: "Orlando", country: "United States", countryCode: "US" },
  { iata: "TPA", name: "Tampa International Airport", city: "Tampa", country: "United States", countryCode: "US" },
  { iata: "CLT", name: "Charlotte Douglas International Airport", city: "Charlotte", country: "United States", countryCode: "US" },
  { iata: "RDU", name: "Raleigh-Durham International Airport", city: "Raleigh", country: "United States", countryCode: "US" },
  { iata: "MSY", name: "Louis Armstrong New Orleans International Airport", city: "New Orleans", country: "United States", countryCode: "US" },
  { iata: "BNA", name: "Nashville International Airport", city: "Nashville", country: "United States", countryCode: "US" },

  // USA — Midwest
  { iata: "ORD", name: "O'Hare International Airport", city: "Chicago", country: "United States", countryCode: "US" },
  { iata: "MDW", name: "Chicago Midway International Airport", city: "Chicago", country: "United States", countryCode: "US" },
  { iata: "DTW", name: "Detroit Metropolitan Wayne County Airport", city: "Detroit", country: "United States", countryCode: "US" },
  { iata: "MSP", name: "Minneapolis-Saint Paul International Airport", city: "Minneapolis", country: "United States", countryCode: "US" },
  { iata: "STL", name: "St. Louis Lambert International Airport", city: "St. Louis", country: "United States", countryCode: "US" },
  { iata: "CMH", name: "John Glenn Columbus International Airport", city: "Columbus", country: "United States", countryCode: "US" },
  { iata: "CLE", name: "Cleveland Hopkins International Airport", city: "Cleveland", country: "United States", countryCode: "US" },
  { iata: "IND", name: "Indianapolis International Airport", city: "Indianapolis", country: "United States", countryCode: "US" },
  { iata: "MKE", name: "Milwaukee Mitchell International Airport", city: "Milwaukee", country: "United States", countryCode: "US" },
  { iata: "CVG", name: "Cincinnati/Northern Kentucky International Airport", city: "Cincinnati", country: "United States", countryCode: "US" },

  // USA — South Central
  { iata: "DFW", name: "Dallas/Fort Worth International Airport", city: "Dallas", country: "United States", countryCode: "US" },
  { iata: "DAL", name: "Dallas Love Field", city: "Dallas", country: "United States", countryCode: "US" },
  { iata: "IAH", name: "George Bush Intercontinental Airport", city: "Houston", country: "United States", countryCode: "US" },
  { iata: "HOU", name: "William P. Hobby Airport", city: "Houston", country: "United States", countryCode: "US" },
  { iata: "AUS", name: "Austin-Bergstrom International Airport", city: "Austin", country: "United States", countryCode: "US" },
  { iata: "SAT", name: "San Antonio International Airport", city: "San Antonio", country: "United States", countryCode: "US" },
  { iata: "OKC", name: "Will Rogers World Airport", city: "Oklahoma City", country: "United States", countryCode: "US" },

  // USA — West
  { iata: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "United States", countryCode: "US" },
  { iata: "SFO", name: "San Francisco International Airport", city: "San Francisco", country: "United States", countryCode: "US" },
  { iata: "SJC", name: "Norman Y. Mineta San Jose International Airport", city: "San Jose", country: "United States", countryCode: "US" },
  { iata: "OAK", name: "Oakland International Airport", city: "Oakland", country: "United States", countryCode: "US" },
  { iata: "SEA", name: "Seattle-Tacoma International Airport", city: "Seattle", country: "United States", countryCode: "US" },
  { iata: "PDX", name: "Portland International Airport", city: "Portland", country: "United States", countryCode: "US" },
  { iata: "LAS", name: "Harry Reid International Airport", city: "Las Vegas", country: "United States", countryCode: "US" },
  { iata: "PHX", name: "Phoenix Sky Harbor International Airport", city: "Phoenix", country: "United States", countryCode: "US" },
  { iata: "DEN", name: "Denver International Airport", city: "Denver", country: "United States", countryCode: "US" },
  { iata: "SLC", name: "Salt Lake City International Airport", city: "Salt Lake City", country: "United States", countryCode: "US" },
  { iata: "SAN", name: "San Diego International Airport", city: "San Diego", country: "United States", countryCode: "US" },
  { iata: "BUR", name: "Hollywood Burbank Airport", city: "Burbank", country: "United States", countryCode: "US" },
  { iata: "ONT", name: "Ontario International Airport", city: "Ontario", country: "United States", countryCode: "US" },
  { iata: "ABQ", name: "Albuquerque International Sunport", city: "Albuquerque", country: "United States", countryCode: "US" },

  // USA — Hawaii & Alaska
  { iata: "HNL", name: "Daniel K. Inouye International Airport", city: "Honolulu", country: "United States", countryCode: "US" },
  { iata: "OGG", name: "Kahului Airport", city: "Maui", country: "United States", countryCode: "US" },
  { iata: "ANC", name: "Ted Stevens Anchorage International Airport", city: "Anchorage", country: "United States", countryCode: "US" },

  // Canada
  { iata: "YYZ", name: "Toronto Pearson International Airport", city: "Toronto", country: "Canada", countryCode: "CA" },
  { iata: "YUL", name: "Montreal-Trudeau International Airport", city: "Montreal", country: "Canada", countryCode: "CA" },
  { iata: "YVR", name: "Vancouver International Airport", city: "Vancouver", country: "Canada", countryCode: "CA" },
  { iata: "YYC", name: "Calgary International Airport", city: "Calgary", country: "Canada", countryCode: "CA" },
  { iata: "YEG", name: "Edmonton International Airport", city: "Edmonton", country: "Canada", countryCode: "CA" },
  { iata: "YOW", name: "Ottawa Macdonald-Cartier International Airport", city: "Ottawa", country: "Canada", countryCode: "CA" },
  { iata: "YHZ", name: "Halifax Stanfield International Airport", city: "Halifax", country: "Canada", countryCode: "CA" },
  { iata: "YWG", name: "Winnipeg James Armstrong Richardson Airport", city: "Winnipeg", country: "Canada", countryCode: "CA" },

  // Mexico
  { iata: "MEX", name: "Benito Juarez International Airport", city: "Mexico City", country: "Mexico", countryCode: "MX" },
  { iata: "CUN", name: "Cancun International Airport", city: "Cancun", country: "Mexico", countryCode: "MX" },
  { iata: "GDL", name: "Miguel Hidalgo y Costilla International Airport", city: "Guadalajara", country: "Mexico", countryCode: "MX" },
  { iata: "MTY", name: "General Mariano Escobedo International Airport", city: "Monterrey", country: "Mexico", countryCode: "MX" },
  { iata: "SJD", name: "Los Cabos International Airport", city: "Los Cabos", country: "Mexico", countryCode: "MX" },
  { iata: "PVR", name: "Licenciado Gustavo Diaz Ordaz International Airport", city: "Puerto Vallarta", country: "Mexico", countryCode: "MX" },
  { iata: "MID", name: "Manuel Crescencio Rejon International Airport", city: "Merida", country: "Mexico", countryCode: "MX" },

  // Caribbean
  { iata: "MBJ", name: "Sangster International Airport", city: "Montego Bay", country: "Jamaica", countryCode: "JM" },
  { iata: "KIN", name: "Norman Manley International Airport", city: "Kingston", country: "Jamaica", countryCode: "JM" },
  { iata: "NAS", name: "Lynden Pindling International Airport", city: "Nassau", country: "Bahamas", countryCode: "BS" },
  { iata: "PUJ", name: "Punta Cana International Airport", city: "Punta Cana", country: "Dominican Republic", countryCode: "DO" },
  { iata: "SDQ", name: "Las Americas International Airport", city: "Santo Domingo", country: "Dominican Republic", countryCode: "DO" },
  { iata: "SJU", name: "Luis Munoz Marin International Airport", city: "San Juan", country: "Puerto Rico", countryCode: "PR" },
  { iata: "HAV", name: "Jose Marti International Airport", city: "Havana", country: "Cuba", countryCode: "CU" },

  // ── SOUTH AMERICA ───────────────────────────────────

  { iata: "GRU", name: "Guarulhos International Airport", city: "Sao Paulo", country: "Brazil", countryCode: "BR" },
  { iata: "CGH", name: "Congonhas Airport", city: "Sao Paulo", country: "Brazil", countryCode: "BR" },
  { iata: "GIG", name: "Galeao International Airport", city: "Rio de Janeiro", country: "Brazil", countryCode: "BR" },
  { iata: "SDU", name: "Santos Dumont Airport", city: "Rio de Janeiro", country: "Brazil", countryCode: "BR" },
  { iata: "BSB", name: "Presidente Juscelino Kubitschek International Airport", city: "Brasilia", country: "Brazil", countryCode: "BR" },
  { iata: "FOR", name: "Pinto Martins International Airport", city: "Fortaleza", country: "Brazil", countryCode: "BR" },
  { iata: "SSA", name: "Deputado Luis Eduardo Magalhaes International Airport", city: "Salvador", country: "Brazil", countryCode: "BR" },
  { iata: "EZE", name: "Ministro Pistarini International Airport", city: "Buenos Aires", country: "Argentina", countryCode: "AR" },
  { iata: "AEP", name: "Jorge Newbery Airport", city: "Buenos Aires", country: "Argentina", countryCode: "AR" },
  { iata: "COR", name: "Ingeniero Aeronautico Ambrosio L.V. Taravella International Airport", city: "Cordoba", country: "Argentina", countryCode: "AR" },
  { iata: "SCL", name: "Arturo Merino Benitez International Airport", city: "Santiago", country: "Chile", countryCode: "CL" },
  { iata: "LIM", name: "Jorge Chavez International Airport", city: "Lima", country: "Peru", countryCode: "PE" },
  { iata: "BOG", name: "El Dorado International Airport", city: "Bogota", country: "Colombia", countryCode: "CO" },
  { iata: "MDE", name: "Jose Maria Cordova International Airport", city: "Medellin", country: "Colombia", countryCode: "CO" },
  { iata: "GYE", name: "Jose Joaquin de Olmedo International Airport", city: "Guayaquil", country: "Ecuador", countryCode: "EC" },
  { iata: "UIO", name: "Mariscal Sucre International Airport", city: "Quito", country: "Ecuador", countryCode: "EC" },
  { iata: "CCS", name: "Simon Bolivar International Airport", city: "Caracas", country: "Venezuela", countryCode: "VE" },
  { iata: "MVD", name: "Carrasco International Airport", city: "Montevideo", country: "Uruguay", countryCode: "UY" },
  { iata: "ASU", name: "Silvio Pettirossi International Airport", city: "Asuncion", country: "Paraguay", countryCode: "PY" },

  // ── MIDDLE EAST ─────────────────────────────────────

  { iata: "DXB", name: "Dubai International Airport", city: "Dubai", country: "United Arab Emirates", countryCode: "AE" },
  { iata: "AUH", name: "Abu Dhabi International Airport", city: "Abu Dhabi", country: "United Arab Emirates", countryCode: "AE" },
  { iata: "SHJ", name: "Sharjah International Airport", city: "Sharjah", country: "United Arab Emirates", countryCode: "AE" },
  { iata: "DOH", name: "Hamad International Airport", city: "Doha", country: "Qatar", countryCode: "QA" },
  { iata: "BAH", name: "Bahrain International Airport", city: "Manama", country: "Bahrain", countryCode: "BH" },
  { iata: "KWI", name: "Kuwait International Airport", city: "Kuwait City", country: "Kuwait", countryCode: "KW" },
  { iata: "MCT", name: "Muscat International Airport", city: "Muscat", country: "Oman", countryCode: "OM" },
  { iata: "RUH", name: "King Khalid International Airport", city: "Riyadh", country: "Saudi Arabia", countryCode: "SA" },
  { iata: "JED", name: "King Abdulaziz International Airport", city: "Jeddah", country: "Saudi Arabia", countryCode: "SA" },
  { iata: "DMM", name: "King Fahd International Airport", city: "Dammam", country: "Saudi Arabia", countryCode: "SA" },
  { iata: "TLV", name: "Ben Gurion International Airport", city: "Tel Aviv", country: "Israel", countryCode: "IL" },
  { iata: "AMM", name: "Queen Alia International Airport", city: "Amman", country: "Jordan", countryCode: "JO" },
  { iata: "BEY", name: "Beirut Rafic Hariri International Airport", city: "Beirut", country: "Lebanon", countryCode: "LB" },
  { iata: "CAI", name: "Cairo International Airport", city: "Cairo", country: "Egypt", countryCode: "EG" },
  { iata: "HRG", name: "Hurghada International Airport", city: "Hurghada", country: "Egypt", countryCode: "EG" },
  { iata: "SSH", name: "Sharm el-Sheikh International Airport", city: "Sharm el-Sheikh", country: "Egypt", countryCode: "EG" },
  { iata: "BGW", name: "Baghdad International Airport", city: "Baghdad", country: "Iraq", countryCode: "IQ" },
  { iata: "IKA", name: "Imam Khomeini International Airport", city: "Tehran", country: "Iran", countryCode: "IR" },

  // ── ASIA ────────────────────────────────────────────

  // China
  { iata: "PEK", name: "Beijing Capital International Airport", city: "Beijing", country: "China", countryCode: "CN" },
  { iata: "PKX", name: "Beijing Daxing International Airport", city: "Beijing", country: "China", countryCode: "CN" },
  { iata: "PVG", name: "Shanghai Pudong International Airport", city: "Shanghai", country: "China", countryCode: "CN" },
  { iata: "SHA", name: "Shanghai Hongqiao International Airport", city: "Shanghai", country: "China", countryCode: "CN" },
  { iata: "CAN", name: "Guangzhou Baiyun International Airport", city: "Guangzhou", country: "China", countryCode: "CN" },
  { iata: "SZX", name: "Shenzhen Bao'an International Airport", city: "Shenzhen", country: "China", countryCode: "CN" },
  { iata: "CTU", name: "Chengdu Tianfu International Airport", city: "Chengdu", country: "China", countryCode: "CN" },
  { iata: "KMG", name: "Kunming Changshui International Airport", city: "Kunming", country: "China", countryCode: "CN" },
  { iata: "XIY", name: "Xi'an Xianyang International Airport", city: "Xi'an", country: "China", countryCode: "CN" },
  { iata: "WUH", name: "Wuhan Tianhe International Airport", city: "Wuhan", country: "China", countryCode: "CN" },
  { iata: "HGH", name: "Hangzhou Xiaoshan International Airport", city: "Hangzhou", country: "China", countryCode: "CN" },
  { iata: "NKG", name: "Nanjing Lukou International Airport", city: "Nanjing", country: "China", countryCode: "CN" },
  { iata: "CSX", name: "Changsha Huanghua International Airport", city: "Changsha", country: "China", countryCode: "CN" },
  { iata: "TSN", name: "Tianjin Binhai International Airport", city: "Tianjin", country: "China", countryCode: "CN" },
  { iata: "HKG", name: "Hong Kong International Airport", city: "Hong Kong", country: "Hong Kong", countryCode: "HK" },
  { iata: "MFM", name: "Macau International Airport", city: "Macau", country: "Macau", countryCode: "MO" },

  // Japan
  { iata: "NRT", name: "Narita International Airport", city: "Tokyo", country: "Japan", countryCode: "JP" },
  { iata: "HND", name: "Tokyo Haneda Airport", city: "Tokyo", country: "Japan", countryCode: "JP" },
  { iata: "KIX", name: "Kansai International Airport", city: "Osaka", country: "Japan", countryCode: "JP" },
  { iata: "ITM", name: "Osaka Itami Airport", city: "Osaka", country: "Japan", countryCode: "JP" },
  { iata: "NGO", name: "Chubu Centrair International Airport", city: "Nagoya", country: "Japan", countryCode: "JP" },
  { iata: "CTS", name: "New Chitose Airport", city: "Sapporo", country: "Japan", countryCode: "JP" },
  { iata: "FUK", name: "Fukuoka Airport", city: "Fukuoka", country: "Japan", countryCode: "JP" },
  { iata: "OKA", name: "Naha Airport", city: "Okinawa", country: "Japan", countryCode: "JP" },

  // South Korea
  { iata: "ICN", name: "Incheon International Airport", city: "Seoul", country: "South Korea", countryCode: "KR" },
  { iata: "GMP", name: "Gimpo International Airport", city: "Seoul", country: "South Korea", countryCode: "KR" },
  { iata: "PUS", name: "Gimhae International Airport", city: "Busan", country: "South Korea", countryCode: "KR" },
  { iata: "CJU", name: "Jeju International Airport", city: "Jeju", country: "South Korea", countryCode: "KR" },

  // India
  { iata: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi", country: "India", countryCode: "IN" },
  { iata: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "India", countryCode: "IN" },
  { iata: "BLR", name: "Kempegowda International Airport", city: "Bangalore", country: "India", countryCode: "IN" },
  { iata: "MAA", name: "Chennai International Airport", city: "Chennai", country: "India", countryCode: "IN" },
  { iata: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", country: "India", countryCode: "IN" },
  { iata: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", country: "India", countryCode: "IN" },
  { iata: "COK", name: "Cochin International Airport", city: "Kochi", country: "India", countryCode: "IN" },
  { iata: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad", country: "India", countryCode: "IN" },
  { iata: "PNQ", name: "Pune Airport", city: "Pune", country: "India", countryCode: "IN" },

  // Southeast Asia
  { iata: "SIN", name: "Singapore Changi Airport", city: "Singapore", country: "Singapore", countryCode: "SG" },
  { iata: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand", countryCode: "TH" },
  { iata: "DMK", name: "Don Mueang International Airport", city: "Bangkok", country: "Thailand", countryCode: "TH" },
  { iata: "HKT", name: "Phuket International Airport", city: "Phuket", country: "Thailand", countryCode: "TH" },
  { iata: "CNX", name: "Chiang Mai International Airport", city: "Chiang Mai", country: "Thailand", countryCode: "TH" },
  { iata: "KUL", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia", countryCode: "MY" },
  { iata: "PEN", name: "Penang International Airport", city: "Penang", country: "Malaysia", countryCode: "MY" },
  { iata: "CGK", name: "Soekarno-Hatta International Airport", city: "Jakarta", country: "Indonesia", countryCode: "ID" },
  { iata: "DPS", name: "Ngurah Rai International Airport", city: "Bali", country: "Indonesia", countryCode: "ID" },
  { iata: "SUB", name: "Juanda International Airport", city: "Surabaya", country: "Indonesia", countryCode: "ID" },
  { iata: "MNL", name: "Ninoy Aquino International Airport", city: "Manila", country: "Philippines", countryCode: "PH" },
  { iata: "CEB", name: "Mactan-Cebu International Airport", city: "Cebu", country: "Philippines", countryCode: "PH" },
  { iata: "SGN", name: "Tan Son Nhat International Airport", city: "Ho Chi Minh City", country: "Vietnam", countryCode: "VN" },
  { iata: "HAN", name: "Noi Bai International Airport", city: "Hanoi", country: "Vietnam", countryCode: "VN" },
  { iata: "DAD", name: "Da Nang International Airport", city: "Da Nang", country: "Vietnam", countryCode: "VN" },
  { iata: "PNH", name: "Phnom Penh International Airport", city: "Phnom Penh", country: "Cambodia", countryCode: "KH" },
  { iata: "REP", name: "Siem Reap-Angkor International Airport", city: "Siem Reap", country: "Cambodia", countryCode: "KH" },
  { iata: "RGN", name: "Yangon International Airport", city: "Yangon", country: "Myanmar", countryCode: "MM" },
  { iata: "VTE", name: "Wattay International Airport", city: "Vientiane", country: "Laos", countryCode: "LA" },

  // Taiwan
  { iata: "TPE", name: "Taiwan Taoyuan International Airport", city: "Taipei", country: "Taiwan", countryCode: "TW" },
  { iata: "TSA", name: "Taipei Songshan Airport", city: "Taipei", country: "Taiwan", countryCode: "TW" },

  // Central Asia
  { iata: "ALA", name: "Almaty International Airport", city: "Almaty", country: "Kazakhstan", countryCode: "KZ" },
  { iata: "NQZ", name: "Nursultan Nazarbayev International Airport", city: "Astana", country: "Kazakhstan", countryCode: "KZ" },
  { iata: "TAS", name: "Islam Karimov Tashkent International Airport", city: "Tashkent", country: "Uzbekistan", countryCode: "UZ" },

  // South Asia
  { iata: "CMB", name: "Bandaranaike International Airport", city: "Colombo", country: "Sri Lanka", countryCode: "LK" },
  { iata: "DAC", name: "Hazrat Shahjalal International Airport", city: "Dhaka", country: "Bangladesh", countryCode: "BD" },
  { iata: "KTM", name: "Tribhuvan International Airport", city: "Kathmandu", country: "Nepal", countryCode: "NP" },
  { iata: "KHI", name: "Jinnah International Airport", city: "Karachi", country: "Pakistan", countryCode: "PK" },
  { iata: "LHE", name: "Allama Iqbal International Airport", city: "Lahore", country: "Pakistan", countryCode: "PK" },
  { iata: "ISB", name: "Islamabad International Airport", city: "Islamabad", country: "Pakistan", countryCode: "PK" },

  // ── AFRICA ──────────────────────────────────────────

  { iata: "JNB", name: "O.R. Tambo International Airport", city: "Johannesburg", country: "South Africa", countryCode: "ZA" },
  { iata: "CPT", name: "Cape Town International Airport", city: "Cape Town", country: "South Africa", countryCode: "ZA" },
  { iata: "DUR", name: "King Shaka International Airport", city: "Durban", country: "South Africa", countryCode: "ZA" },
  { iata: "NBO", name: "Jomo Kenyatta International Airport", city: "Nairobi", country: "Kenya", countryCode: "KE" },
  { iata: "MBA", name: "Mombasa Moi International Airport", city: "Mombasa", country: "Kenya", countryCode: "KE" },
  { iata: "ADD", name: "Addis Ababa Bole International Airport", city: "Addis Ababa", country: "Ethiopia", countryCode: "ET" },
  { iata: "LOS", name: "Murtala Muhammed International Airport", city: "Lagos", country: "Nigeria", countryCode: "NG" },
  { iata: "ABV", name: "Nnamdi Azikiwe International Airport", city: "Abuja", country: "Nigeria", countryCode: "NG" },
  { iata: "ACC", name: "Kotoka International Airport", city: "Accra", country: "Ghana", countryCode: "GH" },
  { iata: "DKR", name: "Blaise Diagne International Airport", city: "Dakar", country: "Senegal", countryCode: "SN" },
  { iata: "CMN", name: "Mohammed V International Airport", city: "Casablanca", country: "Morocco", countryCode: "MA" },
  { iata: "RAK", name: "Marrakesh Menara Airport", city: "Marrakesh", country: "Morocco", countryCode: "MA" },
  { iata: "TNG", name: "Ibn Battuta Airport", city: "Tangier", country: "Morocco", countryCode: "MA" },
  { iata: "ALG", name: "Houari Boumediene Airport", city: "Algiers", country: "Algeria", countryCode: "DZ" },
  { iata: "TUN", name: "Tunis-Carthage International Airport", city: "Tunis", country: "Tunisia", countryCode: "TN" },
  { iata: "TBJ", name: "Tabarka-Ain Draham International Airport", city: "Tabarka", country: "Tunisia", countryCode: "TN" },
  { iata: "TZR", name: "Djerba-Zarzis International Airport", city: "Djerba", country: "Tunisia", countryCode: "TN" },
  { iata: "TNR", name: "Ivato International Airport", city: "Antananarivo", country: "Madagascar", countryCode: "MG" },
  { iata: "DAR", name: "Julius Nyerere International Airport", city: "Dar es Salaam", country: "Tanzania", countryCode: "TZ" },
  { iata: "JRO", name: "Kilimanjaro International Airport", city: "Kilimanjaro", country: "Tanzania", countryCode: "TZ" },
  { iata: "EBB", name: "Entebbe International Airport", city: "Entebbe", country: "Uganda", countryCode: "UG" },
  { iata: "KGL", name: "Kigali International Airport", city: "Kigali", country: "Rwanda", countryCode: "RW" },
  { iata: "HRE", name: "Robert Gabriel Mugabe International Airport", city: "Harare", country: "Zimbabwe", countryCode: "ZW" },
  { iata: "LUN", name: "Kenneth Kaunda International Airport", city: "Lusaka", country: "Zambia", countryCode: "ZM" },

  // ── AUSTRALIA & OCEANIA ─────────────────────────────

  { iata: "SYD", name: "Sydney Kingsford Smith Airport", city: "Sydney", country: "Australia", countryCode: "AU" },
  { iata: "MEL", name: "Melbourne Airport", city: "Melbourne", country: "Australia", countryCode: "AU" },
  { iata: "BNE", name: "Brisbane Airport", city: "Brisbane", country: "Australia", countryCode: "AU" },
  { iata: "PER", name: "Perth Airport", city: "Perth", country: "Australia", countryCode: "AU" },
  { iata: "ADL", name: "Adelaide Airport", city: "Adelaide", country: "Australia", countryCode: "AU" },
  { iata: "OOL", name: "Gold Coast Airport", city: "Gold Coast", country: "Australia", countryCode: "AU" },
  { iata: "CBR", name: "Canberra Airport", city: "Canberra", country: "Australia", countryCode: "AU" },
  { iata: "HBA", name: "Hobart Airport", city: "Hobart", country: "Australia", countryCode: "AU" },
  { iata: "DRW", name: "Darwin International Airport", city: "Darwin", country: "Australia", countryCode: "AU" },
  { iata: "CNS", name: "Cairns Airport", city: "Cairns", country: "Australia", countryCode: "AU" },
  { iata: "AKL", name: "Auckland Airport", city: "Auckland", country: "New Zealand", countryCode: "NZ" },
  { iata: "WLG", name: "Wellington International Airport", city: "Wellington", country: "New Zealand", countryCode: "NZ" },
  { iata: "CHC", name: "Christchurch Airport", city: "Christchurch", country: "New Zealand", countryCode: "NZ" },
  { iata: "NAN", name: "Nadi International Airport", city: "Nadi", country: "Fiji", countryCode: "FJ" },
  { iata: "PPT", name: "Fa'a'a International Airport", city: "Papeete", country: "French Polynesia", countryCode: "PF" },
];

export default europeanAirports;
