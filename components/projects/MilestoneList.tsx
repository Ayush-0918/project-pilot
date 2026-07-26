'use client';

import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

interface Milestone {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | string | null;
  status: string;
}

interface Props {
  milestones: Milestone[];
}

export default function MilestoneList({ milestones }: Props) {
  if (!milestones.length) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-slate-400">
          No milestones available.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => {
        const overdue =
          milestone.dueDate &&
          milestone.status !== 'COMPLETED' &&
          new Date(milestone.dueDate) < new Date();

        return (
          <Card key={milestone.id}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    {milestone.title}
                  </h3>

                  {milestone.description && (
                    <p className="text-sm text-slate-400 mt-1">
                      {milestone.description}
                    </p>
                  )}

                  {milestone.dueDate && (
                    <p className="text-xs text-slate-500 mt-2">
                      Due:{" "}
                      {new Date(milestone.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">

                  <Badge>
                    {milestone.status}
                  </Badge>

                  {overdue && (
                    <Badge variant="destructive">
                      Overdue
                    </Badge>
                  )}

                </div>

              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}