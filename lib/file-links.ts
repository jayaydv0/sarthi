/** Build `/project/:id/files/...` URL with encoded path segments. */
export function projectFileHref(projectId: string, filePath: string) {
  const encoded = filePath
    .split("/")
    .map((s) => encodeURIComponent(s))
    .join("/");
  return `/project/${projectId}/files/${encoded}`;
}
