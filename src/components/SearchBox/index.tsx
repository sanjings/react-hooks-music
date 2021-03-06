import React, { memo, useState, useEffect, useMemo, useRef, useImperativeHandle, forwardRef, FC, ReactElement } from 'react';
import classnames from 'classnames';

import { debounce } from 'utils/tools';

import styles from './index.module.scss';
import { IProps } from './typing';

const SearchBox: FC<IProps> = forwardRef(({
  keywords,
  clickBack,
  onInput
}, ref): ReactElement => {

  const [showClear, setShowClear] = useState<boolean>(false),
        [queryStr, setQueryStr] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * 节流处理
   */
  const debounceOnInput = useMemo(() => {
    return debounce(onInput, 300);
  }, [onInput]);

  useEffect((): void => {
    if (keywords !== queryStr) {
      setQueryStr(keywords);
    }
  }, [keywords]);

  /**
   * 显示时输入框聚焦
   */
  useEffect((): void => {
    inputRef && inputRef.current!.focus();
  }, []);

  /**
   * 监听value值的改变，并触发回调，同时显示隐藏清空按钮
   */
  useEffect((): void => {
    debounceOnInput(queryStr);
    queryStr ? setShowClear(true) : setShowClear(false);
  }, [queryStr]);

  /**
   * 输入框输入事件
   * @param {Event} e
   */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setQueryStr(e.target.value.trim());
  };

  /**
   * 清空输入框
   */
  const handleClear = (): void => {
    setQueryStr('');
    debounceOnInput();
    inputRef.current!.focus();
  };

  /**
   * 暴露组件方法
   */
  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef && inputRef.current!.focus();
      }
    };
  });

  return (
    <div className={styles['search-box']}>
      <div className={styles['back']} onClick={clickBack}>
        <i className="iconfont icon-leftarrow" />
      </div>
      <div className={styles['input-wrap']}>
        <input
          ref={inputRef}
          type="text"
          value={queryStr}
          placeholder="搜索歌曲、歌手、专辑"
          className={styles['input']}
          onChange={handleInput}
        />
        <div className={classnames(styles['clear'], showClear && styles['visible'])} onClick={handleClear}>
          <i className="iconfont icon-clear" />
        </div>
      </div>
    </div>
  );
});

export default memo(SearchBox);
