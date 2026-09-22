import { Add, TrashCan } from '@carbon/icons-react';
import {
  Button,
  Dropdown,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { TertiaryButton } from '@/app/components/ui/primitives';

export type ProjectRoleRow = {
  projectId: string;
  projectRole: string;
};

type ProjectOption = {
  name: string;
  value: string;
};

type RoleOption = {
  name: string;
  value: string;
};

interface ProjectRoleTableProps {
  rows: ProjectRoleRow[];
  onChange: (rows: ProjectRoleRow[]) => void;
  projectOptions: ProjectOption[];
  roleOptions: RoleOption[];
  title?: string;
  addButtonLabel?: string;
  showAddButton?: boolean;
  showRemoveColumn?: boolean;
  defaultProjectId?: string;
}

export function ProjectRoleTable(props: ProjectRoleTableProps) {
  const showAddButton = props.showAddButton ?? true;
  const showRemoveColumn = props.showRemoveColumn ?? true;
  const addButtonLabel = props.addButtonLabel || 'Add project role';
  const columnCount = showRemoveColumn ? 3 : 2;

  return (
    <div>
      <TableContainer
        title={props.title ? `${props.title} (${props.rows.length})` : ''}
      >
        <Table size="sm" useZebraStyles={false}>
          <TableHead>
            <TableRow>
              <TableHeader>Project</TableHeader>
              <TableHeader>Role</TableHeader>
              {showRemoveColumn && <TableHeader>Actions</TableHeader>}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columnCount}>
                  No project roles yet. Click <strong>{addButtonLabel}</strong>{' '}
                  below.
                </TableCell>
              </TableRow>
            )}
            {props.rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Dropdown
                    id={`project-role-project-${index}`}
                    titleText=""
                    label="Select project"
                    items={props.projectOptions}
                    selectedItem={
                      props.projectOptions.find(
                        project => project.value === row.projectId,
                      ) || null
                    }
                    itemToString={(item: ProjectOption | null) =>
                      item?.name || ''
                    }
                    onChange={({ selectedItem }) => {
                      const next = [...props.rows];
                      next[index] = {
                        ...row,
                        projectId: selectedItem?.value || '',
                      };
                      props.onChange(next);
                    }}
                    size="md"
                    direction="top"
                  />
                </TableCell>
                <TableCell>
                  <Dropdown
                    id={`project-role-role-${index}`}
                    titleText=""
                    label="Select role"
                    items={props.roleOptions}
                    selectedItem={
                      props.roleOptions.find(
                        role => role.value === row.projectRole,
                      ) || null
                    }
                    itemToString={(item: RoleOption | null) => item?.name || ''}
                    onChange={({ selectedItem }) => {
                      const next = [...props.rows];
                      next[index] = {
                        ...row,
                        projectRole: selectedItem?.value || '',
                      };
                      props.onChange(next);
                    }}
                    size="md"
                    direction="top"
                  />
                </TableCell>
                {showRemoveColumn && (
                  <TableCell>
                    <Button
                      hasIconOnly
                      renderIcon={TrashCan}
                      iconDescription="Remove project role"
                      kind="danger--ghost"
                      size="sm"
                      onClick={() =>
                        props.onChange(props.rows.filter((_, i) => i !== index))
                      }
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showAddButton && (
        <div>
          <TertiaryButton
            size="md"
            renderIcon={Add}
            onClick={() =>
              props.onChange([
                ...props.rows,
                {
                  projectId:
                    props.defaultProjectId ||
                    props.projectOptions[0]?.value ||
                    '',
                  projectRole: '',
                },
              ])
            }
          >
            {addButtonLabel}
          </TertiaryButton>
        </div>
      )}
    </div>
  );
}
