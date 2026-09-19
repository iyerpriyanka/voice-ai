import React, { useState } from 'react';
import { cn } from '@/utils';
import { IconOnlyButton } from '@/app/components/ui/primitives/button';
import { ColumnPreferencesDialog } from '@/app/components/dialogs/shared/column-preference-modal';
import { SettingsAdjust } from '@carbon/icons-react';
import { Pagination } from '@/app/components/ui/primitives/pagination';

interface TablePreferenceProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  defaultPageSize?: number[];
  columns?: { name: string; key: string; visible: boolean }[];
  onChangeColumns?: (
    clmns: { name: string; key: string; visible: boolean }[],
  ) => void;
  pageSize?: number;
  onChangePageSize?: (pageSize: number) => void;
}

interface TablePaginationProps extends TablePreferenceProps {
  currentPage?: number;
  onChangeCurrentPage?: (page: number) => void;
  totalItem?: number;
}

export function TablePagination({
  className,
  columns = [],
  currentPage = 1,
  defaultPageSize = [10, 20, 50],
  onChangeColumns = () => {},
  onChangeCurrentPage = () => {},
  onChangePageSize = () => {},
  pageSize = 20,
  totalItem = 1,
  ...props
}: TablePaginationProps) {
  const [columnPreferenceModel, setColumnPreferenceModel] = useState(false);
  const totalItems = Math.max(totalItem, 0);
  const currentPageSize = pageSize || defaultPageSize[0] || 20;
  const pageSizes =
    defaultPageSize.length > 0 ? defaultPageSize : [currentPageSize];
  const totalPages = Math.max(Math.ceil(totalItems / currentPageSize), 1);
  const page = Math.min(Math.max(currentPage, 1), totalPages);

  return (
    <>
      <ColumnPreferencesDialog
        open={columnPreferenceModel}
        setOpen={setColumnPreferenceModel}
        defaultPageSize={pageSizes}
        columns={columns}
        onChangeColumns={onChangeColumns}
        pageSize={currentPageSize}
        onChangePageSize={onChangePageSize}
      />
      <div className={cn('flex items-center', className)}>
        <Pagination
          id={props.id}
          className="min-w-0"
          totalItems={totalItems}
          page={page}
          pageSize={currentPageSize}
          pageSizes={pageSizes}
          onChange={({ page: nextPage, pageSize: nextPageSize }) => {
            if (nextPage !== currentPage) {
              onChangeCurrentPage(nextPage);
            }
            if (nextPageSize !== currentPageSize) {
              onChangePageSize(nextPageSize);
            }
          }}
          backwardText="Previous"
          forwardText="Next"
        />
        <IconOnlyButton
          className="shrink-0"
          type="button"
          kind="ghost"
          size="md"
          iconDescription="Configure column preference"
          renderIcon={SettingsAdjust}
          onClick={() => setColumnPreferenceModel(true)}
        />
      </div>
    </>
  );
}
