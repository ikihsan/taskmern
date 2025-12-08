const fs = require('fs/promises');
const path = require('path');

const normalizeStoredPath = (storedPath) => storedPath.replace(/\\/g, '/');

const buildFileUrl = (req, storedPath) => {
  if (!storedPath) return null;
  const normalizedPath = normalizeStoredPath(storedPath).replace(/^backend\//, '');
  return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
};

const resolveAbsolutePath = (storedPath) => {
  if (!storedPath) return null;
  if (path.isAbsolute(storedPath)) {
    return storedPath;
  }

  const normalized = normalizeStoredPath(storedPath);
  if (normalized.startsWith('uploads/')) {
    return path.join(process.cwd(), 'backend', normalized);
  }
  return path.join(process.cwd(), normalized);
};

const removeFile = async (storedPath) => {
  if (!storedPath) return;
  const absolutePath = resolveAbsolutePath(storedPath);
  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('Failed to remove file:', error.message);
    }
  }
};

module.exports = {
  buildFileUrl,
  removeFile
};
