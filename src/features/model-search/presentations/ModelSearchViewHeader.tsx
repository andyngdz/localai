import { Button } from '@heroui/react';
import { Link, LucideProps } from 'lucide-react';
import NextLink from 'next/link';
import { ComponentType, FC } from 'react';

export interface ModelSearchViewHeaderProps {
  Icon: ComponentType<LucideProps>;
  title: string;
  href?: string;
}

export const ModelSearchViewHeader: FC<ModelSearchViewHeaderProps> = ({ Icon, title, href }) => {
  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-2">
        <Icon className="text-primary" />
        <span className="text-foreground-500 text font-bold">{title}</span>
      </div>
      {href && (
        <Button
          as={NextLink}
          href={href}
          size="sm"
          variant="light"
          className="text-foreground-500"
          target="_blank"
          isIconOnly
        >
          <Link size={16} />
        </Button>
      )}
    </div>
  );
};
