interface Props {
  svg: string;
}

export function BadgePreview({ svg }: Props) {
  return (
    <div className="preview-section">
      <label className="section-label">Preview</label>
      <div
        className="preview-container"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
