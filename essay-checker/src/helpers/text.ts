
export function getTextWords(text?: string): string[] {
    return text ? text.split(/\s/) : [];
}

export function textWordNotEmpty(item: string): boolean {
    return !!item?.trim();
}
