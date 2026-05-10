export type CategoryId =
  | "career"
  | "tech"
  | "social"
  | "stability"
  | "lifestyle"
  | "terrain"
  | "safety"
  | "urban"
  | "health"
  | "env"
  | "housing"
  | "gov"
  | "values"
  | "immi"
  | "edu"
  | "history";

export type Region = "Europe" | "Asia" | "Oceania" | "N. America";

export type RegionFilter = Region | "All";

export type CountryCode =
  | "SG"
  | "CH"
  | "NO"
  | "AU"
  | "CZ"
  | "PL"
  | "NZ"
  | "JP"
  | "FI"
  | "DK"
  | "DE"
  | "IE"
  | "NL"
  | "LU"
  | "GB"
  | "CA"
  | "EE"
  | "PT"
  | "US"
  | "ES"
  | "FR"
  | "BE"
  | "SE"
  | "AT"
  | "IT"
  | "KR";

export type CareerFieldId =
  | "technology"
  | "finance"
  | "engineering"
  | "healthcare"
  | "consulting"
  | "legal"
  | "marketing"
  | "media"
  | "education"
  | "architecture"
  | "construction"
  | "logistics"
  | "agriculture"
  | "tourism"
  | "arts"
  | "sales";

export type Category = {
  id: CategoryId;
  name: string;
  w: number;
  icon: string;
};

export type CareerField = {
  id: CareerFieldId;
  name: string;
  icon: string;
  desc: string;
  scores: Record<CountryCode, number>;
};

export type Source = {
  name: string;
  url: string;
  what: string;
};

export type CountryDetails = Record<CategoryId, string> & {
  sum: string;
  deal: string;
  parent: string;
};

export type CountryScores = Record<CategoryId, number>;

export type CountryData = {
  c: CountryCode;
  f: string;
  n: string;
  r: Region;
  s: CountryScores;
  d: CountryDetails;
};
