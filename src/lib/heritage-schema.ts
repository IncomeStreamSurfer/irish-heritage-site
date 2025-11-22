export type HeritageImage = {
  url: string;
  alt?: string;
  caption?: string;
  source?: string;
};

export type HeritageAddress = {
  street?: string;
  town?: string;
  county?: string;
  region?: string;
  country?: string;
  postcode?: string;
};

export type HeritageSite = {
  id: string;
  name: string;
  tagline?: string;
  type?: string;
  categories?: string[];
  era?: string;
  dateBuilt?: string;
  unescoWorldHeritageSite?: boolean;
  managedBy?: string;
  description?: {
    short?: string;
    full?: string;
    history?: string;
    significance?: string;
  };
  location?: {
    address?: HeritageAddress;
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
    directions?: Record<string, string>;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    bookingUrl?: string;
    socialMedia?: Record<string, string>;
  };
  visitingInformation?: {
    openingTimes?: {
      currentStatus?: string;
      standard?: {
        days?: string;
        hours?: string;
        lastAdmission?: string;
      };
      seasonal?: {
        season?: string;
        days?: string;
        hours?: string;
        lastAdmission?: string;
        lastGuidedTour?: string;
      }[];
      parklands?: Record<string, string>;
      specialClosures?: string[];
    };
    admissionPrices?: Record<string, unknown>;
    tourOptions?: {
      type?: string;
      duration?: string;
      included?: string[];
      bookingRequired?: boolean;
      notes?: string;
      seasonal?: string;
      admission?: string;
    }[];
    averageVisitDuration?: string;
    busyPeriods?: string[];
    adviceForVisitors?: string;
  };
  features?: {
    highlights?: string[];
    facilities?: string[];
    accessibility?: {
      wheelchairAccessible?: boolean | string;
      accessibilityLevel?: string;
      restrictions?: string[];
      accessibilityNotes?: string;
    };
  };
  images?: {
    heroImage?: HeritageImage;
    gallery?: HeritageImage[];
  };
  nearbyAttractions?: {
    name: string;
    distance?: string;
    type?: string;
  }[];
  resources?: Record<string, unknown>;
  tags?: string[];
  suitableFor?: string[];
  weatherDependent?: boolean;
  indoorActivities?: boolean;
  outdoorActivities?: boolean;
  filmLocations?: string[];
  unescoTentativeList?: boolean;
  archaeologicalInformation?: string;
  heritage?: Record<string, unknown>;
  interestingFacts?: string[];
  visitPlanning?: Record<string, unknown>;
  additionalInformation?: Record<string, unknown>;
};

export type HeritageMetadata = {
  schemaVersion?: string;
  lastUpdated?: string;
  totalSites?: number;
  dataSource?: string;
  purpose?: string;
  notes?: string;
};

export type HeritageDataset = {
  sites: HeritageSite[];
  metadata?: HeritageMetadata;
};
