interface AttachmentLinkProps {
  url?: string | null;
  path?: string | null;
}

const resolveAttachmentUrl = (url?: string | null, path?: string | null) => {
  if (url) return url;
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
};

const AttachmentLink = ({ url, path }: AttachmentLinkProps) => {
  const resolvedUrl = resolveAttachmentUrl(url, path);
  if (!resolvedUrl) return null;

  const isImage = /(png|jpe?g|gif|webp)$/i.test(resolvedUrl.split('?')[0] || '');

  return (
    <div className="attachment">
      <a className="attachment-link" href={resolvedUrl} target="_blank" rel="noreferrer">
        View attachment
      </a>
      {isImage && (
        <img
          className="attachment-thumb"
          src={resolvedUrl}
          alt="Attachment preview"
          loading="lazy"
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
};

export default AttachmentLink;
