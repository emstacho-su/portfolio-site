import type { InventoryRow, InventoryStatus } from '@/data/harness';

interface InventoryTableProps {
  rows: InventoryRow[];
}

const STATUS_LABEL: Record<InventoryStatus, string> = {
  active: 'active',
  zombie: 'zombie',
  'on-demand': 'on-demand',
};

export function InventoryTable({ rows }: InventoryTableProps) {
  return (
    <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-hairline">
            <ColHeader>Port</ColHeader>
            <ColHeader>Service</ColHeader>
            <ColHeader>Owner</ColHeader>
            <ColHeader>Status</ColHeader>
            <ColHeader className="hidden md:table-cell">Purpose</ColHeader>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.port}
              className="border-b border-hairline last:border-b-0 align-top"
            >
              <Cell mono>{row.port}</Cell>
              <Cell>{row.service}</Cell>
              <Cell mono>{row.owner}</Cell>
              <Cell>
                <span className="inline-flex items-center gap-2">
                  {row.status === 'active' ? (
                    <span
                      aria-hidden="true"
                      className="inline-block w-1.5 h-1.5 rounded-full bg-crimson"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="inline-block w-1.5 h-1.5 rounded-full border border-hairline"
                    />
                  )}
                  <span
                    className={
                      row.status === 'active'
                        ? 'text-foreground'
                        : 'text-tertiary'
                    }
                  >
                    {STATUS_LABEL[row.status]}
                  </span>
                </span>
              </Cell>
              <Cell className="hidden md:table-cell text-foreground/80">
                {row.purpose}
              </Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ColHeaderProps {
  children: React.ReactNode;
  className?: string;
}

function ColHeader({ children, className = '' }: ColHeaderProps) {
  return (
    <th
      scope="col"
      className={`font-mono text-[10px] uppercase tracking-[0.14em] text-tertiary py-2 pr-4 ${className}`}
    >
      {children}
    </th>
  );
}

interface CellProps {
  children: React.ReactNode;
  mono?: boolean;
  className?: string;
}

function Cell({ children, mono = false, className = '' }: CellProps) {
  return (
    <td
      className={`py-3 pr-4 text-sm ${mono ? 'font-mono' : ''} ${className}`}
    >
      {children}
    </td>
  );
}
