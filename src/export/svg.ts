export function downloadSvg(svg: string, filename = "build-with-ai.svg"): void {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadPng(
  svg: string,
  filename = "build-with-ai.png",
  scale = 2,
): Promise<void> {
  const wMatch = svg.match(/width="([^"]+)"/);
  const hMatch = svg.match(/height="([^"]+)"/);
  const w = parseFloat(wMatch?.[1] ?? "400");
  const h = parseFloat(hMatch?.[1] ?? "100");

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = filename;
      a.click();
      resolve();
    };
    img.onerror = reject;
    img.src = url;
  });
}

export async function copySvg(svg: string): Promise<void> {
  await navigator.clipboard.writeText(svg);
}

export async function copyUrl(url: string): Promise<void> {
  await navigator.clipboard.writeText(url);
}
