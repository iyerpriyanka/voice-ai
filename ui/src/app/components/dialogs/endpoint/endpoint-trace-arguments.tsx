import type { Argument } from '@rapidaai/react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { EmptyState } from '@/app/components/ui/feedback';
import { DataCheck } from '@carbon/icons-react';

export function EndpointArguments({ args }: { args: Array<Argument> }) {
  if (args.length <= 0)
    return (
      <EmptyState
        className="h-full min-h-[420px]"
        icon={DataCheck}
        title="No arguments found"
        subtitle="No runtime arguments were recorded for this trace."
      />
    );
  return (
    <TableContainer title="Arguments">
      <Table size="sm" useZebraStyles={false}>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Value</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {args.map((argument, index) => (
            <TableRow key={index}>
              <TableCell>{argument.getName()}</TableCell>
              <TableCell>{argument.getValue()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
