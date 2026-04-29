import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflow";
import { FlaskConicalIcon } from "lucide-react";

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorkflow = useExecuteWorkflow();

  const handleExecute = () => {
    executeWorkflow.mutate({ id: workflowId });
  };

  return (
    <Button size="lg" onClick={handleExecute} disabled={executeWorkflow.isPending}>
    {/* <Button size="lg" > */}
      <FlaskConicalIcon className="size-4" />
      Execute workflow
    </Button>
  );
};
