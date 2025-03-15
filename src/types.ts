export interface RadioStation {
    changeuuid: string;
    stationuuid: string;
    name: string;
    url: string;
    url_resolved: string;
    homepage: string;
    favicon: string;
    tags: string;
    country: string;
    countrycode: string;
    language: string;
    votes: number;
    lastchangetime: string;
    codec: string;
    bitrate: number;
    clickcount: number;
    clicktrend: number;
    ssl_error: number;
    geo_lat: number;
    geo_long: number;
  }

export interface AdvancedSearchState {
  name: string;
  country: string;
  tags: string;
  minBitrate: string;
}