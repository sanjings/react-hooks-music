import { Dispatch } from 'redux';
import { ISearchAction } from './reducer';
import { SET_HOT_KEYWORDS_LIST, SET_SEARCH_DATA } from './actionTypes';

import {
  httpGetHotKeywordsList,
  httpGetSearchList,
  httpGetSearchSuggest
} from '@/requests/search';
import { IHotKey, ISearchResult } from '../typing';

export const changeHotKeywordsListAction = (payload: IHotKey[]): ISearchAction => ({
  type: SET_HOT_KEYWORDS_LIST,
  payload
});

export const changeSearchDataAction = (payload: ISearchResult | null): ISearchAction => ({
  type: SET_SEARCH_DATA,
  payload
});

export const getHotKeywordsListAction = () => {
  return async (dispatch: Dispatch) => {
    const resp = await httpGetHotKeywordsList();
    dispatch(changeHotKeywordsListAction(resp.result.hots));
  };
};

export const getSearchDataAction = (keywords: string) => {
  return async (dispatch: Dispatch) => {
    const resp = await Promise.all([
      httpGetSearchList(keywords),
      httpGetSearchSuggest(keywords)
    ]);

    dispatch(changeSearchDataAction({
        songList: resp[0],
        suggest: resp[1].result
      })
    );
  };
};
