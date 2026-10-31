export const EXHIBITION_TYPE_OPTIONS = [
  { value: 'MEMORIAL', label: '추모 전시' },
  { value: 'RETROSPECTIVE', label: '회고전' },
  { value: 'GENERAL', label: '일반 전시' },
] as const;

export type ExhibitionType = (typeof EXHIBITION_TYPE_OPTIONS)[number]['value'];

export const EXHIBITION_TYPE_FILTERS = [
  { value: 'ALL', label: '전체' },
  ...EXHIBITION_TYPE_OPTIONS,
] as const;

export type ExhibitionTypeFilter = (typeof EXHIBITION_TYPE_FILTERS)[number]['value'];

export function getExhibitionTypeLabel(type: string): string {
  return EXHIBITION_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}
