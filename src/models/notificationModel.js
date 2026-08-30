export function normalizeNotification(notification) {
  if (!notification) return null;
  return { ...notification, id: notification.id || notification._id };
}
