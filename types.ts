export interface UserData {
  name: string;
  gender: string;
  interests: string;
}

// Represents a single grounding source from Google Search
export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  }
}

// The result from the generation service
export interface GenerationResult {
    bios: string[];
    sources: GroundingSource[];
}
