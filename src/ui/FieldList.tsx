import { BadgeField } from "../badge/types";

interface Props {
  fields: BadgeField[];
  onChange: (fields: BadgeField[]) => void;
}

const MAX_FIELDS = 6;

function InlinePicker({
  value,
  defaultColor,
  onChange,
  onClear,
}: {
  value: string | undefined;
  defaultColor: string;
  onChange: (c: string) => void;
  onClear: () => void;
}) {
  return (
    <div className={`field-color-cell${value ? " field-color-set" : ""}`}>
      <input
        type="color"
        className="field-color-pick"
        value={value ?? defaultColor}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="btn-color-clear"
        style={{ visibility: value ? "visible" : "hidden" }}
        onClick={onClear}
        title="Reset"
      >↺</button>
    </div>
  );
}

export function FieldList({ fields, onChange }: Props) {
  function update(i: number, patch: Partial<BadgeField>) {
    onChange(fields.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  }

  function removeField(i: number) {
    onChange(fields.filter((_, idx) => idx !== i));
  }

  function addField() {
    if (fields.length >= MAX_FIELDS) return;
    onChange([...fields, { key: "", value: "" }]);
  }

  function moveUp(i: number) {
    if (i === 0) return;
    const next = [...fields];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  }

  function moveDown(i: number) {
    if (i === fields.length - 1) return;
    const next = [...fields];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    onChange(next);
  }

  return (
    <div className="field-list">
      <label className="section-label">Fields</label>
      {fields.map((f, i) => (
        <div key={i} className="field-row">
          <div className="field-reorder">
            <button className="btn-icon" onClick={() => moveUp(i)} disabled={i === 0} title="Move up">▲</button>
            <button className="btn-icon" onClick={() => moveDown(i)} disabled={i === fields.length - 1} title="Move down">▼</button>
          </div>

          <input
            className="field-input field-key"
            value={f.key}
            placeholder="KEY"
            onChange={(e) => update(i, { key: e.target.value })}
            maxLength={40}
          />
          <InlinePicker
            value={f.keyColor}
            defaultColor="#a5aab5"
            onChange={(c) => update(i, { keyColor: c })}
            onClear={() => update(i, { keyColor: undefined })}
          />

          <input
            className="field-input field-value"
            value={f.value}
            placeholder="VALUE"
            onChange={(e) => update(i, { value: e.target.value })}
            maxLength={40}
          />
          <InlinePicker
            value={f.valueColor}
            defaultColor="#e0e4ef"
            onChange={(c) => update(i, { valueColor: c })}
            onClear={() => update(i, { valueColor: undefined })}
          />

          <button className="btn-icon btn-remove" onClick={() => removeField(i)} title="Remove">×</button>
        </div>
      ))}
      <button className="btn-add" onClick={addField} disabled={fields.length >= MAX_FIELDS}>
        + Add field
      </button>
    </div>
  );
}
