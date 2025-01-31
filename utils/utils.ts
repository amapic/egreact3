export function getDistanceFromTop(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  return rect.top + scrollTop;
}
