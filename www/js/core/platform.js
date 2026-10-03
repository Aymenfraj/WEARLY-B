// Acces aux plugins natifs Capacitor, avec repli navigateur.
export const cap = () => window.Capacitor;
export const isNative = () => !!(cap() && cap().isNativePlatform && cap().isNativePlatform());
export const plugin = n => (cap() && cap().Plugins && cap().Plugins[n]) || null;
