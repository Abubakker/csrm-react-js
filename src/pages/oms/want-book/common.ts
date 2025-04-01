import { wantBookList } from 'apis/oms';
import { UnwrapPromise } from 'types/base';

export type WantBookRecord = UnwrapPromise<
  ReturnType<typeof wantBookList>
>['data']['records'][0];

export const wantBookStatusList = ['待处理', '已处理'];
