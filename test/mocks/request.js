const logs = [
  "test log 1..."
  "test log 2..."
];

export default function request(url) {
  return new Promise((resolve, reject) => {
    process.nextTick(
      () => resolve(logs)
    );
  });
}