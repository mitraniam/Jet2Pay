/**
 * Airport coordinates for EC261 distance calculation.
 * Covers all Jet2 departure airports and their primary destinations.
 * Coordinates are [latitude, longitude] in decimal degrees.
 */

export interface AirportInfo {
  iata: string;
  name: string;
  lat: number;
  lon: number;
  country: string; // ISO 3166-1 alpha-2
  isEuEea: boolean; // EU/EEA/UK for EC261 eligibility
}

// Comprehensive airport database (Jet2-relevant + major hubs)
export const AIRPORTS: Record<string, AirportInfo> = {
  // ── UK departure airports (Jet2 bases) ──────────────────────
  LBA: { iata: "LBA", name: "Leeds Bradford", lat: 53.8659, lon: -1.6606, country: "GB", isEuEea: true },
  MAN: { iata: "MAN", name: "Manchester", lat: 53.3537, lon: -2.2750, country: "GB", isEuEea: true },
  BHX: { iata: "BHX", name: "Birmingham", lat: 52.4539, lon: -1.7480, country: "GB", isEuEea: true },
  LGW: { iata: "LGW", name: "London Gatwick", lat: 51.1481, lon: -0.1903, country: "GB", isEuEea: true },
  LHR: { iata: "LHR", name: "London Heathrow", lat: 51.4775, lon: -0.4614, country: "GB", isEuEea: true },
  STN: { iata: "STN", name: "London Stansted", lat: 51.8850, lon: 0.2350, country: "GB", isEuEea: true },
  LTN: { iata: "LTN", name: "London Luton", lat: 51.8747, lon: -0.3683, country: "GB", isEuEea: true },
  NCL: { iata: "NCL", name: "Newcastle", lat: 55.0375, lon: -1.6917, country: "GB", isEuEea: true },
  EDI: { iata: "EDI", name: "Edinburgh", lat: 55.9500, lon: -3.3725, country: "GB", isEuEea: true },
  GLA: { iata: "GLA", name: "Glasgow", lat: 55.8719, lon: -4.4331, country: "GB", isEuEea: true },
  BFS: { iata: "BFS", name: "Belfast International", lat: 54.6575, lon: -6.2158, country: "GB", isEuEea: true },
  BHD: { iata: "BHD", name: "Belfast City", lat: 54.6181, lon: -5.8725, country: "GB", isEuEea: true },
  EXT: { iata: "EXT", name: "Exeter", lat: 50.7344, lon: -3.4139, country: "GB", isEuEea: true },
  BRS: { iata: "BRS", name: "Bristol", lat: 51.3827, lon: -2.7191, country: "GB", isEuEea: true },
  LPL: { iata: "LPL", name: "Liverpool John Lennon", lat: 53.3336, lon: -2.8497, country: "GB", isEuEea: true },
  DSA: { iata: "DSA", name: "Doncaster Sheffield", lat: 53.4745, lon: -1.0106, country: "GB", isEuEea: true },
  EMA: { iata: "EMA", name: "East Midlands", lat: 52.8311, lon: -1.3281, country: "GB", isEuEea: true },
  BOH: { iata: "BOH", name: "Bournemouth", lat: 50.7800, lon: -1.8425, country: "GB", isEuEea: true },
  SEN: { iata: "SEN", name: "London Southend", lat: 51.5714, lon: 0.6956, country: "GB", isEuEea: true },
  ABZ: { iata: "ABZ", name: "Aberdeen", lat: 57.2019, lon: -2.1978, country: "GB", isEuEea: true },
  INV: { iata: "INV", name: "Inverness", lat: 57.5425, lon: -4.0475, country: "GB", isEuEea: true },

  // ── Spain ────────────────────────────────────────────────────
  PMI: { iata: "PMI", name: "Palma de Mallorca", lat: 39.5517, lon: 2.7388, country: "ES", isEuEea: true },
  AGP: { iata: "AGP", name: "Málaga", lat: 36.6749, lon: -4.4991, country: "ES", isEuEea: true },
  ALC: { iata: "ALC", name: "Alicante", lat: 38.2822, lon: -0.5581, country: "ES", isEuEea: true },
  TFS: { iata: "TFS", name: "Tenerife South", lat: 28.0445, lon: -16.5725, country: "ES", isEuEea: true },
  TFN: { iata: "TFN", name: "Tenerife North", lat: 28.4827, lon: -16.3414, country: "ES", isEuEea: true },
  LPA: { iata: "LPA", name: "Gran Canaria", lat: 27.9319, lon: -15.3866, country: "ES", isEuEea: true },
  ACE: { iata: "ACE", name: "Lanzarote", lat: 28.9455, lon: -13.6052, country: "ES", isEuEea: true },
  FUE: { iata: "FUE", name: "Fuerteventura", lat: 28.4527, lon: -13.8638, country: "ES", isEuEea: true },
  BCN: { iata: "BCN", name: "Barcelona El Prat", lat: 41.2971, lon: 2.0785, country: "ES", isEuEea: true },
  MAD: { iata: "MAD", name: "Madrid Barajas", lat: 40.4936, lon: -3.5668, country: "ES", isEuEea: true },
  VLC: { iata: "VLC", name: "Valencia", lat: 39.4893, lon: -0.4816, country: "ES", isEuEea: true },
  IBZ: { iata: "IBZ", name: "Ibiza", lat: 38.8729, lon: 1.3731, country: "ES", isEuEea: true },
  MAH: { iata: "MAH", name: "Menorca", lat: 39.8626, lon: 4.2186, country: "ES", isEuEea: true },
  GRX: { iata: "GRX", name: "Granada", lat: 37.1887, lon: -3.7775, country: "ES", isEuEea: true },
  SVQ: { iata: "SVQ", name: "Seville", lat: 37.4180, lon: -5.8931, country: "ES", isEuEea: true },
  MJV: { iata: "MJV", name: "Murcia", lat: 37.7750, lon: -0.8124, country: "ES", isEuEea: true },
  REU: { iata: "REU", name: "Reus (Tarragona)", lat: 41.1474, lon: 1.1672, country: "ES", isEuEea: true },
  SDR: { iata: "SDR", name: "Santander", lat: 43.4271, lon: -3.8200, country: "ES", isEuEea: true },

  // ── Portugal ─────────────────────────────────────────────────
  FAO: { iata: "FAO", name: "Faro", lat: 37.0144, lon: -7.9659, country: "PT", isEuEea: true },
  LIS: { iata: "LIS", name: "Lisbon", lat: 38.7813, lon: -9.1359, country: "PT", isEuEea: true },
  OPO: { iata: "OPO", name: "Porto", lat: 41.2481, lon: -8.6814, country: "PT", isEuEea: true },
  FNC: { iata: "FNC", name: "Madeira Funchal", lat: 32.6979, lon: -16.7745, country: "PT", isEuEea: true },
  PDL: { iata: "PDL", name: "Ponta Delgada (Azores)", lat: 37.7412, lon: -25.6979, country: "PT", isEuEea: true },

  // ── Greece ───────────────────────────────────────────────────
  ATH: { iata: "ATH", name: "Athens", lat: 37.9364, lon: 23.9445, country: "GR", isEuEea: true },
  RHO: { iata: "RHO", name: "Rhodes", lat: 36.4054, lon: 28.0862, country: "GR", isEuEea: true },
  HER: { iata: "HER", name: "Heraklion (Crete)", lat: 35.3397, lon: 25.1803, country: "GR", isEuEea: true },
  CHQ: { iata: "CHQ", name: "Chania (Crete)", lat: 35.5317, lon: 24.1497, country: "GR", isEuEea: true },
  KGS: { iata: "KGS", name: "Kos", lat: 36.7933, lon: 27.0917, country: "GR", isEuEea: true },
  ZTH: { iata: "ZTH", name: "Zakynthos", lat: 37.7509, lon: 20.8843, country: "GR", isEuEea: true },
  CFU: { iata: "CFU", name: "Corfu", lat: 39.6019, lon: 19.9117, country: "GR", isEuEea: true },
  SKG: { iata: "SKG", name: "Thessaloniki", lat: 40.5197, lon: 22.9709, country: "GR", isEuEea: true },
  MYK: { iata: "MYK", name: "Mykonos", lat: 37.4351, lon: 25.3481, country: "GR", isEuEea: true },
  JTR: { iata: "JTR", name: "Santorini", lat: 36.3992, lon: 25.4793, country: "GR", isEuEea: true },
  SMI: { iata: "SMI", name: "Samos", lat: 37.6900, lon: 26.9117, country: "GR", isEuEea: true },
  SKU: { iata: "SKU", name: "Skiathos", lat: 39.1772, lon: 23.5038, country: "GR", isEuEea: true },
  KLX: { iata: "KLX", name: "Kalamata", lat: 37.0683, lon: 22.0255, country: "GR", isEuEea: true },
  EFL: { iata: "EFL", name: "Kefalonia", lat: 38.1200, lon: 20.5005, country: "GR", isEuEea: true },

  // ── Turkey ───────────────────────────────────────────────────
  AYT: { iata: "AYT", name: "Antalya", lat: 36.8987, lon: 30.8005, country: "TR", isEuEea: false },
  DLM: { iata: "DLM", name: "Dalaman", lat: 36.7131, lon: 28.7925, country: "TR", isEuEea: false },
  BJV: { iata: "BJV", name: "Bodrum", lat: 37.2506, lon: 27.6644, country: "TR", isEuEea: false },
  IST: { iata: "IST", name: "Istanbul", lat: 41.2608, lon: 28.7418, country: "TR", isEuEea: false },
  SAW: { iata: "SAW", name: "Istanbul Sabiha Gökçen", lat: 40.8986, lon: 29.3092, country: "TR", isEuEea: false },
  ADB: { iata: "ADB", name: "Izmir", lat: 38.2924, lon: 27.1570, country: "TR", isEuEea: false },

  // ── Cyprus ───────────────────────────────────────────────────
  LCA: { iata: "LCA", name: "Larnaca", lat: 34.8751, lon: 33.6249, country: "CY", isEuEea: true },
  PFO: { iata: "PFO", name: "Paphos", lat: 34.7180, lon: 32.4857, country: "CY", isEuEea: true },

  // ── Italy ────────────────────────────────────────────────────
  FCO: { iata: "FCO", name: "Rome Fiumicino", lat: 41.8003, lon: 12.2389, country: "IT", isEuEea: true },
  MXP: { iata: "MXP", name: "Milan Malpensa", lat: 45.6306, lon: 8.7281, country: "IT", isEuEea: true },
  VCE: { iata: "VCE", name: "Venice", lat: 45.5053, lon: 12.3519, country: "IT", isEuEea: true },
  NAP: { iata: "NAP", name: "Naples", lat: 40.8860, lon: 14.2908, country: "IT", isEuEea: true },
  PMO: { iata: "PMO", name: "Palermo", lat: 38.1759, lon: 13.0910, country: "IT", isEuEea: true },
  CTA: { iata: "CTA", name: "Catania", lat: 37.4668, lon: 15.0664, country: "IT", isEuEea: true },
  BRI: { iata: "BRI", name: "Bari", lat: 41.1389, lon: 16.7606, country: "IT", isEuEea: true },
  PSA: { iata: "PSA", name: "Pisa", lat: 43.6839, lon: 10.3927, country: "IT", isEuEea: true },
  AOI: { iata: "AOI", name: "Ancona", lat: 43.6163, lon: 13.3622, country: "IT", isEuEea: true },
  BLQ: { iata: "BLQ", name: "Bologna", lat: 44.5354, lon: 11.2887, country: "IT", isEuEea: true },

  // ── France ───────────────────────────────────────────────────
  CDG: { iata: "CDG", name: "Paris Charles de Gaulle", lat: 49.0097, lon: 2.5478, country: "FR", isEuEea: true },
  ORY: { iata: "ORY", name: "Paris Orly", lat: 48.7233, lon: 2.3794, country: "FR", isEuEea: true },
  NCE: { iata: "NCE", name: "Nice Côte d'Azur", lat: 43.6584, lon: 7.2159, country: "FR", isEuEea: true },
  MRS: { iata: "MRS", name: "Marseille", lat: 43.4393, lon: 5.2214, country: "FR", isEuEea: true },
  LYS: { iata: "LYS", name: "Lyon", lat: 45.7256, lon: 5.0811, country: "FR", isEuEea: true },

  // ── Germany ──────────────────────────────────────────────────
  FRA: { iata: "FRA", name: "Frankfurt", lat: 50.0379, lon: 8.5622, country: "DE", isEuEea: true },
  MUC: { iata: "MUC", name: "Munich", lat: 48.3538, lon: 11.7861, country: "DE", isEuEea: true },
  DUS: { iata: "DUS", name: "Düsseldorf", lat: 51.2895, lon: 6.7668, country: "DE", isEuEea: true },
  TXL: { iata: "TXL", name: "Berlin Tegel (legacy)", lat: 52.5597, lon: 13.2877, country: "DE", isEuEea: true },
  BER: { iata: "BER", name: "Berlin Brandenburg", lat: 52.3667, lon: 13.5033, country: "DE", isEuEea: true },

  // ── Netherlands / Belgium ─────────────────────────────────────
  AMS: { iata: "AMS", name: "Amsterdam Schiphol", lat: 52.3086, lon: 4.7639, country: "NL", isEuEea: true },
  BRU: { iata: "BRU", name: "Brussels", lat: 50.9014, lon: 4.4844, country: "BE", isEuEea: true },

  // ── Bulgaria ─────────────────────────────────────────────────
  SOF: { iata: "SOF", name: "Sofia", lat: 42.6967, lon: 23.4114, country: "BG", isEuEea: true },
  VAR: { iata: "VAR", name: "Varna", lat: 43.2321, lon: 27.8251, country: "BG", isEuEea: true },
  BOJ: { iata: "BOJ", name: "Burgas", lat: 42.5696, lon: 27.5153, country: "BG", isEuEea: true },

  // ── Croatia ──────────────────────────────────────────────────
  DBV: { iata: "DBV", name: "Dubrovnik", lat: 42.5614, lon: 18.2681, country: "HR", isEuEea: true },
  SPU: { iata: "SPU", name: "Split", lat: 43.5389, lon: 16.2981, country: "HR", isEuEea: true },
  ZAG: { iata: "ZAG", name: "Zagreb", lat: 45.7429, lon: 16.0688, country: "HR", isEuEea: true },
  ZAD: { iata: "ZAD", name: "Zadar", lat: 44.1083, lon: 15.3467, country: "HR", isEuEea: true },

  // ── Malta ────────────────────────────────────────────────────
  MLA: { iata: "MLA", name: "Malta Luqa", lat: 35.8597, lon: 14.4775, country: "MT", isEuEea: true },

  // ── Morocco ──────────────────────────────────────────────────
  RAK: { iata: "RAK", name: "Marrakech Menara", lat: 31.6069, lon: -8.0363, country: "MA", isEuEea: false },
  CMN: { iata: "CMN", name: "Casablanca Mohammed V", lat: 33.3675, lon: -7.5897, country: "MA", isEuEea: false },
  AGA: { iata: "AGA", name: "Agadir", lat: 30.3250, lon: -9.4131, country: "MA", isEuEea: false },

  // ── Tunisia ──────────────────────────────────────────────────
  TUN: { iata: "TUN", name: "Tunis-Carthage", lat: 36.8510, lon: 10.2272, country: "TN", isEuEea: false },
  MIR: { iata: "MIR", name: "Monastir", lat: 35.7581, lon: 10.7547, country: "TN", isEuEea: false },
  DJE: { iata: "DJE", name: "Djerba", lat: 33.8750, lon: 10.7756, country: "TN", isEuEea: false },

  // ── Egypt / UAE ───────────────────────────────────────────────
  HRG: { iata: "HRG", name: "Hurghada", lat: 27.1783, lon: 33.7994, country: "EG", isEuEea: false },
  SSH: { iata: "SSH", name: "Sharm El-Sheikh", lat: 27.9773, lon: 34.3950, country: "EG", isEuEea: false },
  DXB: { iata: "DXB", name: "Dubai", lat: 25.2528, lon: 55.3644, country: "AE", isEuEea: false },

  // ── USA ───────────────────────────────────────────────────────
  JFK: { iata: "JFK", name: "New York JFK", lat: 40.6413, lon: -73.7781, country: "US", isEuEea: false },
  MCO: { iata: "MCO", name: "Orlando", lat: 28.4312, lon: -81.3081, country: "US", isEuEea: false },
  MIA: { iata: "MIA", name: "Miami", lat: 25.7959, lon: -80.2870, country: "US", isEuEea: false },
  LAX: { iata: "LAX", name: "Los Angeles", lat: 33.9425, lon: -118.4081, country: "US", isEuEea: false },

  // ── Caribbean / Mexico ────────────────────────────────────────
  CUN: { iata: "CUN", name: "Cancún", lat: 21.0365, lon: -86.8771, country: "MX", isEuEea: false },
  PUJ: { iata: "PUJ", name: "Punta Cana", lat: 18.5674, lon: -68.3634, country: "DO", isEuEea: false },

  // ── Ireland ───────────────────────────────────────────────────
  DUB: { iata: "DUB", name: "Dublin", lat: 53.4273, lon: -6.2436, country: "IE", isEuEea: true },
};

/**
 * Haversine great-circle distance in km between two lat/lon points.
 */
export function haversineKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Calculate distance in km between two IATA airport codes.
 * Returns null if either airport is not in the database.
 */
export function routeDistanceKm(
  departureIata: string,
  arrivalIata: string
): number | null {
  const dep = AIRPORTS[departureIata.toUpperCase()];
  const arr = AIRPORTS[arrivalIata.toUpperCase()];
  if (!dep || !arr) return null;
  return Math.round(haversineKm(dep.lat, dep.lon, arr.lat, arr.lon));
}

/**
 * Check whether a route is covered by EC261/UK261.
 * Covered if: departure OR arrival is in EU/EEA/UK.
 */
export function isEC261Route(
  departureIata: string,
  arrivalIata: string
): boolean {
  const dep = AIRPORTS[departureIata.toUpperCase()];
  const arr = AIRPORTS[arrivalIata.toUpperCase()];
  // If unknown, we can't confirm — return true to avoid excluding valid claims
  if (!dep && !arr) return true;
  return (dep?.isEuEea ?? false) || (arr?.isEuEea ?? false);
}
