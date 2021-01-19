const _ROOT = 'hpzone_';

export function storeOnBrowserSession(key: string, value: any): void {
  if (key) {
    key = _ROOT + key.toLowerCase();
  }
  if (window.sessionStorage) {
    if (value) {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      window.sessionStorage.removeItem(key);
    }
  }
}

export function getFromBrowserSession(key: string): any {
  if (key) {
    key = _ROOT + key.toLowerCase();
  }
  if (window.sessionStorage) {
    const value = JSON.parse(window.sessionStorage.getItem(key));
    if (value) {
      return value;
    }
  }
  return null;
}

export function clearAllApplicationsKeys(): void {
  if (window.sessionStorage) {
    window.sessionStorage.clear();
  }
}
