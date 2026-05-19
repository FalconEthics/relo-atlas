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

export type ScoreTier = "A" | "B" | "C" | "D" | "E";

export type PenaltyCurve = Record<number, number>;

export type GateRule = {
  id: CategoryId;
  minScore: number;
  penaltyMultiplier?: number;
  capTier?: ScoreTier;
  label?: string;
};

export type Region =
  | "Europe"
  | "Asia"
  | "Oceania"
  | "N. America"
  | "S. America"
  | "Africa"
  | "Middle East"
  | "Caribbean"
  | "Central America";

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
  | "KR"
  | "GR"
  | "HU"
  | "RO"
  | "BG"
  | "SI"
  | "HR"
  | "TW"
  | "MY"
  | "TH"
  | "VN"
  | "IN"
  | "MX"
  | "BR"
  | "AR"
  | "CL"
  | "UY"
  | "CO"
  | "PE"
  | "ZA"
  | "MA"
  | "TN"
  | "KE"
  | "MU"
  | "AE"
  | "QA"
  | "SA"
  | "IL"
  | "TR"
  | "OM"
  | "DO"
  | "BB"
  | "BS"
  | "JM"
  | "TT"
  | "CR"
  | "PA"
  | "GT"
  | "SV";

export type CareerFieldId =
  | "technology"
  | "finance"
  | "engineering"
  | "healthcare"
  | "consulting"
  | "legal"
  | "marketing"
  | "media"
  | "adult-entertainment"
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
  scores: Partial<Record<CountryCode, number>>;
  notes?: Partial<Record<CountryCode, string>>;
};

export type ScoringConfig = {
  gates: GateRule[] | null;
  priorities: CategoryId[] | "auto" | null;
  priorityCount: number;
  penaltyCurve: PenaltyCurve | null;
  penaltyPower: number;
};

export type Source = {
  name: string;
  url: string;
  what: string;
};

export type CountryDetails = Omit<Record<CategoryId, string>, "tech"> & { tech?: string } & {
  sum: string;
  deal: string;
  parent: string;
};

export type CountryScores = Omit<Record<CategoryId, number>, "tech"> & { tech?: number };

export type CountryData = {
  c: CountryCode;
  f: string;
  n: string;
  r: Region;
  s: CountryScores;
  d: CountryDetails;
};
