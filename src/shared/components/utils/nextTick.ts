export function nextTick() {
  return new Promise<void>((resolve) => {
    queueMicrotask(resolve);
  });
}
