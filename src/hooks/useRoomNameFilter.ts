'use client';

const useRoomNameFilter = (str: string) => {
  // 10文字以上の場合は、以降の文字を...で表現する
  if (str.length > 10) {
    return str.substring(0, 10) + '...';
  } else {
    return str;
  }
};

export default useRoomNameFilter;
