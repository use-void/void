/**
 * Retrieves a localized value from a Map or plain object based on the current locale.
 * Falls back to 'en' or an empty string.
 */
export function getLocalizedValue(
    map: Map<string, string> | Record<string, string> | undefined | null | any, 
    locale: string
): string {
    if (!map) return '';
    
    // Handle Map (Mongoose Map type)
    if (map instanceof Map) {
        return map.get(locale) || map.get('en') || '';
    }
    
    // Handle Plain Object (lean() results)
    if (typeof map === 'object') {
        return map[locale] || map['en'] || '';
    }
    
    // Fallback for strings
    return String(map);
}
