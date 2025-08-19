import { formatter } from '@/services/formatter';
import { ModelDetailsSibling } from '@/types';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import { Container } from 'lucide-react';
import { FC } from 'react';
import { ModelSearchViewHeader } from './ModelSearchViewHeader';

export interface ModelSearchViewFilesProps {
  id: string;
  siblings: ModelDetailsSibling[];
}

export const ModelSearchViewFiles: FC<ModelSearchViewFilesProps> = ({ id, siblings }) => {
  return (
    <div className="flex flex-col gap-6">
      <ModelSearchViewHeader
        Icon={Container}
        title="Files"
        href={`https://huggingface.co/${id}/tree/main`}
      />
      <Table removeWrapper aria-label="Files table">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Size</TableColumn>
        </TableHeader>
        <TableBody>
          {siblings.map((sibling) => {
            return (
              <TableRow key={sibling.blob_id}>
                <TableCell>{sibling.rfilename}</TableCell>
                <TableCell>{formatter.bytes(sibling.size)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
