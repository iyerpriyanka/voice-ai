import { create } from 'zustand';
import {
  ToolActivityLogType,
  ToolActivityLogTypeProperty,
} from '@/types/types.tool-activity-log';
import { initialPaginated } from '@/types/types.paginated';
import { AssistantToolLog } from '@rapidaai/react';
import { listToolActivityLogs } from '@/clients/activity.client';

const intialToolActivityLog: ToolActivityLogTypeProperty = {
  activities: [],
};

/**
 *
 */
export const useToolActivityLogPage = create<ToolActivityLogType>(
  (set, get) => ({
    ...intialToolActivityLog,
    ...initialPaginated,

    /**
     *
     * @param number
     * @returns
     */
    setPageSize: (pageSize: number) => {
      // when someone change pagesize change the page to zero
      set({
        page: 1,
        pageSize: pageSize,
      });
    },

    /**
     *
     * @param number
     * @returns
     */
    setPage: (pg: number) => {
      set({
        page: pg,
      });
    },

    /**
     *
     * @param number
     * @returns
     */
    setTotalCount: (tc: number) => {
      set({
        totalCount: tc,
      });
    },

    /**
     *
     * @param ep
     */
    onChangeActivities: (ep: AssistantToolLog[]) => {
      set({
        activities: ep,
      });
    },

    /**
     *
     * @param k
     * @param v
     */
    addCriteria: (k: string, v: string, logic: string) => {
      let current = get().criteria.filter(
        x => !(x.key === k && x.logic === logic),
      );
      if (v) current.push({ key: k, value: v, logic: logic });
      set({
        page: 1,
        criteria: current,
      });
    },

    /**
     *
     * @param v
     */
    addCriterias: (v: { k: string; v: string; logic: string }[]) => {
      let current = get().criteria.filter(
        x => !v.find(y => y.k === x.key && x.logic === y.logic),
      );
      v.forEach(c => {
        if (c.v) current.push({ key: c.k, value: c.v, logic: c.logic });
      });
      set({
        page: 1,
        criteria: current,
      });
    },

    /**
     *
     * @param v
     */
    setCriterias: (v: { k: string; v: string; logic: string }[]) => {
      set({
        page: 1,
        criteria: v
          .filter(c => c.v)
          .map(c => ({
            key: c.k,
            logic: c.logic,
            value: c.v,
          })),
      });
    },

    /**
     *
     * @param key
     */
    removeCriteria: (key: string) => {
      set({
        page: 1,
        criteria: get().criteria.filter(x => x.key !== key),
      });
    },

    /**
     *
     */
    clearCriteria: () => {
      set({
        page: 1,
        criteria: [],
      });
    },

    /**
     *
     * @param projectId
     * @param token
     * @param userId
     */
    getActivities: (
      projectId: string,
      token: string,
      userId: string,
      onError: (err: string) => void,
      onSuccess: (e: AssistantToolLog[]) => void,
    ) => {
      listToolActivityLogs({
        projectId,
        page: get().page,
        pageSize: get().pageSize,
        criteria: get().criteria,
        auth: { projectId, token, userId },
      })
        .then(gur => {
          if (gur?.getSuccess()) {
            get().onChangeActivities(gur.getDataList());
            let paginated = gur.getPaginated();
            if (paginated) {
              get().setTotalCount(paginated.getTotalitem());
            }
            onSuccess(gur.getDataList());
          } else {
            let errorMessage = gur?.getError();
            if (errorMessage) {
              onError(errorMessage.getHumanmessage());
              return;
            }
            onError('Unable to get your activity log, please try again later.');
          }
        })
        .catch(x => {
          onError('Unable to get your activity log, please try again later.');
        });
    },

    /**
     * columns
     */

    columns: [
      { name: 'Assistant', key: 'assistant_id', visible: true },
      {
        name: 'Session',
        key: 'assistant_conversation_id',
        visible: true,
      },
      { name: 'Tool Name', key: 'assistant_tool_name', visible: true },
      { name: 'Tool Call ID', key: 'tool_call_id', visible: true },
      { name: 'Action', key: 'action', visible: true },
      { name: 'Status', key: 'status', visible: true },
      { name: 'Time Taken', key: 'time_taken', visible: true },
      { name: 'Created Date', key: 'created_date', visible: true },
    ],

    /**
     *
     * @param cl
     */
    setColumns(cl: { name: string; key: string; visible: boolean }[]) {
      set({
        columns: cl,
      });
    },

    /**
     *
     * @param k
     * @returns
     */
    visibleColumn: (k: string): boolean => {
      const column = get().columns.find(c => c.key === k);
      return column ? column.visible : false;
    },

    /**
     * clear everything from the context
     * @returns
     */
    clear: () => set({ ...intialToolActivityLog }, true),
  }),
);
