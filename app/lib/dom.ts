export function isEditableTarget(el: Element | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  return el.tagName === "TEXTAREA" || el.tagName === "INPUT" || el.isContentEditable;
}
