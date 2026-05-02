import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpTriggerExecutor } from "../components/http-request/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";

export const excutorRegistry: Record<NodeType,NodeExecutor> = {

  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpTriggerExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor, // Use the same executor for Google Form Trigger for now

}

export const getExecutor = (type: NodeType):NodeExecutor => {
  const executor = excutorRegistry[type];
  if(!executor){
    throw new Error(`No executor found for node type: ${type}`);
  }
  return executor;
}