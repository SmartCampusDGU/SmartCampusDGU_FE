import { useState } from "react";
import { useSetPageTitle } from '@/hooks/common/useSetPageTitle';
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";
import PeriodPanel from "@/components/documents/PeriodPanel";
import { PreviewModal } from "@/components/documents/PreviewModal";
import FilePreviewer from "@/components/documents/FilePreviewer";

export default function Documents() {
  useSetPageTitle("보고서 제작");
  useSetActiveNav("", "doc");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewFilename, setPreviewFilename] = useState("");

  function handlePreview(url: string, filename: string) {
    setPreviewUrl(url);
    setPreviewFilename(filename);
    setPreviewOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] min-h-screen px-6 bg-[var(--white-02)]">
      <div className="mt-6 flex justify-center">
        <PeriodPanel onPreview={handlePreview} />
      </div>

      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} title="미리보기">
        <FilePreviewer src={previewUrl} filename={previewFilename}/>
      </PreviewModal>
    </div>
  );
}