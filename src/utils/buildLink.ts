// utils/link-builder.ts
export const buildLink = (
    pathname: string,       // Текущий путь (например, "/projects")
    currentParams: URLSearchParams, // Текущие параметры URL
    updates: Record<string, string | null> // Изменения: { param: value }
) => {
  // 1. Клонируем текущие параметры
  const params = new URLSearchParams(currentParams);

  // 2. Применяем изменения
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null) {
      params.delete(key); // Удаляем параметр, если значение null
    } else {
      params.set(key, value); // Обновляем/добавляем параметр
    }
  });

  // 3. Собираем итоговый URL
  return `${pathname}?${params.toString()}`;
};