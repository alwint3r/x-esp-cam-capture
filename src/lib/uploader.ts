export function upload(label: string, apiKey: string, file: File) {
  const form = new FormData();
  form.append("data", file);

  const init: RequestInit = {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "x-label": label,
    },
    body: form,
  };

  return fetch("http://ingestion.edgeimpulse.com/api/training/files", init);
}
