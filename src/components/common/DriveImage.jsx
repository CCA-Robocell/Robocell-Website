import React, { useState, useMemo } from "react";

export default function DriveImage({ rawLink, alt, className, style, fallback }) {
  const [hasError, setHasError] = useState(false);

  const finalFallback = fallback || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=500&auto=format&fit=crop";

  const fileId = useMemo(() => {
    if (!rawLink) return null;
    const s = String(rawLink).trim();
    let m = s.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (m) return m[1];
    m = s.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (m) return m[1];
    if (/^[a-zA-Z0-9_-]{10,60}$/.test(s)) return s;
    return null;
  }, [rawLink]);

  if (!fileId || hasError) {
    return <img src={finalFallback} alt={alt} className={className} style={style} loading="lazy" />;
  }

  // The Magic Proxy URL
  const proxyUrl =
  `https://wsrv.nl/?url=drive.google.com/uc?id=${fileId}&output=webp`;

  return (
    <img
      src={proxyUrl}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}