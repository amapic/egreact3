export function getDistanceFromTop(element: HTMLElement) {
  // console.log("getDistanceFromTop", element.id);
  const rect = element.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  return rect.top + scrollTop;
}
