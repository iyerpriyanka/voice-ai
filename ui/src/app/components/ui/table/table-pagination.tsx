import React, { useState } from 'react';
import { cn } from '@/utils';
import { GhostButton } from '@/app/components/ui/button';
import { ColumnPreferencesDialog } from '@/app/components/dialogs/column-preference-modal';
import { ChevronLeft, ChevronRight, SettingsAdjust } from '@carbon/icons-react';
import TooltipPlus from '@/app/components/ui/tooltip-plus';

interface TablePreferenceProps extends React.InputHTMLAttributes<HTMLElement> {
  /**
   * default page size
   */
  defaultPageSize: number[];
  /**
   *
   * The columns which is shown currently
   */
  columns: { name: string; key: string; visible: boolean }[];

  /**
   *
   * @param clmns
   * @returns
   */
  onChangeColumns: (
    clmns: { name: string; key: string; visible: boolean }[],
  ) => void;

  /**
   * Item per page
   */
  pageSize: number;

  /**
   * onChange of page
   */
  onChangePageSize: (pageSize: number) => void;
}

interface TablePaginationProps extends TablePreferenceProps {
  /**
   * Current Page
   */
  currentPage: number;

  /**
   * change current page
   */
  onChangeCurrentPage: (page: number) => void;

  /**
   * total Page size
   */
  totalItem: number;
}

export function TablePagination(props: TablePaginationProps) {
  const [columnPreferenceModel, setColumnPreferenceModel] = useState(false);

  const maxPage = Math.ceil(props.totalItem / props.pageSize);
  const arr = generatePageArray(props);
  return (
    <>
      <ColumnPreferencesDialog
        open={columnPreferenceModel}
        setOpen={setColumnPreferenceModel}
        {...props}
      ></ColumnPreferencesDialog>
      <ul className="flex items-center text-base">
        <li>
          <GhostButton
            size="md"
            type="button"
            onClick={() => {
              props.currentPage > 1 &&
                props.onChangeCurrentPage(props.currentPage - 1);
            }}
            disabled={props.currentPage <= 1}
            className={cn(
              'text-base! bg-transparent!',
              props.currentPage <= 1 ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft size={16} className="rtl:rotate-180" />
          </GhostButton>
        </li>
        {/* page count start */}
        {arr
          .filter(px => {
            return px !== undefined;
          })
          .map((pg, idx) => {
            return (
              <li key={`page-${idx}`}>
                <GhostButton
                  size="md"
                  type="button"
                  className={cn(
                    'text-base! bg-transparent!',
                    pg === props.currentPage
                      ? 'text-blue-600! opacity-100'
                      : 'opacity-70',
                  )}
                  onClick={() => {
                    props.onChangeCurrentPage(pg);
                  }}
                >
                  {pg}
                </GhostButton>
              </li>
            );
          })}

        <li className="border-r dark:border-gray-800">
          <GhostButton
            size="md"
            type="button"
            disabled={props.currentPage >= maxPage}
            onClick={() => {
              props.currentPage < maxPage &&
                props.onChangeCurrentPage(props.currentPage + 1);
            }}
            className={cn(
              'text-base! bg-transparent!',
              props.currentPage >= maxPage
                ? 'cursor-not-allowed'
                : 'cursor-pointer',
            )}
          >
            <span className="sr-only">Next</span>
            <ChevronRight size={16} className="rtl:rotate-180" />
          </GhostButton>
        </li>

        {/* setting preference */}
        <li>
          <GhostButton
            size="md"
            type="button"
            onClick={() => {
              setColumnPreferenceModel(true);
            }}
          >
            <span className="sr-only">Setting</span>
            <TooltipPlus
              className="bg-white dark:bg-gray-950 border-[0.5px] rounded-[2px] px-0 py-0"
              popupContent={
                <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-500">
                  Configure column preference
                </div>
              }
            >
              <SettingsAdjust size={16} />
            </TooltipPlus>
          </GhostButton>
        </li>
      </ul>
    </>
  );
}

function generatePageArray(props: TablePaginationProps) {
  const maxPage = Math.ceil(props.totalItem / props.pageSize);

  const prevPage = props.currentPage > 1 ? props.currentPage - 1 : undefined;
  const nextPage =
    props.currentPage < maxPage ? props.currentPage + 1 : undefined;

  return [prevPage, props.currentPage, nextPage];
}

// default params for table pagination
TablePagination.defaultProps = {
  defaultPageSize: [10, 20, 50],
  currentPage: 1,
  pageSize: 20,
  totalItem: 1,
  columns: [],
  onChangeCurrentPage: () => {},
  onChangePageSize: () => {},
  onChangeColumns: () => {},
};
