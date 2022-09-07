import { GifImageModel } from './../models/image/gifImage';
import { GifsResult, GiphyFetch, SearchOptions } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';

const apiKey = process.env.GIPHY_API_KEY || '';
const gf = new GiphyFetch(apiKey);
const DEFAULT_FETCH_COUNT = 16;
const TRENDING_GIF_API = `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}&limit=${DEFAULT_FETCH_COUNT}&rating=g`;

function convertResponseToModel(gifList: IGif[]): GifImageModel[] {
  return gifList.map((gif) => {
    const { id, title, images } = gif;

    return {
      id,
      title,
      imageUrl: images.original.url
    };
  });
}

type GifsCache = {
  gifs: GifImageModel[];
  cacheTime: number;
};

export const gifAPIService = {
  gifsCache: { gifs: [], cacheTime: 0 } as GifsCache,

  startGifsCacheTime: function () {
    this.gifsCache['cacheTime'] = new Date().getTime();
  },

  refreshGifs: function () {
    if (this.gifsCache['cacheTime']) {
      return new Date().getTime() > this.gifsCache['cacheTime'] + 30000;
    }

    return false;
  },

  /**
   * treding gif 목록을 가져옵니다.
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/trending
   */
  getTrending: async function (): Promise<GifImageModel[]> {
    try {
      const gifs: GifsResult = await fetch(TRENDING_GIF_API).then((res) => res.json());
      return convertResponseToModel(gifs.data);
    } catch (e) {
      return [];
    }
  },
  /**
   * 검색어에 맞는 gif 목록을 가져옵니다.
   * @param {string} keyword
   * @param {number} page
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/search
   */
  searchByKeyword: async function (keyword: string, page: number): Promise<GifImageModel[]> {
    const searchOptions: SearchOptions = {
      limit: DEFAULT_FETCH_COUNT,
      lang: 'en',
      offset: page * DEFAULT_FETCH_COUNT
    };

    try {
      const gifs: GifsResult = await gf.search(keyword, searchOptions);
      return convertResponseToModel(gifs.data);
    } catch (e) {
      return [];
    }
  }
};
