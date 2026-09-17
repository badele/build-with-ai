import { useState } from "react";
import { BadgeStyle } from "../badge/types";
import { DEFAULT_STYLE } from "../badge/theme";
import { SvgImport } from "./SvgImport";

interface Props {
  style: BadgeStyle;
  onChange: (style: BadgeStyle) => void;
}

function upd<K extends keyof BadgeStyle>(
  style: BadgeStyle,
  key: K,
  value: BadgeStyle[K],
  onChange: (s: BadgeStyle) => void,
) {
  onChange({ ...style, [key]: value });
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step = 1, unit = "", onChange }: SliderProps) {
  return (
    <div className="style-row">
      <label className="style-row-label">{label}</label>
      <input
        type="range"
        className="style-slider"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <span className="style-row-val">{value}{unit}</span>
    </div>
  );
}

interface ColorProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorProps) {
  return (
    <div className="style-row">
      <label className="style-row-label">{label}</label>
      <div className="style-color-wrap">
        <input
          type="color"
          className="style-color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="style-row-val style-color-hex">{value}</span>
      </div>
    </div>
  );
}

type Align = "left" | "center" | "right";

function AlignButtons({ value, onChange }: { value: Align; onChange: (v: Align) => void }) {
  const options: { val: Align; icon: string; title: string }[] = [
    { val: "left",   icon: "⇤", title: "Align left"   },
    { val: "center", icon: "⇔", title: "Align center" },
    { val: "right",  icon: "⇥", title: "Align right"  },
  ];
  return (
    <div className="style-align-group">
      {options.map(({ val, icon, title }) => (
        <button
          key={val}
          className={`style-align-btn${value === val ? " active" : ""}`}
          title={title}
          onClick={() => onChange(val)}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

function AlignPair({
  titleValue, titleOnChange,
  fieldsValue, fieldsOnChange,
}: {
  titleValue: Align; titleOnChange: (v: Align) => void;
  fieldsValue: Align; fieldsOnChange: (v: Align) => void;
}) {
  return (
    <div className="style-row style-row-block">
      <label className="style-row-label">Alignment</label>
      <div className="style-sub-group">
        <div className="style-sub-row">
          <span className="style-sub-label">Title</span>
          <AlignButtons value={titleValue} onChange={titleOnChange} />
        </div>
        <div className="style-sub-row">
          <span className="style-sub-label">Fields</span>
          <AlignButtons value={fieldsValue} onChange={fieldsOnChange} />
        </div>
      </div>
    </div>
  );
}

function FontSizePair({
  titleValue, titleOnChange,
  fieldsValue, fieldsOnChange,
}: {
  titleValue: number; titleOnChange: (v: number) => void;
  fieldsValue: number; fieldsOnChange: (v: number) => void;
}) {
  return (
    <div className="style-row style-row-block">
      <label className="style-row-label">Font sizes</label>
      <div className="style-sub-group">
        <div className="style-sub-row">
          <span className="style-sub-label">Title</span>
          <input
            type="range" className="style-slider"
            min={10} max={40} value={titleValue}
            onChange={(e) => titleOnChange(parseFloat(e.target.value))}
          />
          <span className="style-row-val">{titleValue}px</span>
        </div>
        <div className="style-sub-row">
          <span className="style-sub-label">Fields</span>
          <input
            type="range" className="style-slider"
            min={8} max={24} value={fieldsValue}
            onChange={(e) => fieldsOnChange(parseFloat(e.target.value))}
          />
          <span className="style-row-val">{fieldsValue}px</span>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="style-section">
      <button className="style-section-toggle" onClick={() => setOpen((o) => !o)}>
        <span>{title}</span>
        <span className="style-section-chevron">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="style-section-body">{children}</div>}
    </div>
  );
}

export function StylePanel({ style, onChange }: Props) {
  const s = style;
  const set = <K extends keyof BadgeStyle>(k: K, v: BadgeStyle[K]) => upd(s, k, v, onChange);
  const isDefault =
    JSON.stringify({ ...s, customSvg: undefined }) === JSON.stringify(DEFAULT_STYLE) &&
    !s.customSvg;

  return (
    <div className="style-panel">
      <div className="style-panel-header">
        <span className="section-label">Appearance</span>
        {!isDefault && (
          <button className="style-reset-btn" onClick={() => onChange({ ...DEFAULT_STYLE })}>
            Reset
          </button>
        )}
      </div>

      <Section title="Global">
        <Slider label="Width"  value={s.width}  min={100} max={900} unit="px" onChange={(v) => set("width",  v)} />
        <Slider label="Height" value={s.height} min={20}  max={300} unit="px" onChange={(v) => set("height", v)} />
        <ColorPicker label="Background" value={s.bg} onChange={(v) => set("bg", v)} />
      </Section>

      <Section title="Left zone">
        <Slider label="Width" value={s.leftZoneWidth} min={50} max={200} unit="px" onChange={(v) => set("leftZoneWidth", v)} />
        <SvgImport value={s.customSvg} onChange={(svg) => set("customSvg", svg)} />
        <Slider label="Scale" value={s.leftZoneScale} min={0.2} max={2} step={0.05} onChange={(v) => set("leftZoneScale", v)} />
        {!s.customSvg && (
          <>
            <ColorPicker label="Gradient start" value={s.leftGradStart} onChange={(v) => set("leftGradStart", v)} />
            <ColorPicker label="Gradient end"   value={s.leftGradEnd}   onChange={(v) => set("leftGradEnd",   v)} />
          </>
        )}
      </Section>

      <Section title="Right zone">
        <Slider label="Row height" value={s.topRowHeight} min={28} max={100} unit="px" onChange={(v) => set("topRowHeight", v)} />
        <AlignPair
          titleValue={s.titleAlign}   titleOnChange={(v) => set("titleAlign", v)}
          fieldsValue={s.fieldAlign}  fieldsOnChange={(v) => set("fieldAlign", v)}
        />
        <FontSizePair
          titleValue={s.titleFontSize}   titleOnChange={(v) => set("titleFontSize", v)}
          fieldsValue={s.fieldFontSize}  fieldsOnChange={(v) => set("fieldFontSize", v)}
        />
        <ColorPicker label="Title grad. start" value={s.titleGradStart} onChange={(v) => set("titleGradStart", v)} />
        <ColorPicker label="Title grad. end"   value={s.titleGradEnd}   onChange={(v) => set("titleGradEnd",   v)} />
      </Section>
    </div>
  );
}
