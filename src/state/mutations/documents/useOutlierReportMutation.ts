import { useMutation } from "@tanstack/react-query";
import { getOutlierReport } from "@/apis/documents/documents";
import type { GetOutlierReportRequest } from "@/types/documents/GetOutlierReportRequest";
import type { GetOutlierReportResponse } from "@/types/documents/GetOutlierReportResponse";

export const useOutlierReportMutation = () => {
  return useMutation<GetOutlierReportResponse, Error, GetOutlierReportRequest>({
    mutationFn: (params) => getOutlierReport(params),
  });
};