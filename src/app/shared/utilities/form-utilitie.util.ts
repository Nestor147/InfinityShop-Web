import { FormGroup } from '@angular/forms';

export type StringDict = Record<string, string>;

export function normalizeDict(obj: any): StringDict {
  const out: StringDict = {};
  if (!obj) return out;
  Object.keys(obj).forEach((k) => {
    const v = obj[k];
    out[k] = v == null ? '' : String(v).trim();
  });
  return out;
}

export function takeSnapshot(fg: FormGroup): StringDict {
  return normalizeDict(fg.getRawValue?.() ?? {});
}

export function hasChanged(fg: FormGroup, snapshot: StringDict | null | undefined): boolean {
  if (!snapshot) return true;
  const now = takeSnapshot(fg);
  return JSON.stringify(now) !== JSON.stringify(snapshot);
}

export function canSave(fg: FormGroup, snapshot: StringDict | null | undefined, busy: boolean): boolean {
  return fg.valid && hasChanged(fg, snapshot) && !busy;
}
