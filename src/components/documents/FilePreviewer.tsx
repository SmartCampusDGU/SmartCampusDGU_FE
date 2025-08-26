import { useEffect, useMemo, useRef, useState } from "react";
import { renderAsync } from "docx-preview";

type Props = {
  src: string;
  filename?: string;
  onNeedConvertHwp?: (src: string) => Promise<string>; 
};

function getExt(src = "", filename = "") {
  const q = (filename || src).split("?")[0].split("#")[0];
  const ext = q.slice(q.lastIndexOf(".") + 1).toLowerCase();
  return ext;
}

function isHttpUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export default function FilePreviewer({ src, filename, onNeedConvertHwp }: Props) {
  const [activeSrc, setActiveSrc] = useState(src);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const ext = useMemo(() => getExt(src, filename), [src, filename]);

  const docxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveSrc(src);
    setErr(null);
  }, [src]);

  // DOC/DOCX 렌더링
  useEffect(() => {
    if (!docxRef.current) return;
    if (ext !== "docx" && ext !== "doc") return;

    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const arrayBuffer = isHttpUrl(src)
          ? await fetch(src, { credentials: "include" }).then((r) => {
              if (!r.ok) throw new Error(`DOCX fetch 실패: ${r.status}`);
              return r.arrayBuffer();
            })
          : await (await fetch(src)).arrayBuffer();

        if (aborted) return;
        docxRef.current!.innerHTML = "";
        await renderAsync(arrayBuffer, docxRef.current!, undefined, {
          inWrapper: true,
          className: "docx-preview",
        });
      } catch (e: any) {
        setErr(e?.message ?? "DOCX 미리보기 실패");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [ext, src]);

  // HWP/HWPX → (미구현 시) 폴백 UI / (구현 시) 변환
  useEffect(() => {
    if (ext !== "hwp" && ext !== "hwpx") return;
    if (!onNeedConvertHwp) return; // 폴백 UI로 처리
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const pdfUrl = await onNeedConvertHwp(src);
        if (!cancelled) setActiveSrc(pdfUrl);
      } catch (e: any) {
        setErr(e?.message ?? "HWP → PDF 변환 실패");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ext, src, onNeedConvertHwp]);

  // PDF (또는 HWP 변환 뒤 PDF)
  if (ext === "pdf" || (ext.match(/^hwp/) && onNeedConvertHwp)) {
    return (
      <div className="w-full h-full relative">
        {loading && <div className="absolute inset-0 grid place-items-center text-sm">로딩 중…</div>}
        {err && <div className="p-4 text-red-600 text-sm">{err}</div>}
        {!err && (
          <iframe title="preview-pdf" src={activeSrc} className="w-full h-full" />
        )}
      </div>
    );
  }

  // DOC/DOCX
  if (ext === "docx" || ext === "doc") {
    return (
      <div className="w-full h-full overflow-auto p-4">
        {loading && <div className="text-sm">DOCX 렌더링 중…</div>}
        {err && <div className="text-sm text-red-600">{err}</div>}
        <div ref={docxRef} />
      </div>
    );
  }

  // HWP/HWPX 폴백 (변환 API 미구현인 경우)
  if (ext === "hwp" || ext === "hwpx") {
    return (
      <div className="h-full w-full grid place-items-center p-6 text-center">
        <div className="space-y-3">
          <p className="[font-family:Inter] text-[14px] text-black leading-normal">
            HWP/HWPX 미리보기는 준비 중입니다.
          </p>
          <div className="flex justify-center gap-8">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-[160px] h-[40px] inline-flex items-center justify-center
                rounded-[8px] border border-[#E5E5E5] bg-white
                [font-family:Inter] text-[14px] font-bold text-black leading-normal
              "
            >
              파일 열기/다운로드
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 기타 형식
  return (
    <div className="w-full h-full grid place-items-center text-sm">
      이 형식은 미리보기를 지원하지 않습니다. 파일을 다운로드해 주세요.
    </div>
  );
}